"use client";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { TransformControls, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
} from "@/slices/targetSlice";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";

type GLTFResult = GLTF & {
  nodes: {
    Swim_jet: THREE.Mesh;
  };
  materials: {
    ["Swim jet"]: THREE.MeshStandardMaterial;
  };
};

const SwimJet = ({
  poolIndex,
  index,
  model,
  sPosition,
  sRotation,
  sScale,
  rotation,
  position,
  scale,
  ...props
}: {
  poolIndex: number;
  index: number;
  model: ChildrensType;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  props?: JSX.IntrinsicElements["group"];
}) => {
  const { nodes, materials } = useGLTF("/models/swim-jet.glb") as GLTFResult;

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
    // console.table(comb)

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
      translateP={[sPosition[0], sPosition[1], sPosition[2]]}
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position.z,
      ]}
      matrix={Mat}
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
          // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
          e.stopPropagation();
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        <mesh
          name="Swim_jet"
          geometry={nodes.Swim_jet.geometry}
          userData={{ name: "Swim jet" }}
          scale={[1, 1, 1]}
        >
          <meshStandardMaterial
            color={"white"}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>
      </group>
    </PivotControls>
  );
};

export default SwimJet;

useGLTF.preload("/models/swim-jet.glb");
