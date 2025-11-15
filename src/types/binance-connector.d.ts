declare module '@binance/connector' {
  export class Spot {
    constructor(apiKey?: string, apiSecret?: string, options?: { baseURL?: string });
    accountInformation(): Promise<any>;
    dailyAccountSnapshot(type: string, options?: { limit?: number; startTime?: number; endTime?: number }): Promise<any>;
    userAsset(options?: { needBtcValuation?: boolean }): Promise<any>;
    symbolPriceTicker(options?: { symbol?: string }): Promise<any>;
    newOrder(symbol: string, side: string, type: string, options?: any): Promise<any>;
    orderBook(symbol: string, options?: { limit?: number }): Promise<any>;
  }
}
