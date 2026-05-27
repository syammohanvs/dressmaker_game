'use client';

import dynamic from 'next/dynamic';

export const Character3D = dynamic(() => import('./Character3D'), { ssr: false, loading: () => <div className="loading-3d">Loading 3D...</div> });

export default Character3D;
