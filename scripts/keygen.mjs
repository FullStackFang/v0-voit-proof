import { exportJWK, generateKeyPair } from "jose";

// Prints a new private Ed25519 signing key as one line, for VOIT_SIGNING_KEY in .env.
const { privateKey } = await generateKeyPair("EdDSA", { crv: "Ed25519", extractable: true });
const jwk = { ...(await exportJWK(privateKey)), kid: new Date().toISOString().slice(0, 10) };
console.log(`VOIT_SIGNING_KEY=${JSON.stringify(jwk)}`);
