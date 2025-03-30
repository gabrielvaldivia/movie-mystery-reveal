import { Heart, HeartOff } from "lucide-react";

interface HeartProps {
  filled?: boolean;
  // ... any other props you might need
}

export function HeartIcon({ filled = false, ...props }: HeartProps) {
  return filled ? (
    <Heart
      color="white"
      fill="white"
      size={24}
      style={{ color: "white", fill: "white" }}
      {...props}
    />
  ) : (
    <Heart color="white" size={24} style={{ color: "white" }} {...props} />
  );
}
