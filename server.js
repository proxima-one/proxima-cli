const { GraphQLServer } = require('graphql-yoga') 
const Ruffle = require('ora-ruffle') 
var fs = require('fs');
const Web3 = require('web3') 
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io:443') 
 const web3 = new Web3(provider); 
 let ruffle = new Ruffle(); 
 const yaml = require('js-yaml');
const environment = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
const abiCode = require(environment.abi); 
const contractAddress = environment.contract; 
let contract = web3.eth.Contract(abiCode, contractAddress); 
contract.getPastEvents('allEvents',{fromBlock: 7668815, toBlock: 'latest' }, 
async function(error, events){ 
if (events) { 
for (var i = 0; i < events.length; i++) { 
let contractEvent = events[i] 
console.log(contractEvent) 
let value = await putEvent(contractEvent); 
} 
} 
}); 
async function putEvent(contractEvent) { 
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
async function getContractEvent(name, id) {  
  let req = { 
    name: name, 
    key: id, 
    action: 'get', 
    id: Date.now() 
  } 
  let resp = await ruffle.request(req) 
  return resp 
} 
async function filterContractEvent(name, pred) { 
  let req = { 
    name: name, 
    predicate: pred, 
    id: Date.now(), 
    action: 'filter' 
  } 
  let values = await ruffle.request(req) 
 console.log(values)
  return values 
}  
const resolvers = { 
 Query: {

SetOwners: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}] 
  let values = await filterContractEvent('SetOwner', predicate) 
  for (var i = 0; i < values.length; i++) { 
   values[i] = resolveSetOwner(values[i]) 
} console.log(values[i]) 
  return values
},
Orders: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}] 
  let values = await filterContractEvent('Order', predicate) 
  for (var i = 0; i < values.length; i++) { 
   values[i] = resolveOrder(values[i]) 
} console.log(values[i]) 
  return values
},
Cancels: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}] 
  let values = await filterContractEvent('Cancel', predicate) 
  for (var i = 0; i < values.length; i++) { 
   values[i] = resolveCancel(values[i]) 
} console.log(values[i]) 
  return values
},
Trades: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}] 
  let values = await filterContractEvent('Trade', predicate) 
  for (var i = 0; i < values.length; i++) { 
   values[i] = resolveTrade(values[i]) 
} console.log(values[i]) 
  return values
},
Deposits: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}] 
  let values = await filterContractEvent('Deposit', predicate) 
  for (var i = 0; i < values.length; i++) { 
   values[i] = resolveDeposit(values[i]) 
} console.log(values[i]) 
  return values
},
Withdraws: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}] 
  let values = await filterContractEvent('Withdraw', predicate) 
  for (var i = 0; i < values.length; i++) { 
   values[i] = resolveWithdraw(values[i]) 
} console.log(values[i]) 
  return values
},
}
}
function resolveSetOwner(contractEvent) { 
  let resp = { 
    blockNumber: contractEvent.value.blockNumber,
   previousOwner: contractEvent.value.returnValues.previousOwner,
   newOwner: contractEvent.value.returnValues.newOwner,
} 
  return resp 
} 

function resolveOrder(contractEvent) { 
  let resp = { 
    blockNumber: contractEvent.value.blockNumber,
   tokenBuy: contractEvent.value.returnValues.tokenBuy,
  amountBuy: web3.utils.fromWei(contractEvent.value.returnValues.amountBuy._hex, 'ether'),
   tokenSell: contractEvent.value.returnValues.tokenSell,
  amountSell: web3.utils.fromWei(contractEvent.value.returnValues.amountSell._hex, 'ether'),
  expires: web3.utils.fromWei(contractEvent.value.returnValues.expires._hex, 'ether'),
  nonce: web3.utils.fromWei(contractEvent.value.returnValues.nonce._hex, 'ether'),
   user: contractEvent.value.returnValues.user,
  v: contractEvent.value.returnValues.v,
  r: contractEvent.value.returnValues.r,
  s: contractEvent.value.returnValues.s,
} 
  return resp 
} 

function resolveCancel(contractEvent) { 
  let resp = { 
    blockNumber: contractEvent.value.blockNumber,
   tokenBuy: contractEvent.value.returnValues.tokenBuy,
  amountBuy: web3.utils.fromWei(contractEvent.value.returnValues.amountBuy._hex, 'ether'),
   tokenSell: contractEvent.value.returnValues.tokenSell,
  amountSell: web3.utils.fromWei(contractEvent.value.returnValues.amountSell._hex, 'ether'),
  expires: web3.utils.fromWei(contractEvent.value.returnValues.expires._hex, 'ether'),
  nonce: web3.utils.fromWei(contractEvent.value.returnValues.nonce._hex, 'ether'),
   user: contractEvent.value.returnValues.user,
  v: contractEvent.value.returnValues.v,
  r: contractEvent.value.returnValues.r,
  s: contractEvent.value.returnValues.s,
} 
  return resp 
} 

function resolveTrade(contractEvent) { 
  let resp = { 
    blockNumber: contractEvent.value.blockNumber,
   tokenBuy: contractEvent.value.returnValues.tokenBuy,
  amountBuy: web3.utils.fromWei(contractEvent.value.returnValues.amountBuy._hex, 'ether'),
   tokenSell: contractEvent.value.returnValues.tokenSell,
  amountSell: web3.utils.fromWei(contractEvent.value.returnValues.amountSell._hex, 'ether'),
   get: contractEvent.value.returnValues.get,
   give: contractEvent.value.returnValues.give,
} 
  return resp 
} 

function resolveDeposit(contractEvent) { 
  let resp = { 
    blockNumber: contractEvent.value.blockNumber,
   token: contractEvent.value.returnValues.token,
   user: contractEvent.value.returnValues.user,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
  balance: web3.utils.fromWei(contractEvent.value.returnValues.balance._hex, 'ether'),
} 
  return resp 
} 

function resolveWithdraw(contractEvent) { 
  let resp = { 
    blockNumber: contractEvent.value.blockNumber,
   token: contractEvent.value.returnValues.token,
   user: contractEvent.value.returnValues.user,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
  balance: web3.utils.fromWei(contractEvent.value.returnValues.balance._hex, 'ether'),
} 
  return resp 
} 



const server = new GraphQLServer({
typeDefs: './schema/ora-schema.graphql',
resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`));

