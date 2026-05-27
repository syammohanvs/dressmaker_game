'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export type Tool = 'pencil' | 'brush' | 'spray' | 'fill' | 'eraser' | 'line' | 'rect' | 'circle' | 'stamp' | 'undo';

const TOOLS: { id: Tool; icon: string; label: string }[] = [
  { id: 'pencil', icon: '✏️', label: 'Pencil' },
  { id: 'brush', icon: '🖌️', label: 'Brush' },
  { id: 'spray', icon: '🎨', label: 'Spray' },
  { id: 'fill', icon: '🪣', label: 'Fill' },
  { id: 'eraser', icon: '🧹', label: 'Eraser' },
  { id: 'line', icon: '📏', label: 'Line' },
  { id: 'rect', icon: '⬜', label: 'Rectangle' },
  { id: 'circle', icon: '⭕', label: 'Circle' },
  { id: 'stamp', icon: '💮', label: 'Stamp' },
  { id: 'undo', icon: '↩️', label: 'Undo' },
];

const PRESET_COLORS = [
  '#ff0000','#ff4500','#ff8c00','#ffd700','#ffff00','#adff2f','#00ff00','#00fa9a',
  '#00ffff','#1e90ff','#0000ff','#8a2be2','#ff00ff','#ff1493','#dc143c','#ffffff',
  '#c0c0c0','#808080','#4a4a4a','#000000','#8b4513','#d2691e','#f4a460','#ffe4b5',
  '#fff5ee','#f0fff0','#e0ffff','#f0f8ff','#ffe4e1','#fff0f5','#faf0e6','#f5f5dc',
  '#2f4f4f','#696969','#556b2f','#8b008b','#800000','#483d8b','#2e8b57','#daa520',
  '#ff6347','#ee82ee','#87ceeb','#6b8e23','#b8860b','#cd853f','#b22222','#5f9ea0',
  '#9acd32','#7b68ee','#f08080','#20b2aa','#8470ff','#32cd32','#ffa07a','#ffdead',
  '#b0e0e6','#dda0dd','#98fb98','#afeeee','#db7093','#ffe4c4','#ffdab9','#e6e6fa',
];

const BRUSH_SIZES = [2, 4, 8, 16, 24];

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

interface Props {
  width: number;
  height: number;
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function DrawingCanvas({ width, height, onSave, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const undoStack = useRef<ImageData[]>([]);
  const drawStart = useRef<{ x: number; y: number } | null>(null);

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * scaleX, y: (t.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (undoStack.current.length > 50) undoStack.current.shift();
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }, []);

  const drawDot = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }, [tool, color, brushSize]);

  const drawLineTo = useCallback((ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }, [tool, color, brushSize]);

  const fillArea = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const w = ctx.canvas.width, h = ctx.canvas.height;
    const idx = (y * w + x) * 4;
    const targetR = imageData.data[idx], targetG = imageData.data[idx + 1], targetB = imageData.data[idx + 2], targetA = imageData.data[idx + 3];

    // Parse fill color
    const tmp = document.createElement('canvas');
    tmp.width = 1; tmp.height = 1;
    const tmpCtx = tmp.getContext('2d')!;
    tmpCtx.fillStyle = color;
    tmpCtx.fillRect(0, 0, 1, 1);
    const fillData = tmpCtx.getImageData(0, 0, 1, 1).data;
    const fillR = fillData[0], fillG = fillData[1], fillB = fillData[2], fillA = fillData[3];

    const match = (i: number) => {
      return Math.abs(imageData.data[i] - targetR) < 10 &&
             Math.abs(imageData.data[i + 1] - targetG) < 10 &&
             Math.abs(imageData.data[i + 2] - targetB) < 10 &&
             Math.abs(imageData.data[i + 3] - targetA) < 10;
    };

    const stack = [[x, y]];
    const visited = new Set<number>();
    const key = (px: number, py: number) => px + py * w;

    while (stack.length > 0) {
      const [px, py] = stack.pop()!;
      const k = key(px, py);
      if (visited.has(k) || px < 0 || px >= w || py < 0 || py >= h) continue;
      const i = (py * w + px) * 4;
      if (!match(i)) continue;
      visited.add(k);
      imageData.data[i] = fillR;
      imageData.data[i + 1] = fillG;
      imageData.data[i + 2] = fillB;
      imageData.data[i + 3] = fillA;
      stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }, [color]);

  const handleStart = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'undo') {
      if (undoStack.current.length > 0) {
        ctx.putImageData(undoStack.current.pop()!, 0, 0);
      }
      return;
    }

    if (tool === 'fill') {
      saveState();
      fillArea(ctx, Math.round(pos.x), Math.round(pos.y));
      return;
    }

    saveState();
    setIsDrawing(true);
    lastPos.current = pos;
    drawStart.current = pos;

    if (tool === 'pencil' || tool === 'brush') {
      drawDot(ctx, pos.x, pos.y);
    }
    if (tool === 'spray') {
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * brushSize;
        drawDot(ctx, pos.x + Math.cos(angle) * dist, pos.y + Math.sin(angle) * dist);
      }
    }
    if (tool === 'stamp') {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pos.x + brushSize * 0.5, pos.y - brushSize * 0.5, brushSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }, [getPos, tool, color, brushSize, saveState, fillArea, drawDot]);

  const handleMove = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPos.current) return;
    const pos = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      drawLineTo(ctx, lastPos.current, pos);
      lastPos.current = pos;
    }
    if (tool === 'spray') {
      const steps = Math.max(1, Math.round(distance(lastPos.current.x, lastPos.current.y, pos.x, pos.y) / 3));
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const px = lastPos.current.x + (pos.x - lastPos.current.x) * t;
        const py = lastPos.current.y + (pos.y - lastPos.current.y) * t;
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * brushSize;
          drawDot(ctx, px + Math.cos(angle) * dist, py + Math.sin(angle) * dist);
        }
      }
      lastPos.current = pos;
    }
  }, [isDrawing, getPos, tool, brushSize, drawLineTo, drawDot]);

  const handleEnd = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !lastPos.current || !drawStart.current) {
      setIsDrawing(false);
      lastPos.current = null;
      drawStart.current = null;
      return;
    }
    const pos = getPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'line') {
      drawLineTo(ctx, drawStart.current, pos);
    }
    if (tool === 'rect') {
      const x = Math.min(drawStart.current.x, pos.x);
      const y = Math.min(drawStart.current.y, pos.y);
      const w = Math.abs(pos.x - drawStart.current.x);
      const h = Math.abs(pos.y - drawStart.current.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(x, y, w, h);
    }
    if (tool === 'circle') {
      const cx = (drawStart.current.x + pos.x) / 2;
      const cy = (drawStart.current.y + pos.y) / 2;
      const r = distance(drawStart.current.x, drawStart.current.y, pos.x, pos.y) / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    setIsDrawing(false);
    lastPos.current = null;
    drawStart.current = null;
  }, [isDrawing, getPos, tool, color, brushSize, drawLineTo]);

  return (
    <div className="drawing-editor">
      <div className="toolbar">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`tool-btn${tool === t.id ? ' active' : ''}`}
            onClick={() => setTool(t.id)}
            title={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>

      <div className="draw-options">
        <div className="color-palette">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              className={`color-swatch${color === c ? ' active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="custom-color-input"
            title="Custom color"
          />
        </div>
        <div className="size-selector">
          {BRUSH_SIZES.map((s) => (
            <button
              key={s}
              className={`size-btn${brushSize === s ? ' active' : ''}`}
              onClick={() => setBrushSize(s)}
            >
              <span className="size-dot" style={{ width: s, height: s }} />
            </button>
          ))}
        </div>
      </div>

      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="draw-canvas"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      <div className="draw-actions">
        <button className="draw-btn cancel" onClick={onCancel}>Cancel</button>
        <button className="draw-btn save" onClick={() => {
          const dataUrl = canvasRef.current?.toDataURL();
          if (dataUrl) onSave(dataUrl);
        }}>Apply Design</button>
      </div>

      <style jsx>{`
        .drawing-editor {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(10, 10, 30, 0.95);
          display: flex;
          flex-direction: column;
          padding: 10px;
        }
        .toolbar {
          display: flex;
          gap: 4px;
          justify-content: center;
          padding: 8px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .tool-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.15s;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tool-btn:hover { background: rgba(255,255,255,0.15); }
        .tool-btn.active { border-color: #ffd200; background: rgba(255,210,0,0.15); }
        .draw-options {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .color-palette {
          display: flex;
          gap: 3px;
          flex-wrap: wrap;
          flex: 1;
          padding: 6px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
          max-height: 80px;
          overflow-y: auto;
        }
        .color-swatch {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .color-swatch:hover { transform: scale(1.2); }
        .color-swatch.active { border-color: #ffd200; box-shadow: 0 0 6px rgba(255,210,0,0.5); }
        .custom-color-input {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
          background: none;
          flex-shrink: 0;
        }
        .size-selector {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 6px 10px;
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .size-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 2px solid transparent;
          cursor: pointer;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .size-btn:hover { background: rgba(255,255,255,0.15); }
        .size-btn.active { border-color: #ffd200; }
        .size-dot {
          display: block;
          background: #aab;
          border-radius: 50%;
        }
        .canvas-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px;
          border-radius: 12px;
          overflow: hidden;
          touch-action: none;
        }
        .draw-canvas {
          max-width: 100%;
          max-height: 100%;
          cursor: crosshair;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
        }
        .draw-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .draw-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }
        .draw-btn.cancel {
          background: rgba(255,255,255,0.1);
          color: #aab;
        }
        .draw-btn.cancel:hover { background: rgba(255,255,255,0.16); }
        .draw-btn.save {
          background: linear-gradient(135deg, #f7971e, #ffd200);
          color: #1a1a2e;
        }
        .draw-btn.save:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(255,210,0,0.3); }
      `}</style>
    </div>
  );
}
