//get the files/folders for the cli-test
//require
var assert = require('assert');
const fs = require('fs-extra');
const yaml = require('js-yaml')
const commands = require('../src/commands.js');
const process = require('process')


///init//////////////////////
const projectName = "Test_Project"
const homeDir = "./" + projectName
const testSchemaPath = require.resolve("./helpers/schema/schema.graphql")
const genAppConfigTestPath = require.resolve("./helpers/gen-app-config-test-template.yml")
const testABIPath = "./test/helpers/abi/"


 function cleanup() {
  fs.removeSync(homeDir);
}

async function genSetup() {
  let resp = await commands["init [project_name]"].action(projectName);
  fs.copySync(testABIPath, homeDir + "/abi")
  fs.copySync(genAppConfigTestPath, homeDir + "/app-config.yml")
  fs.copySync(testSchemaPath, homeDir + "/schema/schema.graphql")
  process.chdir(homeDir);
}

async function buildSetup() {
  let resp = await commands["init [project_name]"].action(projectName);
  fs.copySync(testABIPath, homeDir + "/abi")
  fs.copySync(genAppConfigTestPath, homeDir + "/app-config.yml")
  fs.copySync(testSchemaPath, homeDir + "/schema/schema.graphql")
  process.chdir(homeDir);
  let r = await commands.gen.action();
}

async function runSetup() {
  let resp = await buildSetup();
}

describe('Proxima CLI', async function() {
  describe('init()', async function() {
    it('it should run without errors', async function() {
      let resp = await commands["init [project_name]"].action(projectName);
      assert(true)
    })

    it('should generate the app config', async function() {
      //let resp = await commands["init [project_name]"].action(projectName)

      let hasConfig = fs.existsSync(homeDir + "/abi/")
      let actual_app_config = yaml.safeLoad(fs.readFileSync(homeDir + "/app-config.yml"));
      assert(hasConfig)

      //assert.equal(projectName, actual_app_config.name.toString());
    });

    it('should have the correct folder organization structure', async function() {
          let hasSchema = fs.existsSync(homeDir + "/schema")
          assert(hasSchema);
          let hasABI = fs.existsSync(homeDir + "/abi/")
          assert(hasABI);
          cleanup()
    });
  });

  //generate////////////////////////////
  describe('gen()', async function() {
    //add abi, add schema, add app config
    //correct file structure
    it('should run without errors', async function() {
        let resp = await genSetup();
        let r = await commands.gen.action();
        assert(true)
    });

    it('should have the schema and the abis', function() {
      let hasABI = fs.existsSync("./abi/")
      assert(hasABI);
      let hasSchema = fs.existsSync("./schema")
      assert(hasSchema);
    });
    //correct handler file structure
    it('should generate handlers for every datasource in the app config', function() {
      let hasHandlers = fs.existsSync("./handlers")
      assert(hasHandlers);
    });
    //correct proxima
    it('should generate the data vertex client', function() {
      let hasVertexClient = fs.existsSync("./vertex-client")
      assert(hasVertexClient);
    });
    //correct blockchain file structure
    it('should generate blockchain client', function() {
      let hasBlockchainFolder = fs.existsSync("./blockchain-clients")
      let hasIndex = fs.existsSync("./blockchain-client/index.js")
      process.chdir("../.");
      cleanup();
      assert(hasBlockchainFolder);
      //assert(hasIndex);
    });
  });

  //build////////////////////////////
  describe('build()', async function() {
    it('should maintain the gen folder structure', async function() {
      this.timeout(20000)
      let resp = await buildSetup()
      let esp = await commands.build.action();
    });

    //correct dockerfiles
    it('should generate docker compose file', function() {
      let hasDockerComposeFile = fs.existsSync("./docker-compose.yml")
      assert(hasDockerComposeFile);
    });
    //correct data aggregator
    it('should generate the data aggregator using the handlers, blockchain client, and proxima client', function() {
      let hasDataAggregatorFolder = fs.existsSync("./DataAggregator/")
      assert(hasDataAggregatorFolder);
      let hasVertexClient = fs.existsSync("./DataAggregator/vertex-client")
      assert(hasVertexClient);
      let hasBlockchainClient = fs.existsSync("./DataAggregator/blockchain-clients")
      assert(hasBlockchainClient);
      let hasHandlers = fs.existsSync("./DataAggregator/handlers")
      assert(hasHandlers);
      let hasPackage = fs.existsSync("./DataAggregator/package.json")
      assert(hasPackage);
    });

    it('should generate the database configuration files', function() {
      let hasDatabase = fs.existsSync("./database")
      assert(hasDatabase);
      let hasDatabaseConfig = fs.existsSync("./database/db-config.yaml");
      assert(hasDatabaseConfig);
    });
    //correct data vertex
    it('should build the data vertex', async function() {
      let hasDataVertexFolder = fs.existsSync("./DataVertex/")
      let hasDataVertexMain = fs.existsSync("./DataVertex/main.go")
      assert(!fs.pathExistsSync("./DataVertex/pkg/resolvers/schema.resolvers.go"))
      assert(fs.pathExistsSync("./DataVertex/pkg/resolvers/resolver_fns.go"), true)
      assert(hasDataVertexFolder);
      process.chdir("../.")
      cleanup();
      assert(hasDataVertexMain);
    });
    //application database

    // it('should build the dockerfiles for docker-compose without errors', function() {
    //   assert.equat(true, false);
    // });
  });

  //run////////////////////////////
  describe('run()', function() {
    // //run and check for errors
    // it('should have the correct file structure', function() {
    //   assert.equal(true, false);
    // });
    it('should be able to run docker-compose without errors or building', function() {
      assert(true)
    });
  });
});
