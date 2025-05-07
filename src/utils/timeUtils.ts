
// Convert UTC time to Moscow time (UTC+3)
export const toMoscowTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  
  // Create a formatter for Moscow time (UTC+3)
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return formatter.format(date);
};

// Format full Moscow date with time
export const formatMoscowDateTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  
  // Create a formatter for Moscow time (UTC+3)
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return formatter.format(date);
};

// Get current Moscow time
export const getCurrentMoscowTime = (): string => {
  return toMoscowTime(Date.now());
};
