package vertex

import (
	_ "fmt"
	proxima "github.com/proxima-one/proxima-db-client-go/pkg/database"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/client"
	_ "math/rand"
	//graphql "github.com/graph-gophers/graphql-go"
	"testing"
	_ "time"
	//gqlTools "github.com/jensneuse/graphql-go-tools/pkg/astprinter"
)

//Add the query/update interface
//Post
//Query RawString

func TestDataVertex(t *testing.T) {
	var configFilePath string = "../../app-config.yml"
	var dbConfigFilePath string = "../../database/db-config.yaml"

	config, configErr := getConfig(configFilePath)

	if configErr != nil {
		t.Errorf("Application config reading error: %v", configErr)
	}
	dbConfig, dbConfigErr := getDBConfig(dbConfigFilePath)
	if dbConfigErr != nil {
		t.Errorf("Database config reading error: %v", dbConfigErr)
	}
	var db *proxima.ProximaDatabase;

	db, dbErr := CreateApplicationDatabase(dbConfig);
	if dbErr != nil {
	  t.Error("Error creating the database", dbErr);
	}

	_, dataloaderErr := CreateDataloaders(db)
	if dataloaderErr != nil {
		t.Error("Error creating the resolvers", dataloaderErr)
	}

	_, resolverErr := CreateResolvers(db)
	if resolverErr != nil {
		t.Error("Error creating the resolvers", resolverErr)
	}

	applicationVertex, err := CreateDataVertex(config, dbConfig)
	if err != nil {
		t.Errorf("Data vertex creation error: %v", err)
	}

	query := applicationVertex.query()
	if query == nil {
		t.Error("Error creating the query")
	}
}

func TestLoadDataVertex(t *testing.T) {
	//homeDir
	var configFilePath string = "../../app-config.yml"
	var dbConfigFilePath string = "../../database/db-config.yaml"

	applicationVertex, err := LoadDataVertex(configFilePath, dbConfigFilePath)
	if err != nil {
		t.Errorf("Data vertex creation error: %v", err)
	}

	query := applicationVertex.query()
	if query == nil {
		t.Error("Error creating the resolvers", query)
	}
}

func TestDataVertexResolvers(t *testing.T) {
	//homeDir
	//vertex schema and resolvers
	var configFilePath string = "../../app-config.yml"
	var dbConfigFilePath string = "../../database/db-config.yaml"


	var testConfigFilePath string = "../../testdata/vertex_entities.json"
	var testAppQueriesFilePath string = "../../testdata/vertex_queries.json"

	applicationVertex, err := LoadDataVertex(configFilePath, dbConfigFilePath)
	if err != nil {
		t.Errorf("Data vertex creation error: %v", err)
	}
	//schema := graphql.MustParseSchema(schemaString, applicationVertex.resolvers)
	entityTests, entityErr := LoadEntityTestCases(applicationVertex, testConfigFilePath, testAppQueriesFilePath)
	if entityErr != nil || entityTests == nil {
		t.Error("Error creating the resolver tests", entityErr)
	}
	c := client.New(handler.NewDefaultServer(applicationVertex.executableSchema))
	//get vertex handler/init the client

  RunEntityTestCases(c, t, entityTests, 100)
	// for name, entityTest := range entityTests {
	// 	go entityTest.runTests(t, 100)
	// }
}


func BenchmarkVertexResolvers(b *testing.B) {
	b.StopTimer()
	var configFilePath string = "../../app-config.yml"
	var dbConfigFilePath string = "../../database/db-config.yaml"
	var testConfigFilePath string = "../../../test-structs/88mph-data-vertex_test.json"
	var testAppQueriesFilePath string = "../../../test-structs/app_queries_test.json"

	applicationVertex, err := LoadDataVertex(configFilePath, dbConfigFilePath)
	if err != nil {
		b.Errorf("Data vertex creation error: %v", err)
	}
	//schema := graphql.MustParseSchema(schemaString, applicationVertex.resolvers)
	entityTests, entityErr := LoadEntityTestCases(applicationVertex, testConfigFilePath, testAppQueriesFilePath)
	if entityErr != nil || entityTests == nil {
		b.Error("Error creating the resolver tests", entityErr)
	}
	c := client.New(handler.NewDefaultServer(applicationVertex.executableSchema))
	//29804

	b.StartTimer()
	RunEntityBenchmarkCases(c, b, entityTests, 10000)
}
