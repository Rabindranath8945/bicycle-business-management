"use client";

import { useState, useRef, ReactNode, HTMLAttributes } from "react";

interface RippleProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

export default function Ripple({
  className = "",
  children,
  ...props
}: RippleProps) {
  const [rippleArray, setRippleArray] = useState<any[]>([]);
  const container = useRef<HTMLDivElement>(null);

  const handleClick = (e: any) => {
    const rect = container.current?.getBoundingClientRect();
    if (!rect) return;

    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRippleArray((prev) => [...prev, { x, y, size }]);

    // Remove after animation
    setTimeout(() => {
      setRippleArray((prev) => prev.slice(1));
    }, 450);
  };

  return (
    <div
      ref={container}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}

      {rippleArray.map((r, i) => (
        <span
          key={i}
          style={{
            top: r.y,
            left: r.x,
            width: r.size,
            height: r.size,
          }}
          className="absolute bg-white/20 animate-ripple rounded-full pointer-events-none"
        />
      ))}
    </div>
  );
}
