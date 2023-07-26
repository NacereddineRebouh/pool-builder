import { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import * as THREE from "three";
import { CornerRoundStep } from "./CornerRoundStep";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";

enum sides {
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
}
interface Props {
  rotation: THREE.Euler;
  position: THREE.Vector3;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  poolIndex: number;
  index: number;
  model: ChildrensType;
  scale: THREE.Vector3;
  poolHeight: number;
  gap: number;
  heightPerStep?: number;
  width: number;
  side: sides;
  poolWidth: number;
}

const CornerRoundSteps: FC<Props> = ({
  position,
  rotation,
  sPosition,
  sRotation,
  scale,
  sScale,
  gap,
  side,
  poolIndex,
  index,
  model,
  heightPerStep = 0.2,
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
    // console.table(comb)

    setMat(comb);
  }, [sScale, sPosition, sRotation]);
  return (
    <PivotControls
      disableScaleAxes
      disableSliders
      snapTranslate={5}
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
      matrix={Mat}
      offset={newOffset}
      lineWidth={2}
    >
      <group
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        {stepsArray.map((step, idx) => {
          let newPosition = [0, heightPerStep - idx * heightPerStep, 0];
          return (
            <CornerRoundStep
              key={idx}
              scale={new THREE.Vector3(.16 + gap * idx, 1.2, .16 + gap * idx)}
              position={new THREE.Vector3(...newPosition)}
              rotation={new THREE.Euler(0, 0, 0)}
            />
          );
        })}
      </group>
    </PivotControls>
  );
};

export default CornerRoundSteps;
