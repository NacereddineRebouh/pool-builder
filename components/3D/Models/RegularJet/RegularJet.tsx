/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.12 ./public/models/newModels/RegularJet.gltf --transform -t 
Files: ./public/models/newModels/RegularJet.gltf [599.25KB] > RegularJet-transformed.glb [52.41KB] (91%)
*/

import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { Mask, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { PivotControls } from "../../../UI/pivotControls";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";
import {
  selectTarget,
  selectPivotVisibility,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getActiveAxis } from "@/utils/getActiveAxis";

type GLTFResult = GLTF & {
  nodes: {
    Circle002: THREE.Mesh;
    Circle002_1: THREE.Mesh;
    Circle002_2: THREE.Mesh;
    Mask: THREE.Mesh;
  };
  materials: {
    Glossy: THREE.MeshStandardMaterial;
    White: THREE.MeshPhysicalMaterial;
    Black: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;

export function RegularJet({
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
}) {
  const { nodes, materials } = useGLTF(
    "/models/newModels/RegularJet2-transformed.glb"
  ) as GLTFResult;

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
      disableRotations
      activeAxes={getActiveAxis(model.side)}
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
          const title = model.shapeType + " " + poolIndex + index;
          dispatch(setTargetTitle(title));
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
        {...props}
      >
        <group
          position={[0, 0, -0.076]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.217}
        >
          <mesh
            geometry={nodes.Circle002.geometry}
            material={materials.Glossy}
          />
          <mesh
            geometry={nodes.Circle002_1.geometry}
            material={materials.White}
          />
          <mesh
            geometry={nodes.Circle002_2.geometry}
            material={materials.Black}
          />
          {/* <Mask
            id={2}
            geometry={nodes.Mask.geometry}
            // position={[10.717, 0, -0.014]}
            // rotation={[Math.PI / 2, 0, 0]}
            // scale={0.189}
          /> */}
        </group>
      </group>
    </PivotControls>
  );
}

useGLTF.preload("/models/newModels/RegularJet2-transformed.glb");
