import React from "react";

function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const MockQR: React.FC<{ value: string; size?: number }> = ({ value, size = 160 }) => {
  const modules = 21; // visually QR-like
  const cell = Math.floor(size / modules);
  const pad = Math.floor((size - cell * modules) / 2);
  const seed = hashCode(value);
  const cells: boolean[] = [];
  for (let y = 0; y < modules; y++) {
    for (let x = 0; x < modules; x++) {
      const r = seededRandom(seed + x * 31 + y * 131);
      const on = r > 0.5;
      cells.push(on);
    }
  }
  // add finder-like squares
  const isFinder = (x: number, y: number) => {
    const f = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    return f(0, 0) || f(modules - 7, 0) || f(0, modules - 7);
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Mock QR">
      <rect width={size} height={size} rx={8} fill="white" />
      <g transform={`translate(${pad},${pad})`}>
        {Array.from({ length: modules }).map((_, y) => (
          <g key={y}>
            {Array.from({ length: modules }).map((__, x) => {
              const idx = y * modules + x;
              const on = isFinder(x, y) ? (x === 0 || x === modules - 1 || y === 0 || y === modules - 1 ? true : x === 1 || x === modules - 2 || y === 1 || y === modules - 2 ? false : true) : cells[idx];
              return (
                <rect
                  key={x}
                  x={x * cell}
                  y={y * cell}
                  width={cell - 1}
                  height={cell - 1}
                  fill={on ? "black" : "white"}
                  rx={0.5}
                />
              );
            })}
          </g>
        ))}
      </g>
    </svg>
  );
};
