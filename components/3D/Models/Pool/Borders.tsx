import { Brush } from "@react-three/csg";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { FC, ReactElement,useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";

interface Props {
  width: number;
  height: number;
  depth: number;
  poolWidth: number;
  poolDepth: number;
  outline: number;
  side: string;
  position: { x: number; y: number; z: number };
}


const Borders: FC<Props> = ({
  width,
  height,
  depth,
  side,poolDepth,poolWidth,
  position,
}): ReactElement => {
  // Textures
  const cementTexture = useTexture("/textures/cement.jpg");
  cementTexture.wrapT = THREE.RepeatWrapping;
  cementTexture.wrapS = THREE.RepeatWrapping;
  cementTexture.repeat.set(1/10, 1/10);

  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;

  // Bounding boxes
  const outerWall = useRef<Brush>(null);

  const { scene } = useThree();
  let rotation = [0,0,0];
  let postionOffset = [0,0,0]; // offset pool center
  switch (side) {
    case "left": // Depth 
        rotation[1]=0;
        rotation[0]=degToRad(90);
        postionOffset = [0,height,poolDepth/2]
        break;
    case "right": // Depth 
        rotation[1]=degToRad(180);
        rotation[0]=-degToRad(90);
        postionOffset = [0,height,-poolDepth/2]
        break;
    case "top": // width
        rotation[1]=degToRad(0); 
        rotation[0]=-degToRad(90); 
        rotation[2]=-degToRad(90); 
        postionOffset = [poolWidth/2,0,0]
        const temp = poolWidth
        poolWidth = poolDepth
        poolDepth = temp
        break;
case "bottom": // width 
        rotation[1]=-degToRad(180); 
        rotation[0]=-degToRad(90); 
        rotation[2]=-degToRad(90); 
        postionOffset = [-poolWidth/2, height, 0]
        const temp2 = poolWidth
        poolWidth = poolDepth
        poolDepth = temp2
        break;
  
    default:
        break;
  }
  const extrudeSettings = { depth: height, bevelEnabled: false, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  const squareShape = new THREE.Shape()
  .moveTo( -poolWidth/2, 0 )
  .lineTo( -poolWidth/2-height, height )
  .lineTo( poolWidth/2+height, height )
  .lineTo( poolWidth/2, 0 )
  const geometry = new THREE.ExtrudeGeometry( squareShape, extrudeSettings );

  return (
    <group position={[position.x,0.1, position.z]}>
        <mesh geometry={geometry} rotation={[rotation[0], rotation[1], rotation[2]]} position={[postionOffset[0], postionOffset[1], postionOffset[2]]} ref={outerWall}>
          {/* <boxGeometry args={[width, height, depth]} /> */}
          <meshStandardMaterial
            metalness={.2}
            roughness={0.3}
            color={"#d6dee7"}
            map={cementTexture}
          />
        </mesh>
    </group>
  );
};

export default Borders;
