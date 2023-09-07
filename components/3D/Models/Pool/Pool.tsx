"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Mask, useTexture } from "@react-three/drei";
import Borders from "./Borders";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, PoolType, ReplacePool } from "@/slices/poolsSlice";
interface Props {
  index?: number;
  position: number[];
  sPosition: number[];
  sRotation: number[];
  rotation: number[];
  scale: number[];
  sScale: number[];
  width: number;
  sWidth: number;
  height: number;
  sHeight: number;
  depth: number;
  sDepth: number;
  key?: number;
  Texture?: THREE.Texture;
  children?: React.ReactNode;
  pool: PoolType;
}
const Pool: FC<Props> = ({
  width = 5,
  height = 2,
  depth = 3,
  position,
  sPosition,
  scale,
  sScale,
  sRotation,
  index,
  children,
  pool,
  Texture,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const gp = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);

  // Snapping box
  const boxWidth = 3;
  const boxHeight = height;
  const boxDepth = 4;

  const swimJetBoxWidth = 3 / 3;
  const swimJetBoxHeight = height / 3;
  const swimJetBoxDepth = 4 / 3;

  const infinityEdgeBoxWidth = 1;
  const infinityEdgeBoxHeight = 1;
  const infinityEdgeBoxDepth = depth;

  const waterFallBoxWidth = 3;
  const waterFallBoxHeight = 2;
  const waterFallBoxDepth = 2;

  // useEffect(() => {
  const [Mat, setMat] = useState(new THREE.Matrix4());
  useEffect(() => {
    const pos = new THREE.Vector3(
      0 + sPosition[0],
      0 + sPosition[1],
      0 + sPosition[2]
    );
    const comb = new THREE.Matrix4();
    const radiansX = THREE.MathUtils.degToRad(sRotation[0]);
    const radiansY = THREE.MathUtils.degToRad(sRotation[1]);
    const radiansZ = THREE.MathUtils.degToRad(sRotation[2]);
    const qt = new THREE.Quaternion();
    qt.setFromEuler(new THREE.Euler(radiansX, radiansY, radiansZ, "XYZ"));
    comb.compose(pos, qt, new THREE.Vector3(sScale[0], sScale[1], sScale[2]));
    setMat(comb);
  }, [sScale, sPosition, sRotation, pool]);
  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={10}
      visible={visible && target?.uuid === groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid === groupRef.current?.uuid ? 75 : 0}
      depthTest={false}
      fixed
      disableSliders
      onDragEnd={(w, de, wl, delw) => {
        const pos = new THREE.Vector3(); // create one and reuse it
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        w.decompose(pos, quaternion, scale);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        const pl = { ...pool };
        const x = +pos.x.toFixed(2) + 0;
        const y = +pos.y.toFixed(2) + 0;
        const z = +pos.z.toFixed(2) + 0;
        pl.sPosition = [x, y, z];

        pl.sScale = [scale.x, scale.y, scale.z];
        pl.sRotation = [
          THREE.MathUtils.radToDeg(euler.x),
          THREE.MathUtils.radToDeg(euler.y),
          THREE.MathUtils.radToDeg(euler.z),
        ];
        dispatch(ReplacePool({ poolIndex: index, pool: pl }));
      }}
      ref={gp}
      matrix={Mat}
      lineWidth={2}
    >
      <group
        ref={groupRef}
        onClick={(e) => {
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        {/* Pool */}
        <mesh position={[0, -height / 2, 0]}>
          <boxGeometry args={[width, height, depth]} />
          <>
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={Texture}
              attach={"material-0"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={Texture}
              attach={"material-1"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={Texture}
              attach={"material-3"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={Texture}
              attach={"material-4"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={Texture}
              attach={"material-5"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={Texture}
              attach={"material-2"}
              side={1}
              colorWrite={false}
              color={"lightblue"}
              // transparent
              // opacity={0}
            />
          </>
        </mesh>

        {/* Mask */}
        <Mask id={1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
          <planeGeometry args={[width, depth]} />
          {/* <meshBasicMaterial color={"salmon"}/> */}
        </Mask>

        {/* Borders */}
        <>
          <Borders
            width={width}
            height={0.05}
            depth={height}
            outline={2}
            position={new THREE.Vector3(0, 0, 0)}
            side={"left"}
            poolWidth={width}
            poolDepth={depth}
          />
          <Borders
            width={width}
            height={0.05}
            depth={height}
            outline={2}
            position={new THREE.Vector3(0, 0, 0)}
            side={"top"}
            poolWidth={width}
            poolDepth={depth}
          />
          <Borders
            width={width}
            height={0.05}
            depth={height}
            outline={2}
            position={new THREE.Vector3(0, 0, 0)}
            side={"bottom"}
            poolWidth={width}
            poolDepth={depth}
          />
          <Borders
            width={width}
            height={0.05}
            depth={height}
            outline={2}
            position={new THREE.Vector3(0, 0, 0)}
            side={"right"}
            poolWidth={width}
            poolDepth={depth}
          />
        </>

        {/* Childrens */}
        {children}
      </group>
    </PivotControls>
  );
};

export default Pool;
