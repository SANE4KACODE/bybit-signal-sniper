
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TimeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeField({ value, onChange }: TimeFieldProps) {
  const [time, setTime] = useState(value || "");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTime(newValue);
    onChange(newValue);
  };
  
  return (
    <Input 
      type="time"
      value={time}
      onChange={handleChange}
      className="w-40"
    />
  );
}
