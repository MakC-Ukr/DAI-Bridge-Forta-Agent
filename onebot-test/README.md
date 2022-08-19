# DAI bridged balance checker

## Description

This bot checks if the L2 total supply of DAI is less than the amount of DAI deposited on L1 escrow for MakerDAO

## Supported Chains

- Ethereum
- Optimism
- Arbitrum

## Alerts

Describe each of the type of alerts fired by this bot

- dai-bridge-bot
  - Fired when the total supply of DAI minted on L2 (Arbitrum/Optimism) becomes more than the amount of DAI locked in the respective L1 escrow
  - Severity is always set to "High" 
  - Type is always set to "Exploit" 
  - metadata includes the following information:
  - `l2_chainName`: L2 chain name
  - `escrowBal`: Balance of escrow on L1
  - `l2_totalSupply`: total supply of DAI on the mentioned L2


- DAI-balance-update
  - Fired when the total supply of DAI minted on L2 (Arbitrum/Optimism) changes
  - Severity is always set to "Low" 
  - Type is always set to "Info" 
  - metadata includes the following information:
    - `totalSupplyDAI`: the new total supply of DAI on the L2 chain
    - `prevTotalSupply`: the new total supply of DAI on the L2 chain


## Test Data

The bot behaviour can be verified with the following blocks:
15370688