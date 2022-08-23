import { BlockEvent, HandleBlock } from "forta-agent";
import { MockEthersProvider, TestBlockEvent } from "forta-agent-tools/lib/test";
import { provideHandleBlock_L1 } from "./agent-l1";
import {
  API_URL,
  ERC20_ABI,
  HEADERS,
  iface,
  L2_ESCROW_BALANCES_ARR,
  L2_SUPPLY_ARR,
  MOCK_DAI_L1_ADDR,
  MOCK_L1_ESCROW_ARB,
  MOCK_L1_ESCROW_OP,
  MOCK_FETCHER_DATA
} from "./utils";
import { ethers } from "ethers";

describe("DAI bridged balance checker bot tests", () => {
  let mockProvider_l1 = new MockEthersProvider();

  const mockFetcher = {
    getAlertData: jest.fn(() => Promise.resolve({ totalSupplyDai: MOCK_FETCHER_DATA })),
  };
  let handleBlock_l1: HandleBlock = provideHandleBlock_L1(
    MOCK_DAI_L1_ADDR,
    ERC20_ABI,
    MOCK_L1_ESCROW_ARB,
    MOCK_L1_ESCROW_OP,
    API_URL,
    mockFetcher,
    HEADERS,
    mockProvider_l1 as unknown as ethers.providers.JsonRpcProvider
  );

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
    expect(mockFetcher.getAlertData).toHaveBeenCalled();
  });
});
