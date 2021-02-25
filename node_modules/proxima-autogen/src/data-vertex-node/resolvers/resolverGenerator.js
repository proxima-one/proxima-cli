'use strict';
var fs = require('fs-extra');

function buildResolvers(fileIn, fileOut) {
	let resolverText = (fs.readFileSync(fileIn)).toString()

	let {head, resolverFns}  = parseFunctions(resolverText)
	let newResolverText = "package resolvers\n\n"
	newResolverText += "import ( \n"
	newResolverText += 'models "github.com/proxima-one/proxima-data-vertex/pkg/models"\n'
	newResolverText += 'json "github.com/json-iterator/go"\n'
	newResolverText += '"context"\n'
	newResolverText += ")\n\n"


	for (const functionText of resolverFns) {
		if (functionText && functionText.includes("ctx context.Context,")) {
			let newFunctionText = createResolverFunction(functionText) + "\n"
			//console.log(newFunctionText)
			newResolverText += newFunctionText
		}
	}
	fs.outputFileSync(fileOut, newResolverText)
	fs.removeSync(fileIn)
}

function parseFunctions(resolverText) {
	let resolvers = resolverText.split("func (r ").join('%%%func (r ').split("%%%")
	let head = resolvers[0]
	let tail = resolvers[resolvers.length -1]
	let resolverFns = resolvers.slice(1,resolvers.length -2)
	return {head, resolverFns}
}

function createResolverFunction(functionText) {
	let body = generateDefaultInputText(functionText)
	body += generateResolverBodyText(functionText)

	body = functionText.replace("panic(fmt.Errorf(\"not implemented\"))", body);
	return body
}

function generateDefaultInputText(type) {
	let defaults = "args := DefaultInputs;\n"
	let defaultProofInput = "if prove != nil { args[\"prove\"] = *prove }\n";
	let defaultLimit = "if limit != nil {args[\"limit\"] = *limit}\n" +
		"if order != nil {args[\"order\"] = *order}\n";
	type = getType(type)
	let defaultText = defaults
	switch (type) {
		case 'get':
			defaultText += defaultProofInput
			defaultText += "args[\"id\"] = id\n"
			break
		case 'query':
			defaultText += defaultProofInput
			defaultText += defaultLimit
			defaultText += "args[\"query\"] = query\n"
			break
		case "getAll":
			defaultText += defaultProofInput
			defaultText += defaultLimit
			break
	}
	return defaultText
}

function generateResolverBodyText(functionString) {
	let body = "";
	let functionHead = functionString

	let {type, isQuery} = getType(functionString)
	//console.log(type)
	let tableName = getTableName(functionString)
	//let  = functionString.includes("*queryResolver")
	// Resolver)
	// (ctx context.Context,
	body += "table, _ := r.db.GetTable(\"" + tableName + "\")\n";
	let returnV = "return value, nil\n"
	switch (type) {

		case 'get':
			body += "result, err := table.Get(id, args[\"prove\"].(bool))\n";
			returnV = "return &value, nil\n"
			break
		case 'mutation':
			body += "_, err := table.Put(*input.ID, input, args[\"prove\"].(bool), args)\n";
			body += "boolResult := true\n"
			body += 	"if err != nil {\n" +
				"  return &boolResult, err\n" +
				"}\n"
			break
		case 'getAll':
			body += "result, err := table.Get(args[\"id\"].(string),  args[\"prove\"].(bool))\n";
			break
		case 'query':
			body += "result, err := table.Get(args[\"id\"].(string),  args[\"prove\"].(bool))\n";
			break
	}
	if (!isQuery) {
		body += "return &boolResult, nil\n"
		return body
	}
	if (isQuery) {
		body += 	"if err != nil {\n" +
			"  return nil, err\n" +
			"}\n"
	}
	let output = getOutput(type, tableName, functionString)
	body += "data := result.GetValue();\n"
	body += "var value " + output + ";\n" +
	"json.Unmarshal(data, &value)\n"
	return body + returnV
}

function getOutput(type, tableName, functionString) {
	let outputStr = "models." + tableName.substr(0, tableName.length-1)
	let returnType = ""
	if (type == "getAll" || type == 'query') {
		return "[]*" + outputStr
	} else {
		return outputStr
	}
}

function getType(head) {
	var isQuery = false
	var type = 'mutation'
	if (!head.includes("*queryResolver")) {
		return {type, isQuery}
	}
	isQuery = true
	if (head.includes("Search(")) {
		type = "query"
		return {type, isQuery}
	}
	if (head.includes("[]*models.") ){
		type = 'getAll'
		return {type, isQuery}
	}
	type = 'get'
	return {type, isQuery}
}

function getTableName(head) {
	let tableName = head.replace(" ", "").split("models.")[1].split(")")[0]
	tableName = tableName.replace(", error", "")
	tableName += "s"
	return tableName
}

//name and tail end (either pushing/unmarshalling from input, the other is to unmarshall response)

module.exports = {buildResolvers}
