import {
  PROTOCOL_CONSTANTS,
  CircuitId,
  ProofType,
  AuthorizationRequestMessage,
  AtomicQueryV3PubSignals,
  byteEncoder
} from '@0xpolygonid/js-sdk';
import { auth, resolver } from '@iden3/js-iden3-auth';
import * as path from 'path'

async function main() {


  const zkRequestId = 1747400226;
   // example of request
  const request: AuthorizationRequestMessage = {
    id: '7d22275a-b518-45bb-8ee1-85e12abd8532',
    typ: PROTOCOL_CONSTANTS.MediaType.PlainMessage,
    type: PROTOCOL_CONSTANTS.PROTOCOL_MESSAGE_TYPE.AUTHORIZATION_REQUEST_MESSAGE_TYPE,
    thid: '7d22275a-b518-45bb-8ee1-85e12abd8532',
    body: {
      callbackUrl: 'http://localhost:8080/callback?id=1234442-123123-123123',
      reason: 'reason',
      scope: [
        {
          "circuitId": CircuitId.AtomicQueryV3,
          "id": zkRequestId,
          "params": {
            "nullifierSessionId": "2882484"
          },
          "query": {
            "allowedIssuers": [
              "*"
            ],
            "context": "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v4.jsonld",
            "credentialSubject": {
              "birthday": {
                "$lt": 24041999
              }
            },
            "groupId": 1747255601,
            "type": "KYCAgeCredential"
          }
        }
      ]
    },
    from: 'did:iden3:polygon:amoy:xCkXubP2T1zsUQpFLwczwfbWpdBYBxmJDtUTWAUCE'
  };

  const resolvers: resolver.Resolvers = {
    'privado:main': new resolver.EthStateResolver("https://rpc-mainnet.privado.id","0x3C9acB2205Aa72A05F6D77d708b5Cf85FCa3a896"),
    'polygon:amoy': new resolver.EthStateResolver("<RPC-URL>", "0x1a4cC30f2aA0377b0c3bc9848766D90cb4404124"),
  };
  const verifier = await auth.Verifier.newVerifier({
    stateResolver: resolvers,
    circuitsDir: path.join(__dirname, './keys')
  });


  const token =
    'eyJhbGciOiJncm90aDE2IiwiY2lyY3VpdElkIjoiYXV0aFYyIiwiY3JpdCI6WyJjaXJjdWl0SWQiXSwidHlwIjoiYXBwbGljYXRpb24vaWRlbjMtemtwLWpzb24ifQ.eyJpZCI6IjY4ZDhiNjg4LTA4NDQtNDE3ZC1hM2QxLTc1YzRiMmFmOWFmNiIsInR5cCI6ImFwcGxpY2F0aW9uL2lkZW4zLXprcC1qc29uIiwidHlwZSI6Imh0dHBzOi8vaWRlbjMtY29tbXVuaWNhdGlvbi5pby9hdXRob3JpemF0aW9uLzEuMC9yZXNwb25zZSIsInRoaWQiOiI0MzlkM2VlMC0yNmUwLTQ1MWItOWYxNy0zMjQ1YzM1ZDE4MmUiLCJib2R5Ijp7InNjb3BlIjpbeyJpZCI6MTc0NzQwMDIyNiwiY2lyY3VpdElkIjoiY3JlZGVudGlhbEF0b21pY1F1ZXJ5VjMtYmV0YS4xIiwicHJvb2YiOnsicGlfYSI6WyIxMjQ5MzQ2MzEwNzc4NzYxMTExNTE2ODE5NTcwODYxMzU4MzIzNjU1Mjc3OTgxMzM1MjM0ODg4ODI2MDI3NDg4OTM0ODU2MTQxOTIxNSIsIjI0Mzg1MjkwODU1Mjk3MTc1MDAwNjM5ODE5MTk0MDY2NzcxMTE3NDYyODY3NzMwNTg0NDg0OTc5NTg0NTU5ODUyMzc4MjM3Mzc3NiIsIjEiXSwicGlfYiI6W1siMjAzMzMzNTQ2NDI1MjgyNTI3MDA0MjU1ODU5NTAyNTM5MjM3MjA4MTk0MjAyNjMyNTczMjg4MjMwMTQyMDU1MTQ4NTg4MDE1NzQ1NDEiLCIxMTYxNjMxODc3OTE4Nzc5OTc1NjEwMzg0MDUzNDU3OTA2NDAwODU2ODU2NTcwNDA2MTkyNzM2OTc0MzcxMzEyNzA4MjIzMjQwMTk0OSJdLFsiMTQ3NjM3NDI1NjMyMzgyNzE4NjI2ODQ3NTc3MDQ0NDQ1MDU5NDk1ODU3MzE5ODAzOTM5ODMzMDQ2NzgxNzE5NTc0MzQzODY4MjI4MDIiLCIxOTMwOTcxMDgxNzE3NDkyMzUwNTQwNjM1NjY0NDI1MjMwNTgzNTk2ODMyNDY1ODYxNDIxMTE4MTY4NTQ3NDQzNDY2OTI2MTE0OTAzMSJdLFsiMSIsIjAiXV0sInBpX2MiOlsiMTkxNTU3ODc5MjAwMzAzODQ3MTk1NzkwMDYwOTI1ODIwMjA3MjM5MDY1Mzg2Nzg0MDUwOTIwNDc0MTUyNTYzMTUxNzAyMjc3MTA4NzQiLCI3NDkxMTgyNDY2MjQxODM4ODE5NTM1MTA0NTI1ODk0MzE2OTY0MDE2MjAxMjA2MDQ5Mzc0MDQ0Mzg3NTE2MzA1NDc5Mzc1MTQ0OTQ2IiwiMSJdLCJwcm90b2NvbCI6Imdyb3RoMTYiLCJjdXJ2ZSI6ImJuMTI4In0sInB1Yl9zaWduYWxzIjpbIjEiLCIyNzYwMjc3MTA4MDQzNTM1NzE4Nzk5ODY2OTQxNDUxMDUxNDExMDAwMDI2MjI1NDc2NjYxMjM4OTM5NDM1MzE4MzM3NTEzOTA3MyIsIjExMzMxMDMxMTU0MTA4NzMyNDQ0MDA2NTgyNTcyOTUwODMzMzM0MjUzMjU2NDM1ODkxODc5MjkxNTM0MTIwNTU1NTg4MDg5NTcwMDc3IiwiMjAyODUwMjg0NzUzMzA2MzY3NzY4MTUyNzMxMjU2ODAxODA0NDc4MTM3NjUzNTYwNzcyMjI1MTEyOTM5NTIzMzk2NTE2MTkzNDA4NDIiLCIxNzQ3NDkwMDY3MzkyNDI4MDk3Mjk5NjM5MzE1MTE4OTUwMTkxMDc0NzYzMTYyMzYzMTY2MTk4OTUzODI4MDY5OTMyODUzNDkwNzQwIiwiMCIsIjEiLCIxNzQ3NDAwMjI2IiwiMjI2NDUzMDUxNDU5MDY3MTkzMjIwMzY1MjkwODc3ODY1NTM4ODk1MDc4MzQ0OTA4MDAwNTc3OTgxOTIwMTYzMTg0NzEzNDQ4OTciLCIxIiwiMTE2ODI0MTYyNjA5NzIzNTY4Njk2Njc1NDA2NzU3NTQ4MzY3OTc2MDI3NDQzMzI2ODE3NDI4NTAwOTc4MzY3ODE1MzM4Njk2ODczNjciLCIxNzQ3MDUyMzMzIiwiMjY3ODMxNTIxOTIyNTU4MDI3MjA2MDgyMzkwMDQzMzIxNzk2OTQ0IiwiMjAzNzYwMzM4MzIzNzExMDkxNzc2ODMwNDg0NTYwMTQ1MjU5MDUxMTkxNzM2NzQ5ODU4NDM5MTU0NDU2MzQ3MjYxNjc0NTA5ODk2MzAiLCIwIiwiMiIsIjI0MDQxOTk5IiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMCIsIjAiLCIwIiwiMSIsIjI2ODA3NjYxOTM5MjY5ODM1Nzc2MzQ0NzQwMjQwNDQ0NzQ1MTE2MDkzODkxOTY4MjE0NDk0MDYxOTY3MDc0ODg0MDMxODEyMzUzIiwiMjg4MjQ4NCJdfV19LCJmcm9tIjoiZGlkOmlkZW4zOnByaXZhZG86bWFpbjoyU2ZzZG5tUUJ5NWpMUXFUdTNqY0c2Z0VEdkxGNUxOMkt0VFRjeE5OdjIiLCJ0byI6ImRpZDppZGVuMzpwb2x5Z29uOmFtb3k6eENrWHViUDJUMXpzVVFwRkx3Y3p3ZmJXcGRCWUJ4bUpEdFVUV0FVQ0UifQ.eyJwcm9vZiI6eyJwaV9hIjpbIjE4ODUzNTEzMTkyMjI4MDI0NjY5MzkyODYzMDEwMTI4NjQzMDA1NDMyMTYzMzQ1MDY2NzEzNzQ0NTY0OTkyNjgxNzkxNjQ5NTcxMzgiLCIxODU3MzU1NjUwMTY5NTQ0NzE3MDQ2NTYxNTMzMTAyNzI4NTM0NDg0NjA2ODkzMzIwODYxMzcxNzQ5MjUxNTc5MzExMDE3MzU3ODUxMCIsIjEiXSwicGlfYiI6W1siMzMxOTEwMTU4ODU4ODU2NDg3NTQ3MzIxMjM3ODc2OTE4ODI3NzA4MjQ2ODAxMjkwNDgwNjM1MjcwMzc0MjI5NTI5Mzc5NjY2MTU5OCIsIjExOTEyMDkyODY1ODUxODYxMDQxOTgyMTEzNzU3Njc2ODMzNzc4Njc2NjIxNjg3NzE3MDA1ODY5NjM5OTM0MjU0NzIxMDQ3Mzg2MTg5Il0sWyIxMjk0MjMzMDU2MTk4MDExNzYxODM2OTUzMzIzODYzMDY4MzE5NzAyMzA2MjY0MzYzNDIxOTg4MzI1MTYyMTEyNjEwNjg2NDcwMTE4NSIsIjE5OTEyOTQzNTA2NDYwMDU1MTUxOTc4NDgzMDY3NzQxNDM5NDU1MzgzMDI4MTcxMjc0Nzk1ODU0Mjc5MTk5NjkyNDk5NTQwNjU3NjM5Il0sWyIxIiwiMCJdXSwicGlfYyI6WyIxNjAwNTM2Mjk0MDU2NDQ3NjI4MTQwOTUxNTEzOTI2NDMzNjgwNTUzNjcxMDQ1OTQyMjMxMTkxMDkxMDA3NjU0NjM0MTM3MzE3ODkxNSIsIjg4MzE4MzQ5NzE4MTY2MjI2MjM1NTQ0MDIyMTE3MjM4MTg2OTg3OTgwNDE0MDUxOTYyOTQ5MzAyNjE0NjU4NDc5NjIzNzU1OTU5OTciLCIxIl0sInByb3RvY29sIjoiZ3JvdGgxNiIsImN1cnZlIjoiYm4xMjgifSwicHViX3NpZ25hbHMiOlsiMjc2MDI3NzEwODA0MzUzNTcxODc5OTg2Njk0MTQ1MTA1MTQxMTAwMDAyNjIyNTQ3NjY2MTIzODkzOTQzNTMxODMzNzUxMzkwNzMiLCIxODQ4MTY1OTQ3MjAxNzA2MzQ3MDUwMTI0NjAyMDk1MDM4MDYzMTQ4ODc2ODU3ODE3Mjk4Nzc1MTU3MzAyNTIzODQzMjU4MjU2OTUxNCIsIjAiXX0';

  const response = await verifier.fullVerify(token, request);

  // get nullifier from response by parsing the scope
  const nullifierProof = response.body.scope.find(
    (s) => s.circuitId == CircuitId.AtomicQueryV3 && s.id == zkRequestId
  );
  // parse proof public signals
  const pubSignals = new AtomicQueryV3PubSignals().pubSignalsUnmarshal(
    byteEncoder.encode(JSON.stringify(nullifierProof?.pub_signals))
  );

  console.log(pubSignals.nullifier); // nullifier - unique number for user and his credential. Same nullifier can be presented only by the same did, and can not be presented twice!
  console.log(response.from); // user identifier

}

(async function () {
  await main();
})();
