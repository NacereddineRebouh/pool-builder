"use client"
import { useTexture } from "@react-three/drei";
import { FC, Fragment } from "react";
import * as THREE from "three";

interface Props {
  position?: [number, number, number];
  width?: number;
  height?: number;
}

const SingleRoundStep: FC<Props> = ({
  position = [0, 0, 0],
  width = 1,
  height = 0.1,
}) => {
  // load tile texture
  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;

  return (
     
      <mesh position={position}>
         {/* <Base position={position}> */}
        <cylinderGeometry args={[width / 2, width / 2, height, 32]} />
        <meshStandardMaterial map={tileTexture} color={"lightblue"} />
      {/* </Base> */}
      </mesh>
  );
};

export default SingleRoundStep;
