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

let chainSpecificCache: number = 0;

async function provideHandleBlock_ARB(
  erc20Abi: any[],
  daiL2Address: string,
  blockEvent: BlockEvent
) {
  let provider: JsonRpcProvider = getEthersProvider();
  const findings: Finding[] = [];

  let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
  let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());

  if (chainSpecificCache != L2_totalSupply) {
    findings.push(
      Finding.fromObject({
        name: "(ARB)DAI-balance-update",
        description: `Returns the total supply of L2 Arbitrum DAI tokens`,
        alertId: "ARB_DAI_SUPPLY-1",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
        protocol: "MakerDAO",
        metadata: {
          blockNumber: blockEvent.blockNumber.toString(),
          blockHash: blockEvent.blockHash,
          chainId: "42161",
          totalSupplyDAI: L2_totalSupply.toString(),
          prevTotalSupply: chainSpecificCache.toString(),
        },
      })
    );
    chainSpecificCache = L2_totalSupply;
  }

  return findings;
}

export default provideHandleBlock_ARB;
