/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { StatsD } from 'hot-shots';

import {
  CartManager,
  CartService,
  CheckoutCustomerDataFactory,
  CheckoutPaymentError,
  ResultCartFactory,
  handleEligibilityStatusMap,
} from '@fxa/payments/cart';
import {
  EligibilityManager,
  EligibilityService,
  EligibilityStatus,
} from '@fxa/payments/eligibility';
import {
  PaypalBillingAgreementManager,
  PayPalClient,
  PaypalClientConfig,
  PaypalCustomerManager,
  ResultPaypalCustomerFactory,
} from '@fxa/payments/paypal';
import {
  CustomerManager,
  InvoiceManager,
  InvoicePreviewFactory,
  PaymentIntentManager,
  PaymentMethodManager,
  PriceManager,
  ProductManager,
  PromotionCodeManager,
  STRIPE_CUSTOMER_METADATA,
  SubscriptionManager,
  TaxAddressFactory,
} from '@fxa/payments/customer';
import {
  StripeClient,
  StripeConfig,
  StripeCustomerFactory,
  StripeInvoiceFactory,
  StripePaymentIntentFactory,
  StripePaymentMethodFactory,
  StripePriceFactory,
  StripePromotionCodeFactory,
  StripeResponseFactory,
  StripeSubscriptionFactory,
  ResultAccountCustomerFactory,
  MockStripeConfigProvider,
  AccountCustomerManager,
  StripeConfirmationTokenFactory,
} from '@fxa/payments/stripe';
import {
  MockProfileClientConfigProvider,
  ProfileClient,
} from '@fxa/profile/client';
import {
  MockStrapiClientConfigProvider,
  ProductConfigurationManager,
  StrapiClient,
} from '@fxa/shared/cms';
import { MockFirestoreProvider } from '@fxa/shared/db/firestore';
import {
  CartEligibilityStatus,
  MockAccountDatabaseNestFactory,
} from '@fxa/shared/db/mysql/account';
import { LOGGER_PROVIDER } from '@fxa/shared/log';
import { MockStatsDProvider, StatsDService } from '@fxa/shared/metrics/statsd';
import {
  MockNotifierSnsConfigProvider,
  NotifierService,
  NotifierSnsProvider,
} from '@fxa/shared/notifier';
import {
  CartEligibilityMismatchError,
  CartTotalMismatchError,
  CartEmailNotFoundError,
  CartInvalidPromoCodeError,
  CartInvalidCurrencyError,
  CartUidNotFoundError,
} from './cart.error';
import { CheckoutService } from './checkout.service';
import { PrePayStepsResultFactory } from './checkout.factories';
import { AccountManager } from '@fxa/shared/account/account';
import { CurrencyManager } from '@fxa/payments/currency';
import {
  GeoDBManager,
  GeoDBManagerConfig,
  MockGeoDBNestFactory,
} from '@fxa/shared/geodb';
import { MockCurrencyConfigProvider } from 'libs/payments/currency/src/lib/currency.config';

describe('CheckoutService', () => {
  let accountCustomerManager: AccountCustomerManager;
  let cartManager: CartManager;
  let checkoutService: CheckoutService;
  let customerManager: CustomerManager;
  let eligibilityService: EligibilityService;
  let invoiceManager: InvoiceManager;
  let paymentIntentManager: PaymentIntentManager;
  let paypalBillingAgreementManager: PaypalBillingAgreementManager;
  let paypalCustomerManager: PaypalCustomerManager;
  let privateMethod: any;
  let productConfigurationManager: ProductConfigurationManager;
  let profileClient: ProfileClient;
  let promotionCodeManager: PromotionCodeManager;
  let statsd: StatsD;
  let subscriptionManager: SubscriptionManager;

  const mockLogger = {
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AccountCustomerManager,
        AccountManager,
        CartManager,
        CartService,
        CheckoutService,
        CustomerManager,
        CurrencyManager,
        EligibilityManager,
        EligibilityService,
        GeoDBManager,
        GeoDBManagerConfig,
        MockGeoDBNestFactory,
        InvoiceManager,
        MockAccountDatabaseNestFactory,
        MockCurrencyConfigProvider,
        MockFirestoreProvider,
        MockNotifierSnsConfigProvider,
        MockProfileClientConfigProvider,
        MockStatsDProvider,
        MockStrapiClientConfigProvider,
        MockStripeConfigProvider,
        NotifierService,
        NotifierSnsProvider,
        PaymentIntentManager,
        PaymentMethodManager,
        PaypalBillingAgreementManager,
        PayPalClient,
        PaypalClientConfig,
        PaypalCustomerManager,
        PriceManager,
        ProductConfigurationManager,
        ProductManager,
        ProfileClient,
        PromotionCodeManager,
        StrapiClient,
        StripeClient,
        StripeConfig,
        SubscriptionManager,
        {
          provide: LOGGER_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    accountCustomerManager = moduleRef.get(AccountCustomerManager);
    cartManager = moduleRef.get(CartManager);
    checkoutService = moduleRef.get(CheckoutService);
    customerManager = moduleRef.get(CustomerManager);
    eligibilityService = moduleRef.get(EligibilityService);
    invoiceManager = moduleRef.get(InvoiceManager);
    paymentIntentManager = moduleRef.get(PaymentIntentManager);
    paypalBillingAgreementManager = moduleRef.get(
      PaypalBillingAgreementManager
    );
    paypalCustomerManager = moduleRef.get(PaypalCustomerManager);
    privateMethod = jest
      .spyOn(checkoutService as any, 'customerChanged')
      .mockResolvedValue({});
    profileClient = moduleRef.get(ProfileClient);
    productConfigurationManager = moduleRef.get(ProductConfigurationManager);
    promotionCodeManager = moduleRef.get(PromotionCodeManager);
    statsd = moduleRef.get(StatsDService);
    subscriptionManager = moduleRef.get(SubscriptionManager);
  });

  describe('prePaySteps', () => {
    const mockCustomerData = CheckoutCustomerDataFactory();
    const uid = faker.string.uuid();

    const mockCustomer = StripeResponseFactory(
      StripeCustomerFactory({
        shipping: {
          name: '',
          address: {
            city: faker.location.city(),
            country: TaxAddressFactory().countryCode,
            line1: faker.location.streetAddress(),
            line2: '',
            postal_code: TaxAddressFactory().postalCode,
            state: faker.location.state(),
          },
        },
      })
    );

    const mockInvoicePreview = InvoicePreviewFactory();

    const mockCart = StripeResponseFactory(
      ResultCartFactory({
        uid: uid,
        couponCode: faker.string.uuid(),
        stripeCustomerId: mockCustomer.id,
        eligibilityStatus: CartEligibilityStatus.CREATE,
        amount: mockInvoicePreview.subtotal,
      })
    );

    const mockAccountCustomer = StripeResponseFactory(
      ResultAccountCustomerFactory({
        uid: uid,
        stripeCustomerId: mockCart.stripeCustomerId,
      })
    );

    const mockPrice = StripePriceFactory();

    const mockPromotionCode = StripeResponseFactory(
      StripePromotionCodeFactory()
    );

    beforeEach(async () => {
      jest.spyOn(customerManager, 'create').mockResolvedValue(mockCustomer);
      jest.spyOn(customerManager, 'retrieve').mockResolvedValue(mockCustomer);
      jest
        .spyOn(accountCustomerManager, 'createAccountCustomer')
        .mockResolvedValue(mockAccountCustomer);
      jest.spyOn(cartManager, 'updateFreshCart').mockResolvedValue();
      jest
        .spyOn(eligibilityService, 'checkEligibility')
        .mockResolvedValue(EligibilityStatus.CREATE);
      jest
        .spyOn(productConfigurationManager, 'retrieveStripePrice')
        .mockResolvedValue(mockPrice);
      jest
        .spyOn(invoiceManager, 'previewUpcoming')
        .mockResolvedValue(mockInvoicePreview);
      jest
        .spyOn(subscriptionManager, 'cancelIncompleteSubscriptionsToPrice')
        .mockResolvedValue();
      jest
        .spyOn(promotionCodeManager, 'assertValidPromotionCodeNameForPrice')
        .mockResolvedValue(undefined);
      jest
        .spyOn(promotionCodeManager, 'retrieveByName')
        .mockResolvedValue(mockPromotionCode);
    });

    describe('success - with stripeCustomerId attached to cart', () => {
      beforeEach(async () => {
        await checkoutService.prePaySteps(mockCart, mockCustomerData);
      });

      it('fetches the customer', () => {
        expect(customerManager.retrieve).toHaveBeenCalledWith(
          mockCart.stripeCustomerId
        );
      });

      it('checks if cart eligibility matches customer eligibility', () => {
        expect(eligibilityService.checkEligibility).toHaveBeenCalledWith(
          mockCart.interval,
          mockCart.offeringConfigId,
          mockCustomer.id
        );

        expect(handleEligibilityStatusMap[EligibilityStatus.CREATE]).toEqual(
          mockCart.eligibilityStatus
        );
      });

      it('checks that cart total matches upcoming invoice', () => {
        expect(mockInvoicePreview.subtotal).toEqual(mockCart.amount);
      });

      it('does not update the cart', () => {
        expect(cartManager.updateFreshCart).not.toHaveBeenCalled();
      });

      it('checks that customer does not have existing subscription to price', () => {
        expect(
          subscriptionManager.cancelIncompleteSubscriptionsToPrice
        ).toHaveBeenCalledWith(mockCustomer.id, mockPrice.id);
      });

      it('checks if customer is stripe tax eligible', async () => {
        expect(customerManager.isTaxEligible).toBeTruthy();
      });

      it('fetches promotion code by name', async () => {
        expect(
          promotionCodeManager.assertValidPromotionCodeNameForPrice
        ).toHaveBeenCalledWith(mockCart.couponCode, mockPrice);
      });
    });

    describe('fail', () => {
      it('throws cart email not found error', async () => {
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            email: null,
          })
        );

        await expect(
          checkoutService.prePaySteps(mockCart, mockCustomerData)
        ).rejects.toBeInstanceOf(CartEmailNotFoundError);
      });

      it('throws cart uid not found error', async () => {
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            uid: undefined,
          })
        );

        await expect(
          checkoutService.prePaySteps(mockCart, mockCustomerData)
        ).rejects.toBeInstanceOf(CartUidNotFoundError);
      });

      it('throws cart currency invalid error', async () => {
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            currency: null,
          })
        );

        await expect(
          checkoutService.prePaySteps(mockCart, mockCustomerData)
        ).rejects.toBeInstanceOf(CartInvalidCurrencyError);
      });

      it('throws cart eligibility mismatch error', async () => {
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            uid: uid,
            couponCode: faker.string.uuid(),
            stripeCustomerId: mockCustomer.id,
            eligibilityStatus: CartEligibilityStatus.INVALID,
            amount: mockInvoicePreview.subtotal,
          })
        );

        await expect(
          checkoutService.prePaySteps(mockCart, mockCustomerData)
        ).rejects.toBeInstanceOf(CartEligibilityMismatchError);
      });

      it('throws invalid promo code error', async () => {
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            uid: uid,
            couponCode: faker.string.uuid(),
            stripeCustomerId: null,
            eligibilityStatus: CartEligibilityStatus.CREATE,
            amount: mockInvoicePreview.subtotal,
          })
        );

        jest
          .spyOn(promotionCodeManager, 'assertValidPromotionCodeNameForPrice')
          .mockRejectedValue(undefined);

        await expect(
          checkoutService.prePaySteps(mockCart, mockCustomerData)
        ).rejects.toBeInstanceOf(CartInvalidPromoCodeError);
      });

      it('throws cart total mismatch error', async () => {
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            uid: uid,
            couponCode: faker.string.uuid(),
            stripeCustomerId: null,
            eligibilityStatus: CartEligibilityStatus.CREATE,
            amount: faker.number.int(),
          })
        );

        await expect(
          checkoutService.prePaySteps(mockCart, mockCustomerData)
        ).rejects.toBeInstanceOf(CartTotalMismatchError);
      });
    });
  });

  describe('postPaySteps', () => {
    const mockUid = faker.string.uuid();
    const mockSubscription = StripeResponseFactory(StripeSubscriptionFactory());

    beforeEach(async () => {
      jest.spyOn(customerManager, 'setTaxId').mockResolvedValue();
      jest.spyOn(profileClient, 'deleteCache').mockResolvedValue('test');
      jest.spyOn(cartManager, 'finishCart').mockResolvedValue();
    });

    it('success', async () => {
      const mockCart = ResultCartFactory();

      await checkoutService.postPaySteps(
        mockCart,
        mockCart.version,
        mockSubscription,
        mockUid
      );

      expect(customerManager.setTaxId).toHaveBeenCalledWith(
        mockSubscription.customer,
        mockSubscription.currency
      );

      expect(privateMethod).toHaveBeenCalled();
      expect(cartManager.finishCart).toHaveBeenCalled();
    });

    it('success - adds coupon code to subscription metadata if it exists', async () => {
      const mockCart = ResultCartFactory({
        couponCode: faker.string.uuid(),
      });
      const mockUpdatedSubscription = StripeResponseFactory(
        StripeSubscriptionFactory({
          metadata: {
            [STRIPE_CUSTOMER_METADATA.SubscriptionPromotionCode]:
              mockCart.couponCode as string,
          },
        })
      );

      jest
        .spyOn(subscriptionManager, 'update')
        .mockResolvedValue(mockUpdatedSubscription);

      await checkoutService.postPaySteps(
        mockCart,
        mockCart.version,
        mockSubscription,
        mockUid
      );

      expect(customerManager.setTaxId).toHaveBeenCalledWith(
        mockSubscription.customer,
        mockSubscription.currency
      );
      expect(privateMethod).toHaveBeenCalled();
      expect(subscriptionManager.update).toHaveBeenCalledWith(
        mockSubscription.id,
        {
          metadata: {
            ...mockSubscription.metadata,
            [STRIPE_CUSTOMER_METADATA.SubscriptionPromotionCode]:
              mockCart.couponCode,
          },
        }
      );
    });
  });

  describe('payWithStripe', () => {
    describe('succeeded', () => {
      const mockCustomerData = CheckoutCustomerDataFactory();
      const mockCustomer = StripeResponseFactory(StripeCustomerFactory());
      const mockCart = StripeResponseFactory(
        ResultCartFactory({
          uid: faker.string.uuid(),
          stripeCustomerId: mockCustomer.id,
          couponCode: faker.string.uuid(),
        })
      );
      const mockPromotionCode = StripeResponseFactory(
        StripePromotionCodeFactory()
      );
      const mockSubscription = StripeResponseFactory(
        StripeSubscriptionFactory()
      );
      const mockPaymentIntent = StripeResponseFactory(
        StripePaymentIntentFactory({
          status: 'succeeded',
          payment_method: StripePaymentMethodFactory().id,
        })
      );
      const mockPrice = StripePriceFactory();
      const mockConfirmationToken = StripeConfirmationTokenFactory();
      const mockInvoice = StripeResponseFactory(
        StripeInvoiceFactory({
          payment_intent: mockPaymentIntent.id,
        })
      );
      const mockPrePayStepsResult = PrePayStepsResultFactory({
        uid: mockCart.uid,
        customer: mockCustomer,
        promotionCode: mockPromotionCode,
        price: mockPrice,
      });

      beforeEach(async () => {
        jest
          .spyOn(checkoutService, 'prePaySteps')
          .mockResolvedValue(mockPrePayStepsResult);
        jest
          .spyOn(subscriptionManager, 'create')
          .mockResolvedValue(mockSubscription);
        jest.spyOn(cartManager, 'updateFreshCart').mockResolvedValue();
        jest.spyOn(cartManager, 'setNeedsInputCart').mockResolvedValue();
        jest.spyOn(invoiceManager, 'retrieve').mockResolvedValue(mockInvoice);
        jest
          .spyOn(paymentIntentManager, 'confirm')
          .mockResolvedValue(mockPaymentIntent);
        jest.spyOn(customerManager, 'update').mockResolvedValue(mockCustomer);
        jest.spyOn(statsd, 'increment');
        jest.spyOn(checkoutService, 'postPaySteps').mockResolvedValue();
      });

      beforeEach(async () => {
        await checkoutService.payWithStripe(
          mockCart,
          mockConfirmationToken.id,
          mockCustomerData
        );
      });

      it('calls prePaySteps', async () => {
        expect(checkoutService.prePaySteps).toHaveBeenCalledWith(
          mockCart,
          mockCustomerData
        );
      });

      it('increments the statsd counter', async () => {
        expect(statsd.increment).toHaveBeenCalledWith('stripe_subscription', {
          payment_provider: 'stripe',
        });
      });

      it('creates the subscription', async () => {
        expect(subscriptionManager.create).toHaveBeenCalledWith(
          {
            customer: mockCustomer.id,
            automatic_tax: {
              enabled: true,
            },
            promotion_code: mockPromotionCode.id,
            items: [
              {
                price: mockPrice.id, // TODO: fetch price from cart after FXA-8893
              },
            ],
            payment_behavior: 'default_incomplete',
            currency: mockCart.currency,
            metadata: {
              amount: mockCart.amount,
              currency: mockCart.currency,
            },
          },
          { idempotencyKey: mockCart.id }
        );
      });

      it('calls updateFreshCart', async () => {
        expect(cartManager.updateFreshCart).toHaveBeenCalledWith(
          mockCart.id,
          mockPrePayStepsResult.version,
          { stripeSubscriptionId: mockSubscription.id }
        );
      });

      it('calls calls paymentIntentManager.confirm', async () => {
        expect(paymentIntentManager.confirm).toHaveBeenCalledWith(
          mockInvoice.payment_intent,
          { confirmation_token: mockConfirmationToken.id }
        );
      });

      it('calls customerManager.update', async () => {
        expect(customerManager.update).toHaveBeenCalledWith(mockCustomer.id, {
          invoice_settings: {
            default_payment_method: mockPaymentIntent.payment_method,
          },
        });
      });

      it('calls postPaySteps', async () => {
        expect(checkoutService.postPaySteps).toHaveBeenCalledWith(
          mockCart,
          mockPrePayStepsResult.version + 1,
          mockSubscription,
          mockCart.uid
        );
      });
    });

    describe('requires_action', () => {
      it('calls setNeedsInputCart', async () => {
        const mockCustomerData = CheckoutCustomerDataFactory();
        const mockCustomer = StripeResponseFactory(StripeCustomerFactory());
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            uid: faker.string.uuid(),
            stripeCustomerId: mockCustomer.id,
            couponCode: faker.string.uuid(),
          })
        );
        const mockPromotionCode = StripeResponseFactory(
          StripePromotionCodeFactory()
        );
        const mockSubscription = StripeResponseFactory(
          StripeSubscriptionFactory()
        );
        const mockPaymentIntent = StripeResponseFactory(
          StripePaymentIntentFactory({
            status: 'requires_action',
            payment_method: StripePaymentMethodFactory().id,
          })
        );
        const mockPrice = StripePriceFactory();
        const mockConfirmationToken = StripeConfirmationTokenFactory();
        const mockInvoice = StripeResponseFactory(
          StripeInvoiceFactory({
            payment_intent: mockPaymentIntent.id,
          })
        );
        const mockPrePayStepsResult = PrePayStepsResultFactory({
          uid: mockCart.uid,
          customer: mockCustomer,
          promotionCode: mockPromotionCode,
          price: mockPrice,
        });

        jest
          .spyOn(checkoutService, 'prePaySteps')
          .mockResolvedValue(mockPrePayStepsResult);
        jest
          .spyOn(subscriptionManager, 'create')
          .mockResolvedValue(mockSubscription);
        jest.spyOn(cartManager, 'updateFreshCart').mockResolvedValue();
        jest.spyOn(cartManager, 'setNeedsInputCart').mockResolvedValue();
        jest.spyOn(invoiceManager, 'retrieve').mockResolvedValue(mockInvoice);
        jest
          .spyOn(paymentIntentManager, 'confirm')
          .mockResolvedValue(mockPaymentIntent);
        jest.spyOn(customerManager, 'update').mockResolvedValue(mockCustomer);
        jest.spyOn(statsd, 'increment');
        jest.spyOn(checkoutService, 'postPaySteps').mockResolvedValue();

        await checkoutService.payWithStripe(
          mockCart,
          mockConfirmationToken.id,
          mockCustomerData
        );

        expect(cartManager.setNeedsInputCart).toHaveBeenCalledWith(mockCart.id);
      });
    });
  });

  describe('payWithPaypal', () => {
    describe('success', () => {
      const mockCustomerData = CheckoutCustomerDataFactory();
      const mockToken = faker.string.uuid();
      const mockCustomer = StripeResponseFactory(StripeCustomerFactory());
      const mockCart = StripeResponseFactory(
        ResultCartFactory({
          uid: faker.string.uuid(),
          stripeCustomerId: mockCustomer.id,
          couponCode: faker.string.uuid(),
        })
      );
      const mockPromotionCode = StripeResponseFactory(
        StripePromotionCodeFactory()
      );
      const mockBillingAgreementId = faker.string.uuid();
      const mockSubscription = StripeResponseFactory(
        StripeSubscriptionFactory()
      );
      const mockPaypalCustomer = ResultPaypalCustomerFactory();
      const mockInvoice = StripeResponseFactory(
        StripeInvoiceFactory({ status: 'paid' })
      );
      const mockPrice = StripePriceFactory();
      const mockPrePayStepsResult = PrePayStepsResultFactory({
        uid: mockCart.uid,
        customer: mockCustomer,
        promotionCode: mockPromotionCode,
        price: mockPrice,
        version: mockCart.version + 1,
      });

      beforeEach(async () => {
        jest
          .spyOn(checkoutService, 'prePaySteps')
          .mockResolvedValue(PrePayStepsResultFactory(mockPrePayStepsResult));
        jest
          .spyOn(subscriptionManager, 'getCustomerPayPalSubscriptions')
          .mockResolvedValue([]);
        jest
          .spyOn(paypalBillingAgreementManager, 'retrieveOrCreateId')
          .mockResolvedValue(mockBillingAgreementId);
        jest.spyOn(statsd, 'increment');
        jest
          .spyOn(subscriptionManager, 'create')
          .mockResolvedValue(mockSubscription);
        jest
          .spyOn(paypalCustomerManager, 'deletePaypalCustomersByUid')
          .mockResolvedValue(BigInt(1));
        jest
          .spyOn(paypalCustomerManager, 'createPaypalCustomer')
          .mockResolvedValue(mockPaypalCustomer);
        jest.spyOn(customerManager, 'update').mockResolvedValue(mockCustomer);
        jest.spyOn(invoiceManager, 'retrieve').mockResolvedValue(mockInvoice);
        jest
          .spyOn(invoiceManager, 'processPayPalInvoice')
          .mockResolvedValue(mockInvoice);
        jest.spyOn(subscriptionManager, 'cancel');
        jest.spyOn(paypalBillingAgreementManager, 'cancel').mockResolvedValue();
        jest.spyOn(checkoutService, 'postPaySteps').mockResolvedValue();
        jest.spyOn(cartManager, 'updateFreshCart').mockResolvedValue();
      });

      beforeEach(async () => {
        await checkoutService.payWithPaypal(
          mockCart,
          mockCustomerData,
          mockToken
        );
      });

      it('calls prePaySteps', async () => {
        expect(checkoutService.prePaySteps).toHaveBeenCalledWith(
          mockCart,
          mockCustomerData
        );
      });

      it('fetches the customers paypal subscriptions', async () => {
        expect(
          subscriptionManager.getCustomerPayPalSubscriptions
        ).toHaveBeenCalledWith(mockCustomer.id);
      });

      it('fetches/creates a billing agreement for checkout', async () => {
        expect(
          paypalBillingAgreementManager.retrieveOrCreateId
        ).toHaveBeenCalledWith(mockCart.uid, false, mockToken);
      });

      it('increments the statsd counter', async () => {
        expect(statsd.increment).toHaveBeenCalledWith('stripe_subscription', {
          payment_provider: 'paypal',
        });
      });

      it('creates the subscription', async () => {
        expect(subscriptionManager.create).toHaveBeenCalledWith(
          {
            customer: mockCustomer.id,
            automatic_tax: {
              enabled: true,
            },
            collection_method: 'send_invoice',
            days_until_due: 1,
            promotion_code: mockPromotionCode.id,
            items: [
              {
                price: mockPrice.id,
              },
            ],
            currency: mockCart.currency,
            metadata: {
              amount: mockCart.amount,
              currency: mockCart.currency,
            },
          },
          { idempotencyKey: mockCart.id }
        );
      });

      it('deletes all paypalCustomers for user by uid', () => {
        expect(
          paypalCustomerManager.deletePaypalCustomersByUid
        ).toHaveBeenCalledWith(mockCart.uid);
      });

      it('creates a paypalCustomer entry for created billing agreement', () => {
        expect(paypalCustomerManager.createPaypalCustomer).toHaveBeenCalledWith(
          {
            uid: mockCart.uid,
            billingAgreementId: mockBillingAgreementId,
            status: 'active',
            endedAt: null,
          }
        );
      });

      it('calls customermanager.update', () => {
        expect(customerManager.update).toHaveBeenCalledWith(mockCustomer.id, {
          metadata: { paypalAgreementId: mockBillingAgreementId },
        });
      });
      it('calls cartManager.updateFreshCart', () => {
        expect(cartManager.updateFreshCart).toHaveBeenCalledWith(
          mockCart.id,
          mockPrePayStepsResult.version,
          { stripeSubscriptionId: mockSubscription.id }
        );
      });
      it('calls invoiceManager.processPayPalInvoice', async () => {
        expect(invoiceManager.processPayPalInvoice).toHaveBeenCalledWith(
          mockInvoice
        );
      });
      it('calls postPaySteps', async () => {
        expect(checkoutService.postPaySteps).toHaveBeenCalledWith(
          mockCart,
          mockPrePayStepsResult.version + 1,
          mockSubscription,
          mockCart.uid
        );
      });
    });
    describe('uncollectible', () => {
      it('throws a CheckoutPaymentError', async () => {
        const mockCustomerData = CheckoutCustomerDataFactory();
        const mockToken = faker.string.uuid();
        const mockCustomer = StripeResponseFactory(StripeCustomerFactory());
        const mockCart = StripeResponseFactory(
          ResultCartFactory({
            uid: faker.string.uuid(),
            stripeCustomerId: mockCustomer.id,
            couponCode: faker.string.uuid(),
          })
        );
        const mockPromotionCode = StripeResponseFactory(
          StripePromotionCodeFactory()
        );
        const mockBillingAgreementId = faker.string.uuid();
        const mockSubscription = StripeResponseFactory(
          StripeSubscriptionFactory()
        );
        const mockPaypalCustomer = ResultPaypalCustomerFactory();
        const mockInvoice = StripeResponseFactory(
          StripeInvoiceFactory({ status: 'uncollectible' })
        );
        const mockPrice = StripePriceFactory();
        const mockPrePayStepsResult = PrePayStepsResultFactory({
          uid: mockCart.uid,
          customer: mockCustomer,
          promotionCode: mockPromotionCode,
          price: mockPrice,
          version: mockCart.version + 1,
        });

        jest
          .spyOn(checkoutService, 'prePaySteps')
          .mockResolvedValue(PrePayStepsResultFactory(mockPrePayStepsResult));
        jest
          .spyOn(subscriptionManager, 'getCustomerPayPalSubscriptions')
          .mockResolvedValue([]);
        jest
          .spyOn(paypalBillingAgreementManager, 'retrieveOrCreateId')
          .mockResolvedValue(mockBillingAgreementId);
        jest.spyOn(statsd, 'increment');
        jest
          .spyOn(subscriptionManager, 'create')
          .mockResolvedValue(mockSubscription);
        jest
          .spyOn(paypalCustomerManager, 'deletePaypalCustomersByUid')
          .mockResolvedValue(BigInt(1));
        jest
          .spyOn(paypalCustomerManager, 'createPaypalCustomer')
          .mockResolvedValue(mockPaypalCustomer);
        jest.spyOn(customerManager, 'update').mockResolvedValue(mockCustomer);
        jest.spyOn(invoiceManager, 'retrieve').mockResolvedValue(mockInvoice);
        jest
          .spyOn(invoiceManager, 'processPayPalInvoice')
          .mockResolvedValue(mockInvoice);
        jest.spyOn(subscriptionManager, 'cancel');
        jest.spyOn(paypalBillingAgreementManager, 'cancel').mockResolvedValue();
        jest.spyOn(checkoutService, 'postPaySteps').mockResolvedValue();
        jest.spyOn(cartManager, 'updateFreshCart').mockResolvedValue();

        await expect(
          checkoutService.payWithPaypal(mockCart, mockCustomerData, mockToken)
        ).rejects.toBeInstanceOf(CheckoutPaymentError);
      });
    });
  });
});
