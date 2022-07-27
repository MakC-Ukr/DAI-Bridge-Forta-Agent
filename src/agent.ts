import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  FindingType,
  getJsonRpcUrl,
} from "forta-agent";
var ethers = require("ethers");
import dataJson from "./data.json";

// initialising DAI contract on L1
let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());
let DAI_L1 = new ethers.Contract(dataJson.DAI_L1_ADDRESS, dataJson.Erc20_ABI, provider);

// initialising DAI contract on L2
var OPvsARB = false;

let ESCROW_ADDRESS_L1 = OPvsARB ? dataJson.L1_ESCROW_ADDRESS_OP : dataJson.L1_ESCROW_ADDRESS_ARB;
let DAI_ADDRESS_L2 = OPvsARB ? dataJson.DAI_L2_ADDRES_OP : dataJson.DAI_L2_ADDRES_ARB;
let RPC_LINK_L2 = OPvsARB ? dataJson.OptimismRpc : dataJson.ArbitrumRpc;

let l2_provider = new ethers.providers.JsonRpcProvider(RPC_LINK_L2);
let DAI_L2 = new ethers.Contract(DAI_ADDRESS_L2, dataJson.Erc20_ABI, l2_provider);

const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
  const findings: Finding[] = [];

  let escrowBal = parseFloat(await DAI_L1.balanceOf(ESCROW_ADDRESS_L1)) / Math.pow(10, 18);
  let L2_totalSupply = parseFloat(await DAI_L2.totalSupply()) / Math.pow(10, 18);

  if (L2_totalSupply >= escrowBal) {
    findings.push(
      Finding.fromObject({
        name: "DAI balance LOW",
        description: `DAI balance of the L1 escrow account for Optimism DAI bridge is less than total_supply of DAI on L2.`,
        alertId: "OP_DAI_BRIDGE-1",
        severity: FindingSeverity.High,
        type: FindingType.Suspicious,
        metadata: {},
      })
    );
  }

  return findings;
};

export default {
  // handleTransaction,
  handleBlock,
};
