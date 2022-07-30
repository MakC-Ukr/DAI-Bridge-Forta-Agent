import {
  BlockEvent,
  Finding,
  HandleBlock,
  FindingSeverity,
  getJsonRpcUrl,
  FindingType,
} from "forta-agent";
var ethers = require("ethers");
import { DAI_L1_ADDRESS, ERC20_ABI, L1_ESCROW_ADDRESS_ARB, L1_ESCROW_ADDRESS_OP, API_URL, QUERY_OP, QUERY_ARB, HEADERS} from "./constants";
import axios from "axios";



export function provideHandleBlock(
      DaiL1Address: string,
      erc20Abi: any[], 
      l1EscrowAddressOp: string,
      l1EscrowAddressArb : string,
      apiUrl : string,
      queryOp: string, 
      queryArb: string, 
      headers : {}
  ): HandleBlock {


  const func = async (i: number) => {
    const resp = await axios.post(
      apiUrl,
      {
        query: i === 0 ? queryOp : queryArb,
      },
      {headers: headers,}
    );
    return resp['data']['data']['alerts']['alerts'][0]['metadata'];
  }

      
    let provider = new ethers.providers.JsonRpcProvider(getJsonRpcUrl());
    let DAI_L1 = new ethers.Contract(DaiL1Address, erc20Abi, provider);

    return async (_: BlockEvent) => {
      const findings: Finding[] = [];
      for(let i = 0; i < 2; i++){
        const chainName = i === 0 ? "Optimism" : "Arbitrum";
        let escrowBal = parseFloat(await DAI_L1.balanceOf( i === 0 ? l1EscrowAddressOp : l1EscrowAddressArb)) / Math.pow(10, 18);
        let flag = false;
        let L2_metadata = await func(i);

        if(parseFloat(L2_metadata['totalSupplyDai']) > escrowBal)
          flag = true;

        if (flag) {
          const alertName = i === 0 ? "OP: DAI L1 less than L2" : "AB: DAI L1 less than L2";
          findings.push(
            Finding.fromObject({
              name: alertName,
              description: "DAI balance of L1 escrow for " +chainName+ " DAI bridge less than DAI supply on L2",
              alertId: "DAI_BALANCE-1",
              severity: FindingSeverity.High,
              type: FindingType.Exploit,
              protocol: "MakerDAO (mainnet)",
              metadata: {
                escrowBal: escrowBal.toString(),
                L2_sup : L2_metadata['totalSupplyDai'].toString(),
                L2_chainId: L2_metadata['chainId'],
                L2_chainName: i === 0 ? "Optimism" : "Arbitrum"
              },
            })
          );


        }
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
      HEADERS
    ),
};
