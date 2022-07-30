import {
  BlockEvent,
  Finding,
  HandleBlock,
  HandleTransaction,
  TransactionEvent,
  FindingSeverity,
  FindingType,
} from "forta-agent";
import axios from "axios";
import dataJson from "./useless/src/data.json";

const QUERY: string = `query recentAlerts {
  alerts(
    input: {
      first: 100
      blockDateRange: {
        startDate: "2022-07-29",
        endDate: "2022-07-29"
      }
      bots: [
  "0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5"
      ]
      chainId: 1
    }
  ) {
    pageInfo {
      hasNextPage
    }
    alerts {
      createdAt
      name
      protocol
    }
  }
}`

const constVars = {
  input: {
    first: 10,
    bots: ["0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5"],
    chainId: 1,
    blockDateRange: {
      startDate: "2022-07-29",
      endDate: "2022-07-29",
    }
  }
  };

export const ERC20_TRANSFER_EVENT =
  "event Transfer(address indexed from, address indexed to, uint256 value)";
export const TETHER_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const TETHER_DECIMALS = 6;
let findingsCount = 0;

const func = async () => {
  const resp = await axios.post(
    dataJson.API_URL,
    {
      query: QUERY,
      variables: constVars
    },
    {
      headers: {
        "content-type": "application/json",
      },
    }
    );
    console.log(resp['data']['data']['alerts']);
  }
  
  const handleTransaction: HandleTransaction = async (
    txEvent: TransactionEvent
    ) => {
  const findings: Finding[] = [];

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  if (findingsCount >= 5) return findings;

  // filter the transaction logs for Tether transfer events
  const tetherTransferEvents = txEvent.filterLog(
    ERC20_TRANSFER_EVENT,
    TETHER_ADDRESS
  );

  await func();

  tetherTransferEvents.forEach((transferEvent) => {
    // extract transfer event arguments
    const { to, from, value } = transferEvent.args;
    // shift decimals of transfer value
    const normalizedValue = value.div(10 ** TETHER_DECIMALS);

    // if more than 10,000 Tether were transferred, report it
    if (normalizedValue.gt(10000)) {
      findings.push(
        Finding.fromObject({
          name: "High Tether Transfer",
          description: `High amount of USDT transferred: ${normalizedValue}`,
          alertId: "FORTA-1",
          severity: FindingSeverity.Low,
          type: FindingType.Info,
          metadata: {
            to,
            from,
          },
        })
      );
      findingsCount++;
    }
  });

  return findings;
};

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

export default {
  handleTransaction,
  // handleBlock
};
