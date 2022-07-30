# Alert bot to inform of total supply of DAI on Optimism

## Description

This bot returns the `totalSupply` of DAI tokens on Optimism chain. 

## Supported Chains

- Optimism

## Alerts

- OP_DAI_SUPPLY-1
  - Fired on every block
  - Severity is always set to "low" (mention any conditions where it could be something else)
  - Type is always set to "info" (mention any conditions where it could be something else)
  - Metadata includes:
    - `blockNumber`: block number on L2 when the alert was triggered
    - `blockHash` : block hash on L2 when the alert was triggered
    - `chainId` : chain ID of the L2
    - `totalSupplyDAI` : the returned value of total minted supply of DAI on the L2

## Test Data

The agent behaviour can be verified with the following blocks:
- 16714929