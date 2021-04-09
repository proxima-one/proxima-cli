//https://www.graphql-code-generator.com/docs/plugins/typescript-resolvers
yarn add -D @graphql-codegen/typescript-resolvers

https://www.graphql-code-generator.com/docs/getting-started/installation


//config file
//schema: http://localhost:3000/graphql
documents: ./src/**/*.graphql
generates:
  ./src/types.ts:
    plugins:
      - typescript
      - typescript-operations


//run code gen
{
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js",
    "generate": "graphql-codegen",
    "prestart": "yarn generate",
    "predev": "yarn generate"
  }
}

//update
//load
//new
//save

//access chars
//convert users to Strings on save then write
