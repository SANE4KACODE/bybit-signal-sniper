
import { Signal } from "@/types";

interface IndicatorsTableProps {
  signal: Signal;
}

const IndicatorsTable = ({ signal }: IndicatorsTableProps) => {
  const { indicators } = signal;
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {indicators.rsi !== undefined && (
            <tr className="border-b border-muted-foreground/20">
              <td className="py-1 text-muted-foreground">RSI</td>
              <td className="py-1 text-right font-mono">{indicators.rsi.toFixed(2)}</td>
              <td className="py-1 pl-2 text-xs">
                {indicators.rsi < 30 ? (
                  <span className="text-success">Перепродано</span>
                ) : indicators.rsi > 70 ? (
                  <span className="text-warning">Перекуплено</span>
                ) : (
                  <span className="text-muted-foreground">Нейтрально</span>
                )}
              </td>
            </tr>
          )}
          
          {indicators.macd && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">MACD</td>
                <td className="py-1 text-right font-mono">{indicators.macd.value.toFixed(4)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">MACD Signal</td>
                <td className="py-1 text-right font-mono">{indicators.macd.signal.toFixed(4)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">MACD Histogram</td>
                <td className="py-1 text-right font-mono">{indicators.macd.histogram.toFixed(4)}</td>
                <td className="py-1 pl-2 text-xs">
                  {indicators.macd.histogram > 0 ? (
                    <span className="text-success">Бычий тренд</span>
                  ) : (
                    <span className="text-warning">Медвежий тренд</span>
                  )}
                </td>
              </tr>
            </>
          )}
          
          {indicators.bollingerBands && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">BB Upper</td>
                <td className="py-1 text-right font-mono">{indicators.bollingerBands.upper.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">BB Middle</td>
                <td className="py-1 text-right font-mono">{indicators.bollingerBands.middle.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">BB Lower</td>
                <td className="py-1 text-right font-mono">{indicators.bollingerBands.lower.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
            </>
          )}
          
          {indicators.stochastic && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Stochastic %K</td>
                <td className="py-1 text-right font-mono">{indicators.stochastic.k.toFixed(2)}</td>
                <td className="py-1 pl-2 text-xs">
                  {indicators.stochastic.k < 20 ? (
                    <span className="text-success">Перепродано</span>
                  ) : indicators.stochastic.k > 80 ? (
                    <span className="text-warning">Перекуплено</span>
                  ) : (
                    <span className="text-muted-foreground">Нейтрально</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Stochastic %D</td>
                <td className="py-1 text-right font-mono">{indicators.stochastic.d.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
            </>
          )}
          
          {indicators.adx && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">ADX</td>
                <td className="py-1 text-right font-mono">{indicators.adx.value.toFixed(2)}</td>
                <td className="py-1 pl-2 text-xs">
                  {indicators.adx.value < 20 ? (
                    <span className="text-muted-foreground">Слабый тренд</span>
                  ) : indicators.adx.value > 40 ? (
                    <span className="text-success">Сильный тренд</span>
                  ) : (
                    <span className="text-muted-foreground">Умеренный тренд</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">+DI</td>
                <td className="py-1 text-right font-mono">{indicators.adx.plusDI.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">-DI</td>
                <td className="py-1 text-right font-mono">{indicators.adx.minusDI.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IndicatorsTable;
