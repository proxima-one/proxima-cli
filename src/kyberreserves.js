const { GraphQLServer } = require('graphql-yoga')
const Ruffle = require('ora-ruffle')
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
setInterval(getExpectedRates, 10000)

async function getReserves() {
  console.log(await contract.methods.getReserves.call())
}

async function getTokens() {

}

async function getExpectedRates() {
  let src = "0xdd974D5C2e2928deA5F71b9825b8b646686BD200"
  //000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
  let dest = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  let srcQty = "1000000000000000000"
  console.log(await contract.methods.getExpectedRate(src, dest, srcQty).call())
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

async function putData(data) {
  var id = Date.now()
  let req = {
    name: contractEvent.event,
    key: contractEvent.id,
    value: contractEvent,
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
  return resp
}

/*
/*
Resolvers

function resolveReserveRates(data) {


}


/*
Queries

Query: {

SetOwners: async (parent, args) => {
 let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
 let values = await filterContractEvent('SetOwner', predicate)
 for (var i = 0; i < values.length; i++) {
  values[i] = resolveReserveRates(values[i])
} console.log(values[i])
 return values
},

}




const server = new GraphQLServer({
typeDefs: './schema/ora-schema.graphql',
resolvers,
})

const defaultQuery = 'query { \n \
  Withdraws(fromBlock: 7728000) { \n \
	blockNumber \n \
  user \n \
  amount \n \
  balance \n \
  proof \n \
}\n\
}'

const options = {
  defaultPlaygroundQuery: defaultQuery
}
server.start(options, () => console.log(`Server is running on http://localhost:4000`));
*/
