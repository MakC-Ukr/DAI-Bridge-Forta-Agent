// const {fetch} = require("node-fetch")

// const API_URL = "https://api.forta.network/graphql";
// const QUER_TYPE = '';
// const CUSTOM_VARS = '';

// const func = async () => {
//     const resp = await fetch(API_URL, {
//         method: 'POST', headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//             query: `query recentAlerts {
//             alerts(
//               input: {
//                 first: 100
//                 blockDateRange: {
//                   startDate: "2022-07-29",
//                   endDate: "2022-07-29"
//                 }
//                 bots: [
//             "0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5"
//                 ]
//                 chainId: 1
//               }
//             ) {
//               pageInfo {
//                 hasNextPage
//               }
//               alerts {
//                 createdAt
//                 name
//                 protocol
//               }
//             }
//           }
//           `,
//             variables: {
//                 input: {
//                     bots: ["0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5"],
//                     first: 100,
//                     chainId: 1
//                 },
//             },
//         }),
//     });
//     const result = await resp.json();
//     console.log(result)
//     return result
// }

// func();



  // const resp = await fetch(API_URL, {
  //     method: 'POST', headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //         query: `query recentAlerts {
  //         alerts(
  //           input: {
  //             first: 100
  //             blockDateRange: {
  //               startDate: "2022-07-29",
  //               endDate: "2022-07-29"
  //             }
  //             bots: [
  //         "0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5"
  //             ]
  //             chainId: 1
  //           }
  //         ) {
  //           pageInfo {
  //             hasNextPage
  //           }
  //           alerts {
  //             createdAt
  //             name
  //             protocol
  //           }
  //         }
  //       }
  //       `,
  //         variables: {
  //             input: {
  //                 bots: ["0x5326aeca48c7306e1e628819a8f0336652bbaf9f6ec91c1075b7cedc375133c5"],
  //                 first: 100,
  //                 chainId: 1
  //             },
  //         },
  //     }),
  // });
  // const result = await resp.json();
  // console.log(result)
  // return result
