import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR } from '@react-three/xr';
import { Html } from '@react-three/drei';
import { X, Droplet, Sun } from 'lucide-react';

/**
 * The ARInfoCard component displays a 3D overlay with plant information.
 * Note: WebXR requires a secure context (HTTPS) and a supported browser/device (e.g. Chrome on Android).
 */
export default function ARInfoCardWrapper({ plantData }) {
  // Default mock data if none provided
  const data = plantData || {
    name: "Monstera Deliciosa",
    species: "Monstera deliciosa",
    watering: "Every 1-2 weeks",
    sunlight: "Bright, indirect light",
    description: "Known for its natural leaf holes, the Monstera is a popular houseplant that is easy to care for."
  };

  return (
    <div className="w-full h-[500px] relative bg-gray-900 rounded-xl overflow-hidden">
      {/* ARButton injects the "Enter AR" button into the DOM overlay */}
      <ARButton 
        sessionInit={{ requiredFeatures: ['hit-test'] }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white text-black font-bold py-3 px-6 rounded-full shadow-lg"
      />
      
      <Canvas>
        <XR>
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          
          {/* We position the card 1 meter in front of the user's starting position */}
          <group position={[0, 0, -1]}>
            <ARInfoCard data={data} />
          </group>
        </XR>
      </Canvas>
      
      {/* Fallback/instructions overlay */}
      <div className="absolute top-4 left-4 right-4 text-center pointer-events-none">
        <p className="text-white bg-black/50 p-2 rounded-lg text-sm backdrop-blur-md">
          Tap "Enter AR" on a supported mobile browser to view this card in your physical space.
        </p>
      </div>
    </div>
  );
}

function ARInfoCard({ data }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    // The Html component from drei allows us to render standard DOM elements in 3D space
    <Html
      transform
      occlude
      distanceFactor={1.5} // Scales the HTML to feel physically sized
      position={[0, 0, 0]}
    >
      <div className="w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 select-none">
        {/* Close Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
          <p className="text-sm italic text-gray-500">{data.species}</p>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-blue-50/80 p-2 rounded-lg flex items-center gap-2">
            <Droplet size={16} className="text-blue-500" />
            <div>
              <p className="text-[10px] text-blue-600 font-bold uppercase">Water</p>
              <p className="text-xs text-gray-800">{data.watering}</p>
            </div>
          </div>
          <div className="flex-1 bg-yellow-50/80 p-2 rounded-lg flex items-center gap-2">
            <Sun size={16} className="text-yellow-500" />
            <div>
              <p className="text-[10px] text-yellow-600 font-bold uppercase">Light</p>
              <p className="text-xs text-gray-800">{data.sunlight}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {data.description}
        </p>
        
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">AR View Active</span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </Html>
  );
}
