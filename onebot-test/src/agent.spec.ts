import { BlockEvent, HandleBlock } from "forta-agent";
import { MockEthersProvider, TestBlockEvent } from "forta-agent-tools/lib/test";
import { provideHandleBlock_L1 } from "./agent-l1";
import { provideHandleBlock_L2 } from "./agent-l2";
import { API_URL, ERC20_ABI, HEADERS, INITIAL_PREV_SUPPLY_FOR_L2 } from "./constants";
import { ethers } from "ethers";
import { getFindingL2, getFindingL1 } from "./constants";
import {
  FIRST_TEST_BLOCK_NUMBER,
  iface,
  L2_ESCROW_BALANCES_ARR,
  L2_SUPPLY_ARR,
  MOCK_DAI_L1_ADDR,
  MOCK_DAI_L2_ADDR,
  MOCK_FETCHER,
  MOCK_L1_ESCROW_ARB,
  MOCK_L1_ESCROW_OP,
} from "./test-constants";

describe("DAI bridged balance checker bot tests", () => {
  let mockProvider_l2 = new MockEthersProvider();
  let mockProvider_l1 = new MockEthersProvider();

  let handleBlock_l2: HandleBlock = provideHandleBlock_L2(
    ERC20_ABI,
    MOCK_DAI_L2_ADDR,
    mockProvider_l2 as unknown as ethers.providers.JsonRpcProvider
  );

  let handleBlock_l1: HandleBlock = provideHandleBlock_L1(
    MOCK_DAI_L1_ADDR,
    ERC20_ABI,
    MOCK_L1_ESCROW_ARB,
    MOCK_L1_ESCROW_OP,
    API_URL,
    MOCK_FETCHER,
    HEADERS,
    mockProvider_l1 as unknown as ethers.providers.JsonRpcProvider
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

  it("doesn't return a finding on L1 when the totalSupply on L2 is less than escrow balance", async () => {
    const TEST_BLOCK_NUMBER = 23;
    const TEST_BLOCK_TIMESTAMP = 16523773880;

    mockProvider_l1
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "totalSupply", {
        inputs: [],
        outputs: [L2_SUPPLY_ARR[1]],
      })
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_OP],
        outputs: [L2_ESCROW_BALANCES_ARR[0]],
      })
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_ARB],
        outputs: [L2_ESCROW_BALANCES_ARR[0]],
      })
      .setLatestBlock(TEST_BLOCK_NUMBER);

    mockProvider_l1.setNetwork(1001);

    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER).setTimestamp(TEST_BLOCK_TIMESTAMP);
    expect(await handleBlock_l1(blockEvent)).toStrictEqual([]);
  });

  it("returns a finding on L1 when the totalSupply on L2 is MORE than escrow balance for Arbitrum only", async () => {
    const TEST_BLOCK_NUMBER = 23;
    const TEST_BLOCK_TIMESTAMP = 16523773880;

    // mockProvider_l2 currently returns totalSupply of l2 as 456
    mockProvider_l1
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_OP],
        outputs: [L2_ESCROW_BALANCES_ARR[0]], // = 500, meanwhile the MOCK_FETCHER will return 456, so shouldn't emit an alert
      })
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_ARB],
        outputs: [L2_ESCROW_BALANCES_ARR[1]], // = 400, meanwhile the MOCK_FETCHER will return 456, so should emit an alert
      })
      .setLatestBlock(TEST_BLOCK_NUMBER);

    mockProvider_l1.setNetwork(1001);

    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER).setTimestamp(TEST_BLOCK_TIMESTAMP);
    expect(await handleBlock_l1(blockEvent)).toStrictEqual([getFindingL1("400", "456", "Arbitrum")]);
  });

  it("returns a finding on L1 when the totalSupply on L2 is MORE than escrow balance for Optimism only", async () => {
    const TEST_BLOCK_NUMBER = 23;
    const TEST_BLOCK_TIMESTAMP = 16523773880;

    // mockProvider_l2 currently returns totalSupply of l2 as 456
    mockProvider_l1
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_OP],
        outputs: [L2_ESCROW_BALANCES_ARR[1]], // = 400, meanwhile the MOCK_FETCHER will return 456, so should emit an alert
      })
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_ARB],
        outputs: [L2_ESCROW_BALANCES_ARR[0]], // = 500, meanwhile the MOCK_FETCHER will return 456, so shouldn't emit an alert
      })
      .setLatestBlock(TEST_BLOCK_NUMBER);

    mockProvider_l1.setNetwork(1001);

    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER).setTimestamp(TEST_BLOCK_TIMESTAMP);
    expect(await handleBlock_l1(blockEvent)).toStrictEqual([getFindingL1("400", "456", "Optimism")]);
  });

  it("returns two findings on L1 when the totalSupply on L2 is MORE than escrow balance for both Optimism and Arbitrum", async () => {
    const TEST_BLOCK_NUMBER = 23;
    const TEST_BLOCK_TIMESTAMP = 16523773880;

    // mockProvider_l2 currently returns totalSupply of l2 as 456
    mockProvider_l1
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_OP],
        outputs: [L2_ESCROW_BALANCES_ARR[1]] // = 400, and the MOCK_FETCHER will return 456, so should emit an alert
      })
      .addCallTo(MOCK_DAI_L1_ADDR, TEST_BLOCK_NUMBER, iface, "balanceOf", {
        inputs: [MOCK_L1_ESCROW_ARB],
        outputs: [L2_ESCROW_BALANCES_ARR[1]] // = 400, and the MOCK_FETCHER will return 456, so should emit an alert
      })
      .setLatestBlock(TEST_BLOCK_NUMBER);

    mockProvider_l1.setNetwork(1001);

    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER).setTimestamp(TEST_BLOCK_TIMESTAMP);
    expect(await handleBlock_l1(blockEvent)).toStrictEqual([
      getFindingL1("400", "456", "Optimism"),
      getFindingL1("400", "456", "Arbitrum"),
    ]);
  });
});
