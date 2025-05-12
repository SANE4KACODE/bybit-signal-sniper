
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoinglassWidgetProps {
  symbol?: string;
  timeFrame?: string;
  type?: "funding" | "liquidations" | "openInterest" | "longShortRatio" | "all";
  title?: string;
  height?: number;
}

const CoinglassWidget: React.FC<CoinglassWidgetProps> = ({ 
  symbol = "BTC", 
  timeFrame = "1h",
  type = "funding",
  title,
  height = 300
}) => {
  const [dataType, setDataType] = useState<"funding" | "liquidations" | "openInterest" | "longShortRatio">(
    type === "all" ? "funding" : type as any
  );

  // Function to generate the embed URL based on the selected data type
  const getEmbedURL = () => {
    const coinglassSymbol = symbol?.replace(/USDT|BUSD|USD/g, '').replace(':', '');
    const timeframeMapping: { [key: string]: string } = {
      '1m': '1m',
      '3m': '3m',
      '5m': '5m',
      '15m': '15m',
      '30m': '30m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',
      '1w': '1w',
    };
    const coinglassTimeFrame = timeframeMapping[timeFrame] || '1h';

    let embedURL = '';

    switch (dataType) {
      case "funding":
        embedURL = `https://f.coinglass.com/public/widget/funding/chart?symbol=${coinglassSymbol}&time_type=${coinglassTimeFrame}`;
        break;
      case "liquidations":
        embedURL = `https://f.coinglass.com/public/widget/liquidation/chart?symbol=${coinglassSymbol}&time_type=${coinglassTimeFrame}`;
        break;
      case "openInterest":
        embedURL = `https://f.coinglass.com/public/widget/openinterest/chart?symbol=${coinglassSymbol}&time_type=${coinglassTimeFrame}`;
        break;
      case "longShortRatio":
        embedURL = `https://f.coinglass.com/public/widget/longshort/chart?symbol=${coinglassSymbol}&time_type=${coinglassTimeFrame}`;
        break;
      default:
        embedURL = `https://f.coinglass.com/public/widget/funding/chart?symbol=${coinglassSymbol}&time_type=${coinglassTimeFrame}`;
    }

    return embedURL;
  };

  // Function to handle data type change
  const handleDataTypeChange = (value: "funding" | "liquidations" | "openInterest" | "longShortRatio") => {
    setDataType(value);
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {type === "all" && (
        <div className="flex justify-end mb-2">
          <Select onValueChange={handleDataTypeChange as any}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funding">Funding Rate</SelectItem>
              <SelectItem value="liquidations">Liquidations</SelectItem>
              <SelectItem value="openInterest">Open Interest</SelectItem>
              <SelectItem value="longShortRatio">Long/Short Ratio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <iframe
        src={getEmbedURL()}
        title="Coinglass Widget"
        width="100%"
        height={`${height}px`}
        frameBorder="0"
        allowTransparency="true"
        sandbox="allow-popups allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
};

export default CoinglassWidget;
