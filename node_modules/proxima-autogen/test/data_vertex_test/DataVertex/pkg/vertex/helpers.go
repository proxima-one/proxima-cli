package vertex

import (
	_ "bytes"
	"context"
	"encoding/json"
	"math/rand"
	"fmt"
	"reflect"
	"sort"
	"strconv"
	"testing"
	"io/ioutil"
	"strings"
	"time"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"github.com/99designs/gqlgen/client"
	//graphql "github.com/graph-gophers/graphql-go"
	gql "github.com/99designs/gqlgen/graphql"
	//executor "github.com/99designs/gqlgen/graphql/executor"
	_ "github.com/graph-gophers/graphql-go/errors"
)

type EntityTestCase struct {
	name string
	applicationVertex *ProximaDataVertex
	operations map[string]interface{}
	queryStrings map[string]interface{}
	entities []interface{}
	schema gql.ExecutableSchema
	entity map[string]interface{}
	entityInput map[string]interface{}
	putTests []*GQLTest
	getTests []*GQLTest
	getAllTests  []*GQLTest
	searchTests []*GQLTest
}

type GQLTest struct {
	Context        context.Context
	Schema         gql.ExecutableSchema
	Query          string
	OperationName  string
	Variables      map[string]interface{}
	ExpectedResult interface{}
	ExpectedErrors gqlerror.List
}


func NewGQLTest(schema gql.ExecutableSchema, queryString, operationName string, vars map[string]interface{},  expectedResult interface{}, expectedErrors gqlerror.List) *GQLTest {
	return &GQLTest{Context: context.TODO(), Schema: schema, Query: queryString,
		OperationName: operationName, Variables: vars, ExpectedResult: expectedResult, ExpectedErrors: expectedErrors}
}

func LoadEntityTestCases(applicationVertex *ProximaDataVertex, fileName string, queryFileName string) (map[string]*EntityTestCase, error){
	queryStringMap, err := LoadEntityQueryStrings(queryFileName)
	if err != nil {
		return nil, err
	}
	entityTestCaseMap := make(map[string]*EntityTestCase)
	entityConfigMap := make(map[string]interface{})
	data, err := ioutil.ReadFile(fileName)
	if err != nil {
		return nil, err
	}
	json.Unmarshal([]byte(data), &entityConfigMap)
	var entity map[string]interface{}
	var  queryStrings map[string]interface{}
	for entityName, entityConfig := range entityConfigMap {
		entity = entityConfig.(map[string]interface{})

		if val, ok := queryStringMap[entityName]; ok {
			queryStrings = val.(map[string]interface{})
			entityTestCaseMap[entityName], _ = parseEntity(applicationVertex, applicationVertex.executableSchema, queryStrings, entity)
		}
	}
	return entityTestCaseMap, nil
}

func  LoadEntityQueryStrings(queryFileName string) (map[string]interface{}, error) {
	queryStringMap := make(map[string]interface{})
	data, err := ioutil.ReadFile(queryFileName)
	if err != nil {
		return nil, err
	}
	json.Unmarshal([]byte(data), &queryStringMap)
	var queryStrings map[string]interface{}
	for entityName, qStrings := range queryStringMap {
		//fmt.Println(entityName)
		queryStrings = qStrings.(map[string]interface{})

		//queryName := entityName[:len(entityName)-1]
		if strings.HasSuffix(entityName, "s") {
			length := len(entityName)
			entityName = entityName[:length-1]
			//fmt.Println(queryName)
		}
		queryStringMap[entityName], _ = parseQueryStrings(queryStrings)
	}
	return queryStringMap, nil
}

func parseQueryStrings(entityQueryStrings map[string]interface{}) (map[string]interface{}, error) {
	queryStrings := make(map[string]interface{})
	for queryName, queryStr := range entityQueryStrings {

		queryStrings[queryName], _ = parseQueryString(queryStr.(string))
		//previous queryName
	}
	return queryStrings, nil
}

func parseQueryString(rawQueryString string) (string, error) {
	//split  on
	// first  index of

	// //remove last {
	// // if strings.Contains(rawQueryString, "Input!)") {
	// 		rawQueryString = rawQueryString[strings.Index(rawQueryString, "("):]
	// 	return fmt.Sprintf("mutation%s", rawQueryString), nil
	// }
	//
	// if strings.Contains(rawQueryString, "$prove: Boolean)") {
	// 		rawQueryString = rawQueryString[strings.Index(rawQueryString, "("):strings.LastIndex(rawQueryString, "}")+1]
	// 	return fmt.Sprintf("query%s", rawQueryString), nil
	// }

	return rawQueryString, nil
}

func NewEntityTestCase(name string, schema gql.ExecutableSchema, applicationVertex *ProximaDataVertex, entity, entityInput, queryStrings, operations map[string]interface{}) (*EntityTestCase) {
	entities := make([]interface{}, 0)
	putTests := make([]*GQLTest, 0)
	getTests := make([]*GQLTest, 0)
	getAllTests := make([]*GQLTest, 0)
	searchTests := make([]*GQLTest, 0)
	return &EntityTestCase{name: name, applicationVertex: applicationVertex, entity: entity, operations: operations, schema: schema, entityInput: entityInput, queryStrings: queryStrings, putTests: putTests, getTests: getTests, getAllTests: getAllTests, searchTests: searchTests, entities: entities}
}

func parseEntity(applicationVertex *ProximaDataVertex, schema gql.ExecutableSchema, queryStrings, entityConfig map[string]interface{}) (*EntityTestCase, error) {
	name := entityConfig["name"].(string)
	entityInput := entityConfig["entityInput"].(map[string]interface{})
	entity := entityConfig["entity"].(map[string]interface{})
	operations := entityConfig["operations"].(map[string]interface{})
	return NewEntityTestCase(name, schema, applicationVertex, entity, entityInput, queryStrings, operations), nil
}

func RunEntityTestCases(c *client.Client, t *testing.T, tests map[string]*EntityTestCase, n int){
	for testName, testCase := range tests {
		t.Run(testName, func(t *testing.T) {
			RunEntityTestCase(c, t, testCase, n)
		});
	}
}

func RunEntityTestCase(c *client.Client, t *testing.T, entityTestCase *EntityTestCase, n int) {

	entityTestCase.generateTests(n)

	t.Run("Put Tests", func(t *testing.T) {
		RunGQLTests(c, t, entityTestCase.putTests)
	});

	t.Run("Get Test", func(t *testing.T) {
		RunGQLTests(c, t, entityTestCase.getTests)
	})

//go test -cpu 1,2,4,8 -benchmem -run=^$ -bench . benchmark_test.go
	t.Run("Get All Test", func(t *testing.T) {
		RunGQLTests(c, t, entityTestCase.getAllTests)
	})
	//
	t.Run("Search Test", func(t *testing.T) {
		RunGQLTests(c, t, entityTestCase.searchTests)
	})

}


func RunEntityBenchmarkCases(c *client.Client, b *testing.B, tests map[string]*EntityTestCase,  numEntities int) {
	b.StopTimer()
	SetupEntitiesBenchmarks(c, tests, numEntities);
	b.StartTimer()
	for benchName, benchCase := range tests {
		b.Run(benchName, func(b *testing.B) {
			RunEntityBenchmarkCase(c, b, benchCase)
		});
	}
}

func SetupEntitiesBenchmarks(c *client.Client, entityTestCases map[string]*EntityTestCase, numEntities int) {
	for _, entityTestCase := range entityTestCases {
		SetupEntityBenchmarks(c, entityTestCase, numEntities)
	}
}

func SetupEntityBenchmarks(c *client.Client, entityTestCase *EntityTestCase, numEntities int)  {
	entityTestCase.generateTests(numEntities)
	for _, test := range entityTestCase.putTests {
		RunTestResolverOperation(c, test)
	}
}


func RunEntityBenchmarkCase(c *client.Client, b *testing.B, entityTestCase *EntityTestCase) {
	b.Run("Put Benchmarks", func(b *testing.B) {
		RunGQLBenchmarks(c, b, entityTestCase.putTests)
	});

	b.Run("Get Benchmarks", func(b *testing.B) {
		RunGQLBenchmarks(c, b, entityTestCase.getTests)
	})

	b.Run("Get All Benchmarks", func(b *testing.B) {
		RunGQLBenchmarks(c, b, entityTestCase.getAllTests)
	})
	//
	// b.Run("Search Benchmarks", func(b *testing.B) {
	// 	RunGQLBenchmarks(c, b, entityTestCase.searchTests)
	// })
}

func RunGQLBenchmarks(c *client.Client, b *testing.B, tests []*GQLTest) {
		rand.Seed(time.Now().UnixNano())
		length := len(tests)
		var test *GQLTest;
		for i := 0; i < b.N; i++ {
			test = tests[rand.Intn(length)]
			b.StartTimer()
			RunTestResolverOperation(c, test)
			b.StopTimer()
		}
}

func RunGQLTests(c *client.Client, t *testing.T, tests []*GQLTest) {
		for i, test := range tests {
			t.Run(strconv.Itoa(i+1), func(t *testing.T) {
				RunGQLTest(c, t, test)
			})
		}
}

func RunGQLTest(c *client.Client, t *testing.T, test *GQLTest) {
	if test.Context == nil {
		test.Context = context.Background()
	}
	result := RunTestResolverOperation(c, test)
	//resultErrors := result.Errors
	//checkErrors(t, test.ExpectedErrors, resultErrors)
	//data := result.Data
	checkResult(t, test.ExpectedResult, result)
	//checkProof(t, test, data)
	//checkAudit(t, test, data)
}
//client response
func RunTestResolverOperation(c *client.Client, test *GQLTest) (*client.Response) {
	// gqlExec := executor.New(test.Schema)
	// ctx  := gql.StartOperationTrace(context.Background())
	// now := gql.Now()
	//
	// graphqlParams := &gql.RawParams{
	// 	Query: test.Query,
	// 	OperationName:  test.OperationName,
	// 	Variables: test.Variables,
	// 	ReadTime: gql.TraceTiming{
	// 		Start: now,
	// 		End:   now,
	// 	},
	// }
		// c.RawPost(test.Query,
		//
		//
		//
		// 	`mutation($id: ID!, $text: String!) { updateTodo(id: $id, changes:{text:$text}) { text } }`,
		// c.Var("id", 5),
		// c.Var("prove", "Very important"),)
		//update query string


	// fmt.Println(graphqlParams.OperationName)
	// fmt.Println(graphqlParams.Query)
	// fmt.Println(graphqlParams.Variables)
	// operationContext, err := gqlExec.CreateOperationContext(ctx, graphqlParams)
	//

	//
	// resp, ctx2 := gqlExec.DispatchOperation(ctx, operationContext)
	//print query string
	//fmt.Println(test.Query)
	resp, err := c.RawPost(test.Query)
	if err != nil {
		fmt.Println(err)
	}

	return resp
}

func checkProof(t *testing.T, test *GQLTest, data interface{}) {
	//get prove boolean
	//if prove
		//get proof from data
		//run the correct check proof for type of query (from type of operation)
	//not implemented
	return
}

func checkAudit(t *testing.T, test *GQLTest, data interface{}) {
	//if audit
		//run the correct auditting function (for get, put, etc):
		//get audit fn
		//check audit
	//not implemented
	return
}

func checkResult(t *testing.T, expectedResult, actualResult interface{}) {
	if expectedResult == "" && actualResult != nil {
			t.Fatalf("got: %s", actualResult)
			t.Fatalf("want: null")
	}
	//fmt.Println("actualResult")
	//fmt.Println(actualResult)
	// actual, actualErr := formatJSON(actualResult.([]byte))
	// if actualErr != nil {
	// 	t.Fatalf("got: invalid JSON: %s", actualErr)
	// }
	// CompareEntities(expected, actual); //
}

func CompareEntities(expected, actual interface{}) {
	//check type
	//switch case


	//contains all of aspects of comparison
	//check for lists
		//process lists
	//check for maps
	//for elements of "lead" (don't compare proof)
		//compare the values (name), then convert to bytes

	//
	//name, expected, result, testing
	return
}


func (entityTest *EntityTestCase) generateTestEntities(num int) ([]interface{}, error) {
	entities := make([]interface{}, 0)
	for i := 0; i < num; i++ {
		entityMap := make(map[string]interface{})
		entityMap["entityInput"], _ = GenerateRandomStruct(entityTest.entityInput)
		entityMap["entity"], _ = GenerateRandomStruct(entityTest.entity)
		//fmt.Println(entityMap)
		entities = append(entities, entityMap)
	}

	entityTest.entities = entities
	return entities, nil
}

//add this to the entity string
func (entityTest *EntityTestCase) generateTests(num int) {
	entityTest.putTests = make([]*GQLTest, 0)
	entityTest.getTests = make([]*GQLTest, 0)
	entityTest.getAllTests = make([]*GQLTest, 0)
	entityTest.searchTests = make([]*GQLTest, 0)
	var putQueryString string  = entityTest.queryStrings["put"].(string)
	var getQueryString string  = entityTest.queryStrings["get"].(string)
	var getAllQueryString string  = entityTest.queryStrings["getAll"].(string)
	var searchQueryString string  = entityTest.queryStrings["search"].(string)
	//var searchQueryString string
	//var getAllQueryString string

	entities, _ := entityTest.generateTestEntities(num)
	for i := 0; i < num; i++ {
		var entity map[string]interface{} = entities[i].(map[string]interface{})
		entityTest.putTests = append(entityTest.putTests, entityTest.generatePutTest(putQueryString, entity))
		entityTest.getTests = append(entityTest.getTests, entityTest.generateGetTest(getQueryString, entity))
		entityTest.getAllTests = append(entityTest.getAllTests, entityTest.generateGetAllTest(getAllQueryString, entities))
		entityTest.searchTests = append(entityTest.searchTests, entityTest.generateSearchTest(searchQueryString,  entities))
	}
}

func (entityTest *EntityTestCase) generateGetTest(queryString string, entityMap map[string]interface{}) (*GQLTest) {
	schema := entityTest.schema
	operation := entityTest.operations["get"].(map[string]interface{})
	//queryStr := operation["type"]
	var operationName string = operation["name"].(string)

	entity := entityMap["entityInput"].(map[string]interface{})

	vars := make(map[string]interface{})
	vars["id"] = entity["id"]
	vars["prove"] = false
	queryString = makeQueryString(queryString, vars)
	expectedResult := entity
	expectedErrors  := gqlerror.List{}
	return NewGQLTest(schema, queryString, operationName, vars, expectedResult, expectedErrors)
}

func makeQueryString(queryString string, variables map[string]interface{}) (string) {
	var encodedValue []byte;
	for name, value := range variables {
		valueType := fmt.Sprintf("%T", value)
		//fmt.Println("Value Type")
		//fmt.Println(valueType)
		if name == "input" {
			encodedValue, _ = json.Marshal(value)
			queryString = strings.ReplaceAll(queryString, "$"+ name, string(encodedValue))
			var inputVars map[string]interface{} = value.(map[string]interface{})
			for na, _ := range inputVars {
				varName := fmt.Sprintf("\"%s\"", na)
				queryString = strings.ReplaceAll(queryString, varName, na)
			}
		} else if valueType == "string" {
			varValue := fmt.Sprintf("\"%s\"", fmt.Sprint(value))
			//type
			queryString = strings.ReplaceAll(queryString, "$"+ name, varValue)
		} else {
			queryString = strings.ReplaceAll(queryString, "$"+ name, fmt.Sprint(value))
		}
	}
	//every variable in vars, replace with the value of query with string value (name + $)
	return queryString
}

func (entityTest *EntityTestCase) generatePutTest(queryString string, entityMap map[string]interface{}) (*GQLTest){
	schema := entityTest.schema
	operation := entityTest.operations["put"].(map[string]interface{})
	//queryStr := operation["type"]
	//h := handler.GraphQL(vertex.executableSchema)
	var operationName string = operation["type"].(string)


	entityInput := entityMap["entityInput"].(map[string]interface{})
	//fmt.Println(operation["name"])
	vars := make(map[string]interface{})
	//vars["prove"] = false
	vars["input"] = entityInput
	queryString = makeQueryString(queryString, vars)
	expectedResult := true
	expectedErrors  := gqlerror.List{}
	return NewGQLTest(schema, queryString, operationName, vars, expectedResult, expectedErrors)
}

func (entityTest *EntityTestCase) generateGetAllTest(queryString string, entities []interface{}) (*GQLTest) {
	schema := entityTest.schema
	operation := entityTest.operations["getAll"].(map[string]interface{})
	//queryStr := operation["type"]
	var operationName string = operation["type"].(string)


	rand.Seed(time.Now().UnixNano())

	vars := make(map[string]interface{})
	vars["prove"] = false
	isFirst := false
	//numEntities := len(entities)
	//fmt.Println(numEntities)
	vars["limit"] = 100
	num :=  1 + rand.Intn(100)
	if isFirst {
		vars["first"] = num
		vars["last"] = -1
	} else {
		vars["first"] = -1
		vars["last"] = num
	}

	expectedResult := "[]"
		queryString = makeQueryString(queryString, vars)
	expectedErrors  := gqlerror.List{}
		return NewGQLTest(schema, queryString, operationName, vars, expectedResult, expectedErrors)
}

func (entityTest *EntityTestCase) generateSearchTest(queryString string, entities []interface{}) (*GQLTest) {
	schema := entityTest.schema
	operation := entityTest.operations["search"].(map[string]interface{})
	//queryStr := operation["type"]
	var operationName string = operation["type"].(string)
	vars := make(map[string]interface{})
	//entityTest.entity == map[string]interface{}
	vars["queryText"], _ = GenerateRandomSearchQueryText(entityTest.entity)

	vars["proof"] = false
	expectedResult := ""
		queryString = makeQueryString(queryString, vars)
	expectedErrors  := gqlerror.List{}
	return NewGQLTest(schema, queryString, operationName, vars, expectedResult, expectedErrors)
}

func GenerateRandomSearchQueryText(entityMap map[string]interface{}) (string, error){
	//for  Float, int,
		//generate  filters
		randomEntity := make(map[string]interface{})
		var filterExpressions = []string{">", ">=", "<", "<="}
		var name string
		var varType string
		var entityVar map[string]interface{}
		for _, eVar := range entityMap {
			entityVar = eVar.(map[string]interface{})
			varType = entityVar["type"].(string)

			if varType == "Int" || varType == "Float" {

			name = entityVar["name"].(string)
			filterExpressionIndex := rand.Intn(len(filterExpressions))
			filterExpression := filterExpressions[filterExpressionIndex]
			fmt.Println(filterExpression)
			randomVar, _ := GenerateRandomOfType(varType)
			if randomVar != nil {
				randomEntity[name] = randomVar
			}
		}
			//fmt.Println(name)
			//fmt.Println(varType)
			//fmt.Println(randomEntity[name])
	// 		c.MustPost(
	// 	`mutation($id: ID!, $text: String!) { updateTodo(id: $id, changes:{text:$text}) { text } }`,
	// 	&resp,
	// 	client.Var("id", 5),
	// 	client.Var("text", "Very important"),
	// )
		}
		return fmt.Sprintf(" %v",randomEntity), nil
}


func GenerateRandomStruct(entityStruct map[string]interface{}) (map[string]interface{}, error) {
	randomEntity := make(map[string]interface{})

	var name string
	var varType string
	var entityVar map[string]interface{}
	for _, eVar := range entityStruct {
		entityVar = eVar.(map[string]interface{})
		name = entityVar["name"].(string)
		varType = entityVar["type"].(string)
		randomType, _ := GenerateRandomOfType(varType)
		if randomType != nil {
			randomEntity[name] = randomType
		}
		//fmt.Println(name)
		//fmt.Println(varType)
		//fmt.Println(randomEntity[name])
// 		c.MustPost(
// 	`mutation($id: ID!, $text: String!) { updateTodo(id: $id, changes:{text:$text}) { text } }`,
// 	&resp,
// 	client.Var("id", 5),
// 	client.Var("text", "Very important"),
// )
	}
	return randomEntity, nil
}

func RandomString(size int) (string) {
	rand.Seed(time.Now().UnixNano())
	const charset = "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	  b := make([]byte, size)
	  for i := range b {
	    b[i] = charset[rand.Intn(len(charset))]
	  }
	  return string(b)
}

func GenerateRandomOfType(varType string) (interface{}, error) {
	rand.Seed(time.Now().UnixNano())
	switch (varType) {
		case "String":
			return RandomString(32), nil
		case "Float":
			//range
			return rand.NormFloat64(), nil
		case "ID":
			return RandomString(32), nil
		case "Int":
			//range
			return rand.Int(), nil
		case "Bool":
			return (rand.Intn(2) != 0), nil
		default:
			return nil, nil
	}
}

func formatJSON(data []byte) ([]byte, error) {
	var v interface{}
	if err := json.Unmarshal(data, &v); err != nil {
		return nil, err
	}
	formatted, err := json.Marshal(v)
	if err != nil {
		return nil, err
	}
	return formatted, nil
}

func checkErrors(t *testing.T, want, got gqlerror.List) {
	sortErrors(want)
	sortErrors(got)
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("unexpected error: got %+v, want %+v", got, want)
	}
}

func sortErrors(errors gqlerror.List) {
	if len(errors) <= 1 {
		return
	}
	sort.Slice(errors, func(i, j int) bool {
		return fmt.Sprintf("%s", errors[i].Path) < fmt.Sprintf("%s", errors[j].Path)
	})
}
