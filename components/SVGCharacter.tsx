'use client';

import { useMemo, type JSX } from 'react';
import { ITEMS, type Item } from '@/lib/data';

const VW = 400;
const VH = 550;
const CX = 200;
const HEAD_Y = 95;
const SHOULDER_Y = 142;
const WAIST_Y = 267;
const HIP_Y = 300;
const KNEE_Y = 345;
const ANKLE_Y = 420;
const FOOT_Y = 435;

interface Outfit {
  [slot: string]: string | undefined;
}

interface Props {
  topic: string;
  outfit: Outfit;
  skinTone: string;
  hairstyle: string;
  drawnImages: Record<string, string>;
}

function lookup(topic: string, key: string | undefined): Item | null {
  if (!key || key.startsWith('_custom') || key === '_drawn') return null;
  const [cat, idxStr] = key.split('-');
  return ITEMS[topic]?.[cat]?.[parseInt(idxStr)] ?? null;
}

function isCustom(key: string | undefined): boolean {
  return !!key?.startsWith('_custom');
}

function isDrawn(key: string | undefined): boolean {
  return key === '_drawn';
}

function itemColors(topic: string, key: string | undefined): [string, string] | null {
  if (isDrawn(key)) return null;
  if (isCustom(key) && key) {
    const parts = key.split('#');
    if (parts.length < 2) return null;
    const colors = parts[1].split(',');
    return colors.length >= 2 ? [colors[0], colors[1]] : null;
  }
  const item = lookup(topic, key);
  return item?.c ?? null;
}

// ==================== BODY SVG ====================

const BodySVG = ({ skin }: { skin: string }) => (
  <g>
    {[-13, 13].map((off) => (
      <path key={`leg-${off}`}
        d={`M ${CX + off - 11} 272 Q ${CX + off - 13} 302 ${CX + off - 10} 345 Q ${CX + off - 9} 373 ${CX + off - 8} 420 L ${CX + off - 11} 435 L ${CX + off + 11} 435 L ${CX + off + 8} 420 Q ${CX + off + 9} 373 ${CX + off + 10} 345 Q ${CX + off + 13} 302 ${CX + off + 11} 272 Z`}
        fill={skin} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
    ))}
    {[-1, 1].map((d) => {
      const sx = CX + d * 39, sy = 146, ex = sx + d * 16, ey = sy + 58, hx = ex + d * 6, hy = ey + 38;
      return (
        <path key={`arm-${d}`}
          d={`M ${sx - d * 7} ${sy} Q ${sx - d * 4} ${sy + 10} ${ex - d * 5} ${ey} Q ${ex - d * 3} ${ey + 4} ${hx - d * 4} ${hy} L ${hx + d * 4} ${hy} Q ${ex + d * 3} ${ey + 4} ${ex + d * 5} ${ey} Q ${sx + d * 4} ${sy + 10} ${sx + d * 7} ${sy} Z`}
          fill={skin} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
      );
    })}
    <path
      d={`M ${CX - 35} 142 Q ${CX - 39} 172 ${CX - 23} 220 Q ${CX - 25} 242 ${CX - 31} 265 Q ${CX - 25} 275 ${CX - 21} 272 L ${CX + 21} 272 Q ${CX + 25} 275 ${CX + 31} 265 Q ${CX + 25} 242 ${CX + 23} 220 Q ${CX + 39} 172 ${CX + 35} 142 Z`}
      fill={skin} stroke="rgba(0,0,0,0.06)" strokeWidth={1.5} />
    <rect x={CX - 10} y={142} width={20} height={8} fill={skin} />
    <circle cx={CX} cy={95} r={50} fill={skin} stroke="rgba(0,0,0,0.06)" strokeWidth={1.5} />
    <ellipse cx={CX - 14} cy={92} rx={4} ry={5} fill="#222" />
    <ellipse cx={CX + 14} cy={92} rx={4} ry={5} fill="#222" />
    <circle cx={CX - 12} cy={90} r={1.5} fill="#fff" />
    <circle cx={CX + 16} cy={90} r={1.5} fill="#fff" />
    <path d={`M ${CX - 20} 80 L ${CX - 8} 78`} stroke="#8d6e63" strokeWidth={2} fill="none" />
    <path d={`M ${CX + 20} 80 L ${CX + 8} 78`} stroke="#8d6e63" strokeWidth={2} fill="none" />
    <path d={`M ${CX - 8} 110 Q ${CX} 116 ${CX + 8} 110`} fill="#c76c6c" />
    <ellipse cx={CX - 21} cy={102} rx={7} ry={4} fill="rgba(255,150,150,0.25)" />
    <ellipse cx={CX + 21} cy={102} rx={7} ry={4} fill="rgba(255,150,150,0.25)" />
  </g>
);

// ==================== HAIR ====================

const hairData: Record<string, (c: string, c2: string) => string> = {
  short: (c) => `M ${CX - 52} 95 A 52 52 0 0 1 ${CX + 52} 95 Q ${CX + 48} 118 ${CX + 46} 110 Q ${CX} 130 ${CX - 46} 110 Q ${CX - 48} 118 ${CX - 52} 95 Z`,
  long: (c, c2) => `M ${CX - 53} 95 A 53 53 0 0 1 ${CX + 53} 95 Q ${CX + 55} 145 ${CX + 52} 150 Q ${CX + 46} 140 ${CX + 46} 115 Q ${CX} 135 ${CX - 46} 115 Q ${CX - 46} 140 ${CX - 52} 150 Q ${CX - 55} 145 ${CX - 53} 95 Z`,
  ponytail: (c) => `M ${CX - 53} 95 A 53 53 0 0 1 ${CX + 53} 95 Q ${CX + 50} 110 ${CX + 46} 108 Q ${CX} 118 ${CX - 46} 108 Q ${CX - 50} 110 ${CX - 53} 95 Z M ${CX + 32} 60 Q ${CX + 55} 68 ${CX + 58} 110 Q ${CX + 50} 120 ${CX + 44} 100 Z`,
  bob: (c) => `M ${CX - 52} 95 A 52 52 0 0 1 ${CX + 52} 95 Q ${CX + 56} 130 ${CX + 54} 130 Q ${CX + 48} 125 ${CX + 48} 115 Q ${CX} 128 ${CX - 48} 115 Q ${CX - 48} 125 ${CX - 54} 130 Q ${CX - 56} 130 ${CX - 52} 95 Z`,
  curly: (c) => { let d = `M ${CX - 55} 95 A 55 55 0 0 1 ${CX + 55} 95`; for (let i = 0; i < 10; i++) { const a = Math.PI + (i / 9) * Math.PI; const r = 55 + Math.sin(i * 1.3) * 5; d += ` L ${CX + Math.cos(a) * r} ${95 + Math.sin(a) * r}`; } return d + ' Z'; },
  buzz: (c) => `M ${CX - 47} 95 A 47 47 0 0 1 ${CX + 47} 95 Z`,
  buns: (c) => `M ${CX - 52} 95 A 52 52 0 0 1 ${CX + 52} 95 Q ${CX + 46} 108 ${CX + 44} 106 Q ${CX} 116 ${CX - 44} 106 Q ${CX - 46} 108 ${CX - 52} 95 Z M ${CX - 20} 38 A 16 12 0 1 0 ${CX - 20} 62 A 16 12 0 1 0 ${CX - 20} 38 Z M ${CX + 20} 38 A 16 12 0 1 0 ${CX + 20} 62 A 16 12 0 1 0 ${CX + 20} 38 Z`,
  mohawk: (c, c2) => `M ${CX - 50} 95 A 50 50 0 0 1 ${CX + 50} 95 Z M ${CX - 5} 30 L ${CX + 5} 30 Q ${CX + 7} 70 ${CX + 5} 85 L ${CX - 5} 85 Q ${CX - 7} 70 ${CX - 5} 30 Z`,
};

const hairColors: Record<string, [string, string]> = {
  short: ['#5d4037', '#4e342e'], long: ['#4e342e', '#3e2723'], ponytail: ['#3e2723', '#2d1b0e'],
  bob: ['#6d4c41', '#5d4037'], curly: ['#3e2723', '#2d1b0e'], buzz: ['#5d4037', '#4e342e'],
  buns: ['#4e342e', '#3e2723'], mohawk: ['#2d1b0e', '#e65100'],
};

// ==================== CLOTHING SHAPES ====================

const topShapes: ((c1: string, c2: string) => JSX.Element)[] = [
  // 0: T-shirt
  (c1) => <path d={`M ${CX - 37} 138 L ${CX + 37} 138 Q ${CX + 42} 150 ${CX + 39} 215 Q ${CX + 33} 267 ${CX + 35} 267 L ${CX + 29} 267 Q ${CX + 28} 260 ${CX + 23} 252 L ${CX - 23} 252 Q ${CX - 28} 260 ${CX - 29} 267 L ${CX - 35} 267 Q ${CX - 33} 267 ${CX - 39} 215 Q ${CX - 42} 150 ${CX - 37} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 1: Tank
  (c1) => <path d={`M ${CX - 16} 140 L ${CX + 16} 140 Q ${CX + 24} 150 ${CX + 28} 215 Q ${CX + 30} 260 ${CX + 32} 267 L ${CX + 26} 267 Q ${CX + 24} 258 ${CX + 20} 250 L ${CX - 20} 250 Q ${CX - 24} 258 ${CX - 26} 267 L ${CX - 32} 267 Q ${CX - 30} 260 ${CX - 28} 215 Q ${CX - 24} 150 ${CX - 16} 140 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 2: Blouse
  (c1) => <g><path d={`M ${CX - 45} 138 L ${CX + 45} 138 Q ${CX + 48} 148 ${CX + 42} 152 L ${CX + 38} 215 Q ${CX + 35} 260 ${CX + 35} 267 L ${CX + 29} 267 Q ${CX + 28} 258 ${CX + 23} 250 L ${CX - 23} 250 Q ${CX - 28} 258 ${CX - 29} 267 L ${CX - 35} 267 Q ${CX - 35} 260 ${CX - 38} 215 L ${CX - 42} 152 Q ${CX - 48} 148 ${CX - 45} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} /><path d={`M ${CX - 8} 138 L ${CX} 155 L ${CX + 8} 138 Z`} fill="rgba(255,255,255,0.15)" /></g>,
  // 3: Sweater
  (c1) => <g><path d={`M ${CX - 34} 136 L ${CX + 34} 136 Q ${CX + 38} 148 ${CX + 38} 215 Q ${CX + 36} 260 ${CX + 35} 267 L ${CX + 29} 267 Q ${CX + 28} 258 ${CX + 23} 250 L ${CX - 23} 250 Q ${CX - 28} 258 ${CX - 29} 267 L ${CX - 35} 267 Q ${CX - 36} 260 ${CX - 38} 215 Q ${CX - 38} 148 ${CX - 34} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} /><path d={`M ${CX - 55} 142 Q ${CX - 50} 155 ${CX - 42} 160 L ${CX - 42} 146 Q ${CX - 48} 143 ${CX - 55} 142 Z M ${CX + 55} 142 Q ${CX + 50} 155 ${CX + 42} 160 L ${CX + 42} 146 Q ${CX + 48} 143 ${CX + 55} 142 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1} /></g>,
  // 4: Crop top
  (c1) => <path d={`M ${CX - 35} 138 L ${CX + 35} 138 Q ${CX + 40} 148 ${CX + 37} 200 Q ${CX + 35} 220 ${CX + 36} 220 L ${CX + 30} 220 Q ${CX + 28} 210 ${CX + 24} 205 L ${CX - 24} 205 Q ${CX - 28} 210 ${CX - 30} 220 L ${CX - 36} 220 Q ${CX - 35} 220 ${CX - 37} 200 Q ${CX - 40} 148 ${CX - 35} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 5: Off-shoulder
  (c1) => <path d={`M ${CX - 52} 130 L ${CX + 52} 130 Q ${CX + 55} 144 ${CX + 50} 150 Q ${CX + 44} 160 ${CX + 40} 215 Q ${CX + 34} 262 ${CX + 35} 267 L ${CX + 29} 267 Q ${CX + 28} 258 ${CX + 23} 250 L ${CX - 23} 250 Q ${CX - 28} 258 ${CX - 29} 267 L ${CX - 35} 267 Q ${CX - 34} 262 ${CX - 40} 215 Q ${CX - 44} 160 ${CX - 50} 150 Q ${CX - 55} 144 ${CX - 52} 130 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 6: V-neck
  (c1) => <path d={`M ${CX - 37} 138 L ${CX} 165 L ${CX + 37} 138 Q ${CX + 42} 152 ${CX + 39} 215 Q ${CX + 33} 267 ${CX + 35} 267 L ${CX + 29} 267 Q ${CX + 28} 260 ${CX + 23} 252 L ${CX - 23} 252 Q ${CX - 28} 260 ${CX - 29} 267 L ${CX - 35} 267 Q ${CX - 33} 267 ${CX - 39} 215 Q ${CX - 42} 152 ${CX - 37} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 7: Halter
  (c1) => <path d={`M ${CX - 8} 115 L ${CX + 8} 115 Q ${CX + 22} 150 ${CX + 26} 215 Q ${CX + 28} 260 ${CX + 30} 267 L ${CX + 24} 267 Q ${CX + 22} 258 ${CX + 18} 250 L ${CX - 18} 250 Q ${CX - 22} 258 ${CX - 24} 267 L ${CX - 30} 267 Q ${CX - 28} 260 ${CX - 26} 215 Q ${CX - 22} 150 ${CX - 8} 115 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 8: Peplum
  (c1) => <path d={`M ${CX - 34} 138 L ${CX + 34} 138 Q ${CX + 38} 150 ${CX + 36} 215 Q ${CX + 32} 240 ${CX + 42} 255 Q ${CX + 48} 265 ${CX + 48} 267 L ${CX + 42} 267 Q ${CX + 40} 260 ${CX + 32} 252 L ${CX - 32} 252 Q ${CX - 40} 260 ${CX - 42} 267 L ${CX - 48} 267 Q ${CX - 48} 265 ${CX - 42} 255 Q ${CX - 32} 240 ${CX - 36} 215 Q ${CX - 38} 150 ${CX - 34} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 9: Turtleneck
  (c1) => <g><path d={`M ${CX - 30} 128 L ${CX + 30} 128 Q ${CX + 36} 140 ${CX + 36} 215 Q ${CX + 34} 260 ${CX + 35} 267 L ${CX + 29} 267 Q ${CX + 28} 258 ${CX + 23} 250 L ${CX - 23} 250 Q ${CX - 28} 258 ${CX - 29} 267 L ${CX - 35} 267 Q ${CX - 34} 260 ${CX - 36} 215 Q ${CX - 36} 140 ${CX - 30} 128 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} /><rect x={CX - 20} y={120} width={40} height={16} rx={4} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} /></g>,
];

const dressShapes: ((c1: string, c2: string) => JSX.Element)[] = [
  // 0: A-line
  (c1, c2) => <path d={`M ${CX - 36} 138 L ${CX + 36} 138 Q ${CX + 42} 148 ${CX + 44} 220 Q ${CX + 50} 300 ${CX + 55} 350 L ${CX - 55} 350 Q ${CX - 50} 300 ${CX - 44} 220 Q ${CX - 42} 148 ${CX - 36} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 1: Fitted
  (c1, c2) => <path d={`M ${CX - 34} 138 L ${CX + 34} 138 Q ${CX + 38} 150 ${CX + 35} 220 Q ${CX + 32} 270 ${CX + 34} 310 L ${CX + 38} 330 L ${CX + 42} 350 L ${CX - 42} 350 L ${CX - 38} 330 L ${CX - 34} 310 Q ${CX - 32} 270 ${CX - 35} 220 Q ${CX - 38} 150 ${CX - 34} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 2: Empire waist
  (c1, c2) => <path d={`M ${CX - 36} 138 L ${CX + 36} 138 Q ${CX + 40} 148 ${CX + 38} 185 Q ${CX + 50} 250 ${CX + 56} 350 L ${CX - 56} 350 Q ${CX - 50} 250 ${CX - 38} 185 Q ${CX - 40} 148 ${CX - 36} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 3: Slip dress
  (c1, c2) => <path d={`M ${CX - 20} 138 L ${CX + 20} 138 Q ${CX + 26} 155 ${CX + 24} 220 Q ${CX + 22} 280 ${CX + 24} 330 Q ${CX + 26} 340 ${CX + 30} 350 L ${CX - 30} 350 Q ${CX - 26} 340 ${CX - 24} 330 Q ${CX - 22} 280 ${CX - 24} 220 Q ${CX - 26} 155 ${CX - 20} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 4: Ball gown
  (c1, c2) => <path d={`M ${CX - 34} 138 L ${CX + 34} 138 Q ${CX + 38} 150 ${CX + 35} 210 Q ${CX + 55} 260 ${CX + 70} 350 L ${CX - 70} 350 Q ${CX - 55} 260 ${CX - 35} 210 Q ${CX - 38} 150 ${CX - 34} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 5: Bodycon
  (c1, c2) => <path d={`M ${CX - 32} 138 L ${CX + 32} 138 Q ${CX + 36} 148 ${CX + 33} 220 Q ${CX + 32} 280 ${CX + 34} 340 L ${CX + 35} 350 L ${CX - 35} 350 L ${CX - 34} 340 Q ${CX - 32} 280 ${CX - 33} 220 Q ${CX - 36} 148 ${CX - 32} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 6: Wrap dress
  (c1, c2) => <g><path d={`M ${CX - 36} 138 L ${CX} 165 L ${CX + 36} 138 Q ${CX + 40} 150 ${CX + 38} 210 Q ${CX + 46} 280 ${CX + 50} 350 L ${CX - 50} 350 Q ${CX - 46} 280 ${CX - 38} 210 Q ${CX - 40} 150 ${CX - 36} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} /><line x1={CX} y1={165} x2={CX - 50} y2={350} stroke={c1} strokeWidth={1} strokeDasharray="3,3" opacity={0.3} /></g>,
  // 7: Mermaid
  (c1, c2) => <path d={`M ${CX - 34} 138 L ${CX + 34} 138 Q ${CX + 38} 150 ${CX + 35} 220 Q ${CX + 30} 290 ${CX + 32} 310 Q ${CX + 50} 330 ${CX + 60} 350 L ${CX - 60} 350 Q ${CX - 50} 330 ${CX - 32} 310 Q ${CX - 30} 290 ${CX - 35} 220 Q ${CX - 38} 150 ${CX - 34} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 8: Tunic dress
  (c1, c2) => <path d={`M ${CX - 38} 138 L ${CX + 38} 138 Q ${CX + 44} 148 ${CX + 42} 220 Q ${CX + 44} 290 ${CX + 46} 310 L ${CX + 40} 310 L ${CX + 38} 300 Q ${CX} 295 ${CX - 38} 300 L ${CX - 40} 310 L ${CX - 46} 310 Q ${CX - 44} 290 ${CX - 42} 220 Q ${CX - 44} 148 ${CX - 38} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 9: Maxi dress
  (c1, c2) => <path d={`M ${CX - 36} 138 L ${CX + 36} 138 Q ${CX + 42} 148 ${CX + 44} 220 Q ${CX + 46} 300 ${CX + 48} 380 Q ${CX + 50} 420 ${CX + 52} 440 L ${CX - 52} 440 Q ${CX - 50} 420 ${CX - 48} 380 Q ${CX - 46} 300 ${CX - 44} 220 Q ${CX - 42} 148 ${CX - 36} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
];

const pantsShapes: ((c1: string, c2: string) => JSX.Element)[] = [
  // 0: Straight
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 25} 300 ${CX - 20} 345 Q ${CX - 18} 373 ${CX - 16} 420 L ${CX - 8} 420 L ${CX - 8} 370 L ${CX - 4} 340 L ${CX + 4} 340 L ${CX + 8} 370 L ${CX + 8} 420 L ${CX + 16} 420 Q ${CX + 18} 373 ${CX + 20} 345 Q ${CX + 25} 300 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 1: Shorts
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 26} 290 ${CX - 22} 310 L ${CX - 12} 310 L ${CX - 8} 285 L ${CX + 8} 285 L ${CX + 12} 310 L ${CX + 22} 310 Q ${CX + 26} 290 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 2: Wide leg
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 28} 300 ${CX - 24} 345 Q ${CX - 22} 373 ${CX - 22} 420 L ${CX - 6} 420 L ${CX - 4} 345 L ${CX + 4} 345 L ${CX + 6} 420 L ${CX + 22} 420 Q ${CX + 22} 373 ${CX + 24} 345 Q ${CX + 28} 300 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 3: Skirt
  (c1, c2) => <path d={`M ${CX - 20} 268 L ${CX + 20} 268 Q ${CX + 38} 320 ${CX + 42} 350 L ${CX + 30} 350 Q ${CX + 25} 330 ${CX} 325 Q ${CX - 25} 330 ${CX - 30} 350 L ${CX - 42} 350 Q ${CX - 38} 320 ${CX - 20} 268 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 4: Capris
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 25} 300 ${CX - 20} 330 Q ${CX - 18} 350 ${CX - 16} 360 L ${CX - 8} 360 L ${CX - 6} 345 L ${CX - 3} 330 L ${CX + 3} 330 L ${CX + 6} 345 L ${CX + 8} 360 L ${CX + 16} 360 Q ${CX + 18} 350 ${CX + 20} 330 Q ${CX + 25} 300 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 5: Skinny
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 24} 300 ${CX - 22} 345 Q ${CX - 20} 373 ${CX - 18} 420 L ${CX - 5} 420 L ${CX - 4} 345 L ${CX + 4} 345 L ${CX + 5} 420 L ${CX + 18} 420 Q ${CX + 20} 373 ${CX + 22} 345 Q ${CX + 24} 300 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 6: Flared
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 25} 300 ${CX - 22} 340 Q ${CX - 24} 380 ${CX - 22} 420 L ${CX - 5} 420 L ${CX - 6} 380 L ${CX - 3} 340 L ${CX + 3} 340 L ${CX + 6} 380 L ${CX + 5} 420 L ${CX + 22} 420 Q ${CX + 24} 380 ${CX + 22} 340 Q ${CX + 25} 300 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 7: Cargo
  (c1, c2) => <g><path d={`M ${CX - 24} 266 Q ${CX - 27} 300 ${CX - 22} 345 Q ${CX - 20} 373 ${CX - 18} 420 L ${CX - 6} 420 L ${CX - 6} 370 L ${CX - 3} 340 L ${CX + 3} 340 L ${CX + 6} 370 L ${CX + 6} 420 L ${CX + 18} 420 Q ${CX + 20} 373 ${CX + 22} 345 Q ${CX + 27} 300 ${CX + 24} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} /><rect x={CX - 18} y={305} width={6} height={4} rx={1} fill="rgba(255,255,255,0.1)" stroke={c1} strokeWidth={0.5} /><rect x={CX + 12} y={305} width={6} height={4} rx={1} fill="rgba(255,255,255,0.1)" stroke={c1} strokeWidth={0.5} /></g>,
  // 8: Hot pants
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 28} 285 ${CX - 24} 295 L ${CX - 10} 295 L ${CX - 6} 278 L ${CX + 6} 278 L ${CX + 10} 295 L ${CX + 24} 295 Q ${CX + 28} 285 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
  // 9: Palazzo
  (c1, c2) => <path d={`M ${CX - 23} 266 Q ${CX - 30} 300 ${CX - 28} 345 Q ${CX - 30} 380 ${CX - 30} 420 L ${CX - 4} 420 L ${CX - 4} 360 Q ${CX} 355 ${CX + 4} 360 L ${CX + 4} 420 L ${CX + 30} 420 Q ${CX + 30} 380 ${CX + 28} 345 Q ${CX + 30} 300 ${CX + 23} 266 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1.5} />,
];

const jacketShapes: ((c1: string, c2: string) => JSX.Element)[] = [
  // 0: Open jacket
  (c1) => <path d={`M ${CX - 45} 136 L ${CX + 45} 136 Q ${CX + 50} 152 ${CX + 48} 220 Q ${CX + 46} 270 ${CX + 48} 295 L ${CX + 5} 295 L ${CX} 280 L ${CX - 5} 295 L ${CX - 48} 295 Q ${CX - 46} 270 ${CX - 48} 220 Q ${CX - 50} 152 ${CX - 45} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} />,
  // 1: Cape
  (c1) => <path d={`M ${CX - 52} 136 L ${CX + 52} 136 Q ${CX + 70} 160 ${CX + 65} 220 Q ${CX + 60} 300 ${CX + 55} 350 L ${CX - 55} 350 Q ${CX - 60} 300 ${CX - 65} 220 Q ${CX - 70} 160 ${CX - 52} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} />,
  // 2: Long coat
  (c1) => <path d={`M ${CX - 42} 136 L ${CX + 42} 136 Q ${CX + 46} 148 ${CX + 44} 215 Q ${CX + 42} 300 ${CX + 44} 350 L ${CX + 5} 350 L ${CX} 335 L ${CX - 5} 350 L ${CX - 44} 350 Q ${CX - 42} 300 ${CX - 44} 215 Q ${CX - 46} 148 ${CX - 42} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} />,
  // 3: Bomber
  (c1) => <g><path d={`M ${CX - 46} 136 L ${CX + 46} 136 Q ${CX + 52} 148 ${CX + 50} 210 Q ${CX + 48} 260 ${CX + 44} 272 L ${CX - 44} 272 Q ${CX - 48} 260 ${CX - 50} 210 Q ${CX - 52} 148 ${CX - 46} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} /><rect x={CX - 44} y={268} width={88} height={8} rx={3} fill={c1} opacity={0.7} /></g>,
  // 4: Denim jacket
  (c1) => <path d={`M ${CX - 44} 136 L ${CX + 44} 136 Q ${CX + 48} 148 ${CX + 46} 215 Q ${CX + 44} 260 ${CX + 46} 275 L ${CX + 4} 275 L ${CX} 262 L ${CX - 4} 275 L ${CX - 46} 275 Q ${CX - 44} 260 ${CX - 46} 215 Q ${CX - 48} 148 ${CX - 44} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} />,
  // 5: Leather jacket
  (c1) => <g><path d={`M ${CX - 44} 136 L ${CX - 10} 136 L ${CX} 152 L ${CX + 10} 136 L ${CX + 44} 136 Q ${CX + 48} 148 ${CX + 46} 215 Q ${CX + 44} 260 ${CX + 46} 280 L ${CX + 4} 280 L ${CX} 268 L ${CX - 4} 280 L ${CX - 46} 280 Q ${CX - 44} 260 ${CX - 46} 215 Q ${CX - 48} 148 ${CX - 44} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} /><circle cx={CX - 20} cy={175} r={3} fill={c1} /><circle cx={CX + 20} cy={175} r={3} fill={c1} /></g>,
  // 6: Puffer vest
  (c1) => <g><path d={`M ${CX - 36} 136 L ${CX + 36} 136 Q ${CX + 40} 148 ${CX + 38} 215 Q ${CX + 38} 270 ${CX + 38} 290 L ${CX - 38} 290 Q ${CX - 38} 270 ${CX - 38} 215 Q ${CX - 40} 148 ${CX - 36} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} />{[0,1,2,3,4,5].map(i => <line key={i} x1={CX - 28 + i*12} y1={170 + i*20} x2={CX - 28 + i*12} y2={170 + i*20 + 40} stroke={c1} strokeWidth={2} opacity={0.3} />)}</g>,
  // 7: Cardigan
  (c1) => <g><path d={`M ${CX - 44} 136 L ${CX - 6} 136 L ${CX} 146 L ${CX + 6} 136 L ${CX + 44} 136 Q ${CX + 48} 148 ${CX + 46} 215 Q ${CX + 44} 260 ${CX + 46} 290 L ${CX - 46} 290 Q ${CX - 44} 260 ${CX - 46} 215 Q ${CX - 48} 148 ${CX - 44} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} /><path d={`M ${CX - 55} 142 Q ${CX - 50} 155 ${CX - 44} 160 L ${CX - 44} 146 Q ${CX - 48} 143 ${CX - 55} 142 Z M ${CX + 55} 142 Q ${CX + 50} 155 ${CX + 44} 160 L ${CX + 44} 146 Q ${CX + 48} 143 ${CX + 55} 142 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={1} /></g>,
  // 8: Bolero
  (c1) => <path d={`M ${CX - 48} 136 L ${CX + 48} 136 Q ${CX + 52} 148 ${CX + 50} 185 Q ${CX + 48} 210 ${CX + 46} 215 L ${CX - 46} 215 Q ${CX - 48} 210 ${CX - 50} 185 Q ${CX - 52} 148 ${CX - 48} 136 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} />,
  // 9: Poncho
  (c1) => <path d={`M ${CX - 65} 138 L ${CX + 65} 138 Q ${CX + 75} 180 ${CX + 70} 240 Q ${CX + 65} 300 ${CX + 58} 320 L ${CX - 58} 320 Q ${CX - 65} 300 ${CX - 70} 240 Q ${CX - 75} 180 ${CX - 65} 138 Z`} fill={`url(#g-${c1})`} stroke={c1} strokeWidth={2} />,
];

// ==================== DRAWN IMAGE RENDERING ====================

function DrawnClothing({ slot, drawnImg, children }: { slot: string; drawnImg?: string; children: React.ReactNode }) {
  if (!drawnImg) return <>{children}</>;
  const rect = drawnSlotRect(slot);
  if (!rect) return <>{children}</>;
  return (
    <g>
      <image href={drawnImg} x={rect.x} y={rect.y} width={rect.w} height={rect.h} preserveAspectRatio="xMidYMid slice" opacity={0.9} />
      {children}
    </g>
  );
}

function drawnSlotRect(slot: string): { x: number; y: number; w: number; h: number } | null {
  switch (slot) {
    case 'tops': return { x: CX - 42, y: 136, w: 84, h: 131 };
    case 'dresses': return { x: CX - 50, y: 136, w: 100, h: 214 };
    case 'pants': return { x: CX - 25, y: 264, w: 50, h: 156 };
    case 'jackets': return { x: CX - 50, y: 134, w: 100, h: 200 };
    default: return null;
  }
}

// ==================== EMOJI HELPERS ====================

function getEmoji(topic: string, key: string | undefined): string {
  if (isCustom(key) || isDrawn(key)) return '🎨';
  return lookup(topic, key)?.e ?? '';
}

function getItemName(topic: string, key: string | undefined): string {
  if (isCustom(key)) return 'Custom';
  if (isDrawn(key)) return 'Drawn';
  return lookup(topic, key)?.n ?? '';
}

// ==================== COMPONENT ====================

export default function SVGCharacter({ topic, outfit, skinTone, hairstyle, drawnImages }: Props) {
  const hc = hairColors[hairstyle] ?? ['#5d4037', '#4e342e'];
  const hairD = hairData[hairstyle];
  const hairPath = hairD ? hairD(hc[0], hc[1]) : '';

  function renderClothing(slot: string, shapes: ((c1: string, c2: string) => JSX.Element)[], defaultShape = 0) {
    const key = outfit[slot];
    if (!key) return null;
    const colors = itemColors(topic, key);
    if (!colors) {
      return null;
    }
    if (isDrawn(key)) {
      // handled by DrawnClothing wrapper
      return null;
    }
    if (isCustom(key)) {
      return shapes[defaultShape](colors[0], colors[1]);
    }
    const idx = parseInt(key.split('-')[1]);
    const s = idx % shapes.length;
    if (s >= 0 && s < shapes.length) return shapes[s](colors[0], colors[1]);
    return shapes[defaultShape](colors[0], colors[1]);
  }

  const gradientIds = useMemo(() => {
    const ids: string[] = [];
    for (const slot of ['tops', 'dresses', 'pants', 'jackets']) {
      if (isDrawn(outfit[slot])) continue;
      const colors = itemColors(topic, outfit[slot]);
      if (colors && !ids.includes(colors[0])) ids.push(colors[0]);
    }
    return ids;
  }, [topic, outfit.tops, outfit.dresses, outfit.pants, outfit.jackets]);

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" height="100%" style={{ maxWidth: 380, display: 'block' }}>
      <defs>
        {gradientIds.map((cid) => {
          const colors = itemColors(topic, Object.values(outfit).find(k => k && !isDrawn(k) && itemColors(topic, k)?.[0] === cid));
          if (!colors) return null;
          return (
            <linearGradient key={cid} id={`g-${cid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          );
        })}
      </defs>

      <BodySVG skin={skinTone} />

      {outfit.socks && (() => {
        const e = getEmoji(topic, outfit.socks);
        if (!e) return null;
        return (
          <g>
            <text x={CX - 8} y={395} textAnchor="middle" fontSize={20} fontFamily="serif">{e}</text>
            <text x={CX + 8} y={395} textAnchor="middle" fontSize={20} fontFamily="serif">{e}</text>
          </g>
        );
      })()}

      {hairPath && <path d={hairPath} fill={hc[0]} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />}
      {hairstyle === 'mohawk' && <path d={hairData.mohawk(hc[0], hc[1])} fill={hc[1]} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />}

      {outfit.earrings && (() => {
        const e = getEmoji(topic, outfit.earrings);
        if (!e) return null;
        return (
          <g>
            <text x={CX - 54} y={HEAD_Y + 12} textAnchor="middle" fontSize={18} fontFamily="serif">{e}</text>
            <text x={CX + 54} y={HEAD_Y + 12} textAnchor="middle" fontSize={18} fontFamily="serif">{e}</text>
          </g>
        );
      })()}

      <DrawnClothing slot="tops" drawnImg={drawnImages.tops}>
        {renderClothing('tops', topShapes)}
      </DrawnClothing>

      <DrawnClothing slot="jackets" drawnImg={drawnImages.jackets}>
        {renderClothing('jackets', jacketShapes)}
      </DrawnClothing>

      <DrawnClothing slot="dresses" drawnImg={drawnImages.dresses}>
        {renderClothing('dresses', dressShapes)}
      </DrawnClothing>

      {!outfit.dresses && (
        <DrawnClothing slot="pants" drawnImg={drawnImages.pants}>
          {renderClothing('pants', pantsShapes)}
        </DrawnClothing>
      )}

      {outfit.shoes && (() => {
        const e = getEmoji(topic, outfit.shoes);
        if (!e) return null;
        return <text x={CX} y={FOOT_Y + 8} textAnchor="middle" fontSize={24} fontFamily="serif">{e}</text>;
      })()}

      {outfit.hats && (() => {
        const e = getEmoji(topic, outfit.hats);
        if (!e) return null;
        return <text x={CX} y={HEAD_Y - 60} textAnchor="middle" fontSize={34} fontFamily="serif">{e}</text>;
      })()}
    </svg>
  );
}

export { getItemName };
