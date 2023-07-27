"use client";
import React, { useRef } from "react";
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Environment from "../Environment";
import { Perf } from "r3f-perf";
import Ground from "./Ground/Ground";
import Helper from "./Helpers/Helper";
import { useAppSelector } from "@/store/hooks";
import { selectPools, selectShapes } from "@/slices/shapesSlice";
import { selectPools as selectAllPools } from "@/slices/poolsSlice";
import * as THREE from "three";
import Pool from "./Models/Pool/Pool";
import SwimJet from "./Models/SwimJet";
import WallWaterfall from "./Models/WallWaterfall";
import Waterblade from "./Models/Waterblade/Waterblade";
import Steps from "./Models/Steps";
import InfinityEdge from "./Models/InfinityEdge";
import Fountain from "./Models/Fountain";
import SquareSteps from "./Models/squareSteps";
import { InsetSteps } from "./Models/insetSteps/InsetSteps";
import CornerRoundSteps from "./Models/CornerRoundSteps";
import RoundSteps from "./Models/RoundSteps";
import { PivotControls } from "../UI/pivotControls";;
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
      <POOLS />
    </Canvas>
  );
}
const POOLS = () => {
  const Pools = useAppSelector(selectAllPools);
  return (
    <>
      {Pools.map((pool, poolIndex) => {
        switch (pool.poolType) {
          case "pool":
            return (
              <Pool
                key={poolIndex}
                pool={pool}
                index={poolIndex}
                width={pool.sWidth}
                height={pool.sHeight}
                depth={pool.sDepth}
                scale={pool.scale}
                position={pool.position}
                sPosition={pool.sPosition}
                sRotation={pool.sRotation}
                rotation={pool.rotation}
                sScale={pool.sScale}
                sWidth={pool.sWidth}
                sHeight={pool.sHeight}
                sDepth={pool.sDepth}
              >
                {pool.childrens.length > 0 &&
                  pool.childrens.map((shape, index) => {
                    const pos = [...shape.position];
                    const offsetWidth = pool.sWidth - pool.width;
                    const offsetHeight = pool.sHeight - pool.height;
                    const offsetDepth = pool.sDepth - pool.depth;
                    switch (shape.shapeType) {
                      case "SwimJet":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <SwimJet
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "WallWaterfall":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <WallWaterfall
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "Waterblade":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <Waterblade
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "Steps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <Steps
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            key={index}
                            position={new THREE.Vector3(...pos)}
                            width={3}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                            gap={0.2}
                            poolDepth={pool.sDepth}
                            intersecting={false}
                          />
                        );
                      case "cornerRounded":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }

                        return (
                          <CornerRoundSteps
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                            width={3}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                            gap={0.2}
                            sScale={[1, 1, 1]}
                          />
                        );
                      case "RoundSteps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <RoundSteps
                            key={index}
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            scale={new THREE.Vector3(...shape.scale)}
                            rotation={new THREE.Euler(...shape.rotation)}
                            position={new THREE.Vector3(...pos)}
                            width={3}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                            gap={0.2}
                          />
                        );
                      case "InfinityEdge":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <InfinityEdge
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            poolWidth={pool.sWidth}
                            poolHeight={pool.sHeight}
                            poolDepth={pool.sDepth}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "Fountain":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <Fountain
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "SquareSteps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <SquareSteps
                            model={shape}
                            gap={0.2}
                            index={index}
                            poolIndex={poolIndex}
                            key={index}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                            width={.5}
                            intersecting={false}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                          />
                        );
                      case "insetSteps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <InsetSteps
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                    }
                  })}
              </Pool>
            );
        }
      })}
    </>
  );
};

export const MemoisedScene = React.memo(Scene);
