"use client"
import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
    mesh_0_1: THREE.Mesh;
    mesh_0_2: THREE.Mesh;
  };
  materials: {
    Faucet: THREE.MeshStandardMaterial;
    Water: THREE.MeshStandardMaterial;
    ["Galvanized steel"]: THREE.MeshStandardMaterial;
  };
};

const Waterblade = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/waterblade.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null)
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);

  return (
    <PivotControls
       disableScaleAxes
       snapTranslate={5}
       visible={visible&& target!=null}
       displayValues
       scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
       depthTest={false}
       fixed
       lineWidth={2}>
    <group {...props} dispose={null} onClick={(e)=>{
      // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
      dispatch(setPivotVisibility(true))
      if(target?.uuid!=groupRef?.current?.uuid){
       dispatch(setTarget(groupRef.current))
     }
   }}>
      <PerspectiveCamera
        name="Camera"
        makeDefault={false}
        far={100}
        near={0.01}
        fov={49.996}
        position={[0, 0.75, 4]}
        rotation={[-0.087, 0, 0]}
        userData={{ name: "Camera" }}
      />
      <group name="Water_blade" userData={{ name: "Water blade" }}>
        <mesh
          name="mesh_0"
          geometry={nodes.mesh_0.geometry}
          material={materials.Faucet}
        />
        <mesh
          name="mesh_0_1"
          geometry={nodes.mesh_0_1.geometry}
          material={materials.Water}
        />
        <mesh
          name="mesh_0_2"
          geometry={nodes.mesh_0_2.geometry}
          material={materials["Galvanized steel"]}
        />
      </group>
    </group>
    </PivotControls>
  );
};

export default Waterblade;

useGLTF.preload("/models/waterblade.glb");
