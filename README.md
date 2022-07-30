# DAI Bridge Challenge

Repository for challenge 3 (Nethermind Forta Onboarding). 
The goal of this repo is to create a bot that monitors the following invariant on both Optimism and Arbitrum (L2s) and that emits an alert when it is violated.

```
L1DAI.balanceOf(L1Escrow) ≥ L2DAI.totalSupply()
```

### Relevant data:

- [Optimism: L1Escrow](https://etherscan.io/address/0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65) and [Arbitrum: L1Escrow](https://etherscan.io/address/0xA10c7CE4b876998858b1a9E12b10092229539400#code)
- [Forta API docs](https://docs.forta.network/en/latest/api/)
- [General Agents Module](https://github.com/NethermindEth/general-agents-module)

### Goals:

- Understand the relationship between L1 and L2 and figure out a way to communicate between the two.
- Make the bot emit the appropriate alerts on L1 and on L2.
- Avoid using a hardcoded endpoint
- Improve the performance of the bot as much as possible.