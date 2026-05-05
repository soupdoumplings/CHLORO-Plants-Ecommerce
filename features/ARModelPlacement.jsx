import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ARButton, XR, useHitTest, Interactive } from '@react-three/xr';
import { useGLTF } from '@react-three/drei';

/**
 * Component to handle WebXR hit testing and placing 3D models on detected planes.
 */
export default function ARModelPlacementWrapper({ 
  modelUrl = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf" 
}) {
  return (
    <div className="w-full h-[500px] relative bg-gray-800 rounded-xl overflow-hidden">
      <ARButton 
        sessionInit={{ requiredFeatures: ['hit-test'] }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
      />
      
      <Canvas>
        <XR>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <ARScene modelUrl={modelUrl} />
        </XR>
      </Canvas>
      
      <div className="absolute top-4 left-4 right-4 text-center pointer-events-none">
        <p className="text-white bg-black/60 p-3 rounded-xl text-sm backdrop-blur-md inline-block">
          Point camera at a flat surface (floor/table). Tap to place the plant.
        </p>
      </div>
    </div>
  );
}

function ARScene({ modelUrl }) {
  const reticleRef = useRef();
  const [models, setModels] = useState([]);

  // useHitTest continuously fires, providing intersection data with real-world planes
  useHitTest((hitMatrix, hit) => {
    if (reticleRef.current) {
      hitMatrix.decompose(
        reticleRef.current.position,
        reticleRef.current.quaternion,
        reticleRef.current.scale
      );
      reticleRef.current.rotation.set(-Math.PI / 2, 0, 0); // Lay reticle flat
      // Only show reticle if we have a valid hit
      reticleRef.current.visible = true;
    }
  });

  const placeModel = (e) => {
    // We only place when the reticle is visible (plane detected)
    if (reticleRef.current && reticleRef.current.visible) {
      const position = reticleRef.current.position.clone();
      setModels([...models, { id: Date.now(), position }]);
    }
  };

  return (
    <>
      {/* Invisible plane that catches taps to place objects */}
      <Interactive onSelect={placeModel}>
        <mesh visible={false} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </Interactive>

      {/* Reticle - A visual indicator of where the object will be placed */}
      <mesh ref={reticleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.1, 0.12, 32]} />
        <meshBasicMaterial color="#4ade80" />
      </mesh>

      {/* Render all placed models */}
      {models.map((model) => (
        <PlantModel key={model.id} position={model.position} url={modelUrl} />
      ))}
    </>
  );
}

// Separate component for the loaded model to handle individual state (scale, rotation)
function PlantModel({ position, url }) {
  // useGLTF automatically caches the loaded model
  const { scene } = useGLTF(url);
  const [scale, setScale] = useState(1);
  const clone = scene.clone(); // Clone so we can place multiple instances

  // Implement simple pinch-to-scale or tap-to-rotate here if desired using <Interactive>
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <primitive object={clone} />
    </group>
  );
}
