
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { TrendingUp, TrendingDown } from "lucide-react";

export const OpenInterestTable = () => {
  const { marketData } = useWebSocket();
  
  // Sort market data by absolute openInterestChange
  const sortedData = [...marketData].sort((a, b) => 
    Math.abs(b.openInterestChange) - Math.abs(a.openInterestChange)
  ).slice(0, 5);
  
  return (
    <Card className="bg-trading-card border-trading-highlight">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Открытый Интерес</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Пара</TableHead>
              <TableHead className="text-right">Изменение</TableHead>
              <TableHead className="text-right">Значение</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.symbol} className="hover:bg-trading-highlight">
                <TableCell className="font-medium">{item.symbol}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {item.openInterestChange > 0 ? (
                      <span className="text-success flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +{item.openInterestChange.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-warning flex items-center">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        {item.openInterestChange.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {new Intl.NumberFormat('ru-RU', {
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(item.openInterest)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
