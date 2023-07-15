"use client"
import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { useThree } from "@react-three/fiber";

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
    'Water.008': THREE.MeshStandardMaterial;
    ["Wall waterfall top"]: THREE.MeshStandardMaterial;
    "Faucet.001": THREE.MeshStandardMaterial;
    // ["Wall waterfall"]: THREE.MeshStandardMaterial;
    // Water: THREE.MeshStandardMaterial;
    // ["Wall waterfall top"]: THREE.MeshStandardMaterial;
    // Faucet: THREE.MeshStandardMaterial;
  };
};

const WallWaterfall = ({rotation, position, scale, ...props}:{rotation:THREE.Euler, position:THREE.Vector3, scale:THREE.Vector3, props?: JSX.IntrinsicElements["group"]}) => {
  const { nodes, materials } = useGLTF(
    "/models/newModels/wallWaterfall.glb"
  ) as GLTFResult;
  materials["Wall waterfall"].side=2
  materials["Wall waterfall top"].side=2
  const groupRef = useRef<THREE.Group>(null)
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  const {scene} = useThree()
  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={5}
      visible={visible&& target?.uuid==groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid==groupRef.current?.uuid ?75:0}
      depthTest={false}
      fixed
      offset={[groupRef.current? groupRef.current.position.x : position.x , groupRef.current? groupRef.current.position.y : position.y, groupRef.current? groupRef.current.position.z : position?.z]}
      lineWidth={2}>
      <group 
      // onDoubleClick={(e)=>{
      //   if(groupRef.current?.id){
      //     const object = scene.getObjectById(groupRef.current.id);
      //     if(object){
      //       console.log("here",groupRef.current?.id)
      //       scene.remove(object);
      //     }
      //   }
      // }}
       name="Wall_waterfall" userData={{ name: "Wall waterfall" }} ref={groupRef} rotation={rotation} position={position} scale={scale} {...props} dispose={null} onClick={(e)=>{
       e.stopPropagation()
       dispatch(setPivotVisibility(true))
       if(target?.uuid!=groupRef?.current?.uuid){
        dispatch(setTarget(groupRef.current))
      }

    }} >
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
