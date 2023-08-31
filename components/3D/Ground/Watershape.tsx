import React, { useRef, useMemo } from "react";
import {
  extend,
  useThree,
  useLoader,
  useFrame,
  Object3DNode,
} from "@react-three/fiber";
import * as THREE from "three";

import { Water } from "@/lib/Water2";
// import { Water } from "three/examples/jsm/objects/Water2";

extend({ Water });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: Object3DNode<Water, typeof Water>;
    }
  }
}
function Watershape({
  geometry,
  texture = "Water_1_M_Flow.jpg",
  scale = 0.2,
  reflectivity = 0.2,
  width = 0.2,
  textureSize = 64,
  height = 0.2,
  flowX = 0,
  flowY = -1,
  rotation = [-Math.PI / 2, 0, 0],
  position = [0, 4, 0],
  scaleArray = [1, 1, 1],
  ...props
}: {
  texture?: string;
  width?: number;
  height?: number;
  reflectivity?: number;
  scale?: number;
  textureSize?: number;
  flowX?: number;
  flowY?: number;
  geometry?: THREE.BufferGeometry;
  position: number[];
  rotation: number[];
  scaleArray?: number[];
}) {
  const ref = useRef<any>();
  const gl = useThree((state) => state.gl);
  const waterNormals = useLoader(
    THREE.TextureLoader,
    "/textures/water/" + texture
  );

  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(
    () => new THREE.PlaneGeometry(width, height),
    [width, height]
  );
  const config = useMemo(
    () => ({
      scale: scale,
      color: "#c3e0f7",
      flowDirection: new THREE.Vector2(flowX, flowY),
      textureWidth: textureSize,
      textureHeight: textureSize,
      // flowMap: waterNormals,
      reflectivity: reflectivity,
      clipBias: 0,
      flowspeed: 108,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [waterNormals]
  );
  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation={new THREE.Euler(...rotation)}
      scale={new THREE.Vector3(...scaleArray)}
      position={new THREE.Vector3(...position)}
    />
  );
}

export default Watershape;
