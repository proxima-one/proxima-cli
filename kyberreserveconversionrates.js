const { GraphQLServer } = require('graphql-yoga')
const Ruffle = require('ora-ruffle')
const BigNumber = require('bignumber.js');
var fs = require('fs');
const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io:443')
 const web3 = new Web3(provider);
 let ruffle = new Ruffle();
 const yaml = require('js-yaml');
const environment = yaml.safeLoad(fs.readFileSync('config_kyber.yml', 'utf8'));
const abiCode = require(environment.abi);
const contractAddress = environment.contract;
let contract = web3.eth.Contract(abiCode, contractAddress);

/*
Polling with interval
*/
setInterval(getBaseRates, 10000)

async function getTokens() {
  console.log(await contract.methods.getListedTokens.call())
}

async function getBaseRates() {
  let tokens = await contract.methods.getListedTokens.call();
  for (let i = 0; i < 5; i++) {
    let token = tokens[i]
    let rateBuy = await contract.methods.getBasicRate(token, true).call()
    rateBuy = new BigNumber(rateBuy._hex, 16)
    rateBuy = rateBuy / (10**18)

    let rateSell = await contract.methods.getBasicRate(token, false).call()
    rateSell = new BigNumber(rateSell._hex, 16)
    rateSell = rateSell / (10**18)
    let spread = (1/rateSell) - rateBuy
    let spreadPercent = spread*rateSell*100
    console.log(token, rateBuy, rateSell, spread, spreadPercent)

    let value = {
      token: token,
      rateSell: rateSell,
      rateBuy: rateBuy,
      spread: spread,
      spreadPercent: spreadPercent
    }

    let data = {
      name: "conversionRates",
      id: token,
      value: value
    }

    await putData(data)

  }
}

/*
contract.getPastEvents('allEvents',{fromBlock: 7668815, toBlock: 'latest' },
async function(error, events){
if (events) {
for (var i = 0; i < events.length; i++) {
let contractEvent = events[i]
let value = await putEvent(contractEvent);
}
}
});
*/

/*
Get and Set
*/
async function putData(data) {
  var id = Date.now()
  let req = {
    name: data.name,
    key: data.id,
    value: data.value,
    action: 'put',
    id: id
  }
  let value = await ruffle.request(req)
  return value
}

async function getData(name, id) {
  let req = {
    name: name,
    key: id,
    action: 'get',
    id: Date.now()
  }
  let resp = await ruffle.request(req)
  return [resp]
}

/*
Resolvers
*/
function resolveReserveRates(data) {
  console.log(data)

  return JSON.parse(data.value)
}


/*
Queries
*/

const resolvers = { Query: {

getConversionRate: async (parent, args) => {

 let values = await getData('conversionRates', args.token)
 console.log(values)
 for (var i = 0; i < values.length; i++) {
  values[i] = resolveReserveRates(values[i])
  }
 console.log(values[i])
 return values
}

}
}



const server = new GraphQLServer({
typeDefs: './schema/kyber-schema.graphql',
resolvers,
})




server.start( () => console.log(`Server is running on http://localhost:4000`));
