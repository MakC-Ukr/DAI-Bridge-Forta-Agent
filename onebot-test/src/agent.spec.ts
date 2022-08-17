import {
  BlockEvent,
  Finding,
  FindingSeverity,
  FindingType,
  getEthersProvider,
  HandleBlock,
  Initialize,
  TransactionEvent,
} from "forta-agent";
import { MockEthersProvider, TestBlockEvent, TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress, NetworkManager, ProviderCache } from "forta-agent-tools";
import { NetworkData, provideHandleBlock, provideInitialize } from "./agent";
import { provideHandleBlock_L1 } from "./agent-l1";
import { provideHandleBlock_L2 } from "./agent-l2";
import { API_URL, ERC20_ABI, HEADERS } from "./constants";
import { ethers, utils } from "ethers";

const MOCK_DAI_L2_ADDR: string = createAddress("0x81");
const MOCK_DAI_L1_ADDR: string = createAddress("0x29");
const MOCK_L1_ESCROW_OP: string = createAddress("0x03");
const MOCK_L1_ESCROW_ARB: string = createAddress("0x57");
const iface: utils.Interface = new utils.Interface(ERC20_ABI);
const FIRST_TEST_BLOCK_NUMBER = 20;
const L2_SUPPLY_ARR: number[] = [123, 420, 1000];
const L2_ESCROW_BALANCES_ARR: number[] = [150, 500, 990];

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
    HEADERS,
    mockProvider_l1 as unknown as ethers.providers.JsonRpcProvider
  );

  const TEST_NM_DATA: Record<number, NetworkData> = {
    // @dev L2 equivalent chain
    1010: {
      findingsArrayFunc: handleBlock_l2,
    },
    // @dev L1 equivalent chain
    1001: {
      findingsArrayFunc: handleBlock_l1,
    },
  };

  const networkManager_OP = new NetworkManager(TEST_NM_DATA);
  // networkManager_OP.setNetwork(1001);


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
      Finding.fromObject({
        alertId: "L2_DAI_SUPPLY",
        description: "Returns the total supply of L2 DAI tokens",
        metadata: {
          prevTotalSupply: "0",
          totalSupplyDAI: L2_SUPPLY_ARR[0].toString(),
        },
        name: "DAI-balance-update",
        protocol: "MakerDAO",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
      }),
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
      Finding.fromObject({
        alertId: "L2_DAI_SUPPLY",
        description: "Returns the total supply of L2 DAI tokens",
        metadata: {
          prevTotalSupply: L2_SUPPLY_ARR[0].toString(),
          totalSupplyDAI: L2_SUPPLY_ARR[1].toString(),
        },
        name: "DAI-balance-update",
        protocol: "MakerDAO",
        severity: FindingSeverity.Low,
        type: FindingType.Info,
      }),
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

    mockProvider_l1.setNetwork(
      1001
    );

    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(TEST_BLOCK_NUMBER).setTimestamp(TEST_BLOCK_TIMESTAMP);
    expect(await handleBlock_l1(blockEvent)).toStrictEqual([]);
  });


});
