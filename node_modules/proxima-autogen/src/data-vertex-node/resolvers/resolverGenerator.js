'use strict';
var fs = require('fs-extra');

function buildResolvers(fileIn, fileOut) {
	let resolverText = (fs.readFileSync(fileIn)).toString()

	let {head, resolverFns}  = parseFunctions(resolverText)
	let newResolverText = "package resolvers\n\n"


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
	//console.log(body)
	body += generateResolverBodyText(functionText)

	body = functionText.replace("panic(fmt.Errorf(\"not implemented\"))", body);
		return body, nil
}

function generateDefaultInputText(type) {
	let defaults = "args := DefaultInputs;\n"
	let defaultProofInput = "if (prove != nil ) { args['prove'] = *prove }\n";
	let defaultLimit = "if (limit != nil) {args['limit'] = *limit}\n" +
		"if (order != nil) {args['order'] = *order}\n";
	type = getType(type)
	let defaultText = defaults + defaultProofInput
	switch (type) {
		case 'get':
			defaultText += "args['id'] = id\n"
			break
		case 'query':
			defaultText += defaultLimit
			defaultText += "args['query'] = query\n"
			break
		case "getAll":
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

	switch (type) {
		case 'get':
			body += "result, err := r.db.tables[" + tableName + "].get(args.id, args.prove)\n";
			break
		case 'mutation':
			body += "result, err := r.db.tables[" + tableName + "].put(input.id, input, args.prove)\n";
			break
		case "getAll":
			//body += "result, err := r.db.tables['" + tableName + "'].range(args.id, args.prove)\n";
			break
		case 'query':
			body += "result, err := r.db.tables['" + tableName + "'].query(args.id, args.prove)\n";
			break
	}
	body += 	"if err != nil {\n" +
		"  return false, err\n" +
		"}\n"

	if (!isQuery) {
		body += "return true, nil\n"
		return body
	}

	let output = getOutput(functionString)
	body += "value := " + output + "{}\n" +
	"json.Unmarshal(result, &value)\n" +
	"return value, nil\n"
	return body
}

function getOutput(functionString) {

}

function getType(head) {
	var isQuery = false
	var type = 'mutation'
	if (!head.includes("*queryResolver")) {
		return {type, isQuery}
	}
	isQuery = true
	if (head.includes("Query(")) {
		type = "query"
		return {type, isQuery}
	}
	if (head.includes("[]*model.") ){
		type = 'getAll'
		return {type, isQuery}
	}
	type = 'get'
	return {type, isQuery}
}

function getTableName(head) {
	let tableName = head.replace(" ", "").split("model.")[1].split(")")[0]
	tableName = tableName.replace(", error", "")
	tableName += "s"
	return tableName
}

//name and tail end (either pushing/unmarshalling from input, the other is to unmarshall response)

module.exports = {buildResolvers}
