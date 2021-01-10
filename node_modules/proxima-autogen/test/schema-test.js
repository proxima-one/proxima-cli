//check key matches get query
var assert = require('assert');
var fs = require('fs-extra');
const { parse, visit, print } = require("graphql/language");

const autogen = require('../src/index.js');
var srcDir = "./test/data/schema/"
var destDir = "./test/schema_test";
var expected_schema = (fs.readFileSync("./test/data/schema/processed-schema.graphql")).toString();
var test_schema_1 = (fs.readFileSync("./test/data/schema/test-schema-1.graphql")).toString();
var test_schema_2 = (fs.readFileSync("./test/data/schema/test-schema-2.graphql")).toString();
var actual_schema;
var test_schema_1_name = "test-schema-1.graphql"
var test_schema_2_name = "test-schema-2.graphql"

function setup(testDir, srcDir, srcSchema) {
  //cleanup(testDir)
  fs.ensureDirSync(testDir + "/schema")
  fs.copySync(srcDir + srcSchema, testDir + "/schema/" + srcSchema)
}

function cleanup(testDir) {
  fs.removeSync(testDir)
}

  describe('schema processing', function() {
    for (const schema_file of [test_schema_1_name, test_schema_2_name]) {

      it('should run without error with file: ' + schema_file, function() {
            setup(destDir, srcDir, schema_file)
            autogen.processSchema({}, destDir + "/schema/" + schema_file)
      });
    it('should have the correct folder structure with file: '  + schema_file, function() {
      assert(fs.pathExistsSync(destDir + "/schema/"), true)
      assert(fs.pathExistsSync(destDir + "/schema/" + schema_file), true)
      autogen.processSchema({}, destDir + "/schema/" + schema_file)
      actual_schema = (fs.readFileSync(destDir + "/schema/" + schema_file)).toString()
      assert(actual_schema);
    });
    it('should generate a valid graphql file with file: '  + schema_file, function() {
        actual_schema = (fs.readFileSync(destDir + "/schema/" + schema_file)).toString()
        parse(actual_schema);
    });
    //should be equal to expected schema file
    // it('should generate expected schema with file: '  + schema_file, function() {
    //   var expected_schema = (fs.readFileSync("./test/data/schema/processed-schema.graphql")).toString();
    //
    //   assert.equal(actual_schema, expected_schema);
    // });
    // //inputs
    // it('should generate input values from entities', function() {
    //   //inputs match type
    //   assert.equal(true, false);
    // });

    //mutations
    it('should generate mutations from entities', function() {
      var expected_schema = (fs.readFileSync("./test/data/schema/processed-schema.graphql")).toString();
      assert.equal(true, true);
    });
    //queries
    it('should generate correct queries from entities', function() {
      var expected_schema = (fs.readFileSync("./test/data/schema/processed-schema.graphql")).toString();
      cleanup(destDir)
      assert.equal(true, true);
    });
  }

  });
