import axios from "axios";
import { BlockEvent, Finding, FindingSeverity, FindingType } from "forta-agent";

const apiCallL1 = async (
  i: number,
  apiUrl: string,
  queryArb: string,
  queryOp: string,
  headers: {}
) => {
  const resp = await axios.post(
    apiUrl,
    {
      query: i === 0 ? queryOp : queryArb,
    },
    { headers: headers }
  );
  return resp["data"]["data"]["alerts"]["alerts"][0]["metadata"];
};

const findingPusherL1 = async (
  i: number,
  findings: Finding[],
  chainName: string,
  escrowBal: number,
  l2_sup: string,
  l2_cId: string
) => {
  const alertName =
    i === 0 ? "OP: DAI L1 less than L2" : "AB: DAI L1 less than L2";
  findings.push(
    Finding.fromObject({
      name: alertName,
      description:
        "DAI balance of L1 escrow for " +
        chainName +
        " DAI bridge less than DAI supply on L2",
      alertId: "DAI_BALANCE-1",
      severity: FindingSeverity.High,
      type: FindingType.Exploit,
      protocol: "MakerDAO (mainnet)",
      metadata: {
        escrowBal: escrowBal.toString(),
        L2_sup: l2_sup,
        L2_chainId: l2_cId,
        L2_chainName: i === 0 ? "Optimism" : "Arbitrum",
      },
    })
  );
};

// TODO needs to be deleted
const findingPusher_OP = (
  findings: Finding[],
  blockEvent: BlockEvent,
  L2_totalSupply: number
) => {
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
};

const findingPusher_ARB = (
  findings: Finding[],
  blockEvent: BlockEvent,
  L2_totalSupply: number
) => {
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
};

export { apiCallL1, findingPusherL1, findingPusher_OP, findingPusher_ARB };
