'use strict';

var expect = require('chai').expect;
var fetchRepoVersionsFromGithub = require('../lib/fetch-repo-versions-from-github');
var RSVP = require('rsvp');

describe('lib/fetch-repo-versions-from-github', function() {

  it('fetches ember versions', function() {
    return fetchRepoVersionsFromGithub('ember', {logErrors: true}).then(function(versions) {
      expect(versions.indexOf('2.4.0')).not.to.equal(-1);
    });
  });

  it('fetches from github api for components/ember tags', function() {
    var requestedUrl;
    function fakeFetch(url) {
      requestedUrl = url;
      return new RSVP.Promise(function(resolve) {
        resolve([]);
      });
    }

    return fetchRepoVersionsFromGithub('ember', {fetch: fakeFetch, perPage: 30, page: 0, accessToken: 'foo' }).then(function() {
      expect(requestedUrl).to.equal('https://api.github.com/repos/components/ember/tags?per_page=30&page=0&access_token=foo');
    });
  });

  it('fetches ember-data versions', function() {
    return fetchRepoVersionsFromGithub('ember-data', {logErrors: true}).then(function(versions) {
      expect(versions.indexOf('2.4.0')).not.to.equal(-1);
    });
  });

  it('fetches from github api for components/ember-data tags', function() {
    var requestedUrl;
    function fakeFetch(url) {
      requestedUrl = url;
      return new RSVP.Promise(function(resolve) {
        resolve([]);
      });
    }

    return fetchRepoVersionsFromGithub('ember-data', {fetch: fakeFetch, perPage: 30, page: 0, accessToken: 'foo' }).then(function() {
      expect(requestedUrl).to.equal('https://api.github.com/repos/components/ember-data/tags?per_page=30&page=0&access_token=foo');
    });
  });

  it('returns empty array on error/timeout', function() {
    var options;
    function fakeFetch(url, opts) {
      options = opts;
      return new RSVP.Promise(function() {
        throw new Error('Timeout');
      });
    }

    return fetchRepoVersionsFromGithub('ember', {fetch: fakeFetch}).then(function(versions) {
      expect(versions.length).to.equal(0);
      expect(options.timeout).to.equal(1000);
    });
  });

  it('returns the names of tags returned', function() {
    function fakeFetch() {
      return new RSVP.Promise(function(resolve) {
        resolve({ json: function() {
          return [
            {name: 'cat'},
            {name: 'dog'},
            {name: 'fish'}
          ]
        }});
      });
    }

    return fetchRepoVersionsFromGithub('ember', {fetch: fakeFetch, logErrors: true}).then(function(versions) {
      expect(versions).to.eql(['cat', 'dog', 'fish']);
    });
  });

});
