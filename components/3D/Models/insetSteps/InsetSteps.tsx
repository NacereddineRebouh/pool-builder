/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.5 public/models/insetSteps.glb -ts s
*/

import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, PerspectiveCamera, Mask } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";

type GLTFResult = GLTF & {
  nodes: {
    Inset_steps: THREE.Mesh;
    mask: THREE.Mesh;
  };
  materials: {
    ["Inset steps"]: THREE.MeshStandardMaterial;
    mask: THREE.MeshStandardMaterial;
  };
};

export function InsetSteps({
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
}) {
  const { nodes, materials } = useGLTF(
    "/models/newModels/InsetSteps3.glb"
  ) as GLTFResult;
  // const { nodes, materials } = useGLTF('/models/insetSteps.glb') as GLTFResult
  const groupRef = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
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
      matrix={Mat}
      translateP={[sPosition[0], sPosition[1], sPosition[2]]}
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position.z,
      ]}
      lineWidth={2}
    >
      <group
        {...props}
        rotation={rotation}
        position={position}
        scale={scale}
        dispose={null}
        ref={groupRef}
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
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Inset_steps.geometry}
          material={materials["Inset steps"]}
          scale={[0.6, 0.6, 0.6]}
        ></mesh>
        <Mask id={1}>
          {/* <primitive name="mask" object={nodes.mask.geometry} dispose={null} scale={[2*2.129, 2*1, 2*1]} ></primitive> */}
          <primitive
            object={nodes.mask.geometry}
            dispose={null}
            scale={[2.129, 1, 1]}
          />
          {/* <planeGeometry args={[5,5]} /> */}
          {/* <mesh name="mask" geometry={nodes.mask.geometry}  scale={[2.129, 1, 1]} >
            <meshStandardMaterial color={"pink"}/>
           </mesh> */}
        </Mask>
        <Mask id={1}>
          {/* <primitive name="mask" object={nodes.mask.geometry} dispose={null} scale={[2*2.129, 2*1, 2*1]} ></primitive> */}
          <primitive
            object={nodes.mask.geometry}
            dispose={null}
            scale={[2.129, 1, 1]}
          />
          {/* <planeGeometry args={[5,5]} /> */}
          {/* <mesh name="mask" geometry={nodes.mask.geometry}  scale={[2.129, 1, 1]} >
            <meshStandardMaterial color={"pink"}/>
           </mesh> */}
        </Mask>
      </group>
    </PivotControls>
  );
}

useGLTF.preload("/models/newModels/InsetSteps3.glb");
