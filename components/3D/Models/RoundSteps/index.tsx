"use client";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { SingleRoundStep } from "./SingleRoundStep";
import * as THREE from "three";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";
import { sides } from "@/slices/defaultsSlice";

interface Props {
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  poolHeight: number;
  gap: number;
  heightPerStep: number;
  width: number;
  side: sides;
  poolWidth: number;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  poolIndex: number;
  index: number;
  model: ChildrensType;
}

const RoundSteps: FC<Props> = ({
  sPosition,
  sRotation,
  sScale,
  poolIndex,
  index,
  model,
  position,
  rotation,
  scale,
  gap,
  side,
  heightPerStep,
  poolHeight,
}) => {
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null);
  const visible = useAppSelector(selectPivotVisibility);
  const steps = Math.ceil(poolHeight / heightPerStep);
  const stepsArray = new Array(steps).fill(0);
  let newOffset: [number, number, number] = [
    position.x,
    position.y,
    position.z,
  ];
  switch (side) {
    case "Left":
      newOffset = [position.x - (steps * gap) / 2, position.y, position.z];
      break;
    case "Right":
      newOffset = [position.x + (steps * gap) / 2, position.y, position.z];
      break;
    case "Top":
      newOffset = [position.x, position.y, position.z - (steps * gap) / 2];
      break;
    case "Bottom":
      newOffset = [position.x, position.y, position.z + (steps * gap) / 2];
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
      translateP={[sPosition[0], sPosition[1], sPosition[2]]}
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
      matrix={Mat}
      offset={[position.x, position.y, position.z]}
      lineWidth={2}
    >
      <group
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        onClick={(e) => {
          // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
          e.stopPropagation();
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        {stepsArray.map((step, idx) => {
          // boxwidth/2 // set step to the edge
          const offset = -3 / 5 / 2;
          let newPosition = [0, -idx * heightPerStep, 0];
          return (
            <SingleRoundStep
              key={idx}
              scale={
                new THREE.Vector3(0.16 + gap * idx, 1.24, 0.16 + gap * idx)
              }
              position={new THREE.Vector3(...newPosition)}
            />
          );
        })}
      </group>
    </PivotControls>
  );
};

export default RoundSteps;
