import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  ethers,
} from "forta-agent";
import {
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  API_URL,
  QUERY_API,
  HEADERS,
  DAI_L2_ADDRESS,
} from "./constants";
import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";
// import fortaConfig from '../forta.config.json';

async function func(apiUrl: string, querySent: string, headers: {}) {
  const resp = await axios.post(
    apiUrl,
    {
      query: querySent,
    },
    { headers: headers }
  );
  return resp["data"]["data"]["alerts"]["alerts"][0]["metadata"];
}

let chainSpecificCache: number = 0;
const currBotId =
  "0x8373bf9a8693bd5aa0454625e55a94c9493c2fddae9cdb46b3ba93061e2f6e7d";

export function provideHandleBlock(
  daiL1Address: string,
  erc20Abi: any[],
  l1EscrowAddressArb: string,
  l1EscrowAddressOp: string,
  apiUrl: string,
  headers: {},
  daiL2Address: string
): HandleBlock {
  return async (blockEvent: BlockEvent) => {
    let provider: JsonRpcProvider = getEthersProvider();
    let currChainId = (await provider._networkPromise).chainId;

    const findings: Finding[] = [];

    if (currChainId.toString() === "1") {
      let DAI_L1 = new ethers.Contract(daiL1Address, erc20Abi, provider);
      // Optimism
      let L1_escrowBal_OP = parseFloat(
        await DAI_L1.balanceOf(l1EscrowAddressOp)
      );
      let l2_metadata_OP = (
        await func(apiUrl, QUERY_API(currBotId, "10"), headers)
      )["totalSupplyDai"];

      // if(l2_metadata_OP == 0){
      //   return findings;
      // }

      if (L1_escrowBal_OP >= l2_metadata_OP) {
        findings.push(
          Finding.fromObject({
            name: "dai-bridge-bot",
            description:
              "DAI balance of L1 escrow for " +
              "OP" +
              " DAI bridge less than DAI supply on L2",
            alertId: "DAI_BALANCE-1",
            severity: FindingSeverity.High,
            type: FindingType.Exploit,
            protocol: "MakerDAO (mainnet)",
            metadata: {
              escrowBal: L1_escrowBal_OP.toString(),
              L2_chainName: "Optimism",
              l2_totalSupply: l2_metadata_OP.toString(),
            },
          })
        );
      }
      // ARBITRUM
      let L1_escrowBal_ARB = parseFloat(
        await DAI_L1.balanceOf(l1EscrowAddressArb)
      );
      let l2_metadata_ARB = (
        await func(apiUrl, QUERY_API(currBotId, "42161"), headers)
      )["totalSupplyDai"];

      if (L1_escrowBal_ARB >= l2_metadata_ARB) {
        findings.push(
          Finding.fromObject({
            name: "dai-bridge-bot",
            description:
              "DAI balance of L1 escrow for " +
              "ARB" +
              " DAI bridge less than DAI supply on L2",
            alertId: "DAI_BALANCE-1",
            severity: FindingSeverity.High,
            type: FindingType.Exploit,
            protocol: "MakerDAO (mainnet)",
            metadata: {
              escrowBal: L1_escrowBal_ARB.toString(),
              L2_chainName: "Arbitrum",
              l2_totalSupply: l2_metadata_ARB.toString(),
            },
          })
        );
      }
    } else if (currChainId.toString() === "10") {
      let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
      let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());

      if (chainSpecificCache != L2_totalSupply) {
        findings.push(
          Finding.fromObject({
            name: "(OP)DAI-balance-update",
            description: `Returns the total supply of L2 Optimism DAI tokens`,
            alertId: "OP_DAI_SUPPLY-1",
            severity: FindingSeverity.Low,
            type: FindingType.Info,
            protocol: "MakerDAO",
            metadata: {
              blockNumber: blockEvent.blockNumber.toString(),
              blockHash: blockEvent.blockHash,
              chainId: "10",
              totalSupplyDAI: L2_totalSupply.toString(),
              prevTotalSupply: chainSpecificCache.toString(),
            },
          })
        );
      }

      chainSpecificCache = L2_totalSupply;
    } else if (currChainId.toString() === "42161") {
      let DAI_L2 = new ethers.Contract(daiL2Address, ERC20_ABI, provider);
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
    }

    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock(
    DAI_L1_ADDRESS,
    ERC20_ABI,
    L1_ESCROW_ADDRESS_ARB,
    L1_ESCROW_ADDRESS_OP,
    API_URL,
    HEADERS,
    DAI_L2_ADDRESS
  ),
};
