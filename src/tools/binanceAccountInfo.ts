import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { spotClient } from "../config/client.js";
interface UserAssetItem {
  asset: string;
  free: string;
  locked: string;
  btcValuation?: string;
}

const BTC_PRECISION = 20;

export function registerBinanceAccountInfo(server: McpServer) {
  server.tool(
    "binanceAccountInfo",
    "check binance account info",
    {},
    async ({}) => {
      try {
        const accountInfo = await spotClient.accountInformation();
        const accountSnapshot = await spotClient.dailyAccountSnapshot("SPOT", { limit: 7 });
        const userAsset = await spotClient.userAsset({ needBtcValuation: true })
        if (userAsset) {
          const balances = userAsset.map((item: UserAssetItem) => ({
            asset: item.asset, free: item.free, locked: item.locked
          }))
          const totalAssetOfBtc = userAsset.reduce((sum: number, item: UserAssetItem) => sum + parseFloat(item.btcValuation || "0"), 0).toFixed(BTC_PRECISION).replace(/\.?0+$/, "");
          accountSnapshot.snapshotVos.push({
            type: "spot",
            updateTime: Date.now(),
            data: {
              totalAssetOfBtc,
              balances,
            }
          })
        }
        const btcPrice = await spotClient.symbolPriceTicker({ symbol: "BTCUSDT" });
        return {
          content: [
            {
              type: "text",
              text: `Get binance account info successfully. data: ${JSON.stringify(accountInfo)}`,
            },
            {
              type: "text",
              text: `Get binance balance history info successfully. data: ${JSON.stringify(accountSnapshot)}`,
            },
            {
              type: "text",
              text: `Get BTC price successfully. data: ${JSON.stringify(btcPrice)}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            { type: "text", text: `Server failed: ${errorMessage}` },
          ],
          isError: true,
        };
      }
    }
  );
}