'use client';

import { useState, useCallback, useRef } from 'react';
import { TOPICS, SLOTS, ITEMS, SKIN_TONES, HAIRSTYLES, getItem } from '@/lib/data';
import ThreeDCharacter from '@/components/ThreeCanvas';
import ItemPanel from '@/components/ItemPanel';
import DrawingCanvas from '@/components/DrawingCanvas';

interface Outfit {
  [slot: string]: string | undefined;
}

const PALETTE = [
  '#ff0000','#ff4500','#ff8c00','#ffd700','#ffff00','#adff2f','#00ff00','#00fa9a',
  '#00ffff','#1e90ff','#0000ff','#8a2be2','#ff00ff','#ff1493','#dc143c','#ffffff',
  '#c0c0c0','#808080','#4a4a4a','#000000','#8b4513','#d2691e','#f4a460','#ffe4b5',
  '#fff5ee','#f0fff0','#e0ffff','#f0f8ff','#ffe4e1','#fff0f5','#faf0e6','#f5f5dc',
  '#2f4f4f','#696969','#556b2f','#8b008b','#800000','#483d8b','#2e8b57','#daa520',
  '#ff6347','#ee82ee','#87ceeb','#6b8e23','#b8860b','#cd853f','#b22222','#5f9ea0',
  '#9acd32','#7b68ee','#f08080','#20b2aa','#8470ff','#32cd32','#ffa07a','#ffdead',
  '#b0e0e6','#dda0dd','#98fb98','#afeeee','#db7093','#ffe4c4','#ffdab9','#e6e6fa',
  '#ff69b4','#ba55d3','#7b68ee','#00ced1','#7fff00','#ff4500','#daa520','#cd853f',
];

export default function Home() {
  const [currentTopic, setCurrentTopic] = useState('fantasy');
  const [currentCat, setCurrentCat] = useState('hats');
  const [outfit, setOutfit] = useState<Outfit>({});
  const [skinTone, setSkinTone] = useState('#f5d0b8');
  const [hairstyle, setHairstyle] = useState('short');
  const [toastMsg, setToastMsg] = useState('');
  const [drawnImages, setDrawnImages] = useState<Record<string, string>>({});
  const [drawingSlot, setDrawingSlot] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined as unknown as ReturnType<typeof setTimeout>);




  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 2000);
  }, []);

  const selectTopic = useCallback((id: string) => {
    setCurrentTopic(id);
    setCurrentCat('hats');
    showToast(`Switched to ${TOPICS.find((t) => t.id === id)?.label}`);
  }, [showToast]);

  const selectCat = useCallback((cat: string) => {
    setCurrentCat(cat);
  }, []);

  const toggleItem = useCallback((cat: string, idx: number) => {
    const key = `${cat}-${idx}`;
    setOutfit((prev) => {
      if (prev[cat] === key) {
        const next = { ...prev };
        delete next[cat];
        return next;
      }
      return { ...prev, [cat]: key };
    });
  }, []);

  const setCustomItem = useCallback((cat: string, c1: string, c2: string) => {
    const key = `_custom#${c1},${c2}`;
    setOutfit((prev) => {
      if (prev[cat] === key) {
        const next = { ...prev };
        delete next[cat];
        return next;
      }
      return { ...prev, [cat]: key };
    });
    showToast(`🎨 Custom ${cat} applied!`);
  }, [showToast]);

  const startDrawing = useCallback((cat: string) => {
    setDrawingSlot(cat);
  }, []);

  const saveDrawing = useCallback((dataUrl: string) => {
    if (!drawingSlot) return;
    setDrawnImages((prev) => ({ ...prev, [drawingSlot]: dataUrl }));
    setOutfit((prev) => ({ ...prev, [drawingSlot]: '_drawn' }));
    setDrawingSlot(null);
    showToast(`✏️ ${drawingSlot} design applied!`);
  }, [drawingSlot, showToast]);

  const cancelDrawing = useCallback(() => {
    setDrawingSlot(null);
  }, []);

  const removeDrawn = useCallback((cat: string) => {
    setDrawnImages((prev) => {
      const next = { ...prev };
      delete next[cat];
      return next;
    });
    setOutfit((prev) => {
      const next = { ...prev };
      delete next[cat];
      return next;
    });
  }, []);

  const unequip = useCallback((cat: string) => {
    setOutfit((prev) => {
      const next = { ...prev };
      delete next[cat];
      return next;
    });
  }, []);

  const randomOutfit = useCallback(() => {
    const newOutfit: Outfit = {};
    for (const slot of SLOTS) {
      const slotItems = ITEMS[currentTopic]?.[slot];
      if (slotItems && slotItems.length) {
        const idx = Math.floor(Math.random() * slotItems.length);
        newOutfit[slot] = `${slot}-${idx}`;
      }
    }
    setOutfit(newOutfit);
    showToast('🎲 Random outfit generated!');
  }, [currentTopic, showToast]);

  const clearAll = useCallback(() => {
    setOutfit({});
    setDrawnImages({});
    showToast('🗑️ Cleared all items');
  }, [showToast]);

  const shareOutfit = useCallback(async () => {
    const theme = TOPICS.find((t) => t.id === currentTopic);
    const parts = [`✨ *Dress-Up Adventure - ${theme?.label}* ✨`];
    let hasItems = false;
    for (const slot of SLOTS) {
      const key = outfit[slot];
      if (key) {
        if (key === '_drawn') {
          parts.push(`🎨 Custom drawn ${slot}`);
          hasItems = true;
          continue;
        }
        const [cat, idxStr] = key.split('-');
        const idx = parseInt(idxStr, 10);
        const item = getItem(currentTopic, cat, idx);
        if (item) {
          parts.push(`${item.e} ${item.n}`);
          hasItems = true;
        }
      }
    }
    if (!hasItems) parts.push('_(no items equipped yet!)_');
    const text = parts.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast('📋 Copied outfit to clipboard!');
    } catch {
      showToast('📋 Select & copy the outfit text');
    }
  }, [currentTopic, outfit, showToast]);

  const toggleSkinTone = useCallback((hex: string) => {
    setSkinTone(hex);
  }, []);

  const toggleHairstyle = useCallback((id: string) => {
    setHairstyle(id);
    showToast(`Hairstyle: ${HAIRSTYLES.find((h) => h.id === id)?.label}`);
  }, [showToast]);

  return (
    <>
      <div className="header">
        <h1>👗 Dress-Up Adventure</h1>
        <p>Mix & match looks across different themes</p>
      </div>

      <div className="topic-bar">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            className={`topic-btn${t.id === currentTopic ? ' active' : ''}`}
            onClick={() => selectTopic(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="layout">
        <div className="char-area">
          <div className="char-card char-3d">
            <ThreeDCharacter topic={currentTopic} outfit={outfit} skinTone={skinTone} hairstyle={hairstyle} drawnImages={drawnImages} />
          </div>
          <div className="rot-hint">Drag to rotate in 3D</div>

          <div className="customize-row">
            <div className="customize-group">
              <span className="label">Skin</span>
              <div className="swatches">
                {SKIN_TONES.map((st) => (
                  <button
                    key={st.id}
                    className={`swatch${skinTone === st.hex ? ' active' : ''}`}
                    style={{ background: st.hex }}
                    onClick={() => toggleSkinTone(st.hex)}
                    title={st.label}
                  />
                ))}
              </div>
            </div>
            <div className="customize-group">
              <span className="label">Hair</span>
              <div className="hair-btns">
                {HAIRSTYLES.map((h) => (
                  <button
                    key={h.id}
                    className={`hair-btn${hairstyle === h.id ? ' active' : ''}`}
                    onClick={() => toggleHairstyle(h.id)}
                    title={h.label}
                  >
                    {h.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="palette-group">
            <button className="palette-toggle" onClick={() => setShowPalette(!showPalette)}>
              🎨 Colors {showPalette ? '▲' : '▼'}
            </button>
            {showPalette && (
              <div className="palette-grid">
                {PALETTE.map((c, i) => (
                  <button
                    key={i}
                    className="palette-swatch"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-card actions">
            <button className="btn-random" onClick={randomOutfit}>🎲 Random</button>
            <button className="btn-clear" onClick={clearAll}>🗑️ Clear</button>
            <button className="btn-share" onClick={shareOutfit}>📋 Copy</button>
          </div>
          <ItemPanel
            topic={currentTopic}
            currentCat={currentCat}
            outfit={outfit}
            onSelectCat={selectCat}
            onToggleItem={toggleItem}
            onCustomItem={setCustomItem}
            onStartDrawing={startDrawing}
            onRemoveDrawn={removeDrawn}
            onUnequip={unequip}
          />
        </div>
      </div>

      {drawingSlot && (
        <DrawingCanvas
          width={400}
          height={500}
          onSave={saveDrawing}
          onCancel={cancelDrawing}
        />
      )}

      <div className={`toast${toastMsg ? ' show' : ''}`}>{toastMsg}</div>

      <style jsx>{`
        .header {
          text-align: center;
          padding: 20px 10px 10px;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .header h1 {
          font-size: 28px;
          background: linear-gradient(135deg, #f7971e, #ffd200);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header p { font-size: 13px; color: #8899aa; margin-top: 2px; }
        .layout {
          display: flex;
          gap: 15px;
          padding: 15px;
          max-width: 1300px;
          margin: 0 auto;
          min-height: calc(100vh - 90px);
        }
        .topic-bar {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
          padding: 8px 10px;
          background: rgba(255,255,255,0.05);
          margin: 0 15px;
          border-radius: 12px;
        }
        .topic-btn {
          padding: 6px 16px;
          border-radius: 20px;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
          background: rgba(255,255,255,0.08);
          color: #aab;
        }
        .topic-btn:hover { background: rgba(255,255,255,0.15); transform: translateY(-1px); }
        .topic-btn.active {
          border-color: #ffd200;
          background: rgba(255,210,0,0.15);
          color: #ffd200;
          box-shadow: 0 0 20px rgba(255,210,0,0.15);
        }
        .char-area { flex: 1; display: flex; flex-direction: column; align-items: center; min-width: 300px; }
        .char-card {
          background: rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 20px;
          width: 100%;
          max-width: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .rotatable { width: 100%; }
        .rot-hint {
          font-size: 11px;
          color: #556;
          margin-top: 4px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .customize-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
          width: 100%;
          max-width: 380px;
          flex-wrap: wrap;
        }
        .customize-group {
          flex: 1;
          min-width: 140px;
          background: rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .customize-group .label {
          font-size: 11px;
          color: #889;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 6px;
        }
        .swatches { display: flex; gap: 5px; flex-wrap: wrap; }
        .swatch {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .swatch:hover { transform: scale(1.15); }
        .swatch.active { border-color: #ffd200; box-shadow: 0 0 8px rgba(255,210,0,0.4); }
        .hair-btns { display: flex; gap: 4px; flex-wrap: wrap; }
        .hair-btn {
          padding: 4px 8px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
          background: rgba(255,255,255,0.08);
          line-height: 1;
        }
        .hair-btn:hover { background: rgba(255,255,255,0.15); }
        .hair-btn.active { border-color: #ffd200; background: rgba(255,210,0,0.12); }
        .palette-group {
          width: 100%;
          max-width: 380px;
          margin-top: 8px;
        }
        .palette-toggle {
          width: 100%;
          padding: 6px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          cursor: pointer;
          color: #889;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;
        }
        .palette-toggle:hover { background: rgba(255,255,255,0.1); }
        .palette-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
          padding: 8px;
          margin-top: 4px;
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          max-height: 120px;
          overflow-y: auto;
        }
        .palette-swatch {
          width: 18px;
          height: 18px;
          border-radius: 3px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.1s;
        }
        .palette-swatch:hover { transform: scale(1.3); z-index: 1; }
        .panel { width: 290px; flex-shrink: 0; }
        .panel-card {
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 14px;
          margin-bottom: 12px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .actions button {
          flex: 1;
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
          min-width: 70px;
        }
        .btn-random { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
        .btn-random:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(102,126,234,0.4); }
        .btn-clear { background: rgba(255,255,255,0.1); color: #aab; }
        .btn-clear:hover { background: rgba(255,255,255,0.16); }
        .btn-share { background: linear-gradient(135deg, #f7971e, #ffd200); color: #1a1a2e; }
        .btn-share:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(255,210,0,0.3); }
        .toast {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.85);
          color: #fff;
          padding: 10px 24px;
          border-radius: 10px;
          font-size: 13px;
          z-index: 999;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .toast.show { opacity: 1; }
        @media (max-width: 820px) {
          .layout { flex-direction: column; align-items: center; }
          .panel { width: 100%; max-width: 400px; }
          .char-card { max-width: 320px; }
        }
        @media (max-width: 500px) {
          .header h1 { font-size: 22px; }
          .topic-btn { font-size: 11px; padding: 4px 12px; }
        }
      `}</style>
    </>
  );
}
