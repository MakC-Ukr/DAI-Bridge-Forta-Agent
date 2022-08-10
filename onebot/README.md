# DAI bridged balance checker

## Description

This bot checks if the L2 total supply of DAI is less than the amount of DAI deposited on L1 escrow for MakerDAO

## Supported Chains

- Ethereum
- Optimism
- Arbitrum

## Alerts

Describe each of the type of alerts fired by this bot

- DAI_BALANCE-1
  - Fired when the total supply of DAI minted on L2 (Arbitrum/Optimism) becomes more than the amount of DAI locked in the respective L1 escrow
  - Severity is always set to "High" 
  - Type is always set to "Exploit" 
  - metadata includes the following information:
  - `escrowBal`: Balance of escrow on L1
  - `L2_chainName`: L2 chain name
  - `l2_totalSupply`: total supply of DAI on the mentioned L2


- ARB_DAI_SUPPLY-1
  - Fired when the total supply of DAI minted on Arbitrum changes
  - Severity is always set to "Low" 
  - Type is always set to "Info" 
  - metadata includes the following information:
    - `escrowBal`: Balance of escrow on L1
    - `L2_sup` : supply of DAI on L2
    - `L2_chainId`: L2 chain Id on which the potential exploit happened
    - `L2_chainName`: L2 chain name on which the potential exploit happened
  
  
- OP_DAI_SUPPLY-1
  - Fired when the total supply of DAI minted on Optimism changes
  - Severity is always set to "Low" 
  - Type is always set to "Info" 
  - metadata includes the following information:
    - `escrowBal`: Balance of escrow on L1
    - `L2_sup` : supply of DAI on L2
    - `L2_chainId`: L2 chain Id on which the potential exploit happened
    - `L2_chainName`: L2 chain name on which the potential exploit happened

## Test Data

The bot behaviour can be verified with the following blocks:
15243057