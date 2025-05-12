import {
  PROTOCOL_CONSTANTS,
  CircuitId,
  ProofType,
  AuthorizationRequestMessage,
  AtomicQueryV3PubSignals,
  byteEncoder,
} from "@0xpolygonid/js-sdk";
import { auth, resolver } from "@iden3/js-iden3-auth";
import * as path from "path";

// You can't change these values in the future,
// because if any of them is modified,
// a user who passes verification will produce a different nullifier ID and DID.
const nullifierID = "123456"; // change to your nullifier ID. Random int
const verifierDID =
  "did:iden3:privado:main:2Saj47Medtayrg4eygKp5KBmBTahFQAw353VyAzXQf";

const userNullifierMap = new Map<string, bigint>(); // Map to store response.from -> pubSignals.nullifier

async function createVerificationRequest(
  sessionId: string,
  sessionIdNumber: number
) {
  const requestMsg = auth.createAuthorizationRequest(
    "Uniqueness Verification",
    verifierDID,
    `${this.PRIVADO_REDIRECT_URI}?sessionId=${sessionId}`,
    {
      scope: [
        {
          circuitId: CircuitId.AtomicQueryV3,
          id: sessionIdNumber,
          params: {
            nullifierSessionId: nullifierID,
          },
          query: {
            allowedIssuers: [
              "did:iden3:privado:main:2ScrbEuw9jLXMapW3DELXBbDco5EURzJZRN1tYj7L7",
            ],
            context:
              "https://raw.githubusercontent.com/anima-protocol/claims-polygonid/main/schemas/json-ld/pou-v1.json-ld",
            type: "AnimaProofOfUniqueness",
          },
        },
      ],
    }
  );

  await this.saveSession(sessionId, {
    req: requestMsg,
  });

  return requestMsg;
}

async function verifyProof(
  token: string,
  request: AuthorizationRequestMessage
) {
  const resolvers: resolver.Resolvers = {
    "privado:main": new resolver.EthStateResolver(
      "https://rpc-mainnet.privado.id",
      "0x3C9acB2205Aa72A05F6D77d708b5Cf85FCa3a896"
    ),
  };
  const verifier = await auth.Verifier.newVerifier({
    stateResolver: resolvers,
    circuitsDir: path.join(__dirname, "./keys"),
  });

  const response = await verifier.fullVerify(token, request);

  // get nullifier from response by parsing the scope
  const nullifierProof = response.body.scope.find(
    (s) => s.circuitId == CircuitId.AtomicQueryV3 && this.sessionIdExists(s.id)
  );
  // parse proof public signals
  const pubSignals = new AtomicQueryV3PubSignals().pubSignalsUnmarshal(
    byteEncoder.encode(JSON.stringify(nullifierProof?.pub_signals))
  );

  const userIdentifier = response.from; // user identifier
  const nullifier = pubSignals.nullifier; // nullifier - unique number for user and his credential

  if (userNullifierMap.has(userIdentifier)) {
    const existingNullifier = userNullifierMap.get(userIdentifier);
    if (existingNullifier === nullifier) {
      throw new Error("User already registered with the same nullifier.");
    } else {
      throw new Error("Incorrect nullifier for the given user.");
    }
  } else {
    userNullifierMap.set(userIdentifier, nullifier);
    console.log("User successfully registered.");
  }
}
