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

Rolls: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('Roll', predicate)
  let v = Math.floor((Math.random() * values.length));
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveRoll(values[i])
   if (i === v) {
     console.log("Checking: ", values[i].blockNumber)
   }
}  return values
},
Sponsorships: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('Sponsorship', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveSponsorship(values[i])
}  return values
},
Jackpots: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('Jackpot', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveJackpot(values[i])
}  return values
},
Faucets: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('Faucet', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveFaucet(values[i])
}  return values
},
Donations: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('Donation', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveDonation(values[i])
}  return values
},
Reclaims: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('Reclaim', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveReclaim(values[i])
}  return values
},
TrustUpdates: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('TrustUpdate', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveTrustUpdate(values[i])
}  return values
},
Withdraws: async (parent, args) => {
  let predicate = [{name: 'blockNumber', expression: '>', value: args.fromBlock}]
  let values = await filterContractEvent('Withdraw', predicate)
  for (var i = 0; i < values.length; i++) {
   values[i] = resolveWithdraw(values[i])
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
function resolveRoll(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
  block: web3.utils.fromWei(contractEvent.value.returnValues.block._hex, 'ether'),
   player: contractEvent.value.returnValues.player,
  wager: web3.utils.fromWei(contractEvent.value.returnValues.wager._hex, 'ether'),
  rollUnder: web3.utils.fromWei(contractEvent.value.returnValues.rollUnder._hex, 'ether'),
  dieRoll: web3.utils.fromWei(contractEvent.value.returnValues.dieRoll._hex, 'ether'),
  profit: web3.utils.fromWei(contractEvent.value.returnValues.profit._hex, 'ether'),
  payout: web3.utils.fromWei(contractEvent.value.returnValues.payout._hex, 'ether'),
}
  return resp
}

function resolveSponsorship(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   executor: contractEvent.value.returnValues.executor,
   sender: contractEvent.value.returnValues.sender,
   beneficiary: contractEvent.value.returnValues.beneficiary,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
}
  return resp
}

function resolveJackpot(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   player: contractEvent.value.returnValues.player,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
}
  return resp
}

function resolveFaucet(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   player: contractEvent.value.returnValues.player,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
}
  return resp
}

function resolveDonation(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   benefactor: contractEvent.value.returnValues.benefactor,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
}
  return resp
}

function resolveReclaim(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   owner: contractEvent.value.returnValues.owner,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
}
  return resp
}

function resolveTrustUpdate(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   previous: contractEvent.value.returnValues.previous,
   current: contractEvent.value.returnValues.current,
}
  return resp
}

function resolveWithdraw(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
   player: contractEvent.value.returnValues.player,
  amount: web3.utils.fromWei(contractEvent.value.returnValues.amount._hex, 'ether'),
}
  return resp
}

function resolveOwnershipTransferred(contractEvent) {
  let resp = {
    blockNumber: contractEvent.value.blockNumber,
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
