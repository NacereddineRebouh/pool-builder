import { useTexture } from '@react-three/drei';
import React from 'react'
import { RepeatWrapping } from 'three';

type Props = {
    props: JSX.IntrinsicElements['mesh'];
    bottom:number;
    top:number;
    height:number;
}

export default function CylinderHelper({bottom,top, height, props}:Props) {
  const texture = useTexture("/textures/cement.jpg");
  texture.wrapT = RepeatWrapping;
  texture.wrapS = RepeatWrapping;
  texture.repeat.set(1,1)
  return (
    <mesh renderOrder={0} {...props}>
        <cylinderGeometry args={[top,bottom,height]}/>
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-2"}
          map={texture}
          side={2}
          color={"#aa8873"}
        //   opacity={.7}
        //   transparent
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-0"}
          map={texture}
          side={2}
          color={"#aa8873"}
        //   opacity={.7}
        //   transparent
        /> 
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.24}
          attach={"material-1"}
          side={2}
          map={texture}
          colorWrite={false}
        //   transparent
        //   opacity={0}
        /> 
    </mesh>
  )
}