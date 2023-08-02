"use client";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, ReplaceChildren, sides } from "@/slices/poolsSlice";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTexture } from "@react-three/drei";
import { FC, Fragment, ReactElement, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Steps {
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  gap: number;
  heightPerStep: number;
  width: number;
  poolHeight: number;
  side: sides;
  model: ChildrensType;
  poolWidth: number;
  poolDepth: number;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  index: number;
  poolIndex: number;
  intersecting: boolean;
}
import React from "react";
export default function Steps({
  position,
  width = 6,
  rotation,
  scale,
  poolDepth,
  sRotation,
  sScale,
  heightPerStep = 0.2,
  gap = 0.2,
  model,
  side,
  sPosition,
  index,
  poolIndex,
  intersecting,
  poolHeight,
  poolWidth,
}: Steps) {
  const depthPerStep = 1;

  // load tile texture
  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;
  const steps = Math.ceil(poolHeight / heightPerStep);
  console.log("nb Steps", poolHeight, heightPerStep, "res:", steps);
  const stepsArray = new Array(steps).fill(0);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null);
  const visible = useAppSelector(selectPivotVisibility);
  console.log(side);
  let newOffset: [number, number, number] = [
    position.x,
    position.y,
    position.z,
  ];
  switch (side) {
    case "Left":
      newOffset = [position.x, position.y, position.z];
      break;
    case "Right":
      newOffset = [position.x, position.y, position.z];
      break;
    case "Top":
      newOffset = [position.x, position.y, position.z];
      break;
    case "Bottom":
      newOffset = [position.x, position.y, position.z];
      break;
  }

  const [Mat, setMat] = useState(new THREE.Matrix4());
  useEffect(() => {
    const position = new THREE.Vector3(
      sPosition[0],
      sPosition[1],
      sPosition[2]
    );
    const comb = new THREE.Matrix4();
    const radiansX = THREE.MathUtils.degToRad(sRotation[0]);
    const radiansY = THREE.MathUtils.degToRad(sRotation[1]);
    const radiansZ = THREE.MathUtils.degToRad(sRotation[2]);
    const qt = new THREE.Quaternion();
    qt.setFromEuler(new THREE.Euler(radiansX, radiansY, radiansZ, "XYZ"));
    // Create a new quaternion using Euler angles (XYZ order)
    comb.compose(
      position,
      qt,
      new THREE.Vector3(sScale[0], sScale[1], sScale[2])
    );
    setMat(comb);
  }, [sScale, sPosition, sRotation]);

  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={5}
      disableSliders
      visible={visible && target?.uuid === groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid === groupRef.current?.uuid ? 75 : 0}
      depthTest={false}
      fixed
      onDragEnd={(w, de, wl, delw) => {
        const position = new THREE.Vector3(); // create one and reuse it
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        w.decompose(position, quaternion, scale);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        const pl = { ...model };
        const x = +position.x.toFixed(2);
        const y = +position.y.toFixed(2);
        const z = +position.z.toFixed(2);
        pl.sPosition = [x, y, z];

        pl.sScale = [scale.x, scale.y, scale.z];
        pl.sRotation = [
          THREE.MathUtils.radToDeg(euler.x),
          THREE.MathUtils.radToDeg(euler.y),
          THREE.MathUtils.radToDeg(euler.z),
        ];
        dispatch(
          ReplaceChildren({
            poolIndex: poolIndex,
            modelIndex: index,
            model: pl,
          })
        );
      }}
      offset={newOffset}
      lineWidth={2}
      matrix={Mat}
    >
      <group
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        {stepsArray.map((step, idx) => {
          // boxwidth/2 + gap/2 // set step to the edge
          const offset = -3 / 5 / 2 + gap / 2;
          const offsetZ = 3 / 5 / 2;
          const offsetY = gap / 2;
          let newPosition = [0, 0, 0];
          switch (true) {
            case side === "Left" || side === "tLeft":
              newPosition = [
                offset + (gap / 2) * idx,
                -offsetY - idx * heightPerStep,
                0,
              ]; //1.5 == boxWidth/2
              break;
            case side === "tRight":
              newPosition = [
                -offset - (gap / 2) * idx,
                -offsetY - idx * heightPerStep,
                0,
              ];
              break;
            case side === "Top" || side === "tTop":
              newPosition = [
                0,
                -offsetY - idx * heightPerStep,
                -offsetZ + (gap / 2) * idx,
              ]; //2 == boxWidth/2
              break;
            case side === "Bottom":
              newPosition = [
                0,
                -offsetY - idx * heightPerStep,
                offsetZ - (gap / 2) * idx,
              ];
              break;
          }

          let boxArgs = [poolWidth, poolWidth, poolWidth];
          switch (true) {
            case side === "Left" || side === "tLeft":
              boxArgs = [heightPerStep + gap * idx, heightPerStep, poolDepth];
              break;
            case side === "tRight":
              boxArgs = [heightPerStep + gap * idx, heightPerStep, poolDepth];
              break;
            case side === "Top" || side === "tTop":
              boxArgs = [poolWidth, heightPerStep, heightPerStep + gap * idx];
              break;
            case side === "Bottom":
              boxArgs = [poolWidth, heightPerStep, heightPerStep + gap * idx];
              break;
          }
          console.log("boxArgs:", boxArgs);
          console.log("newPosition:", newPosition);
          return (
            <mesh key={idx} position={new THREE.Vector3(...newPosition)}>
              <boxGeometry args={[boxArgs[0], boxArgs[1], boxArgs[2]]} />
              <meshStandardMaterial
                map={tileTexture}
                metalness={0.2}
                roughness={0.2}
                color={"lightblue"}
              />
            </mesh>
          );
        })}
      </group>
    </PivotControls>
  );
}
