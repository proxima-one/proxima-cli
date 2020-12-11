'use strict';
var fs = require('fs');

async function processFunctions(fileIn, fileOut) {
	let resolverText = await fs.readFile(fileIn)
	let newResolverText = "package resolver \n\n"
	let functionList = parseFunctions(resolverText)
	for (functionText in functionList) {
		newResolverText += createResolverFunction(functionText) + "\n"
	}
	await fs.writeFileSync(fileOut, newResolverText)
}

function parseFunctions(resolverText) {
	let resolvers = resolverText.replaceAll("func (r ", "%%%func (r ") //replace func (r  with
	return resolvers.split("%%%", resolvers)
}

function createResolverFunction(functionText) {
	let body = generateDefaultInputText(functionText)
	body += generateResolverBodyText(functionText)
	return  functionText.replace("	panic(fmt.Errorf('not implemented'))", body);
}

function generateDefaultInputText(type) {
	let defaults = "args := DefaultInputs;\n"
	let defaultProofInput = "if (prove != nil ) { args['prove'] = *prove }\n";
	let defaultLimit = "if (limit != nil) {args['limit'] = *limit}\n" +
		"if (order != nil) {args['order'] = *order}\n";
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
	let functionHead = functionString.split("error)")[0]
	let type, isQuery = getType(functionHead)
	let tableName = getTableName(functionHead)
	let  = functionString.includes("*queryResolver")

	switch (type) {
		case 'get':
			body += "result, err := r.db.tables[" + tableName + "].get(args.id, args.proof)";
			break
		case 'mutation':
			body += "result, err := r.db.tables[" + tableName + "].put(args.id, args.proof)";
			break
		case "getAll":
			body += "result, err := r.db.tables['" + tableName + "'].range(args.id, args.proof)";
			break
		case 'query':
			body += "result, err := r.db.tables['" + tableName + "'].query(args.id, args.proof)";
			break
	}

	if (isQuery) {
		body += "if err != nil {\n" +
		"  return nil, err\n" +
		"}\n" +
		"value := " + output + "{}\n" +
		"json.Unmarshal(result, &value)\n" +
		"return value, nil\n"
	}
	return body
}

function getType(head) {
	var isQuery = false
	var type = 'mutation'
	if (!head.includes("*queryResolver")) {
		return type, isQuery
	}
	isQuery = true
	if (head.includes("Query(") {
		type = "query"
		return type, isQuery
	}
	if (head.includes("[]*models.") {
		type = 'getAll'
		return type, isQuery
	}
	type = 'get'
	return type, isQuery
}

function getTableName(head) {
	let tableName = head.split("*models.")[-1].replace(" ", "")
	tableName = tableName.replace(",error)", "")
	tableName += "s"
	return tableName
}

module.exports = processFunctions
