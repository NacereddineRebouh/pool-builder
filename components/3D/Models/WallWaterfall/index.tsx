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
    mesh_0_3: THREE.Mesh;
  };
  materials: {
    ["Wall waterfall"]: THREE.MeshStandardMaterial;
    Water: THREE.MeshStandardMaterial;
    ["Wall waterfall top"]: THREE.MeshStandardMaterial;
    Faucet: THREE.MeshStandardMaterial;
  };
};

const WallWaterfall = (props: JSX.IntrinsicElements["group"]) => {
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const { nodes, materials } = useGLTF(
    "/models/wall-waterfall.glb"
  ) as GLTFResult;
  const groupRef = useRef<THREE.Group>(null)
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
    <group ref={groupRef} {...props} dispose={null} onClick={(e)=>{
       // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
       dispatch(setPivotVisibility(true))
       if(target?.uuid!=groupRef?.current?.uuid){
        dispatch(setTarget(groupRef.current))
      }

    }}>
      <group name="Wall_waterfall" userData={{ name: "Wall waterfall" }}   >
        <mesh
          name="mesh_0"
          geometry={nodes.mesh_0.geometry}
          material={materials["Wall waterfall"]}
        />
        <mesh
          name="mesh_0_1"
          geometry={nodes.mesh_0_1.geometry}
          material={materials.Water}
        />
        <mesh
          name="mesh_0_2"
          geometry={nodes.mesh_0_2.geometry}
          material={materials["Wall waterfall top"]}
        />
        <mesh
          name="mesh_0_3"
          geometry={nodes.mesh_0_3.geometry}
          material={materials.Faucet}
        />
      </group>
    </group>
    </PivotControls>
  );
};

export default WallWaterfall;

useGLTF.preload("/models/wall-waterfall.glb");
