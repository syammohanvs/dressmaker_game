'use client';

import { useMemo, useRef, type JSX } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const SKIN = '#e7c1a5';
const EYE = '#222';

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

type ClothShape = (c1: string, texture: THREE.Texture | null) => JSX.Element;

// ==================== TEXTURE UTILITY ====================

function makeTexture(dataUrl: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = dataUrl;
  ctx.drawImage(img, 0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ==================== BODY ====================

function Body({ skin }: { skin: string }) {
  return (
    <group>
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.1, 12]} />
        <meshStandardMaterial color={skin} roughness={0.6} />
      </mesh>
      <RoundedBox position={[0, 1.15, 0]} args={[0.55, 0.55, 0.3]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={skin} roughness={0.6} />
      </RoundedBox>
      {[-0.38, 0.38].map((x, i) => (
        <group key={`arm-${i}`}>
          <mesh position={[x, 1.3, 0]} rotation={[0, 0, 0.15 * (i === 0 ? 1 : -1)]}>
            <cylinderGeometry args={[0.08, 0.07, 0.4, 10]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {[-0.12, 0.12].map((x) => (
        <group key={`leg-${x}`}>
          <mesh position={[x, 0.42, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.5, 10]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
          <mesh position={[x, 0.12, 0.04]}>
            <boxGeometry args={[0.14, 0.08, 0.22]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {[-0.12, 0.12].map((x) => (
        <mesh key={`eye-${x}`} position={[x, 1.9, 0.3]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color={EYE} />
        </mesh>
      ))}
      <mesh position={[0, 1.76, 0.3]}>
        <torusGeometry args={[0.04, 0.008, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#c76c6c" />
      </mesh>
    </group>
  );
}

// ==================== HAIR ====================

function Hair({ style }: { style: string }) {
  const hc = '#5d4037';
  const common = { color: hc, roughness: 0.8 } as const;
  switch (style) {
    case 'short':
      return (
        <mesh position={[0, 1.88, 0.05]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[0.36, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial {...common} side={THREE.DoubleSide} />
        </mesh>
      );
    case 'long':
      return (
        <group>
          <mesh position={[0, 1.9, 0.05]} rotation={[0.1, 0, 0]}>
            <sphereGeometry args={[0.37, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial {...common} side={THREE.DoubleSide} />
          </mesh>
          {[-0.15, 0.15].map((x) => (
            <mesh key={x} position={[x, 1.4, 0.05]}>
              <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
              <meshStandardMaterial {...common} />
            </mesh>
          ))}
        </group>
      );
    case 'ponytail':
      return (
        <group>
          <mesh position={[0, 1.9, 0.05]} rotation={[0.1, 0, 0]}>
            <sphereGeometry args={[0.36, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial {...common} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.2, 1.75, -0.05]} rotation={[0.3, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.07, 0.35, 8]} />
            <meshStandardMaterial {...common} />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh position={[0, 1.9, 0.05]} rotation={[0.1, 0, 0]}>
          <sphereGeometry args={[0.36, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial {...common} side={THREE.DoubleSide} />
        </mesh>
      );
  }
}

// ==================== CLOTHING ====================

const topShapes: ClothShape[] = [
  (c, tex) => (
    <group>
      <RoundedBox position={[0, 1.15, 0]} args={[0.5, 0.5, 0.28]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </RoundedBox>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 1.25, 0]} rotation={[0, 0, 0.3 * (x > 0 ? -1 : 1)]}>
          <cylinderGeometry args={[0.07, 0.05, 0.15, 8]} />
          <meshStandardMaterial color={c} map={tex} roughness={0.7} />
        </mesh>
      ))}
    </group>
  ),
  (c, tex) => (
    <RoundedBox position={[0, 1.15, 0]} args={[0.35, 0.5, 0.25]} radius={0.04} smoothness={4}>
      <meshStandardMaterial color={c} map={tex} roughness={0.7} />
    </RoundedBox>
  ),
  (c, tex) => (
    <group>
      <RoundedBox position={[0, 1.15, 0]} args={[0.48, 0.48, 0.26]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </RoundedBox>
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, 1.14, 0]} rotation={[0, 0, 0.4 * (x > 0 ? -1 : 1)]}>
          <cylinderGeometry args={[0.08, 0.04, 0.2, 8]} />
          <meshStandardMaterial color={c} map={tex} roughness={0.7} />
        </mesh>
      ))}
    </group>
  ),
  (c, tex) => (
    <group>
      <RoundedBox position={[0, 1.2, 0]} args={[0.52, 0.6, 0.3]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={c} map={tex} roughness={0.9} />
      </RoundedBox>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 1.35, 0]} rotation={[0, 0, 0.2 * (x > 0 ? -1 : 1)]}>
          <cylinderGeometry args={[0.06, 0.05, 0.35, 8]} />
          <meshStandardMaterial color={c} map={tex} roughness={0.9} />
        </mesh>
      ))}
    </group>
  ),
  (c, tex) => (
    <RoundedBox position={[0, 1.05, 0]} args={[0.45, 0.28, 0.26]} radius={0.05} smoothness={4}>
      <meshStandardMaterial color={c} map={tex} roughness={0.7} />
    </RoundedBox>
  ),
  (c, tex) => (
    <group>
      <RoundedBox position={[0, 1.1, 0]} args={[0.6, 0.45, 0.28]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </RoundedBox>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 1.18, 0]} rotation={[0, 0, 0.2 * (x > 0 ? -1 : 1)]}>
          <cylinderGeometry args={[0.06, 0.05, 0.12, 8]} />
          <meshStandardMaterial color={c} map={tex} roughness={0.7} />
        </mesh>
      ))}
    </group>
  ),
  (c, tex) => (
    <group>
      <RoundedBox position={[0, 1.15, 0]} args={[0.48, 0.5, 0.28]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </RoundedBox>
      {[-0.33, 0.33].map((x) => (
        <mesh key={x} position={[x, 1.25, 0]} rotation={[0, 0, 0.3 * (x > 0 ? -1 : 1)]}>
          <cylinderGeometry args={[0.07, 0.05, 0.14, 8]} />
          <meshStandardMaterial color={c} map={tex} roughness={0.7} />
        </mesh>
      ))}
    </group>
  ),
  (c, tex) => (
    <RoundedBox position={[0, 1.15, 0]} args={[0.3, 0.48, 0.22]} radius={0.04} smoothness={4}>
      <meshStandardMaterial color={c} map={tex} roughness={0.7} />
    </RoundedBox>
  ),
  (c, tex) => (
    <group>
      <RoundedBox position={[0, 1.2, 0]} args={[0.4, 0.35, 0.25]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.25, 0.38, 0.12, 12]} />
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </mesh>
    </group>
  ),
  (c, tex) => (
    <group>
      <RoundedBox position={[0, 1.15, 0]} args={[0.48, 0.5, 0.28]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </RoundedBox>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]} rotation={[0, 0, 0.2 * (x > 0 ? -1 : 1)]}>
          <cylinderGeometry args={[0.06, 0.05, 0.32, 8]} />
          <meshStandardMaterial color={c} map={tex} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.13, 0.14, 0.08, 12]} />
        <meshStandardMaterial color={c} map={tex} roughness={0.7} />
      </mesh>
    </group>
  ),
];

const dressShapes: ClothShape[] = [
  (c, tex) => <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.22, 0.5, 1.0, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>,
  (c, tex) => <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.25, 0.35, 1.0, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>,
  (c, tex) => (<group><mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.2, 0.35, 1.0, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh><mesh position={[0, 1.3, 0]}><cylinderGeometry args={[0.22, 0.18, 0.15, 12]} /><meshStandardMaterial color={c} roughness={0.7} /></mesh></group>),
  (c, tex) => <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.16, 0.28, 1.0, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.4} /></mesh>,
  (c, tex) => (<group><mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.22, 0.65, 0.9, 20]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh><mesh position={[0, 1.25, 0]}><cylinderGeometry args={[0.24, 0.22, 0.2, 12]} /><meshStandardMaterial color={c} roughness={0.7} /></mesh></group>),
  (c, tex) => <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.24, 0.3, 1.0, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.5} /></mesh>,
  (c, tex) => <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.2, 0.45, 1.0, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>,
  (c, tex) => (<group><mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.24, 0.28, 0.7, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh><mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.26, 0.55, 0.3, 20]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh></group>),
  (c, tex) => <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.28, 0.35, 0.8, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>,
  (c, tex) => <mesh position={[0, 0.8, 0]}><cylinderGeometry args={[0.25, 0.48, 1.3, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>,
];

const pantsShapes: ClothShape[] = [
  (c, tex) => (<group>{[-0.11, 0.11].map((x) => <mesh key={x} position={[x, 0.38, 0]}><cylinderGeometry args={[0.09, 0.08, 0.55, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => (<group>{[-0.11, 0.11].map((x) => <mesh key={x} position={[x, 0.35, 0]}><cylinderGeometry args={[0.1, 0.12, 0.25, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => (<group>{[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.38, 0]}><cylinderGeometry args={[0.08, 0.14, 0.55, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.15, 0.38, 0.5, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>,
  (c, tex) => (<group>{[-0.11, 0.11].map((x) => <mesh key={x} position={[x, 0.3, 0]}><cylinderGeometry args={[0.09, 0.07, 0.35, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => (<group>{[-0.1, 0.1].map((x) => <mesh key={x} position={[x, 0.38, 0]}><cylinderGeometry args={[0.08, 0.06, 0.55, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => (<group>{[-0.11, 0.11].map((x) => <mesh key={x} position={[x, 0.38, 0]}><cylinderGeometry args={[0.08, 0.13, 0.55, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => (<group>{[-0.12, 0.12].map((x) => <mesh key={x} position={[x, 0.38, 0]}><cylinderGeometry args={[0.1, 0.09, 0.55, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => (<group>{[-0.11, 0.11].map((x) => <mesh key={x} position={[x, 0.3, 0]}><cylinderGeometry args={[0.1, 0.11, 0.15, 10]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => (<group>{[-0.14, 0.14].map((x) => <mesh key={x} position={[x, 0.38, 0]}><cylinderGeometry args={[0.08, 0.18, 0.55, 12]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
];

const jacketShapes: ClothShape[] = [
  (c, tex) => (<group><RoundedBox position={[0, 1.15, 0.02]} args={[0.55, 0.55, 0.22]} radius={0.05} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.6} /></RoundedBox>{[-0.38, 0.38].map((x) => <mesh key={x} position={[x, 1.3, 0]} rotation={[0, 0, 0.15 * (x > 0 ? -1 : 1)]}><cylinderGeometry args={[0.07, 0.06, 0.4, 8]} /><meshStandardMaterial color={c} map={tex} roughness={0.6} /></mesh>)}</group>),
  (c, tex) => <mesh position={[0, 0.9, 0]}><coneGeometry args={[0.6, 1.0, 20]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} side={THREE.DoubleSide} /></mesh>,
  (c, tex) => (<group><RoundedBox position={[0, 1.1, 0.02]} args={[0.52, 0.6, 0.24]} radius={0.05} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.6} /></RoundedBox>{[-0.36, 0.36].map((x) => <mesh key={x} position={[x, 1.3, 0]} rotation={[0, 0, 0.18 * (x > 0 ? -1 : 1)]}><cylinderGeometry args={[0.06, 0.05, 0.45, 8]} /><meshStandardMaterial color={c} map={tex} roughness={0.6} /></mesh>)}<mesh position={[0, 0.65, 0]}><cylinderGeometry args={[0.26, 0.4, 0.3, 16]} /><meshStandardMaterial color={c} map={tex} roughness={0.6} /></mesh></group>),
  (c, tex) => (<group><RoundedBox position={[0, 1.15, 0]} args={[0.5, 0.45, 0.28]} radius={0.06} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.5} /></RoundedBox>{[-0.36, 0.36].map((x) => <mesh key={x} position={[x, 1.2, 0]} rotation={[0, 0, 0.2 * (x > 0 ? -1 : 1)]}><cylinderGeometry args={[0.07, 0.06, 0.3, 8]} /><meshStandardMaterial color={c} map={tex} roughness={0.5} /></mesh>)}</group>),
  (c, tex) => (<group><RoundedBox position={[0, 1.15, 0.01]} args={[0.52, 0.5, 0.26]} radius={0.04} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.9} /></RoundedBox>{[-0.36, 0.36].map((x) => <mesh key={x} position={[x, 1.25, 0]} rotation={[0, 0, 0.2 * (x > 0 ? -1 : 1)]}><cylinderGeometry args={[0.06, 0.05, 0.35, 8]} /><meshStandardMaterial color={c} map={tex} roughness={0.9} /></mesh>)}</group>),
  (c, tex) => (<group><RoundedBox position={[0, 1.15, 0.02]} args={[0.5, 0.5, 0.24]} radius={0.04} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.3} metalness={0.3} /></RoundedBox>{[-0.35, 0.35].map((x) => <mesh key={x} position={[x, 1.25, 0]} rotation={[0, 0, 0.18 * (x > 0 ? -1 : 1)]}><cylinderGeometry args={[0.06, 0.05, 0.35, 8]} /><meshStandardMaterial color={c} map={tex} roughness={0.3} metalness={0.3} /></mesh>)}</group>),
  (c, tex) => <RoundedBox position={[0, 1.15, 0]} args={[0.48, 0.5, 0.3]} radius={0.08} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.8} /></RoundedBox>,
  (c, tex) => (<group><RoundedBox position={[0, 1.15, 0.01]} args={[0.5, 0.55, 0.24]} radius={0.05} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.7} /></RoundedBox>{[-0.4, 0.4].map((x) => <mesh key={x} position={[x, 1.3, 0]} rotation={[0, 0, 0.15 * (x > 0 ? -1 : 1)]}><cylinderGeometry args={[0.06, 0.05, 0.4, 8]} /><meshStandardMaterial color={c} map={tex} roughness={0.7} /></mesh>)}</group>),
  (c, tex) => <RoundedBox position={[0, 1.2, 0]} args={[0.5, 0.3, 0.26]} radius={0.05} smoothness={4}><meshStandardMaterial color={c} map={tex} roughness={0.7} /></RoundedBox>,
  (c, tex) => <mesh position={[0, 0.95, 0]}><coneGeometry args={[0.6, 0.7, 20]} /><meshStandardMaterial color={c} map={tex} roughness={0.8} side={THREE.DoubleSide} /></mesh>,
];

// ==================== CHARACTER ====================

function Character({ topic, outfit, skinTone, hairstyle, drawnImages }: Props) {
  const clothingConfig = [
    { slot: 'tops' as const, shapes: topShapes },
    { slot: 'dresses' as const, shapes: dressShapes },
    { slot: 'pants' as const, shapes: pantsShapes },
    { slot: 'jackets' as const, shapes: jacketShapes },
  ];

  const textures = useMemo(() => {
    const t: Record<string, THREE.Texture | null> = {};
    for (const slot of ['tops', 'dresses', 'pants', 'jackets']) {
      t[slot] = drawnImages[slot] ? makeTexture(drawnImages[slot]) : null;
    }
    return t;
  }, [drawnImages]);

  function renderClothing(slot: string, shapes: ClothShape[]) {
    const key = outfit[slot];
    if (!key) return null;
    const tex = textures[slot] ?? null;
    if (key === '_drawn') {
      return shapes[0]('#888', tex);
    }
    const parts = key.split('-');
    const idx = parseInt(parts[1], 10);
    const shapeIdx = idx % shapes.length;
    return shapes[shapeIdx]('#888', tex);
  }

  return (
    <group>
      <Body skin={skinTone || SKIN} />
      <Hair style={hairstyle} />

      {outfit.socks && (
        <group>
          {[-0.11, 0.11].map((x) => (
            <mesh key={x} position={[x, 0.12, 0]}>
              <cylinderGeometry args={[0.09, 0.08, 0.12, 10]} />
              <meshStandardMaterial color="#fff" roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}

      {outfit.earrings && (
        <group>
          {[-0.4, 0.4].map((x) => (
            <mesh key={x} position={[x, 1.65, 0]} rotation={[0, 0, 0.2]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {renderClothing('tops', topShapes)}
      {renderClothing('jackets', jacketShapes)}
      {renderClothing('dresses', dressShapes)}
      {!outfit.dresses && renderClothing('pants', pantsShapes)}

      {outfit.shoes && (
        <group>
          {[-0.11, 0.11].map((x) => (
            <mesh key={x} position={[x, 0.04, 0.06]}>
              <boxGeometry args={[0.14, 0.06, 0.24]} />
              <meshStandardMaterial color="#8B4513" roughness={0.6} />
            </mesh>
          ))}
        </group>
      )}

      {outfit.hats && (
        <mesh position={[0, 2.1, 0]}>
          <coneGeometry args={[0.3, 0.25, 16]} />
          <meshStandardMaterial color="#ffd700" roughness={0.5} />
        </mesh>
      )}
    </group>
  );
}

// ==================== SCENE ====================

export default function Scene3D(props: Props) {
  return (
    <Canvas camera={{ position: [0, 1.2, 3.5], fov: 40, near: 0.1, far: 10 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} />
      <directionalLight position={[-2, 1, -3]} intensity={0.3} />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={2}
        maxDistance={6}
        enableDamping
        dampingFactor={0.1}
      />
      <Character {...props} />
    </Canvas>
  );
}
