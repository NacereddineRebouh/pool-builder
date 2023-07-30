import { useAppSelector } from "@/store/hooks";
import { selectPools, selectShapes } from "@/slices/shapesSlice";
import { selectPools as selectAllPools } from "@/slices/poolsSlice";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Fragment } from "react";
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

export const AllModels = () => {
  const Pools = useAppSelector(selectAllPools);
  console.log(Pools);
  return (
    <Fragment key={0}>
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
                            width={0.5}
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
            break;

          case "hottub":
            return (
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
                sDepth={pool.sDepth}
              >
                {pool.childrens.length > 0 &&
                  pool.childrens.map((shape, index) => {
                    const pos = [...shape.position];
                    const offsetWidth = pool.sWidth - pool.width;
                    const offsetHeight = pool.sHeight - pool.height;
                    const offsetDepth = pool.sDepth - pool.depth;
                    console.log("nbSwimJet:", pool.nbSwimJet);
                    console.log("shape:", shape);
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
                          <>
                            {pool.nbSwimJet && pool.nbSwimJet > 0 ? (
                              new Array(pool.nbSwimJet).fill(0).map((_, i) => {
                                const offsetPosition = [...pos];
                                if (pool.nbSwimJet) {
                                  const resetZ =
                                    offsetPosition[2] + pool.depth / 2;
                                  const resetX =
                                    offsetPosition[0] - pool.width / 2;
                                  const offsetZ = pool.depth / pool.nbSwimJet;
                                  const initialZ =
                                    pool.depth / pool.nbSwimJet / 2;

                                  const offsetX = pool.width / pool.nbSwimJet;
                                  const initialX =
                                    pool.width / pool.nbSwimJet / 2;

                                  switch (shape.side) {
                                    case "Left":
                                      //Topleft
                                      offsetPosition[0] = shape.position[0];
                                      offsetPosition[1] = shape.position[1];
                                      offsetPosition[2] =
                                        resetZ - initialZ - i * offsetZ;
                                      break;
                                    case "Right":
                                      offsetPosition[0] = shape.position[0];
                                      offsetPosition[1] = shape.position[1];
                                      offsetPosition[2] =
                                        resetZ - initialZ - i * offsetZ;
                                      break;
                                    case "Top":
                                      //bottom Left
                                      offsetPosition[0] =
                                        resetX + initialX + i * offsetX;
                                      offsetPosition[1] = shape.position[1];
                                      offsetPosition[2] = shape.position[2];
                                      break;
                                    case "Bottom":
                                      offsetPosition[0] =
                                        resetX + initialX + i * offsetX;
                                      offsetPosition[1] = shape.position[1];
                                      offsetPosition[2] = shape.position[2];
                                      break;
                                  }
                                }
                                console.log(offsetPosition);
                                return (
                                  <SwimJet
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
                                    scale={new THREE.Vector3(...shape.scale)}
                                    position={
                                      new THREE.Vector3(...offsetPosition)
                                    }
                                  />
                                );
                              })
                            ) : (
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
                            )}
                          </>
                        );
                    }
                  })}
              </Hottub>
            );
            break;

          default:
            console.log("Unknown scene type");
            break;
        }
      })}
    </Fragment>
  );
};
