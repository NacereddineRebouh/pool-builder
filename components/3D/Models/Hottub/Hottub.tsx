"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Mask, useTexture } from "@react-three/drei";
import Borders from "../Pool/Borders";
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
  children?: React.ReactNode;
  pool: PoolType;
}
const Hottub: FC<Props> = ({
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
}) => {
  // Bench calculations

  const BenchWidth = 0.5;
  const BenchDepth = 0.5;
  const BenchHeight = height - 0.65;
  const BenchYPosition = -height + BenchHeight / 2;

  // load tile texture
  const texture = useTexture("/textures/tiles.jpg");

  const material = new THREE.MeshStandardMaterial({
    metalness: 0.2,
    roughness: 0.15,
    map: texture,
    side: 2,
    color: new THREE.Color("lightblue"),
  });
  if (material.map) {
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.repeat.set(2, 1);
  }

  const groupRef = useRef<THREE.Group>(null);
  const gp = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);

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

  const left = pool?.BenchSeatings?.includes("left");
  const right = pool?.BenchSeatings?.includes("right");
  const top = pool?.BenchSeatings?.includes("top");
  const bottom = pool?.BenchSeatings?.includes("bottom");
  // Bench seatings
  const leftOffsetZPosition =
    top && bottom
      ? 0
      : top && !bottom
      ? BenchWidth / 2
      : !top && bottom
      ? -BenchWidth / 2
      : 0;
  const leftWidth = BenchWidth;
  const leftDepth =
    top && bottom
      ? depth - BenchWidth * 2
      : (top && !bottom) || (!top && bottom)
      ? depth - BenchWidth
      : depth;

  const rightOffsetZPosition =
    top && bottom
      ? 0
      : top && !bottom
      ? BenchWidth / 2
      : !top && bottom
      ? -BenchWidth / 2
      : 0;
  const rightWidth = BenchWidth;
  const rightDepth =
    top && bottom
      ? depth - BenchWidth * 2
      : (top && !bottom) || (!top && bottom)
      ? depth - BenchWidth
      : depth;
  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={10}
      visible={visible && target?.uuid === groupRef.current?.uuid}
      displayValues={false}
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
        dispose={null}
        onClick={(e) => {
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        {/* Pool */}
        <mesh dispose={null} position={[0, -height / 2, 0]}>
          <boxGeometry args={[width, height, depth]} />
          <>
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={texture}
              attach={"material-0"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={texture}
              attach={"material-1"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={texture}
              attach={"material-3"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={texture}
              attach={"material-4"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={texture}
              attach={"material-5"}
              side={2}
              color={"lightblue"}
            />
            <meshStandardMaterial
              metalness={0.2}
              roughness={0.24}
              map={texture}
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
        {/* ------------------- Snapping areas " stairs helper boxes "  ---------------- */}

        {/* BenchSeating */}
        {/* left */}
        {pool?.BenchSeatings?.includes("left") && (
          <mesh
            material={material}
            visible={true}
            position={[
              -width / 2 + BenchWidth / 2,
              BenchYPosition,
              rightOffsetZPosition,
            ]}
            renderOrder={0}
          >
            <boxGeometry
              args={[leftWidth, BenchHeight, leftDepth]}
              // args={[BenchWidth, BenchHeight, depth - BenchWidth * 2]}
            />
          </mesh>
        )}
        {pool?.BenchSeatings?.includes("top") && (
          <mesh
            material={material}
            visible={true}
            position={[0, BenchYPosition, -depth / 2 + BenchWidth / 2]}
            renderOrder={2}
          >
            <boxGeometry args={[width, BenchHeight, BenchDepth]} />
          </mesh>
        )}
        {pool?.BenchSeatings?.includes("bottom") && (
          <mesh
            material={material}
            visible={true}
            position={[0, BenchYPosition, depth / 2 - BenchWidth / 2]}
            renderOrder={3}
          >
            <boxGeometry args={[width, BenchHeight, BenchDepth]} />
          </mesh>
        )}
        {pool?.BenchSeatings?.includes("right") && (
          <mesh
            material={material}
            visible={true}
            position={[
              width / 2 - BenchWidth / 2,
              BenchYPosition,
              rightOffsetZPosition,
            ]}
            renderOrder={1}
          >
            <boxGeometry
              args={[rightWidth, BenchHeight, rightDepth]}
              // args={[BenchWidth, BenchHeight, depth - BenchWidth * 2]}
            />
          </mesh>
        )}
        {/* Right */}
        {/* Top */}
        {/* Bottom */}
        {/* Childrens */}
        {children}
      </group>
    </PivotControls>
  );
};

export default Hottub;
