"use strict";
var fs = require("fs-extra");
const { parse, visit, print } = require("graphql/language");
const _ = require("lodash");
const dataloaderFnTemplateFile = require.resolve("./dataloaderFnTemplate.js");
const dataloaderBashTemplateFile = require.resolve(
  "../data-vertex-dataloader-template.sh"
);
const dataloaderMainTemplatePath = require.resolve(
  "../dataloaders/dataloader.go"
);

function buildDataloaders(
  config,
  outputFile = "./DataVertex/pkg/dataloaders/dataloader.go"
) {
  let schemaFile = config.schema.file;
  let schema = readSchema(schemaFile);
  let entities = parseSchema(schema);
  entities = checkEntities(entities);
  let entitiesDict = makeDict(entities);
  let dataloaders = generateDataloaderObjects(entities, entitiesDict); //dataloaders
  let fetchFns = generateFetchFns(dataloaders); //fetch function
  let newLoaders = generateNewLoaders(dataloaders, fetchFns);

  let dataloaderMainTemplate = fs
    .readFileSync(dataloaderMainTemplatePath)
    .toString();
  updateMainDataloader(dataloaderMainTemplate, outputFile, newLoaders);
}

function parseSchema(schema) {
  //console.log(schema);
  return parse(schema).definitions;
}

async function generateDataloaders(config, templateBash) {
  let schemaFile = config.schema.file;
  let schema = readSchema(schemaFile);
  let entities = parseSchema(schema);
  entities = checkEntities(entities);
  let entitiesDict = makeDict(entities);
  let dataloaders = generateDataloaderObjects(entities, entitiesDict);
  buildCommandlineArguments(dataloaders, templateBash);
}

function getDataloaders(config, schemaFile = "") {
  if (schemaFile == "") {
    schemaFile = config.schema.file;
  }
  let schema = readSchema(schemaFile);
  let entities = parseSchema(schema);
  entities = checkEntities(entities);
  let entitiesDict = makeDict(entities);
  let dataloaders = generateDataloaderObjects(entities, entitiesDict);
  return dataloaders;
}

function generateDataloaderObjects(entities, entityDict = {}) {
  let dataloaders = {};
  for (const entity of entities) {
    if (
      entity.kind == "ObjectTypeDefinition" &&
      entity.kind != "Query" &&
      entity.kind != "Mutation" &&
      entity.name.value != "Query" &&
      entity.name.value != "Mutation" &&
      entity.name.value != "Proof"
    ) {
      dataloaders = generateDataloader(entity, entityDict, dataloaders);
      //append
      //dataloaders = new Map([...dataloaders, ...newDataloaders]);
    }
  }
  return dataloaders;
}

function toModelNameCase(str) {
  let newStr = str;
  if (str.length < 4) {
    newStr = _.upperFirst(_.camelCase(str));
  }
  return newStr;
}

function generateDataloader(entity, entityDict, dataloaders) {
  let name = entity.name.value; //camelcase have MPH,

  //name + SliceLoader
  //name + Loader
  //regular name
  //lower name
  //model name
  //entityName
  //objName (conversion)
  dataloaders[name + "ById"] = {
    name: name + "Loader",
    arg: "string",
    input: "[]string",
    output: "[]*models." + toModelNameCase(name),
    entityName: name,
    objInput: name + "ID",
  };
  // dataloaders[name + "sBySlice"] = {
  //   name: name + "SliceLoader",
  //   arg: "[]string",
  //   input: "[][]string",
  //   output: "[][]*models." + name,
  //   entityName: name,
  //   objInput: name + "Ids",
  // };
  //let output = //
  //let entityName = name //
  //let input = //
  //let name = //
  return dataloaders;
}

function generateFetchFns(dataloaders) {
  let fetchFns = {};
  for (var name in dataloaders) {
    fetchFns[name] = generateFetchFn(name, dataloaders[name]);
  }
  return fetchFns;
}

function generateFetchFn(name, dataloader) {
  let output = dataloader.output;
  let input = dataloader.input;
  let tableName = dataloader.entityName + "s"; //table name
  let modelName = toModelNameCase(dataloader.entityName);
  let splitText = "/////////SPLIT";
  let fetchFnTextList = fs
    .readFileSync(dataloaderFnTemplateFile)
    .toString()
    .split(splitText);
  let fetchFnText = fetchFnTextList[0];
  //name and tableName
  if (dataloader.name.includes("Slice")) {
    fetchFnText = fetchFnTextList[1];
  }
  fetchFnText = fetchFnText
    .split("$modelName")
    .join(modelName)
    .split("$tableName")
    .join(tableName);
  return fetchFnText;
}

function generateNewLoaders(dataloaders, fetchFns) {
  let newLoaders = {};
  for (var name in dataloaders) {
    newLoaders[name] = generateNewLoader(
      name,
      dataloaders[name],
      fetchFns[name]
    );
  }
  return newLoaders;
}

function generateNewLoader(name, dataloader, fetchFn) {
  let loader =
    dataloader.name +
    "{ \n" +
    "maxBatch: 100,\n" +
    "wait:     5 * time.Millisecond,\n" +
    "fetch: " +
    fetchFn +
    ",\n" +
    "}";
  return loader;
}

function makeDict(entities) {
  let entityDict = {};
  for (const entity of entities) {
    entityDict[entity.name.value] = entity;
  }
  return entityDict;
}
function checkEntities(entities) {
  for (const entity of entities) {
    checkEntity(entity);
  }
  return entities;
}

function checkEntity(entity) {
  //if not input
  let newEntity = ensureEntityIsCorrect(entity);
  return ensureEntityIsOptimized(newEntity);
}

function ensureEntityIsCorrect(entity) {
  if (!entity) {
    entity = {};
  }
  if (!entity.id) {
    entity.id = "ID!";
  }
  //
  if (!entity.proof || entity.proof != "String") {
    entity.proof = "Proof";
  }
  return entity;
}

function ensureEntityIsOptimized(entity) {
  //directives
  return entity;
}

function readSchema(fileName) {
  let schema = fs.readFileSync(fileName).toString();
  return schema;
}

//command-line arguments
//let dataloaderStr = "#####DATALOADERS";
function buildCommandlineArguments(
  dataloaders,
  fileOut,
  fileIn = dataloaderBashTemplateFile
) {
  //readFile
  let oldFileText = fs.readFileSync(fileIn).toString();
  let newDataloaderText = "";
  let dataloaderStr = "#####DATALOADERS";
  for (const [key, dataloader] of Object.entries(dataloaders)) {
    //console.log(dataloader.input);
    let listStr = "";

    let txt = "";
    if (dataloader.name && dataloader.arg && dataloader.entityName) {
      if (dataloader.arg.includes("[]")) {
        listStr = "[]";
      }
      txt =
        "go run github.com/vektah/dataloaden " +
        dataloader.name +
        " " +
        dataloader.arg +
        ' "' +
        listStr +
        "*github.com/proxima-one/proxima-data-vertex/pkg/models." +
        toModelNameCase(dataloader.entityName) +
        '"';
      txt += " && ";
    }
    newDataloaderText += txt;
  }
  newDataloaderText = newDataloaderText.substring(
    0,
    newDataloaderText.length - 4
  );
  newDataloaderText = oldFileText.replace(dataloaderStr, newDataloaderText);
  fs.outputFileSync(fileOut, newDataloaderText);
}

//dataloader main update (with the list of dataloaders)
function updateMainDataloader(
  mainStr,
  outputFile,
  newLoaders,
  dataloaders = {}
) {
  let loadersStr = "  #######LOADERS";
  let newLoaderStr = "########NEW DATALOADERS";
  let dataloaderMain = mainStr;
  //dataloader names
  let loadersNewStr = "";
  let newLoadersNewStr = "";
  //dataloaders
  for (var name in newLoaders) {
    let loaderName = name.replace("ById", "Loader");
    loadersNewStr += name + "  " + loaderName + "\n";
    newLoadersNewStr += name + ": " + newLoaders[name] + ",\n";
  }
  dataloaderMain = dataloaderMain.replace(loadersStr, loadersNewStr);
  dataloaderMain = dataloaderMain.replace(newLoaderStr, newLoadersNewStr);
  fs.outputFileSync(outputFile, dataloaderMain);
}

function build_dataloaders(fileIn, fileOut) {
  //dataloader fileIn needs to be defined
  let resolverText = fs.readFileSync(fileIn).toString();
  let { head, resolverFns } = parseFunctions(resolverText);
  let newResolverText = "package dataloader\n\n";
  newResolverText += "import ( \n";
  newResolverText +=
    'models "github.com/proxima-one/proxima-data-vertex/pkg/models"\n';
  newResolverText += 'json "github.com/json-iterator/go"\n';
  //update proxima db
  //json encoding, prettify
  newResolverText += '"context"\n';
  newResolverText += ")\n\n";

  for (const functionText of resolverFns) {
    if (functionText && functionText.includes("ctx context.Context,")) {
      let newFunctionText = createResolverFunction(functionText) + "\n";
      //console.log(newFunctionText);
      newResolverText += newFunctionText;
    }
  }
  //updateMainDataloader
  fs.outputFileSync(fileOut, newResolverText);
  fs.removeSync(fileIn);
}

function parseFunctions(resolverText) {
  let resolvers = resolverText
    .split("func (r ")
    .join("%%%func (r ")
    .split("%%%");
  let head = resolvers[0];
  let tail = resolvers[resolvers.length - 1];
  let resolverFns = resolvers.slice(1, resolvers.length - 2);
  return { head, resolverFns };
}

function createDataloaderFunction(functionText) {
  let { type, isQuery } = getType(functionText);
  let body = generateDefaultInputText(functionText);
  body += generateResolverBodyText(functionText);
  //LoadAllThunk
  //body = functionText.replace("panic(fmt.Errorf(\"not implemented\"))", body);
  return body;
}

function generateDefaultInputText(functionText) {
  let defaults = "args := DefaultInputs;\n";
  let defaultProofInput = 'if prove != nil { args["prove"] = *prove }\n';
  let defaultLimit =
    'if limit != nil {args["limit"] = *limit}\n' +
    'if first != nil {args["first"] = *first}\n' +
    'if last != nil {args["last"] = *last}\n';
  let { type, isQuery } = getType(functionText);
  let defaultText = defaults;
  switch (type) {
    case "get":
      defaultText += defaultProofInput;
      defaultText += 'args["id"] = id\n';
      break;
    case "query":
      defaultText += defaultProofInput;
      //defaultText += defaultLimit
      //defaultText += "args[\"query\"] = query\n"
      break;
    case "getAll":
      defaultText += defaultProofInput;
      defaultText += defaultLimit;
      break;
  }
  return defaultText;
}

function generateResolverBodyText(functionString) {
  let body = "";
  let functionHead = functionString;
  var output;
  let { type, isQuery } = getType(functionString);
  //console.log(type)
  let tableName = getTableName(functionString);
  //let  = functionString.includes("*queryResolver")
  // Resolver)
  // (ctx context.Context,
  body += 'table, _ := r.db.GetTable("' + tableName + '")\n';
  let returnV = "return &value, nil\n";
  switch (type) {
    case "get":
      body += 'result, err := table.Get(id, args["prove"].(bool))\n';
      break;
    case "mutation":
      body +=
        '_, err := table.Put(*input.ID, input, args["prove"].(bool), args)\n';
      body += "boolResult := true\n";
      body +=
        "if err != nil {\n" +
        " boolResult = false\n" +
        "}\n" +
        "  return &boolResult, err\n";
      return body;
      break;
    case "getAll":
      output = getOutput(type, tableName, functionString);
      body +=
        'result, err := table.Scan(args["first"].(int), args["last"].(int), args["limit"].(int), args["prove"].(bool),  args)\n';
      body += "if err != nil {\n" + "  return nil, err\n" + "}\n";

      body +=
        "value := make(" +
        output +
        ", 0)\n" +
        "for _, dataRow := range result {\n" +
        "var val models." +
        tableName.substr(0, tableName.length - 1) +
        ";\n" +
        "json.Unmarshal(dataRow.GetValue(), &val)\n" +
        "value = append(value, &val)\n" +
        "};\nreturn value, nil\n";
      return body;
    case "query":
      output = getOutput(type, tableName, functionString);
      body += 'result, err := table.Query(queryText, args["prove"].(bool))\n';
      body += "if err != nil {\n" + "  return nil, err\n" + "}\n";

      body +=
        "value := make(" +
        output +
        ", 0)\n" +
        "for _, dataRow := range result {\n" +
        "var val models." +
        tableName.substr(0, tableName.length - 1) +
        ";\n" +
        "json.Unmarshal(dataRow.GetValue(), &val)\n" +
        //update for proof
        "value = append(value, &val)\n" +
        "};\nreturn value, nil\n";
      return body;
  }
  if (isQuery) {
    body += "if err != nil {\n" + "  return nil, err\n" + "}\n";
  }

  output = getOutput(type, tableName, functionString);
  body += "data := result.GetValue();\n";
  body += "var value " + output + ";\n" + "json.Unmarshal(data, &value)\n";
  return body + returnV;
}

function getOutput(type, tableName, functionString) {
  let outputStr = "models." + tableName.substr(0, tableName.length - 1);
  let returnType = "";
  if (type == "getAll" || type == "query") {
    return "[]*" + outputStr;
  } else {
    return outputStr;
  }
}

function getType(head) {
  var isQuery = false;
  var type = "mutation";
  if (!head.includes("*queryResolver")) {
    return { type, isQuery };
  }
  isQuery = true;
  if (head.includes("Search(")) {
    type = "query";
    return { type, isQuery };
  }
  if (head.includes("[]*models.")) {
    type = "getAll";
    return { type, isQuery };
  }
  type = "get";
  return { type, isQuery };
}

function getTableName(head) {
  let tableName = head.replace(" ", "").split("models.")[1].split(")")[0];
  tableName = tableName.replace(", error", "");
  tableName = tableName.replace("Input", "");
  tableName += "s";
  return tableName;
}

//name and tail end (either pushing/unmarshalling from input, the other is to unmarshall response)

module.exports = { buildDataloaders, generateDataloaders, getDataloaders };
