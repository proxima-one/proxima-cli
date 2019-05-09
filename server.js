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

async function getLatest() {
 let blockNumber = await  web3.eth.getBlockNumber();
 console.log(await contract.methods.name.call())
contract.getPastEvents('allEvents',{fromBlock: blockNumber-1000, toBlock: 'latest' },
async function(error, events){
if (events) {
for (var i = 0; i < events.length; i++) {
let contractEvent = events[i]
let value = await putEvent(contractEvent);
}
}
});
 }

 getLatest();





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
  return values
}

const resolvers = {
 Query: {

OrderApprovedPartOnes: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('OrderApprovedPartOne', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveOrderApprovedPartOne(values[i])
}  return values
},
OrderApprovedPartTwos: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('OrderApprovedPartTwo', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveOrderApprovedPartTwo(values[i])
}  return values
},
OrderCancelleds: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('OrderCancelled', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveOrderCancelled(values[i])
}  return values
},
OrdersMatcheds: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('OrdersMatched', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveOrdersMatched(values[i])
}  return values
},
OwnershipRenounceds: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('OwnershipRenounced', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveOwnershipRenounced(values[i])
}  return values
},
OwnershipTransferreds: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('OwnershipTransferred', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveOwnershipTransferred(values[i])
}  return values
},
}
}
function resolveOrderApprovedPartOne(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   proof: JSON.stringify(contractEvent.proof),
  hash: contractEvent.value.returnValues.hash,
   exchange: contractEvent.value.returnValues.exchange,
   maker: contractEvent.value.returnValues.maker,
   taker: contractEvent.value.returnValues.taker,
  makerRelayerFee: web3.utils.fromWei(contractEvent.value.returnValues.makerRelayerFee._hex, 'ether'),
  takerRelayerFee: web3.utils.fromWei(contractEvent.value.returnValues.takerRelayerFee._hex, 'ether'),
  makerProtocolFee: web3.utils.fromWei(contractEvent.value.returnValues.makerProtocolFee._hex, 'ether'),
  takerProtocolFee: web3.utils.fromWei(contractEvent.value.returnValues.takerProtocolFee._hex, 'ether'),
   feeRecipient: contractEvent.value.returnValues.feeRecipient,
  feeMethod: contractEvent.value.returnValues.feeMethod,
  side: contractEvent.value.returnValues.side,
  saleKind: contractEvent.value.returnValues.saleKind,
   target: contractEvent.value.returnValues.target,
}
  return resp
}

function resolveOrderApprovedPartTwo(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   proof: JSON.stringify(contractEvent.proof),
  hash: contractEvent.value.returnValues.hash,
  howToCall: contractEvent.value.returnValues.howToCall,
  calldata: contractEvent.value.returnValues.calldata,
  replacementPattern: contractEvent.value.returnValues.replacementPattern,
   staticTarget: contractEvent.value.returnValues.staticTarget,
  staticExtradata: contractEvent.value.returnValues.staticExtradata,
   paymentToken: contractEvent.value.returnValues.paymentToken,
  basePrice: web3.utils.fromWei(contractEvent.value.returnValues.basePrice._hex, 'ether'),
  extra: web3.utils.fromWei(contractEvent.value.returnValues.extra._hex, 'ether'),
  listingTime: web3.utils.fromWei(contractEvent.value.returnValues.listingTime._hex, 'ether'),
  expirationTime: web3.utils.fromWei(contractEvent.value.returnValues.expirationTime._hex, 'ether'),
  salt: web3.utils.fromWei(contractEvent.value.returnValues.salt._hex, 'ether'),
  orderbookInclusionDesired: contractEvent.value.returnValues.orderbookInclusionDesired,
}
  return resp
}

function resolveOrderCancelled(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   proof: JSON.stringify(contractEvent.proof),
  hash: contractEvent.value.returnValues.hash,
}
  return resp
}

function resolveOrdersMatched(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   proof: JSON.stringify(contractEvent.proof),
  buyHash: contractEvent.value.returnValues.buyHash,
  sellHash: contractEvent.value.returnValues.sellHash,
   maker: contractEvent.value.returnValues.maker,
   taker: contractEvent.value.returnValues.taker,
  price: web3.utils.fromWei(contractEvent.value.returnValues.price._hex, 'ether'),
  metadata: contractEvent.value.returnValues.metadata,
}
  return resp
}

function resolveOwnershipRenounced(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   proof: JSON.stringify(contractEvent.proof),
   previousOwner: contractEvent.value.returnValues.previousOwner,
}
  return resp
}

function resolveOwnershipTransferred(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   proof: JSON.stringify(contractEvent.proof),
   previousOwner: contractEvent.value.returnValues.previousOwner,
   newOwner: contractEvent.value.returnValues.newOwner,
}
  return resp
}



const server = new GraphQLServer({
typeDefs: './schema/ora-schema.graphql',
resolvers,
})
server.start(() => console.log(`Server is running on http://localhost:4000`));
