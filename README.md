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


### Bots
There are 2 bots deployed on two L2's: one is [deployed](https://explorer.forta.network/bot/0xe83234e6d5182610b4165bccb1b0dcf29c4582a18cf0c097bfc1d056edbe07b3) on Arbitrum and the other is [deployed](https://explorer.forta.network/bot/0x4ee97e15449fe5c14fd556f2b8a51a41f826f9c8df189d4328e92fa955a703dd) on Optimism. The respective bots' code is in `./L2-bot-arbitrum` and `./L2-bot-optimism` repositories. The main router bot is [deployed](https://explorer.forta.network/bot/0xda07e20f41b66467c8e16dbfda9ed047570a4dd43becf760d54db866695427ca) for mainnet and is the one that issues the High Severity alerts when the condition mentioned above becomes true.
