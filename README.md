# Large Tether Transfer Agent

## Description

This agent **detects the following condition** for the DAI token Bridge recently launched onO Optimism: 
`L1DAI.balanceOf(L1Escrow) ≥ L2DAI.totalSupply()`

## Supported Chains

- Ethereum/Optimism
- Ethereum/Arbitrum

In order to change to Arbitrum, the `OPvsARB` variable (line 19) in `./src/agent.ts` showuld be set to `false`.
In order to change to Optimism, the `OPvsARB` variable (line 19) in `./src/agent.ts` showuld be set to `true`.

## Alerts

Describe each of the type of alerts fired by this agent

- OP_DAI_BRIDGE-1
  - Fired when the condition `L1DAI.balanceOf(L1Escrow) ≥ L2DAI.totalSupply()` holds true for an Ethereum block
  - Severity is always set to "High" 
  - Type is always set to "Suspicious"
## Test Data

The agent behaviour can be verified with the following transactions:

- 0x3a0f757030beec55c22cbc545dd8a844cbbb2e6019461769e1bc3f3a95d10826 (15,000 USDT)
