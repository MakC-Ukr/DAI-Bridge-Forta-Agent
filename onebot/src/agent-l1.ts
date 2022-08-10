import {
  Finding,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  ethers,
  HandleBlock,
  BlockEvent,
} from "forta-agent";
import {
  QUERY_API,
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  API_URL,
  HEADERS,
} from "./constants";
import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";

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

const CURR_BOT_ID =
  "0x8373bf9a8693bd5aa0454625e55a94c9493c2fddae9cdb46b3ba93061e2f6e7d";

export async function provideHandleBlock_L1(
  daiL1Address: string,
  erc20Abi: any[],
  l1EscrowAddressArb: string,
  l1EscrowAddressOp: string,
  apiUrl: string,
  headers: {}
): Promise<Finding[]> {
  let provider: JsonRpcProvider = getEthersProvider();

  const findings: Finding[] = [];
  let DAI_L1 = new ethers.Contract(daiL1Address, erc20Abi, provider);
  // Optimism
  let L1_escrowBal_OP = parseFloat(await DAI_L1.balanceOf(l1EscrowAddressOp));
  let l2_metadata_OP = (
    await func(apiUrl, QUERY_API(CURR_BOT_ID, "10"), headers)
  )["totalSupplyDai"];

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
  let L1_escrowBal_ARB = parseFloat(await DAI_L1.balanceOf(l1EscrowAddressArb));
  let l2_metadata_ARB = (
    await func(apiUrl, QUERY_API(CURR_BOT_ID, "42161"), headers)
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

  return findings;
}

// export default provideHandleBlock_L1;
export default {
  handleBlock: provideHandleBlock_L1(
    DAI_L1_ADDRESS,
    ERC20_ABI,
    L1_ESCROW_ADDRESS_ARB,
    L1_ESCROW_ADDRESS_OP,
    API_URL,
    HEADERS
  ),
};
