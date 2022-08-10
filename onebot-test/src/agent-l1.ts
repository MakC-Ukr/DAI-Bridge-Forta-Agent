import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleBlock,
  BlockEvent,
} from "forta-agent";

export function provideHandleBlock_L1(): HandleBlock {
  return async (_: BlockEvent) => {
    const findings: Finding[] = [];
    findings.push(
      Finding.fromObject({
        name: "dai-bridge-bot",
        description: "DAI balance of L1 escrow less than DAI supply on L2",
        alertId: "DAI_BALANCE-1",
        severity: FindingSeverity.High,
        type: FindingType.Exploit,
        protocol: "MakerDAO (mainnet)",
      })
    );
    return findings;
  };
}

export default {
  handleBlock: provideHandleBlock_L1(),
};
