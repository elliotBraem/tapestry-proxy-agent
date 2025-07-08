# Tapestry Proxy Agent

A TEE proxy server for NEAR signature verification and MPC account management (use the [Tapestry SDK](https://docs.usetapestry.dev/) with a NEAR wallet).

The server accepts [NEP-413](https://github.com/near/NEPs/blob/master/neps/nep-0413.md?plain=1) signed messages from the [playground UI](./playground/), verifies them using [near-sign-verify](https://github.com/elliotBraem/near-sign-verify) on the proxy server, and subsequently creates & manages a Solana account controlled by Multi-Party Computation (MPC), in order to leverage the [Tapestry SDK](https://docs.usetapestry.dev/).

This implementation is an extension of the [Shade Agent Sandbox](https://docs.near.org/ai/shade-agents/sandbox/sandbox-deploying).

## Local Development

1.  **Configure Environment:**
    Rename `.env.development.local.example` to `.env.development.local` and populate it with your environment variables.

2.  **Initialize Repository:**
    The following command will prompt for your `sudo password` to configure the necessary host entries.
    ```bash
    bun run init
    ```

3.  **Start Development Server:**
    In a new terminal, install dependencies and launch the development server.
    ```bash
    bun install
    bun run dev
    ```

---

## TEE Deployment 

1.  **Configure Contract ID:**
    In your environment settings, update the `NEXT_PUBLIC_contractId` to be prefixed with `ac.sandbox.` followed by your NEAR account ID.

2.  **Deploy to TEE:**
    This command initiates the deployment to the Phala TEE. You will be prompted for your `sudo password`, and the process takes approximately 5 minutes.
    ```bash
    bun run deploy
    ```

3.  **Access Your Deployment:**
    -   Navigate to your Phala Cloud dashboard at [cloud.phala.network/dashboard](https://cloud.phala.network/dashboard).
    -   After the deployment completes, select your deployment.
    -   Open the `Network` tab and access the endpoint running on port `3000`.
