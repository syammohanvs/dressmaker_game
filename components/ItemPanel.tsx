'use client';

import { useState } from 'react';
import { CAT_ORDER, CAT_NAMES, ITEMS, type Slot } from '@/lib/data';

interface Outfit {
  [slot: string]: string | undefined;
}

interface Props {
  topic: string;
  currentCat: string;
  outfit: Outfit;
  onSelectCat: (cat: string) => void;
  onToggleItem: (slot: string, idx: number) => void;
  onCustomItem: (slot: string, color1: string, color2: string) => void;
  onStartDrawing: (slot: string) => void;
  onRemoveDrawn: (slot: string) => void;
  onUnequip: (slot: string) => void;
}

const DEFAULT_COLORS: Record<string, [string, string]> = {
  tops: ['#6a0dad', '#4a0080'],
  dresses: ['#ff1493', '#8b008b'],
  pants: ['#2c3e50', '#1a252f'],
  jackets: ['#c3a87c', '#a08050'],
  hats: ['#ffd700', '#b8860b'],
  earrings: ['#ffd700', '#b8860b'],
  socks: ['#ffffff', '#cccccc'],
  shoes: ['#8B4513', '#5c2e0a'],
};

export default function ItemPanel({ topic, currentCat, outfit, onSelectCat, onToggleItem, onCustomItem, onStartDrawing, onRemoveDrawn, onUnequip }: Props) {
  const [showCustom, setShowCustom] = useState(false);
  const [customC1, setCustomC1] = useState(DEFAULT_COLORS[currentCat]?.[0] ?? '#ff0000');
  const [customC2, setCustomC2] = useState(DEFAULT_COLORS[currentCat]?.[1] ?? '#000000');

  const items = ITEMS[topic]?.[currentCat] ?? [];
  const isCustomEquipped = outfit[currentCat]?.startsWith('_custom');
  const isDrawnEquipped = outfit[currentCat] === '_drawn';

  const handleApplyCustom = () => {
    onCustomItem(currentCat, customC1, customC2);
    setShowCustom(false);
  };

  const handleOpenCustom = () => {
    const d = DEFAULT_COLORS[currentCat];
    if (d) { setCustomC1(d[0]); setCustomC2(d[1]); }
    setShowCustom(true);
  };

  const handleDraw = () => {
    setShowCustom(false);
    onStartDrawing(currentCat);
  };

  const handleRemove = () => {
    if (isDrawnEquipped) {
      onRemoveDrawn(currentCat);
    } else {
      onUnequip(currentCat);
    }
  };

  return (
    <div className="panel-card">
      <h3>{CAT_NAMES[currentCat as Slot] || currentCat}</h3>
      <div className="cat-tabs">
        {CAT_ORDER.filter((c) => ITEMS[topic]?.[c]).map((cat) => (
          <button
            key={cat}
            className={`cat-tab${cat === currentCat ? ' active' : ''}`}
            onClick={() => { onSelectCat(cat); setShowCustom(false); }}
          >
            {(CAT_NAMES[cat as Slot] || cat).split(' ').slice(1).join(' ')}
          </button>
        ))}
      </div>
      <div className="items-grid">
        {items.length === 0 ? (
          <div className="empty-msg">No items yet</div>
        ) : (
          items.map((item, idx) => {
            const key = `${currentCat}-${idx}`;
            const equipped = outfit[currentCat] === key;
            const isCloth = !!item.c;
            return (
              <div
                key={idx}
                className={`item-btn${equipped ? ' equipped' : ''}`}
                onClick={() => { onToggleItem(currentCat, idx); setShowCustom(false); }}
              >
                <span className="emoji">{item.e}</span>
                <span className="iname">
                  {isCloth && item.c ? (
                    <span className="color-swatch" style={{ background: item.c[0] }} />
                  ) : null}
                  {item.n}
                </span>
              </div>
            );
          })
        )}

        {/* Custom options */}
        {isCustomEquipped ? (
          <div className="item-btn equipped custom-btn" onClick={handleRemove}>
            <span className="emoji">🎨</span>
            <span className="iname">Custom Gradient</span>
          </div>
        ) : isDrawnEquipped ? (
          <div className="item-btn equipped custom-btn" onClick={handleRemove}>
            <span className="emoji">✏️</span>
            <span className="iname">Drawn Design</span>
          </div>
        ) : (
          <>
            <div className="item-btn custom-btn" onClick={handleDraw}>
              <span className="emoji">✏️</span>
              <span className="iname">Draw Design</span>
            </div>
            <div className="item-btn custom-btn" onClick={handleOpenCustom}>
              <span className="emoji">🎨</span>
              <span className="iname">Quick Color</span>
            </div>
          </>
        )}
      </div>

      {showCustom && (
        <div className="custom-picker">
          <div className="picker-row">
            <div className="picker-group">
              <label>Color 1</label>
              <input type="color" value={customC1} onChange={(e) => setCustomC1(e.target.value)} />
            </div>
            <div className="picker-group">
              <label>Color 2</label>
              <input type="color" value={customC2} onChange={(e) => setCustomC2(e.target.value)} />
            </div>
          </div>
          <div className="preview-swatch" style={{ background: `linear-gradient(135deg, ${customC1}, ${customC2})` }} />
          <button className="apply-btn" onClick={handleApplyCustom}>Apply</button>
        </div>
      )}

      <style jsx>{`
        .panel-card {
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 14px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .panel-card h3 {
          font-size: 14px;
          color: #aab;
          margin-bottom: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cat-tabs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .cat-tab {
          padding: 4px 10px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.2s;
          background: rgba(255,255,255,0.08);
          color: #889;
        }
        .cat-tab:hover { background: rgba(255,255,255,0.14); color: #bbc; }
        .cat-tab.active { background: #ffd200; color: #1a1a2e; }
        .items-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .item-btn {
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px 4px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          border: 2px solid transparent;
          user-select: none;
        }
        .item-btn:hover { background: rgba(255,255,255,0.14); transform: translateY(-1px); }
        .item-btn.equipped {
          border-color: #ffd200;
          background: rgba(255,210,0,0.12);
          box-shadow: 0 0 12px rgba(255,210,0,0.1);
        }
        .item-btn .emoji { font-size: 24px; display: block; }
        .item-btn .iname {
          font-size: 10px;
          color: #99a;
          margin-top: 3px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .color-swatch {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 3px;
          vertical-align: middle;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .empty-msg {
          color: #667;
          font-size: 12px;
          text-align: center;
          padding: 12px 0;
          grid-column: 1 / -1;
        }
        .custom-btn {
          border: 2px dashed rgba(255,210,0,0.3);
        }
        .custom-btn:hover {
          border-color: #ffd200;
          background: rgba(255,210,0,0.08);
        }
        .custom-picker {
          margin-top: 10px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .picker-row {
          display: flex;
          gap: 12px;
          margin-bottom: 8px;
        }
        .picker-group {
          flex: 1;
        }
        .picker-group label {
          font-size: 10px;
          color: #889;
          display: block;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .picker-group input {
          width: 100%;
          height: 36px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          background: none;
          padding: 0;
        }
        .picker-group input::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        .picker-group input::-webkit-color-swatch {
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: 8px;
        }
        .preview-swatch {
          width: 100%;
          height: 24px;
          border-radius: 8px;
          margin-bottom: 8px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .apply-btn {
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          background: linear-gradient(135deg, #f7971e, #ffd200);
          color: #1a1a2e;
          transition: all 0.2s;
        }
        .apply-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255,210,0,0.3);
        }
      `}</style>
    </div>
  );
}
