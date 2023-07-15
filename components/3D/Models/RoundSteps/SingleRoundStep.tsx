/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.7 public/models/newModels/RoundStep.glb types
*/

import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Round_step: THREE.Mesh
  }
  materials: {
    ['pool texture 2']: THREE.MeshStandardMaterial
  }
}
export function SingleRoundStep({position,scale,...props}:{
  position:THREE.Vector3;
  scale:THREE.Vector3;
  props?: JSX.IntrinsicElements["group"]}) {
  const groupRef = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/models/newModels/roundStep.glb') as GLTFResult
  return (
    <group ref={groupRef} position={position} scale={scale} {...props} dispose={null}>
      <group name="Scene">
        <mesh name="Round_step" geometry={nodes.Round_step.geometry} material={materials['pool texture 2']} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/newModels/roundStep.glb')
