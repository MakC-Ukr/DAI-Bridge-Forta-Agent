import { utils } from "ethers";
import { createAddress, NetworkManager } from "forta-agent-tools";
import { Finding, FindingSeverity, FindingType } from "forta-agent";
import { ERC20_ABI } from "./constants";

// MockFetcher class
export class Fetcher {
  retData = MOCK_FETCHER_DATA;

  // variable names intentionally left unused
  getAlertData(apiUrl: string, querySent: string, headers: {}) {
    return Promise.resolve({ totalSupplyDai: this.retData });
  }
}

export const MOCK_FETCHER_DATA = "456";
export const MOCK_FETCHER: Fetcher = new Fetcher();
export const MOCK_DAI_L2_ADDR: string = createAddress("0x81");
export const MOCK_DAI_L1_ADDR: string = createAddress("0x29");
export const MOCK_L1_ESCROW_OP: string = createAddress("0x03");
export const MOCK_L1_ESCROW_ARB: string = createAddress("0x57");
export const iface: utils.Interface = new utils.Interface(ERC20_ABI);
export const FIRST_TEST_BLOCK_NUMBER = 20;
export const L2_SUPPLY_ARR: number[] = [123, 420];
export const L2_ESCROW_BALANCES_ARR: number[] = [500, 400];
