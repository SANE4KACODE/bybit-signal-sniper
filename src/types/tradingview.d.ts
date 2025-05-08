
interface TradingViewWidgetOptions {
  symbol: string;
  width?: number | string;
  height?: number | string;
  interval?: string;
  timezone?: string;
  theme?: string;
  style?: string;
  locale?: string;
  toolbar_bg?: string;
  enable_publishing?: boolean;
  save_image?: boolean;
  container_id?: string;
  hide_top_toolbar?: boolean;
  hide_legend?: boolean;
  studies?: string[];
  autosize?: boolean;
  withdateranges?: boolean;
}

interface TradingView {
  widget: new (options: TradingViewWidgetOptions) => any;
}

declare global {
  interface Window {
    TradingView: TradingView;
  }
}

export {};
