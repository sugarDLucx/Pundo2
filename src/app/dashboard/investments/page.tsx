"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useProfileStore } from '@/store/profileStore';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Search, Loader2, LineChart } from 'lucide-react';

interface Asset {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  currency: string;
}

export default function InvestmentsPage() {
  const { t } = useLanguage();
  const profile = useProfileStore((state) => state.profile);
  
  const [showInBaseCurrency, setShowInBaseCurrency] = useState(true);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  
  const [marketIndices, setMarketIndices] = useState<Asset[]>([]);
  const [loadingIndices, setLoadingIndices] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Asset | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  // Fetch default market indices and leading assets
  useEffect(() => {
    async function fetchIndices() {
      try {
        const res = await fetch('/api/investments?tickers=^GSPC,^IXIC,^DJI,BTC-USD,ETH-USD,SOL-USD,AAPL,MSFT,NVDA,AMZN,GOOGL,META');
        if (res.ok) {
          const data = await res.json();
          setMarketIndices(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingIndices(false);
      }
    }
    fetchIndices();
  }, []);

  const getCurrencyCode = (symbol: string) => {
    switch (symbol) {
      case '₱': return 'PHP';
      case '€': return 'EUR';
      case '£': return 'GBP';
      case '¥': return 'JPY';
      case 'A$': return 'AUD';
      case 'C$': return 'CAD';
      case '$': return 'USD';
      default: return 'USD';
    }
  };

  // Fetch exchange rate based on user's base currency
  useEffect(() => {
    async function fetchExchangeRate() {
      if (!profile?.currency || profile.currency === '$') return;
      const targetCode = getCurrencyCode(profile.currency);
      try {
        const res = await fetch(`/api/investments?tickers=USD${targetCode}=X`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            setExchangeRate(data.data[0].regularMarketPrice);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate', err);
      }
    }
    fetchExchangeRate();
  }, [profile?.currency]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    setError('');
    try {
      const res = await fetch(`/api/investments?tickers=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setSearchResult(data.data[0]);
      } else {
        setError(t('Asset not found'));
        setSearchResult(null);
      }
    } catch (err) {
      setError(t('Failed to fetch asset data'));
    } finally {
      setSearching(false);
    }
  };

  const renderAssetCard = (asset: Asset) => {
    const isPositive = asset.regularMarketChange >= 0;
    
    let displayPrice = asset.regularMarketPrice;
    let displayChange = asset.regularMarketChange;
    let displaySymbol = asset.currency === 'USD' ? '$' : asset.currency;

    if (showInBaseCurrency && profile?.currency && profile.currency !== '$' && exchangeRate !== null && asset.currency === 'USD') {
      displayPrice = asset.regularMarketPrice * exchangeRate;
      displayChange = asset.regularMarketChange * exchangeRate;
      displaySymbol = profile.currency;
    } else if (!showInBaseCurrency && profile?.currency && profile.currency !== '$' && exchangeRate !== null && asset.currency !== 'USD') {
      // Approximate back to USD if native currency matches user base currency
      if (asset.currency === getCurrencyCode(profile.currency)) {
        displayPrice = asset.regularMarketPrice / exchangeRate;
        displayChange = asset.regularMarketChange / exchangeRate;
        displaySymbol = '$';
      }
    }

    return (
      <Card key={asset.symbol} className="p-6 bg-surface/50 border border-border/40 hover:shadow-md transition-all flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-foreground text-lg">{asset.symbol}</h3>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{asset.shortName}</p>
          </div>
          <div className={cn("p-2 rounded-full", isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        </div>
        <div>
          <div className="font-playfair text-3xl font-bold text-foreground flex items-baseline gap-1">
            <span className="text-xl text-muted-foreground">{displaySymbol}</span>
            {displayPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className={cn("text-sm font-semibold mt-1", isPositive ? "text-green-500" : "text-red-500")}>
            {isPositive ? '+' : ''}{displayChange?.toFixed(2)} ({asset.regularMarketChangePercent?.toFixed(2)}%)
          </p>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-8">
        <h1 className="font-playfair text-4xl font-bold text-primary tracking-tight">{t("Investments")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("Track real-time market data and your favorite assets.")}</p>
      </header>

      <section>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="font-playfair text-2xl font-bold text-foreground">{t("Market Overview")}</h2>
          {profile?.currency && profile.currency !== '$' && exchangeRate !== null && (
            <div className="flex items-center gap-3 bg-surface/50 px-4 py-2 rounded-full border border-border/40">
              <span className="text-sm font-medium text-muted-foreground">
                {t("Show in")} {profile.currency}
              </span>
              <button 
                onClick={() => setShowInBaseCurrency(!showInBaseCurrency)} 
                aria-label="Toggle Base Currency"
                className={cn("w-10 h-5 rounded-full relative transition-colors duration-200", showInBaseCurrency ? 'bg-primary' : 'bg-border/60')}
              >
                <span className={cn("absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 shadow-sm", showInBaseCurrency ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loadingIndices ? (
            Array(12).fill(0).map((_, i) => (
              <Card key={i} className="p-6 h-36"><Skeleton className="w-full h-full" /></Card>
            ))
          ) : (
            marketIndices.map(renderAssetCard)
          )}
        </div>
      </section>

      <section className="mt-12">
        <Card className="p-6 lg:p-8 bg-surface/30 border border-border/40">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-1/3">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <LineChart className="w-6 h-6" />
                </div>
                <h2 className="font-playfair text-2xl font-bold text-foreground">{t("Asset Lookup")}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {t("Search for any stock ticker or cryptocurrency symbol to view its current price and daily performance.")}
              </p>
              
              <form onSubmit={handleSearch} className="flex gap-2 w-full relative">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    id="assetSearch"
                    name="assetSearch"
                    placeholder="AAPL, TSLA, ETH-USD..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    className="w-full h-11 pl-10 pr-4 rounded-md border border-border/40 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={searching || !searchQuery.trim()}
                  className="h-11 px-6 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Search")}
                </button>
              </form>
              {error && <p className="text-destructive text-sm mt-3 font-medium">{error}</p>}
            </div>

            <div className="w-full lg:w-2/3">
              {searchResult ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderAssetCard(searchResult)}
                </div>
              ) : (
                <div className="h-full min-h-[150px] border-2 border-dashed border-border/60 rounded-xl flex items-center justify-center text-muted-foreground bg-background/50">
                  {t("Search for an asset to view details")}
                </div>
              )}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
