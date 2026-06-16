import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers');

  if (!tickers) {
    return NextResponse.json({ error: 'Tickers parameter is required' }, { status: 400 });
  }

  const tickerArray = tickers.split(',').map(t => t.trim().toUpperCase());

  try {
    const results = await Promise.all(
      tickerArray.map(async (ticker) => {
        try {
          const quote: any = await yahooFinance.quote(ticker);
          return {
            symbol: quote.symbol,
            shortName: quote.shortName,
            regularMarketPrice: quote.regularMarketPrice,
            regularMarketChange: quote.regularMarketChange,
            regularMarketChangePercent: quote.regularMarketChangePercent,
            currency: quote.currency
          };
        } catch (err) {
          console.error(`Error fetching ${ticker}:`, err);
          return null;
        }
      })
    );

    const validResults = results.filter(r => r !== null);
    return NextResponse.json({ data: validResults });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
