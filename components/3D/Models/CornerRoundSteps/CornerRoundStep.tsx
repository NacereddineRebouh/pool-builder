/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.7 public/models/newModels/cornerRoundStep.glb
*/

import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
type GLTFResult = GLTF & {
  nodes: {
    Corner_round_step: THREE.Mesh
  }
  materials: {
    ['pool texture']: THREE.MeshStandardMaterial
  }
}
export function CornerRoundStep({position,scale,rotation,...props}:{ rotation:THREE.Euler;
  position:THREE.Vector3;
  scale:THREE.Vector3;
  props?: JSX.IntrinsicElements["group"]}) {
  const groupRef = useRef<THREE.Group>(null)

  const { nodes, materials, animations } = useGLTF('/models/newModels/cornerRoundStep.glb') as GLTFResult
  return (
    <group ref={groupRef} rotation={rotation} position={position} scale={scale} {...props} dispose={null}>
      <group name="Scene">
        <mesh name="Corner_round_step" geometry={nodes.Corner_round_step.geometry} material={materials['pool texture']} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/newModels/cornerRoundStep.glb')
