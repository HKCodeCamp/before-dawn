'use strict';

const assert = require('assert');
const Package = require('../../app/lib/package.js');
const sinon = require('sinon');

const helpers = require('./setup.js');
var workingDir = helpers.getTempDir();

var attrs = {
  repo: "muffinista/before-dawn-screensavers",
  dest:workingDir
}

var sandbox;

describe('Package', function() {
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

	describe('initialization', function() {
    it('loads data', function() {
      var p = new Package(attrs);

			assert.equal(false, p.downloaded);
			assert.equal(false, p.attrs().downloaded);      

      assert.equal(workingDir, p.dest);
      assert.equal(workingDir, p.attrs().dest);      
		});
  });

  describe('getReleaseInfo', () => {
    it('does stuff', async () => {
      var p = new Package(attrs);
      let results = await p.getReleaseInfo();
      assert.equal("muffinista", results.author.login);
    });
  });

  describe('checkLatestRelease', () => {
    var p;

    beforeEach(() => {
      p = new Package(attrs);
      sandbox.stub(p, 'getReleaseInfo').
              returns(require('../fixtures/release.json'));
    });
     
    it('calls downloadFile', async () => {
      var cb = sinon.spy();
      var df = sandbox.stub(p, 'downloadFile');

      let results = await p.checkLatestRelease(cb);
      assert(df.calledOnce);
      //assert(cb.called);
    });

    it('doesnt call if not needed', async () => {
      var cb = sinon.spy();
      var df = sandbox.stub(p, 'downloadFile');

      p.updated_at = "2017-06-06T23:55:44Z";
      
      let results = await p.checkLatestRelease(cb);
      assert(!df.calledOnce);
    });
  });
  
});
