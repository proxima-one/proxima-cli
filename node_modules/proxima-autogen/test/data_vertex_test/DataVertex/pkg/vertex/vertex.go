package vertex

import (
	"context"
	"io/ioutil"
	"net/http"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/handler"
	"github.com/gin-gonic/gin"
	gql "github.com/proxima-one/proxima-data-vertex/pkg/gql"
	resolver "github.com/proxima-one/proxima-data-vertex/pkg/resolvers"
	proxima "github.com/proxima-one/proxima-db-client-go/pkg/database"

	//yaml "gopkg.in/yaml.v2"
	"crypto/tls"
	json "encoding/json"
	"fmt"
	"log"

	yaml "github.com/ghodss/yaml"
	"github.com/rs/cors"
)

func LoadDataVertex(configFilePath, dbConfigFilePath string) (*ProximaDataVertex, error) {
	config, configErr := getConfig(configFilePath)
	if configErr != nil {
		log.Fatalf("Application config reading error: %v", configErr)
	}
	dbConfig, dbErr := getDBConfig(dbConfigFilePath)
	if dbErr != nil {
		log.Fatalf("Database config readig error: %v", dbErr)
	}
	applicationVertex, err := CreateDataVertex(config, dbConfig)
	if err != nil {
		log.Fatalf("Data vertex creation error: %v", err)
	}
	return applicationVertex, err
}

func getConfig(configPath string) (map[string]interface{}, error) {
	data, err := ioutil.ReadFile(configPath)
	if err != nil {
		return make(map[string]interface{}), nil
	}
	jsonData, _ := yaml.YAMLToJSON([]byte(data))
	var configMap map[string]interface{}
	err = json.Unmarshal(jsonData, &configMap)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return make(map[string]interface{}), nil
	}
	return configMap, nil
}

func getDBConfig(configPath string) (map[string]interface{}, error) {
	data, err := ioutil.ReadFile(configPath)
	if err != nil {
		return make(map[string]interface{}), nil
	}
	jsonData, _ := yaml.YAMLToJSON([]byte(data))
	var configMap map[string]interface{}
	err = json.Unmarshal(jsonData, &configMap)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return make(map[string]interface{}), nil
	}
	return configMap, nil
}

func ConvertMapTo(inputMap map[interface{}]interface{}) map[string]interface{} {
	var configMap map[string]interface{} = make(map[string]interface{})
	var key string
	for k, value := range inputMap {
		key = k.(string)
		valueType := fmt.Sprintf("%T", value)
		newValue := value
		if valueType == "map[interface  {}]interface {}" {
			//fmt.Println(value)
			var strMap map[string]interface{} = ConvertMapTo(value.(map[interface{}]interface{}))
			configMap[key] = strMap
			//fmt.Println(fmt.Sprintf("Value of map: %T", strMap))
		}
		if valueType == "[]interface {}" {
			newValue := make([]interface{}, len(value.([]interface{})))
			for i, v := range value.([]interface{}) {
				newV := v
				//fmt.Println(newV)
				if fmt.Sprintf("%T", v) == "map[interface {}]interface {}" {
					var strMap map[string]interface{} = ConvertMapTo(v.(map[interface{}]interface{}))
					newValue[i] = strMap

				} else {
					newValue[i] = newV
				}
			}
		}

		configMap[key] = newValue
	}
	return configMap
}

type ProximaDataVertex struct {
	name          string
	id            string
	version       string
	applicationDB *proxima.ProximaDatabase
	//resolvers resolver.Resolver
	schema           string
	executableSchema graphql.ExecutableSchema
}

func CreateDataVertex(config, dbConfig map[string]interface{}) (*ProximaDataVertex, error) {
	database, dErr := CreateApplicationDatabase(dbConfig)
	if dErr != nil {
		return nil, dErr
	}
	resolvers, rErr := CreateResolvers(database)
	if rErr != nil {
		return nil, rErr
	}
	//middleware

	//
	exec := gql.NewExecutableSchema(resolvers)
	newVertex := &ProximaDataVertex{name: config["name"].(string), id: config["id"].(string), version: config["version"].(string), applicationDB: database, executableSchema: exec}
	return newVertex, nil
}

func CreateResolvers(db *proxima.ProximaDatabase) (gql.Config, error) {
	var r gql.Config
	// loader, err := CreateDataloaders(db)
	// if err != nil {
	// 	return r, err
	// }
	c := gql.Config{
		Resolvers: resolver.NewResolver(db),
	}
	//Load directives
	c = LoadDirectives(c)

	return c, nil
}

// //create middleware
// func LoadMiddleware(configFilePath, middlewareConfig) (error) {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		ctx := context.WithValue(r.Context(), loadersKey, &Loaders{})
// 			r = r.WithContext(ctx)
// 			next.ServeHTTP(w, r)
// 		})
// 	//dataloaders
// 	//authentication
// 	//cors
// }

func LoadDirectives(c gql.Config) gql.Config {
	c.Directives.HasRole = func(ctx context.Context, obj interface{}, next graphql.Resolver, role Role) (interface{}, error) {
		if !getCurrentUser(ctx).HasRole(role) {
			// 		// block calling the next resolver
			return nil, fmt.Errorf("Access denied")
		}
		//
		// 	// or let it pass through
		return next(ctx)
	}
	c.Directives.isAuthenticated = func(ctx context.Context, obj interface{}, next graphql.Resolver, role Role) (interface{}, error) {
		// 	if !getCurrentUser(ctx).HasRole(role) {
		// // 		// block calling the next resolver
		// 		return nil, fmt.Errorf("Access denied")
		// 	}
		return next(ctx)
	}

	c.Directives.useDefaultArgs = func(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
		return next(ctx)
	}

	//filter

	return c
	//add
}

// func CreateDataloaders(db *proxima.ProximaDatabase) (*dataloader.Dataloader, error) {
//   loader , err := dataloader.NewDataloader(db)
//   if err != nil {
//     return nil, err
//   }
//   return loader, nil
// }

func CreateApplicationDatabase(db_config map[string]interface{}) (*proxima.ProximaDatabase, error) {
	proximaDB, err := proxima.LoadProximaDatabase(db_config)
	if err != nil {
		return nil, err
	}
	proximaDB.Open()
	//proximaDB.Sync()
	return proximaDB, nil
}

func (vertex *ProximaDataVertex) StartVertexServer() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()
	//server setup
	// generate a `Certificate` struct
	//cert, _ := tls.LoadX509KeyPair( "localhost.crt", "localhost.key" )

	// create a custom server with `TLSConfig`
	s := &http.Server{
		Addr:    ":4000",
		Handler: r, // use `http.DefaultServeMux`gin router
		TLSConfig: &tls.Config{
			Certificates: []tls.Certificate{},
		},
	}

	// srv.AddTransport(&transport.Websocket{
	// 		Upgrader: websocket.Upgrader{
	// 				CheckOrigin: func(r *http.Request) bool {
	// 						// Check against your desired domains here
	// 						 return r.Host == "example.org"
	// 				},
	// 				ReadBufferSize:  1024,
	// 				WriteBufferSize: 1024,
	// 		},
	// })

	//r.Use(auth.Middleware())
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:4000"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	r.Use(dataloaders.Middleware(vertex.applicationDB))
	//r.Use(validation.Middleware())

	go r.POST("/query", vertex.query())
	go r.GET("/", vertex.playgroundHandler())
	//run  tl5 with server cert
	//cert
	//key
	r.RunTL5(":4000")
}

func (vertex *ProximaDataVertex) query() gin.HandlerFunc {
	h := handler.GraphQL(vertex.executableSchema)
	//middleware
	//LoadMiddleware(h, )
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

func (vertex *ProximaDataVertex) playgroundHandler() gin.HandlerFunc {
	h := handler.Playground("GraphQL", "/query")
	return func(c *gin.Context) {
		h.ServeHTTP(c.Writer, c.Request)
	}
}

// // Group using gin.BasicAuth() middleware
// 	// gin.Accounts is a shortcut for map[string]string
// 	authorized := r.Group("/admin", gin.BasicAuth(gin.Accounts{
// 		"foo":    "bar",
// 		"austin": "1234",
// 		"lena":   "hello2",
// 		"manu":   "4321",
// 	}))
//
// 	// /admin/secrets endpoint
// 	// hit "localhost:8080/admin/secrets
// 	authorized.GET("/secrets", func(c *gin.Context) {
// 		// get user, it was set by the BasicAuth middleware
// 		user := c.MustGet(gin.AuthUserKey).(string)
// 		if secret, ok := secrets[user]; ok {
// 			c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
// 		} else {
// 			c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
// 		}
// 	})
