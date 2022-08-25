import { BlockEvent, Finding, HandleBlock, getEthersProvider, ethers } from "forta-agent";
import { DAI_L2_ADDRESS, ERC20_ABI, getFindingL2, INITIAL_PREV_SUPPLY_FOR_L2 } from "./utils";

let chainSpecificCache: number = INITIAL_PREV_SUPPLY_FOR_L2;

export function provideHandleBlock_L2(
  erc20Abi: any[],
  daiL2Address: string,
  provider: ethers.providers.JsonRpcProvider
): HandleBlock {
  return async (blockEvent: BlockEvent) => {
    const findings: Finding[] = [];

    let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
    let L2_totalSupply = parseFloat(await DAI_L2.totalSupply({ blockTag: blockEvent.blockNumber }));
    if (chainSpecificCache != L2_totalSupply) {
      findings.push(getFindingL2(chainSpecificCache.toString(), L2_totalSupply.toString()));
      chainSpecificCache = L2_totalSupply;
    }

    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock_L2(ERC20_ABI, DAI_L2_ADDRESS, getEthersProvider()),
};
