"use client";
import React, { Suspense, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Environment from "../Environment";
import { Perf } from "r3f-perf";
import Ground from "./Ground/Ground";
import Helper from "./Helpers/Helper";
import { AllModels } from "./All Models/AllModels";
import { Euler, PlaneGeometry, Vector3 } from "three";
type Props = {};
export default function Scene({}: Props) {
  const cameraRef = useRef<any>(null);
  const g = new PlaneGeometry(5, 5);
  return (
    <Canvas>
      <Perf position={"bottom-right"} />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={true}
        position={[0, 1, 2]}
        near={0.1}
        far={100}
      />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />
      <Environment />
      <Ground />
      <Suspense>
        <Helper />
      </Suspense>
      <Suspense></Suspense>
      <AllModels />
    </Canvas>
  );
}

export const MemoisedScene = React.memo(Scene);
