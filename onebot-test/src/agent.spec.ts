import { BlockEvent, getEthersProvider, HandleBlock, Initialize, TransactionEvent } from "forta-agent";
import { MockEthersProvider, TestBlockEvent, TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress, NetworkManager, ProviderCache } from "forta-agent-tools";
import { NetworkData, provideHandleBlock, provideInitialize } from "./agent";
import { provideHandleBlock_L1 } from "./agent-l1";
import { provideHandleBlock_L2 } from "./agent-l2";
import { API_URL, ERC20_ABI, HEADERS } from "./constants";
import { utils } from "ethers";

const MOCK_DAI_L2_ADDR: string = createAddress("0x81");
const iface: utils.Interface = new utils.Interface(ERC20_ABI);

const TEST_NM_DATA: Record<number, NetworkData> = {
  1010: {
    findingsArrayFunc: provideHandleBlock_L2(ERC20_ABI, MOCK_DAI_L2_ADDR),
  },
};

describe("DAI supply underflow detection bot", () => {
  const networkManager_OP = new NetworkManager(TEST_NM_DATA);
  networkManager_OP.setNetwork(1010);

  let mockProvider = new MockEthersProvider().addCallTo(MOCK_DAI_L2_ADDR, 20, iface, "totalSupply", {
    inputs: [],
    outputs: [123],
  });

  let handleInit: any = provideInitialize;
  let handleBlock: HandleBlock = provideHandleBlock(networkManager_OP);

  it("returns a finding on Optimism when first deployed", async () => {
    await handleInit(networkManager_OP, mockProvider);
    const blockEvent: BlockEvent = new TestBlockEvent().setNumber(20);
    console.log(await handleBlock(blockEvent));
  });
});
