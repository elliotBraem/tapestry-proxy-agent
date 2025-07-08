import * as FastIntear from "fastintear";

export const NETWORK_ID = import.meta.env.PUBLIC_NETWORK || "testnet";

export const near: typeof FastIntear =
  typeof window !== "undefined" && window.near
    ? window.near // in browser
    : (FastIntear.config({ networkId: NETWORK_ID }), FastIntear); // on server
