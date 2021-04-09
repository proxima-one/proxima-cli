import { BigDecimal, Address, ethereum } from "@graphprotocol/graph-ts";

import {DInterest} from '../generated/contracts/DInterest.d.ts' 
import {IInterestOracle} from '../generated/contracts/IInterestOracle.d.ts' 
import {ERC20} from '../generated/contracts/ERC20.d.ts' 
import {MPHMinter} from '../generated/contracts/MPHMinter.d.ts' 

import { BigDecimal, BigInt, DPoolList, DPoolListInput, DPool, DPoolInput, User, UserInput, UserTotalDeposit, UserTotalDepositInput, Deposit, DepositInput, Funder, FunderInput, FunderTotalInterest, FunderTotalInterestInput, Funding, FundingInput, MPHHolder, MPHHolderInput, MPH, MPHInput, useDefaultArgs, hasRole, hasAuthentication, goField, Role } from '../generated/models/models.ts'
export function EDepositHandler(event: EDeposit): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
export function EFundHandler(event: EFund): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
export function ESetParamAddressHandler(event: ESetParamAddress): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
export function ESetParamUintHandler(event: ESetParamUint): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
export function EWithdrawHandler(event: EWithdraw): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
export function OwnershipTransferredHandler(event: OwnershipTransferred): void {
  //test template (importing into the handler files)
console.log(event);

}

//attaching multiple handler at the same time
