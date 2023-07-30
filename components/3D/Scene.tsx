"use client";
import React, { useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Environment from "../Environment";
import { Perf } from "r3f-perf";
import Ground from "./Ground/Ground";
import Helper from "./Helpers/Helper";
import { AllModels } from "./All Models/AllModels";
type Props = {};
enum sides {
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
}
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
      <Helper />
      {/* <House/> */}
      <AllModels />
      {/* <CustomBox width={5} height={2} depth={4} /> */}
    </Canvas>
  );
}

export const MemoisedScene = React.memo(Scene);
