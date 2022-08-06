import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  getJsonRpcUrl,
  FindingType,
  getEthersProvider
} from "forta-agent";
var ethers = require("ethers");
import {
  DAI_L1_ADDRESS,
  ERC20_ABI,
  L1_ESCROW_ADDRESS_ARB,
  L1_ESCROW_ADDRESS_OP,
  API_URL,
  QUERY_OP,
  QUERY_ARB,
  HEADERS,
  DAI_L2_ADDRESS,
} from "./constants";
import axios from "axios";
import { JsonRpcProvider } from "@ethersproject/providers";

async function func(
  i: number,
  apiUrl: string,
  queryArb: string,
  queryOp: string,
  headers: {}
) {
  const resp = await axios.post(
    apiUrl,
    {
      query: i === 0 ? queryOp : queryArb,
    },
    { headers: headers }
  );
  return resp["data"]["data"]["alerts"]["alerts"][0]["metadata"];
};


export function provideHandleBlock(
  DaiL1Address: string,
  erc20Abi: any[],
  l1EscrowAddressOp: string,
  l1EscrowAddressArb: string,
  apiUrl: string,
  queryOp: string,
  queryArb: string,
  headers: {},
  daiL2Address: string
): HandleBlock {
  return async (blockEvent: BlockEvent) => {
    const findings: Finding[] = [];
    let provider: JsonRpcProvider = getEthersProvider();

    let currChainId = (await provider._networkPromise).chainId;


    if (currChainId.toString() === "1") {
        // let DAI_L1 = new ethers.Contract(DaiL1Address, erc20Abi, provider);
        // for (let i = 0; i < 1; i++) {
          // const chainName = i === 0 ? "Optimism" : "Arbitrum";
          // let l1Bal = await DAI_L1.balanceOf(i === 0 ? l1EscrowAddressOp : l1EscrowAddressArb)
          // let l1Bal = await DAI_L1.balanceOf(l1EscrowAddressOp);
          // let escrowBal = parseFloat(l1Bal) / Math.pow(10, 18);
          // let flag = false;

          // let L2_metadata = await func(
          //   i,
          //   apiUrl,
          //   queryArb,
          //   queryOp,
          //   headers
          // );
          
          // let l2Supply : string = L2_metadata['totalSupplyDai'];
          // console.log(l2Supply);

          // if (parseFloat(L2_metadata["totalSupplyDai"]) <= escrowBal){ 
          //   flag = true;
          // }

          // if (flag) {
            findings.push(
              Finding.fromObject({
                name: "(OP)DAI balance update",
                description: `Returns the total supply of L2 Optimism DAI tokens`,
                alertId: "OP_DAI_SUPPLY-1",
                severity: FindingSeverity.Low,
                type: FindingType.Info,
                protocol: "MakerDAO",
                // metadata: {
                //   blockNumber: blockEvent.blockNumber.toString(),
                //   blockHash: blockEvent.blockHash,
                //   chainId: "10",
                //   escrowBal: escrowBal.toString(),
                //   l1Balance: l1Bal,
                // }
              })
            );      

          // }
        // }
    }
    else if (currChainId.toString() === "10") {
      let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
      let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());
      L2_totalSupply /= Math.pow(10, 18);

      findings.push(
        Finding.fromObject({
          name: "(OP)DAI balance update",
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
          },

        })
      );
    } else if (currChainId.toString() === "42161") {
      let DAI_L2 = new ethers.Contract(daiL2Address, erc20Abi, provider);
      let L2_totalSupply = parseFloat(await DAI_L2.totalSupply());
      L2_totalSupply /= Math.pow(10, 18);

      findings.push(
        Finding.fromObject({
          name: "(ARB)DAI balance update",
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
          },
        })
      );

    }
    else {
      findings.push(
        Finding.fromObject({
          name: "4",
          description: "chain on which i am is: " + currChainId.toString(),
          alertId: "DAI_ERR",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {},
        })
      );

    }

    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock(
    DAI_L1_ADDRESS,
    ERC20_ABI,
    L1_ESCROW_ADDRESS_OP,
    L1_ESCROW_ADDRESS_ARB,
    API_URL,
    QUERY_OP,
    QUERY_ARB,
    HEADERS,
    DAI_L2_ADDRESS
  ),
};
