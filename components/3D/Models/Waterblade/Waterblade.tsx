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
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";

type GLTFResult = GLTF & {
  nodes: {
    Mesh_0019: THREE.Mesh;
    Mesh_0019_1: THREE.Mesh;
    Mesh_0019_2: THREE.Mesh;
    // mesh_0: THREE.Mesh;
    // mesh_0_1: THREE.Mesh;
    // mesh_0_2: THREE.Mesh;
  };
  materials: {
    ["Faucet.002"]: THREE.MeshStandardMaterial;
    ["Water.008"]: THREE.MeshStandardMaterial;
    ["Galvanized steel"]: THREE.MeshStandardMaterial;
    // Faucet: THREE.MeshStandardMaterial;
    // Water: THREE.MeshStandardMaterial;
    // ["Galvanized steel"]: THREE.MeshStandardMaterial;
  };
};

const Waterblade = ({
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
    "/models/newModels/waterBlade.glb"
  ) as GLTFResult;
  // const { nodes, materials } = useGLTF("/models/waterblade.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  materials["Faucet.002"].side = 2;
  materials["Water.008"].side = 2;
  materials["Galvanized steel"].side = 2;
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
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position?.z,
      ]}
      lineWidth={2}
    >
      <group
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
        <group name="Water_blade" userData={{ name: "Water blade" }}>
          <mesh
            name="Mesh_0019"
            geometry={nodes["Mesh_0019"].geometry}
            material={materials["Faucet.002"]}
          />
          <mesh
            name="Mesh_0019_1"
            geometry={nodes["Mesh_0019_1"].geometry}
            material={materials["Water.008"]}
          />
          <mesh
            name="Mesh_0019_2"
            geometry={nodes["Mesh_0019_2"].geometry}
            material={materials["Galvanized steel"]}
          />
        </group>
      </group>
    </PivotControls>
  );
};

export default Waterblade;

useGLTF.preload("/models/newModels/waterblade.glb");
