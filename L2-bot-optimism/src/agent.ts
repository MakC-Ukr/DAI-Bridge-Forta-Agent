import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  getJsonRpcUrl,
  FindingType,
} from "forta-agent";
var ethers = require("ethers");
import { DAI_L2_ADDRESS, ERC20_ABI, CHAIN_ID_BOT } from "./constants";

export function provideHandleBlock(DaiL2Address: string, erc20Abi: any[], chainIdBot: string): HandleBlock {
  let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());
  let DAI_L2 = new ethers.Contract(DaiL2Address, erc20Abi, provider);

  return async (blockEvent: BlockEvent) => {
    let L2_totalSupply = parseFloat(await DAI_L2.totalSupply()) / Math.pow(10, 18);
    const findings: Finding[] = [];
    findings.push(
      Finding.fromObject({
        name: "DAI balance update",
        description: `Returns the total supply of L2 Optimism DAI tokens`,
        alertId: "OP_DAI_SUPPLY-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "MakerDAO",
        metadata: {
          blockNumber: blockEvent.blockNumber.toString(),
          blockHash: blockEvent.blockHash,
          chainId: chainIdBot,
          totalSupplyDAI: L2_totalSupply.toString(),
        },
      })
    );
    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock(DAI_L2_ADDRESS, ERC20_ABI, CHAIN_ID_BOT),
};
