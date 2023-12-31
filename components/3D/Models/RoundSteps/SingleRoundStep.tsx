/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.7 public/models/newModels/RoundStep.glb types
*/

import React, { useRef } from "react";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
type GLTFResult = GLTF & {
  nodes: {
    Round_step: THREE.Mesh;
  };
  materials: {
    ["pool texture 2"]: THREE.MeshStandardMaterial;
  };
};

export function SingleRoundStep({
  position,
  scale,
  ...props
}: {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  props?: JSX.IntrinsicElements["group"];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(
    "/models/newModels/roundStep.glb"
  ) as GLTFResult;
  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;
  tileTexture.repeat.set(1, 1);
  tileTexture.colorSpace = THREE.SRGBColorSpace;
  tileTexture.needsUpdate = true;
  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      {...props}
      dispose={null}
    >
      <group name="Scene">
        <mesh
          name="Round_step"
          geometry={nodes.Round_step.geometry}
          //  material={materials['pool texture 2']}
        >
          <meshStandardMaterial
            map={tileTexture}
            metalness={0.2}
            roughness={0.1}
            color={"lightblue"}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/newModels/roundStep.glb");
