/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const sinon = require('sinon');
const assert = { ...sinon.assert, ...chai.assert };
const { recoveryPhoneRoutes } = require('../../../lib/routes/recovery-phone');
import { RecoveryNumberNotSupportedError } from '@fxa/accounts/recovery-phone';

const { getRoute } = require('../../routes_helpers');
const { mockRequest } = require('../../mocks');
const { Container } = require('typedi');
chai.use(chaiAsPromised);

describe('/recovery-phone', () => {
  const sandbox = sinon.createSandbox();
  const uid = '123435678123435678123435678123435678';
  const phoneNumber = '+15550005555';
  const code = '000000';
  const mockLog = {};
  const mockGlean = {
    twoStepAuthPhoneCode: {
      sent: sandbox.fake(),
      sendError: sandbox.fake(),
      complete: sandbox.fake(),
    },
  };
  const mockRecoveryPhoneService = {
    setupPhoneNumber: sandbox.fake(),
    confirmCode: sandbox.fake(),
  };
  let routes = [];

  before(() => {
    Container.set('RecoveryPhoneService', mockRecoveryPhoneService);
    routes = recoveryPhoneRoutes(mockLog, mockGlean);
  });

  afterEach(() => {
    sandbox.reset();
  });

  async function makeRequest(req) {
    const route = getRoute(routes, req.path, req.method);
    return await route.handler(mockRequest(req));
  }

  describe('POST /recovery-phone/send_code', () => {
    it('sends recovery phone code', async () => {
      mockRecoveryPhoneService.sendCode = sinon.fake.returns(true);

      const resp = await makeRequest({
        method: 'POST',
        path: '/recovery-phone/send_code',
        credentials: { uid },
      });

      assert.isDefined(resp);
      assert.equal(resp.status, 'success');
      assert.equal(mockRecoveryPhoneService.sendCode.callCount, 1);
      assert.equal(mockRecoveryPhoneService.sendCode.getCall(0).args[0], uid);

      assert.equal(mockGlean.twoStepAuthPhoneCode.sent.callCount, 1);
      assert.equal(mockGlean.twoStepAuthPhoneCode.sendError.callCount, 0);
    });

    it('handles failure to send recovery phone code', async () => {
      mockRecoveryPhoneService.sendCode = sinon.fake.returns(false);

      const resp = await makeRequest({
        method: 'POST',
        path: '/recovery-phone/send_code',
        credentials: { uid },
      });

      assert.isDefined(resp);
      assert.equal(resp.status, 'failure');
      assert.equal(mockRecoveryPhoneService.sendCode.callCount, 1);
      assert.equal(mockRecoveryPhoneService.sendCode.getCall(0).args[0], uid);

      assert.equal(mockGlean.twoStepAuthPhoneCode.sent.callCount, 0);
      assert.equal(mockGlean.twoStepAuthPhoneCode.sendError.callCount, 1);
    });

    it('handles unexpected backend error', async () => {
      mockRecoveryPhoneService.sendCode = sinon.fake.returns(
        Promise.reject(new Error('BOOM'))
      );

      const promise = makeRequest({
        method: 'POST',
        path: '/recovery-phone/send_code',
        credentials: { uid },
      });

      await assert.isRejected(promise, 'A backend service request failed.');
      assert.equal(mockRecoveryPhoneService.sendCode.callCount, 1);
      assert.equal(mockRecoveryPhoneService.sendCode.getCall(0).args[0], uid);

      assert.equal(mockGlean.twoStepAuthPhoneCode.sent.callCount, 0);
      assert.equal(mockGlean.twoStepAuthPhoneCode.sendError.callCount, 0);
    });

    it('requires session authorization', () => {
      const route = getRoute(routes, '/recovery-phone/send_code', 'POST');
      assert.include(route.options.auth.strategies, 'sessionToken');
    });
  });

  describe('POST /recovery-phone/create', () => {
    it('creates recovery phone number', async () => {
      mockRecoveryPhoneService.setupPhoneNumber = sinon.fake.returns(true);

      const resp = await makeRequest({
        method: 'POST',
        path: '/recovery-phone/create',
        credentials: { uid },
        payload: { phoneNumber },
      });

      assert.isDefined(resp);
      assert.equal(resp.status, 'success');
      assert.equal(mockRecoveryPhoneService.setupPhoneNumber.callCount, 1);
      assert.equal(
        mockRecoveryPhoneService.setupPhoneNumber.getCall(0).args[0],
        uid
      );
      assert.equal(
        mockRecoveryPhoneService.setupPhoneNumber.getCall(0).args[1],
        phoneNumber
      );
      assert.equal(mockGlean.twoStepAuthPhoneCode.sent.callCount, 1);
      assert.equal(mockGlean.twoStepAuthPhoneCode.sendError.callCount, 0);
    });

    it('indicates failure sending sms', async () => {
      mockRecoveryPhoneService.setupPhoneNumber = sinon.fake.returns(false);

      const resp = await makeRequest({
        method: 'POST',
        path: '/recovery-phone/create',
        credentials: { uid },
        payload: { phoneNumber: 'invalid' },
      });

      assert.isDefined(resp);
      assert.equal(resp.status, 'failure');
      assert.equal(mockGlean.twoStepAuthPhoneCode.sent.callCount, 0);
      assert.equal(mockGlean.twoStepAuthPhoneCode.sendError.callCount, 1);
    });

    it('rejects an unsupported dialing code', async () => {
      mockRecoveryPhoneService.setupPhoneNumber = sinon.fake.returns(
        Promise.reject(new RecoveryNumberNotSupportedError())
      );

      const promise = makeRequest({
        method: 'POST',
        path: '/recovery-phone/create',
        credentials: { uid },
        payload: { phoneNumber: '+495550005555' },
      });

      await assert.isRejected(promise, 'Invalid phone number');
      assert.equal(mockGlean.twoStepAuthPhoneCode.sent.callCount, 0);
      assert.equal(mockGlean.twoStepAuthPhoneCode.sendError.callCount, 1);
    });

    it('handles unexpected backend error', async () => {
      mockRecoveryPhoneService.setupPhoneNumber = sinon.fake.returns(
        Promise.reject(new Error('BOOM'))
      );

      const promise = makeRequest({
        method: 'POST',
        path: '/recovery-phone/create',
        credentials: { uid },
        payload: { phoneNumber },
      });

      await assert.isRejected(promise, 'A backend service request failed.');
      assert.equal(mockGlean.twoStepAuthPhoneCode.sent.callCount, 0);
      assert.equal(mockGlean.twoStepAuthPhoneCode.sendError.callCount, 1);
    });

    it('validates incoming phone number', () => {
      const route = getRoute(routes, '/recovery-phone/create', 'POST');
      const joiSchema = route.options.validate.payload;

      const validNumber = joiSchema.validate({ phoneNumber: '+15550005555' });
      const missingNumber = joiSchema.validate({});
      const invalidNumber = joiSchema.validate({ phoneNumber: '5550005555' });

      assert.isUndefined(validNumber.error);
      assert.include(missingNumber.error.message, 'is required');
      assert.include(
        invalidNumber.error.message,
        'fails to match the required pattern'
      );
    });

    it('requires session authorization', () => {
      const route = getRoute(routes, '/recovery-phone/create', 'POST');
      assert.include(route.options.auth.strategies, 'sessionToken');
    });
  });

  describe('POST /recovery-phone/confirm', async () => {
    it('confirms a code', async () => {
      mockRecoveryPhoneService.confirmCode = sinon.fake.returns(true);

      const resp = await makeRequest({
        method: 'POST',
        path: '/recovery-phone/confirm',
        credentials: { uid },
        payload: { code },
      });

      assert.isDefined(resp);
      assert.equal(resp.status, 'success');
      assert.equal(mockRecoveryPhoneService.confirmCode.callCount, 1);
      assert.equal(
        mockRecoveryPhoneService.confirmCode.getCall(0).args[0],
        uid
      );
      assert.equal(
        mockRecoveryPhoneService.confirmCode.getCall(0).args[1],
        code
      );
      assert.equal(mockGlean.twoStepAuthPhoneCode.complete.callCount, 1);
    });

    it('indicates a failure confirming code', async () => {
      mockRecoveryPhoneService.confirmCode = sinon.fake.returns(false);
      const promise = makeRequest({
        method: 'POST',
        path: '/recovery-phone/confirm',
        credentials: { uid },
        payload: { code },
      });

      await assert.isRejected(promise, 'Invalid or expired confirmation code');
      assert.equal(mockGlean.twoStepAuthPhoneCode.complete.callCount, 0);
    });

    it('indicates an issue with the backend service', async () => {
      mockRecoveryPhoneService.confirmCode = sinon.fake.returns(
        Promise.reject(new Error('BOOM'))
      );
      const promise = makeRequest({
        method: 'POST',
        path: '/recovery-phone/confirm',
        credentials: { uid },
        payload: { code },
      });

      await assert.isRejected(promise, 'A backend service request failed.');
      assert.equal(mockGlean.twoStepAuthPhoneCode.complete.callCount, 0);
    });
  });
});
