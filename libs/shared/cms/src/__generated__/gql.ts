/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query CapabilityServiceByPlanIds($stripePlanIds: [String]!) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 200 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      offering {\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        capabilities {\n          slug\n          services {\n            oauthClientId\n          }\n        }\n      }\n    }\n  }\n": types.CapabilityServiceByPlanIdsDocument,
    "\n  query EligibilityContentByOffering($apiIdentifier: String!) {\n    offerings(\n      filters: { apiIdentifier: { eq: $apiIdentifier } }\n      pagination: { limit: 200 }\n    ) {\n      apiIdentifier\n      stripeProductId\n      defaultPurchase {\n        stripePlanChoices {\n          stripePlanChoice\n        }\n      }\n      subGroups {\n        groupName\n        offerings {\n          apiIdentifier\n          stripeProductId\n          defaultPurchase {\n            stripePlanChoices {\n              stripePlanChoice\n            }\n          }\n        }\n      }\n    }\n  }\n": types.EligibilityContentByOfferingDocument,
    "\n  query EligibilityContentByPlanIds($stripePlanIds: [String]!) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 200 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      offering {\n        apiIdentifier\n        stripeProductId\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        countries\n        subGroups {\n          groupName\n          offerings {\n            apiIdentifier\n            stripeProductId\n            stripeLegacyPlans(pagination: { limit: 200 }) {\n              stripeLegacyPlan\n            }\n            countries\n          }\n        }\n      }\n    }\n  }\n": types.EligibilityContentByPlanIdsDocument,
    "\n  query Locales {\n    i18NLocales(pagination: { limit: 100 }) {\n      code\n    }\n  }\n": types.LocalesDocument,
    "\n  query Offering($id: ID!, $locale: String!) {\n    offering(documentId: $id) {\n      stripeProductId\n      countries\n      defaultPurchase {\n        purchaseDetails {\n          productName\n          details\n          subtitle\n          webIcon\n          localizations(filters: { locale: { eq: $locale } }) {\n            productName\n            details\n            subtitle\n            webIcon\n          }\n        }\n      }\n    }\n  }\n": types.OfferingDocument,
    "\n  query PageContentForOffering($locale: String!, $apiIdentifier: String!) {\n    offerings(\n      filters: { apiIdentifier: { eq: $apiIdentifier } }\n      pagination: { limit: 200 }\n    ) {\n      apiIdentifier\n      stripeProductId\n      defaultPurchase {\n        purchaseDetails {\n          details\n          productName\n          subtitle\n          webIcon\n          localizations(filters: { locale: { eq: $locale } }) {\n            details\n            productName\n            subtitle\n            webIcon\n          }\n        }\n      }\n      commonContent {\n        privacyNoticeUrl\n        privacyNoticeDownloadUrl\n        termsOfServiceUrl\n        termsOfServiceDownloadUrl\n        cancellationUrl\n        emailIcon\n        successActionButtonUrl\n        successActionButtonLabel\n        newsletterLabelTextCode\n        newsletterSlug\n        localizations(filters: { locale: { eq: $locale } }) {\n          privacyNoticeUrl\n          privacyNoticeDownloadUrl\n          termsOfServiceUrl\n          termsOfServiceDownloadUrl\n          cancellationUrl\n          emailIcon\n          successActionButtonUrl\n          successActionButtonLabel\n          newsletterLabelTextCode\n          newsletterSlug\n        }\n      }\n    }\n  }\n": types.PageContentForOfferingDocument,
    "\n  query PurchaseWithDetailsOfferingContent(\n    $locale: String!\n    $stripePlanIds: [String]!\n  ) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 500 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      purchaseDetails {\n        details\n        productName\n        subtitle\n        webIcon\n        localizations(filters: { locale: { eq: $locale } }) {\n          details\n          productName\n          subtitle\n          webIcon\n        }\n      }\n      offering {\n        stripeProductId\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        commonContent {\n          privacyNoticeUrl\n          privacyNoticeDownloadUrl\n          termsOfServiceUrl\n          termsOfServiceDownloadUrl\n          cancellationUrl\n          emailIcon\n          successActionButtonUrl\n          successActionButtonLabel\n          newsletterLabelTextCode\n          newsletterSlug\n          localizations(filters: { locale: { eq: $locale } }) {\n            privacyNoticeUrl\n            privacyNoticeDownloadUrl\n            termsOfServiceUrl\n            termsOfServiceDownloadUrl\n            cancellationUrl\n            emailIcon\n            successActionButtonUrl\n            successActionButtonLabel\n            newsletterLabelTextCode\n            newsletterSlug\n          }\n        }\n      }\n    }\n  }\n": types.PurchaseWithDetailsOfferingContentDocument,
    "\n  query ServicesWithCapabilities {\n    services(pagination: { limit: 500 }) {\n      oauthClientId\n      capabilities {\n        slug\n      }\n    }\n  }\n": types.ServicesWithCapabilitiesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CapabilityServiceByPlanIds($stripePlanIds: [String]!) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 200 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      offering {\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        capabilities {\n          slug\n          services {\n            oauthClientId\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CapabilityServiceByPlanIds($stripePlanIds: [String]!) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 200 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      offering {\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        capabilities {\n          slug\n          services {\n            oauthClientId\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EligibilityContentByOffering($apiIdentifier: String!) {\n    offerings(\n      filters: { apiIdentifier: { eq: $apiIdentifier } }\n      pagination: { limit: 200 }\n    ) {\n      apiIdentifier\n      stripeProductId\n      defaultPurchase {\n        stripePlanChoices {\n          stripePlanChoice\n        }\n      }\n      subGroups {\n        groupName\n        offerings {\n          apiIdentifier\n          stripeProductId\n          defaultPurchase {\n            stripePlanChoices {\n              stripePlanChoice\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query EligibilityContentByOffering($apiIdentifier: String!) {\n    offerings(\n      filters: { apiIdentifier: { eq: $apiIdentifier } }\n      pagination: { limit: 200 }\n    ) {\n      apiIdentifier\n      stripeProductId\n      defaultPurchase {\n        stripePlanChoices {\n          stripePlanChoice\n        }\n      }\n      subGroups {\n        groupName\n        offerings {\n          apiIdentifier\n          stripeProductId\n          defaultPurchase {\n            stripePlanChoices {\n              stripePlanChoice\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EligibilityContentByPlanIds($stripePlanIds: [String]!) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 200 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      offering {\n        apiIdentifier\n        stripeProductId\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        countries\n        subGroups {\n          groupName\n          offerings {\n            apiIdentifier\n            stripeProductId\n            stripeLegacyPlans(pagination: { limit: 200 }) {\n              stripeLegacyPlan\n            }\n            countries\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query EligibilityContentByPlanIds($stripePlanIds: [String]!) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 200 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      offering {\n        apiIdentifier\n        stripeProductId\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        countries\n        subGroups {\n          groupName\n          offerings {\n            apiIdentifier\n            stripeProductId\n            stripeLegacyPlans(pagination: { limit: 200 }) {\n              stripeLegacyPlan\n            }\n            countries\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Locales {\n    i18NLocales(pagination: { limit: 100 }) {\n      code\n    }\n  }\n"): (typeof documents)["\n  query Locales {\n    i18NLocales(pagination: { limit: 100 }) {\n      code\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Offering($id: ID!, $locale: String!) {\n    offering(documentId: $id) {\n      stripeProductId\n      countries\n      defaultPurchase {\n        purchaseDetails {\n          productName\n          details\n          subtitle\n          webIcon\n          localizations(filters: { locale: { eq: $locale } }) {\n            productName\n            details\n            subtitle\n            webIcon\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Offering($id: ID!, $locale: String!) {\n    offering(documentId: $id) {\n      stripeProductId\n      countries\n      defaultPurchase {\n        purchaseDetails {\n          productName\n          details\n          subtitle\n          webIcon\n          localizations(filters: { locale: { eq: $locale } }) {\n            productName\n            details\n            subtitle\n            webIcon\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PageContentForOffering($locale: String!, $apiIdentifier: String!) {\n    offerings(\n      filters: { apiIdentifier: { eq: $apiIdentifier } }\n      pagination: { limit: 200 }\n    ) {\n      apiIdentifier\n      stripeProductId\n      defaultPurchase {\n        purchaseDetails {\n          details\n          productName\n          subtitle\n          webIcon\n          localizations(filters: { locale: { eq: $locale } }) {\n            details\n            productName\n            subtitle\n            webIcon\n          }\n        }\n      }\n      commonContent {\n        privacyNoticeUrl\n        privacyNoticeDownloadUrl\n        termsOfServiceUrl\n        termsOfServiceDownloadUrl\n        cancellationUrl\n        emailIcon\n        successActionButtonUrl\n        successActionButtonLabel\n        newsletterLabelTextCode\n        newsletterSlug\n        localizations(filters: { locale: { eq: $locale } }) {\n          privacyNoticeUrl\n          privacyNoticeDownloadUrl\n          termsOfServiceUrl\n          termsOfServiceDownloadUrl\n          cancellationUrl\n          emailIcon\n          successActionButtonUrl\n          successActionButtonLabel\n          newsletterLabelTextCode\n          newsletterSlug\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query PageContentForOffering($locale: String!, $apiIdentifier: String!) {\n    offerings(\n      filters: { apiIdentifier: { eq: $apiIdentifier } }\n      pagination: { limit: 200 }\n    ) {\n      apiIdentifier\n      stripeProductId\n      defaultPurchase {\n        purchaseDetails {\n          details\n          productName\n          subtitle\n          webIcon\n          localizations(filters: { locale: { eq: $locale } }) {\n            details\n            productName\n            subtitle\n            webIcon\n          }\n        }\n      }\n      commonContent {\n        privacyNoticeUrl\n        privacyNoticeDownloadUrl\n        termsOfServiceUrl\n        termsOfServiceDownloadUrl\n        cancellationUrl\n        emailIcon\n        successActionButtonUrl\n        successActionButtonLabel\n        newsletterLabelTextCode\n        newsletterSlug\n        localizations(filters: { locale: { eq: $locale } }) {\n          privacyNoticeUrl\n          privacyNoticeDownloadUrl\n          termsOfServiceUrl\n          termsOfServiceDownloadUrl\n          cancellationUrl\n          emailIcon\n          successActionButtonUrl\n          successActionButtonLabel\n          newsletterLabelTextCode\n          newsletterSlug\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PurchaseWithDetailsOfferingContent(\n    $locale: String!\n    $stripePlanIds: [String]!\n  ) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 500 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      purchaseDetails {\n        details\n        productName\n        subtitle\n        webIcon\n        localizations(filters: { locale: { eq: $locale } }) {\n          details\n          productName\n          subtitle\n          webIcon\n        }\n      }\n      offering {\n        stripeProductId\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        commonContent {\n          privacyNoticeUrl\n          privacyNoticeDownloadUrl\n          termsOfServiceUrl\n          termsOfServiceDownloadUrl\n          cancellationUrl\n          emailIcon\n          successActionButtonUrl\n          successActionButtonLabel\n          newsletterLabelTextCode\n          newsletterSlug\n          localizations(filters: { locale: { eq: $locale } }) {\n            privacyNoticeUrl\n            privacyNoticeDownloadUrl\n            termsOfServiceUrl\n            termsOfServiceDownloadUrl\n            cancellationUrl\n            emailIcon\n            successActionButtonUrl\n            successActionButtonLabel\n            newsletterLabelTextCode\n            newsletterSlug\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query PurchaseWithDetailsOfferingContent(\n    $locale: String!\n    $stripePlanIds: [String]!\n  ) {\n    purchases(\n      filters: {\n        or: [\n          { stripePlanChoices: { stripePlanChoice: { in: $stripePlanIds } } }\n          {\n            offering: {\n              stripeLegacyPlans: { stripeLegacyPlan: { in: $stripePlanIds } }\n            }\n          }\n        ]\n      }\n      pagination: { limit: 500 }\n    ) {\n      stripePlanChoices {\n        stripePlanChoice\n      }\n      purchaseDetails {\n        details\n        productName\n        subtitle\n        webIcon\n        localizations(filters: { locale: { eq: $locale } }) {\n          details\n          productName\n          subtitle\n          webIcon\n        }\n      }\n      offering {\n        stripeProductId\n        stripeLegacyPlans(pagination: { limit: 200 }) {\n          stripeLegacyPlan\n        }\n        commonContent {\n          privacyNoticeUrl\n          privacyNoticeDownloadUrl\n          termsOfServiceUrl\n          termsOfServiceDownloadUrl\n          cancellationUrl\n          emailIcon\n          successActionButtonUrl\n          successActionButtonLabel\n          newsletterLabelTextCode\n          newsletterSlug\n          localizations(filters: { locale: { eq: $locale } }) {\n            privacyNoticeUrl\n            privacyNoticeDownloadUrl\n            termsOfServiceUrl\n            termsOfServiceDownloadUrl\n            cancellationUrl\n            emailIcon\n            successActionButtonUrl\n            successActionButtonLabel\n            newsletterLabelTextCode\n            newsletterSlug\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ServicesWithCapabilities {\n    services(pagination: { limit: 500 }) {\n      oauthClientId\n      capabilities {\n        slug\n      }\n    }\n  }\n"): (typeof documents)["\n  query ServicesWithCapabilities {\n    services(pagination: { limit: 500 }) {\n      oauthClientId\n      capabilities {\n        slug\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;