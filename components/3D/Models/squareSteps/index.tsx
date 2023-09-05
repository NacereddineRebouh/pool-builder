"use client";
import { PivotControls } from "@/components/UI/pivotControls";
import { sides } from "@/slices/defaultsSlice";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { CustomBoxGeometry } from "@/utils/getActiveAxis";
import { useTexture } from "@react-three/drei";
import { FC, Fragment, ReactElement, useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface squareStepsProps {
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  model: ChildrensType;
  gap: number;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  index: number;
  poolIndex: number;
  heightPerStep: number;
  width: number;
  poolHeight: number;
  side: sides;
  poolWidth: number;
  // rotation?: number;
  intersecting: boolean;
}

const SquareSteps: FC<squareStepsProps> = ({
  position,
  width = 6,
  rotation,
  sPosition,
  sRotation,
  sScale,
  scale,
  poolIndex,
  index,
  model,
  heightPerStep = 0.2,
  gap = 0.2,
  side,
  intersecting,
  poolHeight,
  poolWidth,
}): ReactElement => {
  const depthPerStep = 1;

  // load tile texture
  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;
  tileTexture.repeat.set(1, 1);
  tileTexture.colorSpace = THREE.SRGBColorSpace;
  tileTexture.needsUpdate = true;
  const steps = Math.max(1, Math.ceil(poolHeight / heightPerStep));
  const stepsArray = new Array(steps).fill(0);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null);
  const visible = useAppSelector(selectPivotVisibility);
  let newOffset: [number, number, number] = [
    position.x,
    position.y,
    position.z,
  ];
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
      matrix={Mat}
      lineWidth={2}
    >
      <group
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          const title = model.shapeType + " " + poolIndex + index;
          dispatch(setTargetTitle(title));
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        {stepsArray.map((step, idx) => {
          let newPosition = [0, 0, 0];
          let boxArgs = [
            width + (gap / 2) * idx,
            heightPerStep,
            width + (gap / 2) * idx,
          ];

          switch (true) {
            case side === "Left" || side === "tLeft":
              newPosition = [
                -gap / 4 + (gap / 2) * idx,
                -heightPerStep / 2 - idx * heightPerStep,
                0,
              ];
              boxArgs = [
                width + gap * idx,
                heightPerStep,
                width + gap * 2 * idx,
              ];
              break;
            case side === "tRight" || side === "Right":
              newPosition = [
                +gap / 4 - (gap / 2) * idx,
                -heightPerStep / 2 - idx * heightPerStep,
                0,
              ];
              boxArgs = [
                width + gap * idx,
                heightPerStep,
                width + gap * 2 * idx,
              ];
              break;
            case side === "Top" || side === "tTop":
              newPosition = [
                0,
                -heightPerStep / 2 - idx * heightPerStep,
                -gap + (gap / 2) * idx,
              ];
              boxArgs = [
                width + gap * 2 * idx,
                heightPerStep,
                width + gap * idx,
              ];
              break;
            case side === "Bottom":
              newPosition = [
                0,
                -heightPerStep / 2 - idx * heightPerStep,
                gap - (gap / 2) * idx,
              ];
              boxArgs = [
                width + gap * 2 * idx,
                heightPerStep,
                width + gap * idx,
              ];
              break;
          }
          return (
            <mesh
              key={idx}
              position={new THREE.Vector3(...newPosition)}
              geometry={CustomBoxGeometry({
                width: boxArgs[0],
                height: boxArgs[1],
                depth: boxArgs[2],
              })}
            >
              {/* <boxGeometry args={[boxArgs[0], boxArgs[1], boxArgs[2]]} /> */}
              <meshStandardMaterial
                map={tileTexture}
                color={"lightblue"}
                metalness={0.2}
                side={2}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>
    </PivotControls>
  );
};

export default SquareSteps;
