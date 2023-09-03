import { useAppSelector } from "@/store/hooks";
import { selectPools, selectShapes } from "@/slices/shapesSlice";
import { selectPools as selectAllPools } from "@/slices/poolsSlice";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Fragment, Suspense, useEffect, useRef, useState } from "react";
import CornerRoundSteps from "../Models/CornerRoundSteps";
import Fountain from "../Models/Fountain";
import Hottub from "../Models/Hottub/Hottub";
import InfinityEdge from "../Models/InfinityEdge";
import Pool from "../Models/Pool/Pool";
import RoundSteps from "../Models/RoundSteps";
import Steps from "../Models/Steps";
import SwimJet from "../Models/SwimJet";
import WallWaterfall from "../Models/WallWaterfall";
import Waterblade from "../Models/Waterblade/Waterblade";
import { InsetSteps } from "../Models/insetSteps/InsetSteps";
import SquareSteps from "../Models/squareSteps";
import LShape from "../Models/L-Shape/L-Shape";
import { sides } from "@/slices/defaultsSlice";
import { useTexture } from "@react-three/drei";
import { InsetStep } from "../Models/insetSteps/InsetStep";
import { CSGGeometryRef } from "@react-three/csg";
import PoolBool from "../Models/Pool/booleanPool";
import { RegularJet } from "../Models/RegularJet/RegularJet";
import InfinityEdge2 from "../Models/infinity Edge2";

export const AllModels = () => {
  const Pools = useAppSelector(selectAllPools);
  const textureLoader = new THREE.TextureLoader();
  const [Texture, setTexture] = useState<THREE.Texture>();
  const [TextureStone, setTextureStone] = useState<THREE.Texture>();
  useTexture.preload("/textures/tiles.jpg");
  useTexture.preload("/textures/stone/stone-9_diffuse.png");
  useEffect(() => {
    textureLoader.load("/textures/tiles.jpg", (t) => {
      // Texture loaded callback
      if (t) {
        t.wrapT = THREE.RepeatWrapping;
        t.wrapS = THREE.RepeatWrapping;
        t.repeat.set(2, 1);
      }
      setTexture(t);
    });
    textureLoader.load("textures/stone/stone-9_diffuse.png", (t) => {
      // Texture loaded callback
      if (t) {
        t.wrapT = THREE.RepeatWrapping;
        t.wrapS = THREE.RepeatWrapping;
        t.repeat.set(1, 1);
      }
      setTextureStone(t);
    });
  }, []);
  // const texture = useTexture("/textures/tiles.jpg");
  const csg = useRef<CSGGeometryRef>(null);
  const csg2 = useRef<CSGGeometryRef>(null);
  const csg3 = useRef<CSGGeometryRef>(null); // pool

  return (
    <Fragment key={0}>
      {Pools.map((pool, poolIndex) => {
        const edges = pool.childrens.filter(
          (value) => value.shapeType === "InfinityEdge"
        );
        switch (true) {
          case pool.poolType === "pool" || pool.poolType === "squarepool":
            return (
              <Suspense>
                <PoolBool
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
                  csg={csg3}
                  Texture={Texture?.clone()}
                  TextureStone={TextureStone?.clone()}
                  children2={
                    <>
                      {pool.childrens.map((shape, index) => {
                        if (shape.shapeType === "insetSteps") {
                          const pos = [...shape.position];
                          const offsetWidth = pool.sWidth - pool.width;
                          const offsetbHeight = pool.sHeight - pool.height;
                          const offsetDepth = pool.sDepth - pool.depth;
                          pos[1] =
                            shape.position[1] +
                            offsetbHeight / 2 +
                            pool.height / 2;

                          let scale = [-1, 1, 1];

                          switch (shape.side) {
                            case "Left":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[2] = shape.position[2];
                              scale = [-1, 1, 1];
                              break;
                            case "Right":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[2] = shape.position[2];
                              scale = [-1, 1, 1];
                              break;
                            case "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[2] = shape.position[2] - offsetDepth / 2;
                              scale = [1, 1, -1];
                              break;
                            case "Bottom":
                              pos[0] = shape.position[0];
                              pos[2] = shape.position[2] + offsetDepth / 2;
                              scale = [-1, 1, 1];
                              break;
                          }
                          return (
                            <Suspense key={index}>
                              <InsetStep
                                onDrag={() => csg3.current?.update()}
                                model={shape}
                                index={index}
                                poolIndex={poolIndex}
                                sPosition={shape.sPosition}
                                sRotation={shape.sRotation}
                                sScale={shape.sScale}
                                key={index}
                                rotation={new THREE.Euler(...shape.rotation)}
                                scale={
                                  new THREE.Vector3(
                                    shape.scale[0] * scale[0],
                                    shape.scale[1] * scale[1],
                                    shape.scale[2] * scale[2]
                                  )
                                }
                                position={new THREE.Vector3(...pos)}
                              />
                            </Suspense>
                          );
                        }
                      })}
                    </>
                  }
                >
                  {pool.childrens.length > 0 &&
                    pool.childrens.map((shape, index) => {
                      // const index = poolInsets.length + i;
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
                            <Suspense>
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
                            </Suspense>
                          );

                        case "RegularJets":
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
                            <>
                              {pool.nbSwimJet && pool.nbSwimJet > 0 ? (
                                new Array(pool.nbSwimJet)
                                  .fill(0)
                                  .map((_, i) => {
                                    const offsetPosition = [...pos];
                                    if (pool.nbSwimJet) {
                                      const resetZ =
                                        offsetPosition[2] + pool.depth / 2;
                                      const resetX =
                                        offsetPosition[0] - pool.width / 2;
                                      const offsetZ =
                                        pool.depth / pool.nbSwimJet;
                                      const initialZ =
                                        pool.depth / pool.nbSwimJet / 2;

                                      const offsetX =
                                        pool.width / pool.nbSwimJet;
                                      const initialX =
                                        pool.width / pool.nbSwimJet / 2;

                                      switch (shape.side) {
                                        case "Left":
                                          //Topleft
                                          offsetPosition[0] = pos[0];
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] =
                                            resetZ - initialZ - i * offsetZ;
                                          break;
                                        case "Right":
                                          offsetPosition[0] = pos[0];
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] =
                                            resetZ - initialZ - i * offsetZ;
                                          break;
                                        case "Top":
                                          //bottom Left
                                          offsetPosition[0] =
                                            resetX + initialX + i * offsetX;
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] = pos[2];
                                          break;
                                        case "Bottom":
                                          offsetPosition[0] =
                                            resetX + initialX + i * offsetX;
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] = pos[2];
                                          break;
                                      }
                                    }
                                    return (
                                      <Suspense key={i}>
                                        <RegularJet
                                          model={shape}
                                          index={index}
                                          poolIndex={poolIndex}
                                          sPosition={shape.sPosition}
                                          sRotation={shape.sRotation}
                                          sScale={shape.sScale}
                                          key={i}
                                          rotation={
                                            new THREE.Euler(...shape.rotation)
                                          }
                                          scale={
                                            new THREE.Vector3(...shape.scale)
                                          }
                                          position={
                                            new THREE.Vector3(...offsetPosition)
                                          }
                                        />
                                      </Suspense>
                                    );
                                  })
                              ) : (
                                <RegularJet
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
                              )}
                            </>
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
                            <Suspense>
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
                            </Suspense>
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
                            <Suspense>
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
                            </Suspense>
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
                            <Suspense>
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
                            </Suspense>
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
                            <Suspense>
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
                            </Suspense>
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
                            <Suspense>
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
                            </Suspense>
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
                            <Suspense>
                              <InfinityEdge2
                                model={shape}
                                index={index}
                                poolIndex={poolIndex}
                                sPosition={shape.sPosition}
                                sRotation={shape.sRotation}
                                sScale={shape.sScale}
                                poolWidth={pool.sWidth}
                                poolHeight={pool.sHeight}
                                poolDepth={pool.sDepth}
                                sides={edges}
                                key={index}
                                rotation={new THREE.Euler(...shape.rotation)}
                                scale={new THREE.Vector3(...shape.scale)}
                                position={new THREE.Vector3(...pos)}
                                pooltHeight={0}
                                poolbHeight={0}
                                poolType={pool.poolType}
                                poolPosition={pool.sPosition}
                              />
                            </Suspense>
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
                            <Suspense>
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
                            </Suspense>
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
                            <Suspense>
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
                                width={0.5}
                                intersecting={false}
                                poolHeight={pool.sHeight}
                                poolWidth={pool.sWidth}
                                side={shape.side}
                                heightPerStep={0.2}
                              />
                            </Suspense>
                          );
                      }
                    })}
                </PoolBool>
              </Suspense>
            );

          case pool.poolType === "hottub":
            return (
              <Suspense>
                <Hottub
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
                  TextureStone={TextureStone?.clone()}
                  sDepth={pool.sDepth}
                  PoolTexture={Texture?.clone()}
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
                        case "RegularJets":
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
                            <>
                              {pool.nbSwimJet && pool.nbSwimJet > 0 ? (
                                new Array(pool.nbSwimJet)
                                  .fill(0)
                                  .map((_, i) => {
                                    const offsetPosition = [...pos];
                                    if (pool.nbSwimJet) {
                                      const resetZ =
                                        offsetPosition[2] + pool.depth / 2;
                                      const resetX =
                                        offsetPosition[0] - pool.width / 2;
                                      const offsetZ =
                                        pool.depth / pool.nbSwimJet;
                                      const initialZ =
                                        pool.depth / pool.nbSwimJet / 2;

                                      const offsetX =
                                        pool.width / pool.nbSwimJet;
                                      const initialX =
                                        pool.width / pool.nbSwimJet / 2;

                                      switch (shape.side) {
                                        case "Left":
                                          //Topleft
                                          offsetPosition[0] = pos[0];
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] =
                                            resetZ - initialZ - i * offsetZ;
                                          break;
                                        case "Right":
                                          offsetPosition[0] = pos[0];
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] =
                                            resetZ - initialZ - i * offsetZ;
                                          break;
                                        case "Top":
                                          //bottom Left
                                          offsetPosition[0] =
                                            resetX + initialX + i * offsetX;
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] = pos[2];
                                          break;
                                        case "Bottom":
                                          offsetPosition[0] =
                                            resetX + initialX + i * offsetX;
                                          offsetPosition[1] = pos[1];
                                          offsetPosition[2] = pos[2];
                                          break;
                                      }
                                    }
                                    return (
                                      <Suspense key={i}>
                                        <RegularJet
                                          model={shape}
                                          index={index}
                                          poolIndex={poolIndex}
                                          sPosition={shape.sPosition}
                                          sRotation={shape.sRotation}
                                          sScale={shape.sScale}
                                          key={i}
                                          rotation={
                                            new THREE.Euler(...shape.rotation)
                                          }
                                          scale={
                                            new THREE.Vector3(...shape.scale)
                                          }
                                          position={
                                            new THREE.Vector3(...offsetPosition)
                                          }
                                        />
                                      </Suspense>
                                    );
                                  })
                              ) : (
                                <RegularJet
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
                              )}
                            </>
                          );
                      }
                    })}
                </Hottub>
              </Suspense>
            );
            break;

          case pool.poolType === "lshape":
            return (
              <Suspense>
                <LShape
                  StoneTexture={TextureStone?.clone()}
                  index={poolIndex}
                  theight={pool.stHeight}
                  bheight={pool.sbHeight}
                  stHeight={pool.stHeight}
                  sbHeight={pool.sbHeight}
                  position={pool.position}
                  sPosition={pool.sPosition}
                  sRotation={pool.sRotation}
                  rotation={pool.rotation}
                  scale={pool.scale}
                  sScale={pool.sScale}
                  width={pool.sWidth}
                  sWidth={pool.sWidth}
                  depth={pool.sDepth}
                  sDepth={pool.sDepth}
                  pool={pool}
                  key={poolIndex}
                  PoolTexture={Texture?.clone()}
                  childrenBottom={
                    <>
                      {pool.childrens.map((shape, index) => {
                        if (shape.shapeType === "insetSteps") {
                          const pos = [...shape.position];
                          const offsetWidth = pool.sWidth - pool.width;
                          const offsetbHeight = pool.sbHeight - pool.bHeight;
                          const offsetDepth = pool.sDepth - pool.depth;
                          pos[1] =
                            shape.position[1] +
                            offsetDepth / 2 +
                            pool.depth / 2;

                          const LshapeBXPosition =
                            -pool.bHeight / 2 + pool.sWidth / 2;
                          let scale = [-1, 1, 1]; // left
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight / 2 +
                                offsetWidth / 2 -
                                LshapeBXPosition;
                              pos[2] = shape.position[2];
                              scale = [-1, 1, 1];
                              return (
                                <Suspense key={index}>
                                  <InsetStep
                                    onDrag={() => csg.current?.update()}
                                    model={shape}
                                    index={index}
                                    poolIndex={poolIndex}
                                    sPosition={shape.sPosition}
                                    sRotation={shape.sRotation}
                                    sScale={shape.sScale}
                                    key={index}
                                    rotation={
                                      new THREE.Euler(...shape.rotation)
                                    }
                                    scale={new THREE.Vector3(...scale)}
                                    position={new THREE.Vector3(...pos)}
                                  />
                                </Suspense>
                              );
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0] - LshapeBXPosition;
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              scale = [1, 1, 1];
                              return (
                                <Suspense key={index}>
                                  <InsetStep
                                    onDrag={() => csg.current?.update()}
                                    model={shape}
                                    index={index}
                                    poolIndex={poolIndex}
                                    sPosition={shape.sPosition}
                                    sRotation={shape.sRotation}
                                    sScale={shape.sScale}
                                    key={index}
                                    rotation={
                                      new THREE.Euler(...shape.rotation)
                                    }
                                    scale={new THREE.Vector3(...scale)}
                                    position={new THREE.Vector3(...pos)}
                                  />
                                </Suspense>
                              );
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0] - LshapeBXPosition;
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              scale = [-1, 1, 1];
                              return (
                                <Suspense key={index}>
                                  <InsetStep
                                    onDrag={() => csg.current?.update()}
                                    model={shape}
                                    index={index}
                                    poolIndex={poolIndex}
                                    sPosition={shape.sPosition}
                                    sRotation={shape.sRotation}
                                    sScale={shape.sScale}
                                    key={index}
                                    rotation={
                                      new THREE.Euler(...shape.rotation)
                                    }
                                    scale={new THREE.Vector3(...scale)}
                                    position={new THREE.Vector3(...pos)}
                                  />
                                </Suspense>
                              );
                          }
                        }
                      })}
                    </>
                  }
                  childrenTop={
                    <>
                      {pool.childrens.map((shape, index) => {
                        if (shape.shapeType === "insetSteps") {
                          const pos = [...shape.position];
                          const offsetWidth = pool.sWidth - pool.width;
                          const offsettHeight = pool.stHeight - pool.tHeight;
                          const offsetDepth = pool.sDepth - pool.depth;
                          pos[1] =
                            shape.position[1] +
                            offsetDepth / 2 +
                            pool.depth / 2;
                          const LshapeTZPosition =
                            -pool.tHeight / 2 + pool.sWidth / 2;
                          let scale = [-1, 1, 1]; // left
                          switch (true) {
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[2] = shape.position[2] - LshapeTZPosition;
                              scale = [-1, 1, 1];
                              return (
                                <Suspense key={index}>
                                  <InsetStep
                                    onDrag={() => csg.current?.update()}
                                    model={shape}
                                    index={index}
                                    poolIndex={poolIndex}
                                    sPosition={shape.sPosition}
                                    sRotation={shape.sRotation}
                                    sScale={shape.sScale}
                                    key={index}
                                    rotation={
                                      new THREE.Euler(...shape.rotation)
                                    }
                                    scale={new THREE.Vector3(...scale)}
                                    position={new THREE.Vector3(...pos)}
                                  />
                                </Suspense>
                              );
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[2] = shape.position[2] - LshapeTZPosition;
                              scale = [1, 1, 1];
                              return (
                                <Suspense key={index}>
                                  <InsetStep
                                    onDrag={() => csg.current?.update()}
                                    model={shape}
                                    index={index}
                                    poolIndex={poolIndex}
                                    sPosition={shape.sPosition}
                                    sRotation={shape.sRotation}
                                    sScale={shape.sScale}
                                    key={index}
                                    rotation={
                                      new THREE.Euler(...shape.rotation)
                                    }
                                    scale={new THREE.Vector3(...scale)}
                                    position={new THREE.Vector3(...pos)}
                                  />
                                </Suspense>
                              );
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[2] =
                                shape.position[2] -
                                LshapeTZPosition -
                                offsettHeight / 2 +
                                offsetWidth / 2;
                              scale = [1, 1, 1];
                              return (
                                <Suspense key={index}>
                                  <InsetStep
                                    onDrag={() => csg.current?.update()}
                                    model={shape}
                                    index={index}
                                    poolIndex={poolIndex}
                                    sPosition={shape.sPosition}
                                    sRotation={shape.sRotation}
                                    sScale={shape.sScale}
                                    key={index}
                                    rotation={
                                      new THREE.Euler(...shape.rotation)
                                    }
                                    scale={new THREE.Vector3(...scale)}
                                    position={new THREE.Vector3(...pos)}
                                  />
                                </Suspense>
                              );
                          }
                        }
                      })}
                    </>
                  }
                  csg={csg}
                  csg2={csg2}
                >
                  {pool.childrens.length > 0 &&
                    pool.childrens.map((shape, index) => {
                      const pos = [...shape.position];
                      const offsetWidth = pool.sWidth - pool.width;
                      const offsettHeight = pool.stHeight - pool.tHeight;
                      const offsetbHeight = pool.sbHeight - pool.bHeight;
                      const offsetDepth = pool.sDepth - pool.depth;
                      let poolHeight = pool.stHeight;
                      let poolDepth = pool.sDepth;
                      let poolWidth = pool.sWidth;

                      switch (shape.shapeType) {
                        case "Steps":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsettHeight / 2;
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight / 2 +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0] - offsetbHeight / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight / 2 +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          switch (shape.side) {
                            case sides.Left:
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sbHeight;
                              poolDepth = pool.sWidth;
                              break;
                            case sides.Bottom:
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sbHeight;
                              poolDepth = pool.sWidth;
                              break;
                            case sides.Top:
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sbHeight - pool.sWidth;
                              poolDepth = pool.sWidth;
                              break;
                            case sides.tLeft:
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sWidth;
                              poolDepth = pool.stHeight - pool.sWidth;
                              break;
                            case sides.tRight:
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sWidth;
                              poolDepth = pool.stHeight;
                              break;
                            case sides.tTop:
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sWidth;
                              poolDepth = pool.stHeight;
                              break;

                            // default:
                            //   break;
                          }
                          return (
                            <Suspense>
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
                                poolHeight={poolHeight}
                                poolWidth={poolWidth}
                                side={shape.side}
                                heightPerStep={0.2}
                                gap={0.2}
                                poolDepth={poolDepth}
                                intersecting={false}
                              />
                            </Suspense>
                          );
                        case "RoundSteps":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          poolHeight = pool.stHeight;
                          switch (shape.side) {
                            case sides.Left:
                              poolHeight = pool.sWidth;
                              break;
                            case sides.Bottom:
                              poolHeight = pool.sbHeight;
                              break;
                            case sides.Top:
                              poolHeight = pool.sbHeight - pool.sWidth / 2;
                              break;
                            case sides.tLeft:
                              poolHeight = pool.stHeight - pool.sWidth / 2;
                              break;
                            case sides.tRight:
                              poolHeight = pool.stHeight;
                              break;
                            case sides.tTop:
                              poolHeight = pool.sWidth;
                              break;

                            // default:
                            // break;
                          }
                          return (
                            <Suspense>
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
                                poolHeight={pool.sDepth}
                                poolWidth={pool.sWidth}
                                side={shape.side}
                                heightPerStep={0.2}
                                gap={0.2}
                              />
                            </Suspense>
                          );
                        case "SquareSteps":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          poolHeight = pool.stHeight;
                          switch (shape.side) {
                            case sides.Left:
                              poolHeight = pool.sWidth;
                              break;
                            case sides.Bottom:
                              poolHeight = pool.sbHeight;
                              break;
                            case sides.Top:
                              poolHeight = pool.sbHeight - pool.sWidth / 2;
                              break;
                            case sides.tLeft:
                              poolHeight = pool.stHeight - pool.sWidth / 2;
                              break;
                            case sides.tRight:
                              poolHeight = pool.stHeight;
                              break;
                            case sides.tTop:
                              poolHeight = pool.sWidth;
                              break;
                          }
                          return (
                            <Suspense>
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
                                width={0.5}
                                intersecting={false}
                                poolHeight={poolHeight}
                                poolWidth={poolWidth}
                                side={shape.side}
                                heightPerStep={0.2}
                              />
                            </Suspense>
                          );
                        case "cornerRounded":
                          switch (true) {
                            case shape.side === "Top":
                              //Top Left
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;

                            case shape.side === "Left":
                              //Bottom left
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;

                            case shape.side === "Right":
                              //Bottom right
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;

                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;

                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                          }
                          switch (shape.side) {
                            case sides.Left: // left bottom
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sbHeight;
                              poolDepth = pool.sWidth;
                              break;
                            case sides.Right: // Right Bottom
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sbHeight;
                              poolDepth = pool.sWidth;
                              break;
                            case sides.Top: // left top
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sbHeight - pool.sWidth;
                              poolDepth = pool.sWidth;
                              break;
                            case sides.tLeft: // left Top
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sWidth;
                              poolDepth = pool.stHeight - pool.sWidth;
                              break;
                            case sides.tRight: // Right Top
                              poolHeight = pool.sDepth;
                              poolWidth = pool.sWidth;
                              poolDepth = pool.stHeight;
                              break;

                            // default:
                            //   break;
                          }
                          return (
                            <Suspense>
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
                                poolHeight={poolHeight}
                                poolWidth={poolWidth}
                                side={shape.side}
                                heightPerStep={0.2}
                                gap={0.2}
                                sScale={[1, 1, 1]}
                              />
                            </Suspense>
                          );
                        case "Fountain":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          return (
                            <Suspense>
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
                            </Suspense>
                          );
                        case "WallWaterfall":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          return (
                            <Suspense>
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
                            </Suspense>
                          );
                        case "Waterblade":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          return (
                            <Suspense>
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
                            </Suspense>
                          );
                        case "SwimJet":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          return (
                            <Suspense>
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
                            </Suspense>
                          );
                        case "RegularJets":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          return (
                            <Suspense>
                              <>
                                {pool.nbSwimJet && pool.nbSwimJet > 0 ? (
                                  new Array(pool.nbSwimJet)
                                    .fill(0)
                                    .map((_, i) => {
                                      const offsetPosition = [...pos];
                                      if (pool.nbSwimJet) {
                                        const resetZ =
                                          offsetPosition[2] + pool.sWidth / 2;
                                        const resetZtLeft =
                                          offsetPosition[2] -
                                          (pool.stHeight - pool.sWidth) / 2;
                                        const offsetZtLeft =
                                          (pool.stHeight - pool.sWidth) /
                                          pool.nbSwimJet;
                                        const initialZtLeft =
                                          (pool.stHeight - pool.sWidth) /
                                          pool.nbSwimJet /
                                          2;
                                        const resetZtRight =
                                          offsetPosition[2] - pool.stHeight / 2;
                                        const offsetZtRight =
                                          pool.stHeight / pool.nbSwimJet;
                                        const initialZtRight =
                                          pool.stHeight / pool.nbSwimJet / 2;
                                        const offsetZ =
                                          pool.sWidth / pool.nbSwimJet;
                                        const initialZ =
                                          pool.sWidth / pool.nbSwimJet / 2;

                                        const resetX =
                                          offsetPosition[0] -
                                          (pool.sbHeight - pool.sWidth) / 2;
                                        const resetXtTop =
                                          offsetPosition[0] - pool.sWidth / 2;
                                        const resetXBottom =
                                          offsetPosition[0] - pool.sbHeight / 2;
                                        const offsetX =
                                          (pool.sbHeight - pool.sWidth) /
                                          pool.nbSwimJet;
                                        const offsetXtTop =
                                          pool.sWidth / pool.nbSwimJet;
                                        const initialX =
                                          (pool.sbHeight - pool.sWidth) /
                                          pool.nbSwimJet /
                                          2;
                                        const initialXtTop =
                                          pool.sWidth / pool.nbSwimJet / 2;
                                        const offsetXBottom =
                                          pool.sbHeight / pool.nbSwimJet;
                                        const initialXBottom =
                                          pool.sbHeight / pool.nbSwimJet / 2;

                                        switch (shape.side) {
                                          case "Left":
                                            //Topleft
                                            offsetPosition[0] = pos[0];
                                            offsetPosition[1] = pos[1];
                                            offsetPosition[2] =
                                              resetZ - initialZ - i * offsetZ;
                                            break;
                                          case "Top":
                                            //bottom Left
                                            offsetPosition[0] =
                                              resetX + initialX + i * offsetX;
                                            offsetPosition[1] = pos[1];
                                            offsetPosition[2] = pos[2];
                                            break;
                                          case "Bottom":
                                            offsetPosition[0] =
                                              resetXBottom +
                                              initialXBottom +
                                              i * offsetXBottom;
                                            offsetPosition[1] = pos[1];
                                            offsetPosition[2] = pos[2];
                                            break;
                                          case "tTop":
                                            //bottom Left
                                            offsetPosition[0] =
                                              resetXtTop +
                                              initialXtTop +
                                              i * offsetXtTop;
                                            offsetPosition[1] = pos[1];
                                            offsetPosition[2] = pos[2];
                                            break;
                                          case "tLeft":
                                            //bottom Left
                                            offsetPosition[0] = pos[0];
                                            offsetPosition[1] = pos[1];
                                            offsetPosition[2] =
                                              resetZtLeft +
                                              initialZtLeft +
                                              i * offsetZtLeft;
                                            break;
                                          case "tRight":
                                            //bottom Left
                                            offsetPosition[0] = pos[0];

                                            offsetPosition[1] = pos[1];
                                            offsetPosition[2] =
                                              resetZtRight +
                                              initialZtRight +
                                              i * offsetZtRight;
                                            break;
                                        }
                                      }
                                      return (
                                        <Suspense key={i}>
                                          <RegularJet
                                            model={shape}
                                            index={index}
                                            poolIndex={poolIndex}
                                            sPosition={shape.sPosition}
                                            sRotation={shape.sRotation}
                                            sScale={shape.sScale}
                                            key={i}
                                            offset={-0.1}
                                            rotation={
                                              new THREE.Euler(...shape.rotation)
                                            }
                                            scale={
                                              new THREE.Vector3(...shape.scale)
                                            }
                                            position={
                                              new THREE.Vector3(
                                                ...offsetPosition
                                              )
                                            }
                                          />
                                        </Suspense>
                                      );
                                    })
                                ) : (
                                  <RegularJet
                                    model={shape}
                                    index={index}
                                    poolIndex={poolIndex}
                                    sPosition={shape.sPosition}
                                    sRotation={shape.sRotation}
                                    sScale={shape.sScale}
                                    key={index}
                                    offset={-0.09}
                                    rotation={
                                      new THREE.Euler(...shape.rotation)
                                    }
                                    scale={new THREE.Vector3(...shape.scale)}
                                    position={new THREE.Vector3(...pos)}
                                  />
                                )}
                              </>
                            </Suspense>
                          );
                        case "InfinityEdge":
                          switch (true) {
                            case shape.side === "Left":
                              //Topleft
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2];
                              break;
                            case shape.side === "tLeft":
                              //Topleft
                              pos[0] = shape.position[0] - offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight / 2 -
                                (0.05 * 5) / 2; //0.05 for the border
                              break;
                            case shape.side === "tRight":
                              pos[0] = shape.position[0] + offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight / 2 +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Top":
                              //bottom Left
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight / 2 -
                                (0.05 * 5) / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] - offsetWidth / 2;
                              break;
                            case shape.side === "tTop":
                              //bottom Left
                              pos[0] = shape.position[0];
                              pos[1] = shape.position[1];
                              pos[2] =
                                shape.position[2] -
                                offsettHeight +
                                offsetWidth / 2;
                              break;
                            case shape.side === "Bottom":
                              pos[0] =
                                shape.position[0] -
                                offsetbHeight / 2 +
                                offsetWidth / 2;
                              pos[1] = shape.position[1];
                              pos[2] = shape.position[2] + offsetWidth / 2;
                              break;
                          }
                          return (
                            <Suspense>
                              <InfinityEdge2
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
                                pooltHeight={pool.stHeight}
                                poolbHeight={pool.sbHeight}
                                poolType={pool.poolType}
                                poolPosition={pool.sPosition}
                                sides={edges}
                              />
                            </Suspense>
                          );
                      }
                    })}
                </LShape>
              </Suspense>
            );

          default:
            console.log("Unknown scene type");
            break;
        }
      })}
    </Fragment>
  );
};
