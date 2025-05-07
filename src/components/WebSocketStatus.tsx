
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/contexts/WebSocketContext";

export const WebSocketStatus = () => {
  const { status, connect, disconnect } = useWebSocket();
  
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <span className="mr-2 text-sm">Статус:</span>
        <div className="flex items-center">
          <span 
            className={`w-3 h-3 rounded-full mr-2 ${
              status === 'connected' ? 'bg-success animate-pulse-slow' : 
              status === 'connecting' ? 'bg-amber-400 animate-pulse-slow' : 
              status === 'error' ? 'bg-warning' : 'bg-muted'
            }`}
          />
          <span className="text-sm">
            {status === 'connected' ? 'Подключено' : 
             status === 'connecting' ? 'Подключение...' : 
             status === 'error' ? 'Ошибка' : 'Отключено'}
          </span>
        </div>
      </div>
      
      <div className="ml-4">
        {status === 'connected' ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnect}
            className="text-xs h-8"
          >
            Отключить
          </Button>
        ) : status === 'connecting' ? (
          <Button 
            variant="outline" 
            size="sm" 
            disabled
            className="text-xs h-8"
          >
            Подключение...
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={connect}
            className="text-xs h-8"
          >
            Подключить
          </Button>
        )}
      </div>
    </div>
  );
};
