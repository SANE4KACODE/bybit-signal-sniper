
import { Signal } from "@/types";

interface IndicatorsTableProps {
  signal: Signal;
}

const IndicatorsTable = ({ signal }: IndicatorsTableProps) => {
  const { indicators } = signal;
  
  return (
    <div className="overflow-x-auto max-h-96">
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
          
          {/* New indicators */}
          {indicators.vwap && (
            <tr className="border-b border-muted-foreground/20">
              <td className="py-1 text-muted-foreground">VWAP</td>
              <td className="py-1 text-right font-mono">{indicators.vwap.value.toFixed(2)}</td>
              <td className="py-1 pl-2 text-xs">
                {signal.price && signal.price > indicators.vwap.value ? (
                  <span className="text-success">Выше VWAP</span>
                ) : (
                  <span className="text-warning">Ниже VWAP</span>
                )}
              </td>
            </tr>
          )}
          
          {indicators.supertrend && (
            <tr className="border-b border-muted-foreground/20">
              <td className="py-1 text-muted-foreground">Supertrend</td>
              <td className="py-1 text-right font-mono">{indicators.supertrend.value.toFixed(2)}</td>
              <td className="py-1 pl-2 text-xs">
                {indicators.supertrend.trend === 'UP' ? (
                  <span className="text-success">Восходящий тренд</span>
                ) : (
                  <span className="text-warning">Нисходящий тренд</span>
                )}
              </td>
            </tr>
          )}
          
          {indicators.keltnerChannels && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Keltner Upper</td>
                <td className="py-1 text-right font-mono">{indicators.keltnerChannels.upper.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Keltner Middle</td>
                <td className="py-1 text-right font-mono">{indicators.keltnerChannels.middle.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Keltner Lower</td>
                <td className="py-1 text-right font-mono">{indicators.keltnerChannels.lower.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
            </>
          )}
          
          {indicators.aroon && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Aroon Up</td>
                <td className="py-1 text-right font-mono">{indicators.aroon.up.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Aroon Down</td>
                <td className="py-1 text-right font-mono">{indicators.aroon.down.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Aroon Oscillator</td>
                <td className="py-1 text-right font-mono">{indicators.aroon.oscillator.toFixed(2)}</td>
                <td className="py-1 pl-2 text-xs">
                  {indicators.aroon.oscillator > 50 ? (
                    <span className="text-success">Сильный восходящий тренд</span>
                  ) : indicators.aroon.oscillator < -50 ? (
                    <span className="text-warning">Сильный нисходящий тренд</span>
                  ) : (
                    <span className="text-muted-foreground">Нет выраженного тренда</span>
                  )}
                </td>
              </tr>
            </>
          )}
          
          {indicators.trix && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">TRIX</td>
                <td className="py-1 text-right font-mono">{indicators.trix.value.toFixed(4)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">TRIX Signal</td>
                <td className="py-1 text-right font-mono">{indicators.trix.signal.toFixed(4)}</td>
                <td className="py-1 pl-2 text-xs">
                  {indicators.trix.value > indicators.trix.signal ? (
                    <span className="text-success">Бычий сигнал</span>
                  ) : (
                    <span className="text-warning">Медвежий сигнал</span>
                  )}
                </td>
              </tr>
            </>
          )}
          
          {indicators.donchianChannels && (
            <>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Donchian Upper</td>
                <td className="py-1 text-right font-mono">{indicators.donchianChannels.upper.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Donchian Middle</td>
                <td className="py-1 text-right font-mono">{indicators.donchianChannels.middle.toFixed(2)}</td>
                <td className="py-1 pl-2"></td>
              </tr>
              <tr className="border-b border-muted-foreground/20">
                <td className="py-1 text-muted-foreground">Donchian Lower</td>
                <td className="py-1 text-right font-mono">{indicators.donchianChannels.lower.toFixed(2)}</td>
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
