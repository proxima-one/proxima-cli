
//const web3 = require("web3")
/*
Datasource
*/

'use strict'

var fs = require('fs');

const schemaFile = './schema/ora-schema.graphql';
const eventFile = 'server.js';

const yaml = require('js-yaml');
const environment = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
//const environment = JSON.stringify(config, null, 4);
//console.log(environment.abi);

//
//const environment = require('./env.json');
//console.log(environment)
const abiCode = require(environment.abi);//require('./abi.json');
const contractAddress = environment.contract;


function main() {
  let schema = ""
  let schemaHead = "type Query { \n"
  let eventQuery = "const resolvers = { \n Query: {\n"
  let eventRes = ""
  let indexHead = ""
  //Queries
  for (let i = 0; i < abiCode.length; i++) {
    let chunk = abiCode[i]
    switch(chunk.type) {
      case 'event':
        console.log('event', chunk.name)
        var resp  =  processEvent(chunk)
        schema += resp.schema
        schemaHead += resp.schemaHead
        eventRes += resp.eventStruct
        eventQuery += resp.query

        break;
      /*
      case 'function':
        if (chunk.constant) {
          console.log("function", chunk)
        }

        break;
      default:
        console.log(chunk.type)

      */
    }
  }

  schemaHead += "}\n \n"

  eventQuery += "\n}\n}\n"

  fs.writeFile(schemaFile, schemaHead + schema, function (err) {

  if (err) throw err;
    console.log('Saved!');
    fs.writeFile(eventFile, headIndex() + eventQuery + eventRes + tailIndex(), function (err) {
    if (err) throw err;
      console.log('Saved!');
    });
  });



}

/*
Helper
*/
function processEvent(contractEvent) {
  return {schema: eventSchema(contractEvent), schemaHead: eventQueries(contractEvent), eventStruct: eventResolvers(contractEvent),
      query: queryResolvers(contractEvent)}
}


function eventSchema(contractEvent) {
  let schema = "type "
  schema += contractEvent.name + "  { " + '\n'
  schema += "  blockNumber: Int! \n"
  schema += "  proof: String! \n"
  for (let v = 0; v < contractEvent.inputs.length; v ++) {
    switch(contractEvent.inputs[v].type) {
      case "address":
        schema+= "  " + contractEvent.inputs[v].name + ": " +  "String!" + '\n'
        break
      case "uint256":
        schema+= "  " + contractEvent.inputs[v].name + ": " +  "Float!" + '\n'
        break
      default:
        schema+= "  " + contractEvent.inputs[v].name + ": " +  "String!" + '\n'
    }
  }
  schema +="} " + '\n\n'
  return schema
}

function eventQueries(contractEvent) {
  let query = "  "
  query += contractEvent.name + "s(fromBlock: Int!): " +  "[" + contractEvent.name + "] \n"
  return query
}


function setup() {


}

/*
values[i] = values[i].value.returnValues
values[i].value = web3.utils.fromWei(values[i].value._hex, \'ether\' ) }

*/
function eventResolvers(contractEvent) {
  let funct = "function resolve" + contractEvent.name + "(contractEvent) { \n"
  funct += "  let resp = { \n"
  funct += "    blockNumber: contractEvent.value.blockNumber,\n"
    funct += "    proof: JSON.stringify(contractEvent.proof),\n"
  for (let v = 0; v < contractEvent.inputs.length; v ++) {
    switch(contractEvent.inputs[v].type) {
      case "address":
        funct+= "   " + contractEvent.inputs[v].name + ": " +  "contractEvent.value.returnValues."+contractEvent.inputs[v].name + ',\n'
        break
      case "uint256":
        funct+= "  " + contractEvent.inputs[v].name + ": " +  "web3.utils.fromWei(contractEvent.value.returnValues."+contractEvent.inputs[v].name+ "._hex" + ", \'ether\')" + ',\n'
        break
      default:
        funct+= "  " + contractEvent.inputs[v].name + ": " +  "contractEvent.value.returnValues."+contractEvent.inputs[v].name + ',\n'
    }
}
funct += "} \n"
funct += '  return resp \n} \n\n'
return funct
}





function queryResolvers(contractEvent) {
  let schema = "\n"
  /*
  filter
  */
  schema += contractEvent.name + "s: async (parent, args) => {\n"
  schema += "  let predicate = [{name: \'blockNumber\', expression: \'>\', value: args.fromBlock}] \n"
  schema += "  let values = await filterContractEvent(\'" + contractEvent.name + "\', predicate) \n"
  schema += "  for (var i = 0; i < values.length; i++) { \n"

  schema += "   values[i] = resolve" + contractEvent.name + "(values[i]) \n}"
    //schema += " console.log(values[i]) \n"
  schema += "  return values\n},"


  return schema
}




function headIndex() {

  let head = "const { GraphQLServer } = require('graphql-yoga') \n"
    head += "const Ruffle = require('ora-ruffle') \n"
    head += "var fs = require('fs');\n"
    head += "const Web3 = require('web3') \n"
  head += "const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io:443') \n "
  head += "const web3 = new Web3(provider); \n "

  head += "let ruffle = new Ruffle(); \n "
  head += "const yaml = require('js-yaml');\n"
  head += "const environment = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));\n"
  head += "const abiCode = require(environment.abi); \n"
  head += "const contractAddress = environment.contract; \n"
  head += "let contract = web3.eth.Contract(abiCode, contractAddress); \n"


  head += "contract.getPastEvents('allEvents',{fromBlock: 7668815, toBlock: 'latest' }, \n"
    head += "async function(error, events){ \n"
      head += "if (events) { \n"
      head += "for (var i = 0; i < events.length; i++) { \n"
      head += "let contractEvent = events[i] \n"
      head += "console.log(contractEvent) \n"
      head += "let value = await putEvent(contractEvent); \n"
      head += "} \n"
    head += "} \n"
  head += "}); \n"
  head += "async function putEvent(contractEvent) { \n"
  head += "  var id = Date.now() \n"
  head += "  let req = { \n"
  head += "    name: contractEvent.event, \n"
  head += "    key: contractEvent.id, \n"
  head += "    value: contractEvent, \n"
  head += "    action: 'put', \n"
  head += "    id: id \n"
  head += "  } \n"
  head += "  let value = await ruffle.request(req) \n"
  head += "  return value \n"
  head += "} \n"
  head += "async function getContractEvent(name, id) {  \n"
  head += "  let req = { \n"
  head += "    name: name, \n"
  head += "    key: id, \n"
  head += "    action: 'get', \n"
  head += "    id: Date.now() \n"
  head += "  } \n"
  head += "  let resp = await ruffle.request(req) \n"
  head += "  return [resp] \n"
  head += "} \n"

  head += "async function filterContractEvent(name, pred) { \n"
  head += "  let req = { \n"
  head += "    name: name, \n"
  head += "    predicate: pred, \n"
  head += "    id: Date.now(), \n"
  head += "    action: 'filter' \n"
  head += "  } \n"
  head += "  let values = await ruffle.request(req) \n"
  head += " console.log(values)\n"
  head += "  return values \n}  \n"
    return head
}


function tailIndex(){

  let tail = "\n\n"

  tail += "const server = new GraphQLServer({\n"
  tail += "typeDefs: './schema/ora-schema.graphql',\n"
  tail += "resolvers,\n"
  tail += "})\n"
  tail += "server.start(() => console.log(`Server is running on http://localhost:4000`));\n\n"
  return tail
}



module.exports = {
  main
}
