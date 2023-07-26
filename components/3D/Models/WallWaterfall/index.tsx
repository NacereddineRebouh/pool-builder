"use client";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { useThree } from "@react-three/fiber";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";

type GLTFResult = GLTF & {
  nodes: {
    Mesh_0018: THREE.Mesh;
    Mesh_0018_1: THREE.Mesh;
    Mesh_0018_2: THREE.Mesh;
    Mesh_0018_3: THREE.Mesh;
    // mesh_0: THREE.Mesh;
    // mesh_0_1: THREE.Mesh;
    // mesh_0_2: THREE.Mesh;
    // mesh_0_3: THREE.Mesh;
  };
  materials: {
    ["Wall waterfall"]: THREE.MeshStandardMaterial;
    "Water.008": THREE.MeshStandardMaterial;
    ["Wall waterfall top"]: THREE.MeshStandardMaterial;
    "Faucet.001": THREE.MeshStandardMaterial;
    // ["Wall waterfall"]: THREE.MeshStandardMaterial;
    // Water: THREE.MeshStandardMaterial;
    // ["Wall waterfall top"]: THREE.MeshStandardMaterial;
    // Faucet: THREE.MeshStandardMaterial;
  };
};

const WallWaterfall = ({
  sPosition,
  sRotation,
  sScale,
  poolIndex,
  index,
  model,
  rotation,
  position,
  scale,
  ...props
}: {
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  poolIndex: number;
  index: number;
  model: ChildrensType;
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  props?: JSX.IntrinsicElements["group"];
}) => {
  const { nodes, materials } = useGLTF(
    "/models/newModels/wallWaterfall.glb"
  ) as GLTFResult;
  materials["Wall waterfall"].side = 2;
  materials["Wall waterfall top"].side = 2;
  const groupRef = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  const { scene } = useThree();

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
      snapTranslate={5}
      visible={visible && target?.uuid == groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid == groupRef.current?.uuid ? 75 : 0}
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
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position?.z,
      ]}
      lineWidth={2}
    >
      <group
        name="Wall_waterfall"
        userData={{ name: "Wall waterfall" }}
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        {...props}
        dispose={null}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        <mesh
          name="Mesh_0018"
          geometry={nodes.Mesh_0018.geometry}
          material={materials["Wall waterfall"]}
        />
        <mesh
          name="Mesh_0018_1"
          geometry={nodes.Mesh_0018_1.geometry}
          material={materials["Water.008"]}
        />
        <mesh
          name="Mesh_0018_2"
          geometry={nodes.Mesh_0018_2.geometry}
          material={materials["Wall waterfall top"]}
        />
        <mesh
          name="Mesh_0018_3"
          geometry={nodes.Mesh_0018_3.geometry}
          material={materials["Faucet.001"]}
        />
      </group>
    </PivotControls>
  );
};

export default WallWaterfall;

useGLTF.preload("/models/newModels/wallWaterfall.glb");
