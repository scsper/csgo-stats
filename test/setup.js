import 'babel-polyfill';

import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai from 'chai';

chai.use(sinonChai);

global.expect = chai.expect;

beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
});

afterEach(function() {
    this.sandbox.restore();
});
