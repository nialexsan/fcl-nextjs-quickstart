import { config } from "@onflow/fcl";
import flowJSON from '../flow.json'

config({
  "app.detail.title": "Flow Next.js Quick Start",
  "app.detail.icon": "https://unavatar.io/twitter/muttonia",
  "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API,
  "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
  "flow.network": process.env.NEXT_PUBLIC_FLOW_NETWORK,
}).load({ flowJSON })
