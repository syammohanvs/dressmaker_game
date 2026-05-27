export interface Item {
  e: string;
  n: string;
  c?: [string, string];
  b?: string;
}

export interface Topic {
  id: string;
  label: string;
  icon: string;
}

export type Slot = 'hats' | 'earrings' | 'tops' | 'dresses' | 'pants' | 'socks' | 'shoes' | 'jackets';

export const SLOTS: Slot[] = ['hats', 'earrings', 'tops', 'dresses', 'pants', 'socks', 'shoes', 'jackets'];

export const SKIN_TONES = [
  { id: 'light', label: 'Light', hex: '#f5d0b8' },
  { id: 'fair', label: 'Fair', hex: '#fce8d5' },
  { id: 'tan', label: 'Tan', hex: '#d4a574' },
  { id: 'olive', label: 'Olive', hex: '#c99a6b' },
  { id: 'brown', label: 'Brown', hex: '#8d5524' },
  { id: 'dark', label: 'Dark', hex: '#5c3a1e' },
];

export const HAIRSTYLES = [
  { id: 'short', label: 'Short', icon: '💇' },
  { id: 'long', label: 'Long', icon: '💇‍♀️' },
  { id: 'ponytail', label: 'Ponytail', icon: '🎀' },
  { id: 'bob', label: 'Bob Cut', icon: '✂️' },
  { id: 'curly', label: 'Curly', icon: '🦱' },
  { id: 'buzz', label: 'Buzz Cut', icon: '⚡' },
  { id: 'buns', label: 'Space Buns', icon: '🍩' },
  { id: 'mohawk', label: 'Mohawk', icon: '🦖' },
];

export const TOPICS: Topic[] = [
  { id: 'fantasy', label: 'Fantasy', icon: '🌟' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'space', label: 'Space', icon: '🚀' },
  { id: 'medieval', label: 'Medieval', icon: '🏰' },
  { id: 'party', label: 'Party', icon: '🎉' },
  { id: 'gothic', label: 'Gothic', icon: '🖤' },
  { id: 'sporty', label: 'Sporty', icon: '⚽' },
];

export const CAT_NAMES: Record<Slot, string> = {
  hats: '🎩 Hats',
  earrings: '💎 Earrings',
  tops: '👕 Tops',
  dresses: '👗 Dresses',
  pants: '👖 Pants',
  socks: '🧦 Socks',
  shoes: '👟 Shoes',
  jackets: '🧥 Jackets',
};

export const CAT_ORDER: Slot[] = ['hats', 'earrings', 'tops', 'dresses', 'pants', 'socks', 'shoes', 'jackets'];

export const ITEMS: Record<string, Record<string, Item[]>> = {
  fantasy: {
    hats: [
      { e: '🪄', n: 'Wizard Hat' }, { e: '👑', n: 'Golden Crown' }, { e: '🌸', n: 'Flower Crown' },
      { e: '🎀', n: 'Hair Bow' }, { e: '🌙', n: 'Crescent Tiara' },
    ],
    earrings: [
      { e: '💎', n: 'Gem Drops' }, { e: '✨', n: 'Star Studs' }, { e: '🌙', n: 'Moon Hoops' },
      { e: '🍄', n: 'Mushroom Dangles' },
    ],
    tops: [
      { e: '🧙', n: 'Magic Robe', c: ['#6a0dad', '#4a0080'], b: '#9b30ff' },
      { e: '🦸', n: 'Elven Tunic', c: ['#2d8a4e', '#1a6b34'], b: '#3cb371' },
      { e: '🧚', n: 'Fairy Bodice', c: ['#ff69b4', '#c2185b'], b: '#ffb6c1' },
      { e: '🌿', n: 'Druid Top', c: ['#556b2f', '#2e4a1a'], b: '#8fbc8f' },
      { e: '🔥', n: 'Phoenix Vest', c: ['#ff4500', '#b22222'], b: '#ff8c00' },
    ],
    dresses: [
      { e: '👗', n: 'Wizard Gown', c: ['#483d8b', '#2a1a5e'], b: '#7b68ee' },
      { e: '🌙', n: 'Moon Cloak Dress', c: ['#1a1a4e', '#0d0d2e'], b: '#4a4aff' },
      { e: '❄️', n: 'Ice Queen Gown', c: ['#b0e0e6', '#4682b4'], b: '#e0ffff' },
      { e: '🌊', n: 'Naiad Dress', c: ['#008b8b', '#005050'], b: '#20b2aa' },
    ],
    pants: [
      { e: '👖', n: 'Mystic Pants', c: ['#4a0080', '#2a0048'], b: '#9b30ff' },
      { e: '👖', n: 'Elven Leggings', c: ['#2d8a4e', '#1a6b34'], b: '#3cb371' },
      { e: '👖', n: 'Wizard Trousers', c: ['#483d8b', '#2a1a5e'], b: '#7b68ee' },
    ],
    socks: [
      { e: '🧦', n: 'Knight Socks' }, { e: '🧦', n: 'Striped Stockings' }, { e: '🧦', n: 'Lace Anklets' },
    ],
    shoes: [
      { e: '👢', n: 'Enchanted Boots' }, { e: '🩰', n: 'Glass Slippers' }, { e: '👞', n: 'Elven Shoes' },
    ],
    jackets: [
      { e: '🧥', n: 'Enchanted Robe', c: ['#4a0080', '#2a0048'], b: '#9b30ff' },
      { e: '🧙', n: 'Mystic Cloak', c: ['#1a1a4e', '#0d0d2e'], b: '#4a4aff' },
      { e: '🦋', n: 'Butterfly Cape', c: ['#ff69b4', '#c2185b'], b: '#ffb6c1' },
    ],
  },
  beach: {
    hats: [
      { e: '👒', n: 'Sun Hat' }, { e: '🧢', n: 'Visor' }, { e: '🌺', n: 'Flower Lei' },
      { e: '🧉', n: 'Straw Hat' }, { e: '🎀', n: 'Hibiscus Clip' },
    ],
    earrings: [
      { e: '🐚', n: 'Shell Studs' }, { e: '🌸', n: 'Flower Hoops' }, { e: '⭐', n: 'Starfish Drops' },
      { e: '💧', n: 'Pearl Dangles' },
    ],
    tops: [
      { e: '👙', n: 'Bikini Top', c: ['#ff6b9d', '#e8416a'], b: '#ff69b4' },
      { e: '👕', n: 'Hawaiian Shirt', c: ['#ff4500', '#ff8c00'], b: '#ffd700' },
      { e: '🏄', n: 'Rash Guard', c: ['#00bfff', '#0099cc'], b: '#00ffff' },
      { e: '☀️', n: 'Sunny Tank', c: ['#ffff00', '#ffa500'], b: '#fffacd' },
      { e: '🌊', n: 'Wave Tee', c: ['#20b2aa', '#008080'], b: '#7fffd4' },
    ],
    dresses: [
      { e: '👗', n: 'Sundress', c: ['#ff69b4', '#d6408a'], b: '#ffb6c1' },
      { e: '👗', n: 'Tropical Dress', c: ['#ff4500', '#0066ff'], b: '#ffd700' },
      { e: '👗', n: 'Beach Cover-Up', c: ['#ffefd5', '#deb887'], b: '#f5deb3' },
    ],
    pants: [
      { e: '🩳', n: 'Swim Trunks', c: ['#00bfff', '#006994'], b: '#00ffff' },
      { e: '🩳', n: 'Boardshorts', c: ['#ffa500', '#cc8400'], b: '#ffd700' },
      { e: '👖', n: 'Cargo Shorts', c: ['#deb887', '#b8860b'], b: '#f5deb3' },
      { e: '🧵', n: 'Crochet Bottoms', c: ['#fff8dc', '#fafad2'], b: '#fffff0' },
    ],
    socks: [
      { e: '🧦', n: 'No-Show Socks' }, { e: '🧦', n: 'Fishnet Socks' }, { e: '🧦', n: 'Striped Socks' },
    ],
    shoes: [
      { e: '🩴', n: 'Flip Flops' }, { e: '👟', n: 'Water Shoes' }, { e: '👡', n: 'Sandals' },
    ],
    jackets: [
      { e: '🧥', n: 'Beach Kimono', c: ['#ff6b9d', '#e8416a'], b: '#ff69b4' },
      { e: '👕', n: 'Mesh Cover-Up', c: ['#ffffff', '#f0f0f0'], b: '#ccc' },
      { e: '🧣', n: 'Sarong Wrap', c: ['#ff4500', '#ff8c00'], b: '#ffd700' },
    ],
  },
  professional: {
    hats: [
      { e: '🎩', n: 'Fedora' }, { e: '🧢', n: 'Beret' }, { e: '🎓', n: 'Graduate Cap' },
      { e: '🧠', n: 'Thinking Cap' },
    ],
    earrings: [
      { e: '💎', n: 'Pearl Studs' }, { e: '💍', n: 'Gold Hoops' }, { e: '✨', n: 'Diamond Drops' },
      { e: '⌚', n: 'Watch' },
    ],
    tops: [
      { e: '👔', n: 'Business Suit', c: ['#2c3e50', '#1a252f'], b: '#5d6d7e' },
      { e: '👕', n: 'Dress Shirt', c: ['#ffffff', '#f0f0f0'], b: '#cccccc' },
      { e: '🥼', n: 'Lab Coat', c: ['#f5f5f5', '#e0e0e0'], b: '#ffffff' },
      { e: '👚', n: 'Blouse', c: ['#ffb6c1', '#ff91a4'], b: '#ffc0cb' },
      { e: '🧶', n: 'Cardigan', c: ['#d3d3d3', '#a9a9a9'], b: '#808080' },
    ],
    dresses: [
      { e: '👗', n: 'Sheath Dress', c: ['#800020', '#4d0013'], b: '#b22222' },
      { e: '👗', n: 'Pencil Dress', c: ['#1a1a2e', '#0d0d1a'], b: '#4a4a6a' },
      { e: '👗', n: 'A-Line Dress', c: ['#2c3e50', '#1a252f'], b: '#5d6d7e' },
    ],
    pants: [
      { e: '👖', n: 'Dress Pants', c: ['#2c3e50', '#1a252f'], b: '#5d6d7e' },
      { e: '👗', n: 'Pencil Skirt', c: ['#4a4a4a', '#2d2d2d'], b: '#666666' },
      { e: '🩳', n: 'Chinos', c: ['#c3a87c', '#a08050'], b: '#deb887' },
    ],
    socks: [
      { e: '🧦', n: 'Dress Socks' }, { e: '🧦', n: 'Knee-Highs' }, { e: '🧦', n: 'Ankle Socks' },
    ],
    shoes: [
      { e: '👞', n: 'Oxfords' }, { e: '👠', n: 'Heels' }, { e: '👟', n: 'Loafers' },
    ],
    jackets: [
      { e: '🧥', n: 'Trench Coat', c: ['#c3a87c', '#a08050'], b: '#deb887' },
      { e: '🧥', n: 'Blazer', c: ['#1a1a2e', '#0d0d1a'], b: '#4a4a6a' },
      { e: '🧥', n: 'Cardigan', c: ['#d3d3d3', '#a9a9a9'], b: '#808080' },
    ],
  },
  space: {
    hats: [
      { e: '🪐', n: 'Astronaut Helmet' }, { e: '📡', n: 'Antenna' }, { e: '⭐', n: 'Star Headband' },
      { e: '🌙', n: 'Moon Crown' },
    ],
    earrings: [
      { e: '⭐', n: 'Star Studs' }, { e: '🌙', n: 'Moon Hoops' }, { e: '💫', n: 'Galaxy Drops' },
      { e: '🛸', n: 'UFO Dangles' },
    ],
    tops: [
      { e: '👨‍🚀', n: 'Space Suit', c: ['#ffffff', '#e0e0e0'], b: '#ff4444' },
      { e: '🌌', n: 'Star Uniform', c: ['#191970', '#0d0d4e'], b: '#4169e1' },
      { e: '🛸', n: 'Nebula Jacket', c: ['#8b008b', '#4a0080'], b: '#da70d6' },
      { e: '🌠', n: 'Shooting Star Top', c: ['#ffd700', '#b8860b'], b: '#fffacd' },
    ],
    dresses: [
      { e: '👗', n: 'Cosmic Dress', c: ['#483d8b', '#2a1a5e'], b: '#7b68ee' },
      { e: '🪐', n: 'Saturn Gown', c: ['#f0e68c', '#bdb76b'], b: '#eee8aa' },
      { e: '🌌', n: 'Nebula Dress', c: ['#8b008b', '#4a0080'], b: '#da70d6' },
    ],
    pants: [
      { e: '👖', n: 'Space Pants', c: ['#ffffff', '#d3d3d3'], b: '#a9a9a9' },
      { e: '🚀', n: 'Rocket Leggings', c: ['#ff4500', '#b22222'], b: '#ff8c00' },
      { e: '🌓', n: 'Lunar Trousers', c: ['#c0c0c0', '#808080'], b: '#dcdcdc' },
    ],
    socks: [
      { e: '🧦', n: 'Neon Socks' }, { e: '🧦', n: 'Gravity Socks' }, { e: '🧦', n: 'Moon Socks' },
    ],
    shoes: [
      { e: '👢', n: 'Moon Boots' }, { e: '👟', n: 'Gravity Sneakers' }, { e: '🥾', n: 'Magnetic Boots' },
    ],
    jackets: [
      { e: '🚀', n: 'Space Coat', c: ['#ffffff', '#e0e0e0'], b: '#ff4444' },
      { e: '🌌', n: 'Galaxy Jacket', c: ['#8b008b', '#4a0080'], b: '#da70d6' },
      { e: '🪐', n: 'Astro Vest', c: ['#191970', '#0d0d4e'], b: '#4169e1' },
    ],
  },
  medieval: {
    hats: [
      { e: '⛑️', n: 'Knight Helm' }, { e: '👑', n: 'Royal Crown' }, { e: '🎭', n: 'Masquerade Mask' },
      { e: '🌹', n: 'Rose Crown' }, { e: '🔔', n: 'Jester Hat' },
    ],
    earrings: [
      { e: '⚜️', n: 'Royal Studs' }, { e: '💎', n: 'Gem Hoops' }, { e: '🔔', n: 'Jingle Drops' },
      { e: '🕯️', n: 'Candle Dangles' },
    ],
    tops: [
      { e: '🛡️', n: 'Chainmail', c: ['#808080', '#505050'], b: '#a9a9a9' },
      { e: '🧥', n: 'Royal Tunic', c: ['#800020', '#4d0013'], b: '#ff0000' },
      { e: '🥋', n: 'Gambeson', c: ['#8b4513', '#5c2e0a'], b: '#a0522d' },
      { e: '⚔️', n: 'Plate Armor', c: ['#c0c0c0', '#808080'], b: '#ffd700' },
      { e: '👘', n: 'Noble Doublet', c: ['#191970', '#0d0d4e'], b: '#4169e1' },
    ],
    dresses: [
      { e: '👗', n: 'Long Skirt Dress', c: ['#2e4a1a', '#1a3310'], b: '#556b2f' },
      { e: '👗', n: 'Velvet Gown', c: ['#800020', '#4d0013'], b: '#ffd700' },
      { e: '👗', n: 'Peasant Dress', c: ['#d2b48c', '#a08050'], b: '#deb887' },
    ],
    pants: [
      { e: '👖', n: 'Leather Pants', c: ['#8b4513', '#5c2e0a'], b: '#a0522d' },
      { e: '🎌', n: 'Tabard', c: ['#800020', '#4d0013'], b: '#ffd700' },
      { e: '👖', n: 'Chain Chaps', c: ['#708090', '#505050'], b: '#a9a9a9' },
    ],
    socks: [
      { e: '🧦', n: 'Wool Socks' }, { e: '🧦', n: 'Knight Stockings' }, { e: '🧦', n: 'Lace Socks' },
    ],
    shoes: [
      { e: '👢', n: 'Knight Boots' }, { e: '🥾', n: 'Leather Boots' }, { e: '👞', n: 'Pilgrim Shoes' },
    ],
    jackets: [
      { e: '🧥', n: 'Royal Cloak', c: ['#800020', '#4d0013'], b: '#ffd700' },
      { e: '🛡️', n: 'Plate Armor', c: ['#c0c0c0', '#808080'], b: '#ffd700' },
      { e: '🐺', n: 'Fur Mantle', c: ['#8b4513', '#5c2e0a'], b: '#d2691e' },
    ],
  },
  party: {
    hats: [
      { e: '🎉', n: 'Party Hat' }, { e: '🎊', n: 'Confetti Crown' }, { e: '🎈', n: 'Balloon Hat' },
      { e: '👑', n: 'Birthday Crown' }, { e: '⭐', n: 'Star Headpiece' },
    ],
    earrings: [
      { e: '💡', n: 'Neon Studs' }, { e: '🎉', n: 'Confetti Drops' }, { e: '⭐', n: 'Sparkle Hoops' },
      { e: '🎊', n: 'Party Dangles' },
    ],
    tops: [
      { e: '✨', n: 'Sequined Top', c: ['#ffd700', '#b8860b'], b: '#fffacd' },
      { e: '🕺', n: 'Disco Shirt', c: ['#ff00ff', '#8b008b'], b: '#ff69b4' },
      { e: '💃', n: 'Fiesta Top', c: ['#ff1493', '#9400d3'], b: '#ff69b4' },
      { e: '🌟', n: 'Glitter Top', c: ['#c0c0c0', '#808080'], b: '#ffffff' },
      { e: '🎤', n: 'Karaoke Vest', c: ['#000000', '#1a1a1a'], b: '#ffd700' },
    ],
    dresses: [
      { e: '👗', n: 'Party Dress', c: ['#ff1493', '#8b008b'], b: '#ff69b4' },
      { e: '👗', n: 'Sequin Dress', c: ['#ffd700', '#b8860b'], b: '#fffacd' },
      { e: '🌈', n: 'Rainbow Dress', c: ['#ff0000', '#8b00ff'], b: '#ffffff' },
    ],
    pants: [
      { e: '👖', n: 'Glitter Pants', c: ['#c0c0c0', '#808080'], b: '#ffffff' },
      { e: '🩳', n: 'Sequin Shorts', c: ['#ffd700', '#b8860b'], b: '#fffacd' },
      { e: '👖', n: 'Neon Leggings', c: ['#00ff00', '#008000'], b: '#7fff00' },
      { e: '🎭', n: 'Harlequin Pants', c: ['#ff0000', '#0000ff'], b: '#ffd700' },
    ],
    socks: [
      { e: '🧦', n: 'Glow Socks' }, { e: '🧦', n: 'Striped Party Socks' }, { e: '🧦', n: 'Confetti Socks' },
    ],
    shoes: [
      { e: '🪩', n: 'Dancing Shoes' }, { e: '👠', n: 'Stilettos' }, { e: '👟', n: 'Glow Sneakers' },
    ],
    jackets: [
      { e: '🧥', n: 'Sequined Jacket', c: ['#ffd700', '#b8860b'], b: '#fffacd' },
      { e: '🌈', n: 'Rainbow Cape', c: ['#ff0000', '#8b00ff'], b: '#ffffff' },
      { e: '🧥', n: 'Confetti Blazer', c: ['#ff00ff', '#8b008b'], b: '#ff69b4' },
    ],
  },
  gothic: {
    hats: [
      { e: '🖤', n: 'Wide Brim Hat' }, { e: '🌹', n: 'Rose Crown' }, { e: '🕷️', n: 'Spider Veil' },
      { e: '🦇', n: 'Bat Headband' }, { e: '💀', n: 'Skull Cap' },
    ],
    earrings: [
      { e: '🖤', n: 'Black Heart Studs' }, { e: '🕷️', n: 'Spider Drops' }, { e: '🦇', n: 'Bat Hoops' },
      { e: '💀', n: 'Skull Dangles' },
    ],
    tops: [
      { e: '🖤', n: 'Velvet Corset', c: ['#1a0000', '#0d0000'], b: '#8b0000' },
      { e: '🥀', n: 'Withered Bodice', c: ['#4a0030', '#2a0018'], b: '#800040' },
      { e: '🦇', n: 'Batwing Top', c: ['#1a001a', '#0d000d'], b: '#4a004a' },
      { e: '🕸️', n: 'Web Shawl', c: ['#2a2a2a', '#1a1a1a'], b: '#4a4a4a' },
      { e: '💜', n: 'Purple Corset', c: ['#4a0080', '#2a0048'], b: '#9b30ff' },
    ],
    dresses: [
      { e: '👗', n: 'Gothic Dress', c: ['#1a0000', '#0d0000'], b: '#8b0000' },
      { e: '👗', n: 'Lace Dress', c: ['#2a2a2a', '#1a1a1a'], b: '#4a4a4a' },
      { e: '🌙', n: 'Midnight Gown', c: ['#000033', '#00001a'], b: '#000066' },
    ],
    pants: [
      { e: '👖', n: 'Vinyl Pants', c: ['#0a0a0a', '#000000'], b: '#333333' },
      { e: '👖', n: 'Fishnets', c: ['#1a0000', '#0d0000'], b: '#8b0000' },
      { e: '👗', n: 'Lace Petticoat', c: ['#2a2a2a', '#1a1a1a'], b: '#4a4a4a' },
      { e: '👗', n: 'Crinoline Skirt', c: ['#800080', '#4a004a'], b: '#da70d6' },
    ],
    socks: [
      { e: '🧦', n: 'Fishnet Socks' }, { e: '🧦', n: 'Lace Socks' }, { e: '🧦', n: 'Ripped Tights' },
    ],
    shoes: [
      { e: '👢', n: 'Platform Boots' }, { e: '👠', n: 'Stiletto Heels' }, { e: '🥿', n: 'Victorian Boots' },
    ],
    jackets: [
      { e: '🖤', n: 'Velvet Cape', c: ['#1a0000', '#0d0000'], b: '#8b0000' },
      { e: '🥀', n: 'Withered Shawl', c: ['#4a0030', '#2a0018'], b: '#800040' },
      { e: '🌑', n: 'Shadow Cloak', c: ['#0a0a0a', '#000000'], b: '#333' },
    ],
  },
  sporty: {
    hats: [
      { e: '🧢', n: 'Baseball Cap' }, { e: '⛑️', n: 'Football Helmet' }, { e: '🎾', n: 'Visor' },
      { e: '🎿', n: 'Beanie' }, { e: '🏃', n: 'Headband' },
    ],
    earrings: [
      { e: '⚡', n: 'Bolt Studs' }, { e: '🏅', n: 'Medal Hoops' }, { e: '💧', n: 'Sweat Drops' },
      { e: '⚽', n: 'Ball Dangles' },
    ],
    tops: [
      { e: '👕', n: 'Jersey', c: ['#ff0000', '#cc0000'], b: '#ffffff' },
      { e: '🎽', n: 'Tank Top', c: ['#00bfff', '#0099cc'], b: '#ffffff' },
      { e: '🏋️', n: 'Compression Shirt', c: ['#000000', '#1a1a1a'], b: '#ff0000' },
      { e: '👕', n: 'Retro Jersey', c: ['#00ff00', '#009900'], b: '#ffffff' },
      { e: '🥊', n: 'Boxing Tank', c: ['#ff0000', '#8b0000'], b: '#ffffff' },
    ],
    dresses: [
      { e: '👗', n: 'Tennis Dress', c: ['#ffffff', '#f0f0f0'], b: '#00bfff' },
      { e: '👗', n: 'Athletic Dress', c: ['#ff0000', '#cc0000'], b: '#ffffff' },
      { e: '👗', n: 'Sporty Skater Dress', c: ['#00bfff', '#0099cc'], b: '#ffffff' },
    ],
    pants: [
      { e: '🩳', n: 'Shorts', c: ['#000000', '#1a1a1a'], b: '#ffffff' },
      { e: '👖', n: 'Sweatpants', c: ['#808080', '#505050'], b: '#a9a9a9' },
      { e: '🩳', n: 'Compression Shorts', c: ['#0000ff', '#0000cc'], b: '#ffffff' },
      { e: '👖', n: 'Track Pants', c: ['#c0c0c0', '#808080'], b: '#ff0000' },
    ],
    socks: [
      { e: '🧦', n: 'Athletic Socks' }, { e: '🧦', n: 'Knee-High Socks' }, { e: '🧦', n: 'Compression Socks' },
    ],
    shoes: [
      { e: '👟', n: 'Running Shoes' }, { e: '🥾', n: 'Hiking Boots' }, { e: '👟', n: 'Basketball High-Tops' },
    ],
    jackets: [
      { e: '🧥', n: 'Track Jacket', c: ['#c0c0c0', '#808080'], b: '#ff0000' },
      { e: '🎿', n: 'Snow Jacket', c: ['#ff4500', '#b22222'], b: '#ffff00' },
      { e: '🏋️', n: 'Hoodie', c: ['#000000', '#1a1a1a'], b: '#ff0000' },
    ],
  },
};

export function getItem(topicId: string, slot: string, idx: number): Item | undefined {
  return ITEMS[topicId]?.[slot]?.[idx];
}
