"use client";
import React, { Suspense, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Environment from "../Environment";
import { Perf } from "r3f-perf";
import Ground from "./Ground/Ground";
import Helper from "./Helpers/Helper";
import { AllModels } from "./All Models/AllModels";
import LShape from "./Models/L-Shape/L-Shape";
type Props = {};
export default function Scene({}: Props) {
  const cameraRef = useRef<any>(null);
  return (
    <Canvas>
      <Perf position={"bottom-right"} />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={true}
        position={[0, 1, 2]}
        near={0.1}
        far={200}
      />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />
      <Environment />

      <Ground />
      <Suspense>
        <Helper />
      </Suspense>
      {/* <House/> */}
      <AllModels />
      {/* <TestLShape width={4} theight={16} bheight={12} depth={2} /> */}
      {/* <CustomBox width={5} height={2} depth={4} /> */}
    </Canvas>
  );
}

export const MemoisedScene = React.memo(Scene);
