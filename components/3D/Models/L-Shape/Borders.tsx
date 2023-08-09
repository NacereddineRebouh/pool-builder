import { PivotControls } from "@/components/UI/pivotControls";
import { Brush } from "@react-three/csg";
import { useMask, useTexture } from "@react-three/drei";
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
  let scale = [1, 1, 1];
  let postionOffset = [0, 0, 0]; // offset pool center
  let val = poolWidth;
  switch (true) {
    case side === "left": // Depth
      rotation[0] = -degToRad(90);
      rotation[2] = degToRad(90);
      scale[2] = -1;
      // rotation[1] = degToRad(0);
      postionOffset = [-poolbHeight / 2, 0, 0];
      break;
    case side === "top": // width
      rotation[0] = degToRad(-90);
      scale[2] = -1;
      postionOffset = [0, 0, -poolWidth / 2];
      val = poolbHeight - poolWidth;
      break;
    case side === "bottom": // width
      rotation[0] = degToRad(90);
      postionOffset = [0, 0, poolWidth / 2];
      val = poolbHeight;
      break;

    case side === "tleft": // Depth
      rotation[0] = -degToRad(90);
      rotation[2] = degToRad(90);
      scale[2] = -1;
      postionOffset = [-poolWidth / 2, 0, 0];
      val = pooltHeight - poolWidth;
      break;
    case side === "tright": // Depth
      rotation[0] = degToRad(90);
      rotation[2] = -degToRad(90);
      // scale[2] = -1;
      postionOffset = [poolWidth / 2, 0, 0];
      val = pooltHeight;

      break;
    case side === "ttop": // width
      rotation[0] = degToRad(-90);
      scale[2] = -1;
      postionOffset = [0, 0, -pooltHeight / 2];
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

  let v = height * 5;
  if (side === "tleft") v = -height * 5;
  let squareShape = new THREE.Shape()
    .moveTo(-val / 2, 0)
    .lineTo(-val / 2 - height * 5, height * 5) // bottom side
    .lineTo(val / 2 + height * 5, height * 5) // top side
    .lineTo(val / 2, 0);
  if (side === "tleft")
    squareShape = new THREE.Shape()
      .moveTo(-val / 2, 0)
      .lineTo(-val / 2 + height * 5, height * 5) // bottom side
      .lineTo(val / 2 + height * 5, height * 5) // top side
      .lineTo(val / 2, 0);
  if (side === "top")
    squareShape = new THREE.Shape()
      .moveTo(-val / 2, 0)
      .lineTo(-val / 2 - height * 5, height * 5) // bottom side
      .lineTo(val / 2 - height * 5, height * 5) // top side
      .lineTo(val / 2, 0);
  const geometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);
  const stencil = useMask(1, true);
  return (
    <group
      position={[
        position.x + postionOffset[0],
        height + postionOffset[1],
        position.z + postionOffset[2],
      ]}
    >
      <mesh
        geometry={geometry}
        ref={outerWall}
        rotation={[rotation[0], rotation[1], rotation[2]]}
        scale={[scale[0], scale[1], scale[2]]}
      >
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.3}
          color={"#d6dee7"}
          map={cementTexture}
          {...stencil}
        />
      </mesh>
    </group>
  );
};

export default LShapeBorders;
