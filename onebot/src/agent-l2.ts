import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  ethers,
} from "forta-agent";
import { JsonRpcProvider } from "@ethersproject/providers";
import { DAI_L2_ADDRESS, ERC20_ABI } from "./constants";

let chainSpecificCache: number = 0;

export function provideHandleBlock_L2(
  erc20Abi: any[],
  daiL2Address: string
): HandleBlock {
  return async (_: BlockEvent) => {
    let provider: JsonRpcProvider = getEthersProvider();
    const findings: Finding[] = [];

    let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
    let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());
    if (chainSpecificCache != L2_totalSupply) {
      findings.push(
        Finding.fromObject({
          name: "DAI-balance-update",
          description: `Returns the total supply of L2 DAI tokens`,
          alertId: "L2_DAI_SUPPLY",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          protocol: "MakerDAO",
          metadata: {
            totalSupplyDAI: L2_totalSupply.toString(),
            prevTotalSupply: chainSpecificCache.toString(),
          },
        })
      );
      chainSpecificCache = L2_totalSupply;
    }

    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock_L2(ERC20_ABI, DAI_L2_ADDRESS),
};
