curl --request POST \
    --header 'content-type: application/json' \
    --url 'https://api.forta.network/graphql' \
    --data '{"query":"query recentAlerts {\n  alerts(\n    input: {\n      first: 5\n      bots: [\n        \"0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5\"\n      ]\n      createdSince: 0\n      chainId: 1\n    }\n  ) {\n    pageInfo {\n      hasNextPage\n      endCursor {\n        alertId\n        blockNumber\n      }\n    }\n    alerts {\n      createdAt\n      name\n      protocol\n      findingType\n      source {\n        transactionHash\n        block {\n          number\n          chainId\n        }\n        bot {\n          id\n        }\n      }\n      severity\n      metadata\n      scanNodeCount\n    }\n  }\n}","variables":{}}'


    query recentAlerts {
        alerts(
          input: {
            first: 100
            blockDateRange: {
              startDate: "2022-07-29",
              endDate: "2022-07-29"
            }
            bots: [
        "0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5"
            ]
            chainId: 1
          }
        ) {
          pageInfo {
            hasNextPage
          }
          alerts {
            createdAt
            name
            protocol
          }
        }
      }

      
      