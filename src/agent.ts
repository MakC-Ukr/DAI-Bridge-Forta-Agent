import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
  getJsonRpcUrl
} from "forta-agent";
var ethers = require("ethers");

const DAI_L1_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const L1_ESCROW_ADDRESS = "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65";

const Erc20_ABI = [{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());
let DAI_L1 = new ethers.Contract(DAI_L1_ADDRESS, Erc20_ABI, provider);


// const handleTransaction: HandleTransaction = async (
//   txEvent: TransactionEvent
// ) => {
//   const findings: Finding[] = [];

//   // limiting this agent to emit only 5 findings so that the alert feed is not spammed
//   if (findingsCount >= 5) return findings;

//   // filter the transaction logs for Tether transfer events
//   const tetherTransferEvents = txEvent.filterLog(
//     ERC20_TRANSFER_EVENT,
//     TETHER_ADDRESS
//   );

//   tetherTransferEvents.forEach((transferEvent) => {
//     // extract transfer event arguments
//     const { to, from, value } = transferEvent.args;
//     // shift decimals of transfer value
//     const normalizedValue = value.div(10 ** TETHER_DECIMALS);

//     // if more than 10,000 Tether were transferred, report it
//     if (normalizedValue.gt(10000)) {
//       findings.push(
//         Finding.fromObject({
//           name: "High Tether Transfer",
//           description: `High amount of USDT transferred: ${normalizedValue}`,
//           alertId: "FORTA-1",
//           severity: FindingSeverity.Low,
//           type: FindingType.Info,
//           metadata: {
//             to,
//             from,
//           },
//         })
//       );
//       findingsCount++;
//     }
//   });

//   return findings;
// };

const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
  const findings: Finding[] = [];

  // Check if total supply was changed on L2 for DAI token

  // Get DAI balance of L1 escrow 
  let escrowBalNum = parseFloat(await DAI_L1.balanceOf(L1_ESCROW_ADDRESS));
  let escrowBal = await DAI_L1.balanceOf(L1_ESCROW_ADDRESS);
  console.log({escrowBalNum, escrowBal});


  findings.push(
    Finding.fromObject({
      name: "DAI balance LOW",
      description: `DAI balance of the L1 escrow account for Optimism DAI bridge is less than total_supply of DAI on L2.`,
      alertId: "DAI_BRIDGE-1",
      severity: FindingSeverity.High,
      type: FindingType.Suspicious,
      metadata: {},
    })
  );


  return findings;
}

export default {
  // handleTransaction,
  handleBlock
};
