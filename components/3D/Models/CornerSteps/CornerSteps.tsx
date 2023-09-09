"use client";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import * as THREE from "three";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";
import { sides } from "@/slices/defaultsSlice";
import { GetTriangle } from "@/utils/getActiveAxis";

interface Props {
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  poolHeight: number;
  gap: number;
  heightPerStep: number;
  width: number;
  side: sides;
  Texture?: THREE.Texture;
  poolWidth: number;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  poolIndex: number;
  index: number;
  model: ChildrensType;
  BenchSeatings: string[];
}

const CornerSteps: FC<Props> = ({
  sPosition,
  sRotation,
  sScale,
  poolIndex,
  poolHeight,
  Texture: stepTexture,
  index,
  model,
  position,
  poolWidth,
  rotation,
  scale,
  BenchSeatings,
}) => {
  let visibility = false;
  switch (true) {
    case model.side === "Left" || model.side === "BottomLeft":
      //Topleft
      if (BenchSeatings?.includes("left") && BenchSeatings?.includes("top")) {
        visibility = true;
      }
      break;
    case model.side === "Right" || model.side === "BottomRight":
      if (BenchSeatings?.includes("right") && BenchSeatings?.includes("top")) {
        visibility = true;
      }
      break;
    case model.side === "Top" || model.side === "BottomTop":
      //bottom Left
      if (
        BenchSeatings?.includes("left") &&
        BenchSeatings?.includes("bottom")
      ) {
        visibility = true;
      }
      break;
    case model.side === "Bottom" || model.side === "BottomBottom":
      if (
        BenchSeatings?.includes("right") &&
        BenchSeatings?.includes("bottom")
      ) {
        visibility = true;
      }

      break;
  }
  const [Texture, setTexture] = useState(stepTexture);

  useEffect(() => {
    if (Texture) {
      Texture.wrapS = THREE.RepeatWrapping;
      Texture.wrapT = THREE.RepeatWrapping;
      Texture.repeat.set(1, 1);
    }
  }, [Texture]);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null);
  const visible = useAppSelector(selectPivotVisibility);
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

  const BenchWidth = 0.5;
  const BenchDepth = 0.5;
  const BenchHeight = poolHeight - 0.65;
  const BenchYPosition = -poolHeight + BenchHeight / 2;
  const cornerHeight = 0.2;
  const cornerHeightPosition = BenchYPosition + BenchHeight / 2 + cornerHeight;
  const cornerHeightBottomPosition =
    BenchYPosition - BenchHeight / 2 + cornerHeight;
  const isoscelesGeometry = GetTriangle({ BenchDepth, cornerHeight });
  const isoscelesGeometryBottom = GetTriangle({ BenchDepth, cornerHeight });
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
        visible={visibility}
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        onClick={(e) => {
          // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
          e.stopPropagation();
          const title = model.shapeType + " " + poolIndex + index;
          dispatch(setTargetTitle(title));
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        <mesh geometry={isoscelesGeometry}>
          <meshStandardMaterial
            color={"lightblue"}
            roughness={0.22}
            metalness={0.15}
            side={2}
            map={Texture}
          />
        </mesh>
      </group>
    </PivotControls>
  );
};

export default CornerSteps;
