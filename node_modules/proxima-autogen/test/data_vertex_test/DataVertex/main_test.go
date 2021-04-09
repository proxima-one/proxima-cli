package proxima_data_vertex

import (
  "testing"
  _ "math/rand"
  _ "fmt"
  _ "time"
  //vertexTesting "github.com/proxima-one/proxima-data-vertex/pkg/vertexTesting"
)



func TestApplicationResolvers(t *testing.T) {
  var configFilePath string = "../../app-config.yml"
  var dbConfigFilePath string = "../database/db-config.yaml"

  config, configErr :=  getConfig(configFilePath)

  if configErr != nil {
    t.Errorf("Application config reading error: %v", configErr)

  }
  dbConfig, dbConfigErr := getDBConfig(dbConfigFilePath)
  if dbConfigErr != nil {
    t.Errorf("Database config readig error: %v", dbConfigErr)
  }
  var db *proxima.ProximaDatabase;

  db, dbErr := vertex.CreateApplicationDatabase(dbConfig);
  if (dbErr != nil) {
    t.Error("Error creating the resolvers", dbErr);
  }

  _, resolverErr := vertex.CreateResolvers(db);
  if (resolverErr != nil) {
    t.Error("Error creating the resolvers", resolverErr);
  }
}
//   //auto-generated, but using the resolvers config file
//   //vertexTesting
//   //generate the vertex
//   //testCases
//   schema := 0 //vertex.executableSchema()
//   queryString := ""
//   operationName := ""
//   variables := make(map[string]interface{})
//   expectedResult := ""
//
//   //read JSON data
//   //generate test controls from JSON
//
//
//   //use test controls for operations, entities, etc (split them up into entities)
//   //entities
//   //entityInputs
//
//   //GenerateEntities, and Inputs
//   //GenerateEntityInputs
//   testCase := vertexTesting.NewDefaultTestCase(schema, queryString, operationName, expectedResult, variables)
//
//   //mutationTests := vertexTesting.GenerateMutationTests(entityInputs)
//   //queryTest := vertexTesting.GenerateQueryTests(entities)
//
//   //vertexTesting.RunTests(t, mutationTests)
//   //vertexTesting.RunTests(t, queryTests)
//   vertexTesting.RunTest(t, testCase)
// }

//resolverEntityTest
