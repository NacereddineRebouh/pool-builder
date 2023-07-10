import { useTexture } from '@react-three/drei';
import React from 'react'
import { RepeatWrapping } from 'three';

type Props = {
  props: JSX.IntrinsicElements['mesh'];
  height:number;
  width:number;
  depth:number;
}

export default function PoolHelper({width,depth, height, props}:Props) {
  const texture = useTexture("/textures/cement.jpg");
  texture.wrapT = RepeatWrapping;
  texture.wrapS = RepeatWrapping;
  texture.repeat.set(1,1)
  return (
    <mesh renderOrder={0} {...props}>
        <boxGeometry args={[width,height,depth]}/>
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-0"}
          side={2}
          map={texture}
          color={"#aa8873"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-1"}
          side={2}
          map={texture}
          color={"#aa8873"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-3"}
          side={2}
          map={texture}
          color={"#aa8873"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-4"}
          side={2}
          map={texture}
          color={"#aa8873"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-5"}
          side={2}
          map={texture}
          color={"#aa8873"}
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-2"}
          side={2}
          colorWrite={false}
          // transparent
          // opacity={0}
        /> 
    </mesh>
  )
}