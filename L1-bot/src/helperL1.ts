import axios from "axios";
import { Finding, FindingSeverity, FindingType } from "forta-agent";

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
export { apiCallL1, findingPusherL1 };
