import { Brush } from "@react-three/csg";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { FC, ReactElement, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";

interface Props {
  width: number;
  height: number;
  depth: number;
  poolWidth: number;
  pooltHeight: number;
  poolbHeight: number;
  outline: number;
  side: string;
  position: { x: number; y: number; z: number };
}

const LShapeBorders: FC<Props> = ({
  width,
  height,
  depth,
  side,
  pooltHeight,
  poolbHeight,
  poolWidth,
  position,
}): ReactElement => {
  // Textures
  const cementTexture = useTexture("/textures/cement.jpg");
  cementTexture.wrapT = THREE.RepeatWrapping;
  cementTexture.wrapS = THREE.RepeatWrapping;
  cementTexture.repeat.set(1 / 4, 1 / 4);

  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;

  // Bounding boxes
  const outerWall = useRef<Brush>(null);
  let rotation = [0, 0, 0];
  let postionOffset = [0, 0, 0]; // offset pool center
  switch (true) {
    case side === "left": // Depth
      rotation[1] = 0;
      rotation[0] = degToRad(90);
      postionOffset = [-poolbHeight / 2, 0];
      break;
    case side === "top": // width
      postionOffset = [0, -height, -poolWidth / 2];
      poolWidth = poolbHeight - poolWidth;
      break;
    case side === "bottom": // width
      rotation[1] = -degToRad(180);
      rotation[0] = -degToRad(90);
      rotation[2] = -degToRad(90);
      postionOffset = [0, 0, -poolWidth / 2];
      poolWidth = poolbHeight;
      break;

    case side === "tleft": // Depth
      rotation[1] = 0;
      rotation[0] = degToRad(90);
      postionOffset = [-poolWidth / 2, 0, 0];
      poolWidth = pooltHeight - poolWidth;
      break;
    case side === "tright": // Depth
      rotation[1] = degToRad(180);
      rotation[0] = -degToRad(90);
      postionOffset = [poolWidth / 2, 0, 0];
      poolWidth = pooltHeight;

      break;
    case side === "ttop": // width
      rotation[1] = degToRad(0);
      rotation[0] = -degToRad(90);
      rotation[2] = -degToRad(90);
      postionOffset = [0, -height, -pooltHeight / 2];
      break;

    default:
      break;
  }
  const extrudeSettings = {
    depth: height,
    bevelEnabled: false,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1,
    bevelOffset: 1,
  };
  const squareShape = new THREE.Shape()
    .moveTo(-poolWidth / 2, 0)
    .lineTo(-poolWidth / 2 - height * 5, height * 5)
    .lineTo(poolWidth / 2 + height * 5, height * 5)
    .lineTo(poolWidth / 2, 0);
  const geometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);

  return (
    <group position={[position.x, height, position.z]}>
      <mesh
        geometry={geometry}
        rotation={[rotation[0], rotation[1], rotation[2]]}
        position={[postionOffset[0], postionOffset[1], postionOffset[2]]}
        ref={outerWall}
      >
        {/* <boxGeometry args={[width, height, depth]} /> */}
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.3}
          color={"#d6dee7"}
          map={cementTexture}
        />
      </mesh>
    </group>
  );
};

export default LShapeBorders;
