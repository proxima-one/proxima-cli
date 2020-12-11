//get the files/folders for the cli-test
//require
var assert = require('assert');

///init//////////////////////

describe('Proxima CLI', function() {
  describe('init()', function() {
    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //correct project name
    it('should have the correct project name', function() {
      assert.equal(true, false);
    });
    //correct app config and proxima config template
    it('should have the application config and proxima config', function() {
      assert.equal(true, false);
    });
  });

  //generate////////////////////////////
  describe('gen()', function() {
    //add abi, add schema, add app config

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //correct handler file structure
    it('should have the handlers generated correctly', function() {
      assert.equal(true, false);
    });
    //correct blockchain file structure
    it('should generate the blockchain client correctly', function() {
      assert.equal(true, false);
    });
    //correct proxima
    it('should generate the proxima vertex client correctly', function() {
      assert.equal(true, false);
    });
    //application database
    it('should generate the database configuration files correctly', function() {
      assert.equal(true, false);
    });
    //correct schema process
    it('should process the schema, such that it has queries, mutations, and inputs', function() {
      assert.equal(true, false);
    });
  });

  //build////////////////////////////
  describe('build()', function() {
    //add handlers

    //correct file structure
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });
    //correct data vertex
    it('should build the data vertex correctly', function() {
      assert.equal(true, false);
    });
    //correct dockerfiles
    it('should generate all of the dockerfiles correctly', function() {
      assert.equal(true, false);
    });
    //correct data aggregator
    it('should generate the data aggregator correctly', function() {
      assert.equal(true, false);
    });

    it('should build the dockerfiles for docker-compose without errors', function() {
      assert.equat(true, false);
    });
  });

  //run////////////////////////////
  describe('run()', function() {
    //run and check for errors
    it('should have the correct file structure', function() {
      assert.equal(true, false);
    });

    it('should be able to run docker-compose without errors or building', function() {
      assert.equal(true, false);
    });
  });
});
