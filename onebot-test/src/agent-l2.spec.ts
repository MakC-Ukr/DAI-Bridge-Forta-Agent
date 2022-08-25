import { BlockEvent, HandleBlock } from "forta-agent";
import { MockEthersProvider, TestBlockEvent } from "forta-agent-tools/lib/test";
import { provideHandleBlock_L2 } from "./agent-l2";
import {
  ERC20_ABI,
  INITIAL_PREV_SUPPLY_FOR_L2,
  getFindingL2,
  FIRST_TEST_BLOCK_NUMBER,
  iface,
  L2_SUPPLY_ARR,
  MOCK_DAI_L2_ADDR,
} from "./utils";
import { ethers } from "ethers";

describe("DAI bridged balance checker bot tests", () => {
  let mockProvider_l2 = new MockEthersProvider();

  let handleBlock_l2: HandleBlock = provideHandleBlock_L2(
    ERC20_ABI,
    MOCK_DAI_L2_ADDR,
    mockProvider_l2 as unknown as ethers.providers.JsonRpcProvider
  );

  it("returns a finding on when the bot is deployed for L2", async () => {
    const TEST_BLOCK_NUMBER = 20;

    mockProvider_l2
      .addCallTo(MOCK_DAI_L2_ADDR, FIRST_TEST_BLOCK_NUMBER, iface, "totalSupply", {
        inputs: [],
        outputs: [L2_SUPPLY_ARR[0]],
      })
      .setLatestBlock(FIRST_TEST_BLOCK_NUMBER);

    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER);
    expect(await handleBlock_l2(blockEvent)).toStrictEqual([
      getFindingL2(INITIAL_PREV_SUPPLY_FOR_L2.toString(), L2_SUPPLY_ARR[0].toString()),
    ]);
  });

  it("doesn't return a finding on L2 when the totalSupply on L2 remains the same", async () => {
    const TEST_BLOCK_NUMBER = 21;

    mockProvider_l2
      .addCallTo(MOCK_DAI_L2_ADDR, TEST_BLOCK_NUMBER, iface, "totalSupply", {
        inputs: [],
        outputs: [L2_SUPPLY_ARR[0]],
      })
      .setLatestBlock(TEST_BLOCK_NUMBER);

    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER);
    expect(await handleBlock_l2(blockEvent)).toStrictEqual([]);
  });

  it("returns a finding on L2 on when the totalSupply changes on L2", async () => {
    const TEST_BLOCK_NUMBER = 22;

    mockProvider_l2
      .addCallTo(MOCK_DAI_L2_ADDR, TEST_BLOCK_NUMBER, iface, "totalSupply", {
        inputs: [],
        outputs: [L2_SUPPLY_ARR[1]],
      })
      .setLatestBlock(TEST_BLOCK_NUMBER);
    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER);

    expect(await handleBlock_l2(blockEvent)).toStrictEqual([
      getFindingL2(L2_SUPPLY_ARR[0].toString(), L2_SUPPLY_ARR[1].toString()),
    ]);
  });
});
