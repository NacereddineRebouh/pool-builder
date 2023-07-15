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

const Waterblade = ({rotation, position, scale, ...props}:{rotation:THREE.Euler, position:THREE.Vector3, scale:THREE.Vector3, props?: JSX.IntrinsicElements["group"]}) => {
  const { nodes, materials } = useGLTF("/models/newModels/waterBlade.glb") as GLTFResult;
  // const { nodes, materials } = useGLTF("/models/waterblade.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null)
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  materials["Faucet.002"].side=2
  materials["Water.008"].side=2
  materials["Galvanized steel"].side=2
  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={5}
      visible={visible&& target?.uuid===groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
      depthTest={false}
      fixed
      offset={[groupRef.current? groupRef.current.position.x : position.x , groupRef.current? groupRef.current.position.y : position.y, groupRef.current? groupRef.current.position.z : position?.z]}
      lineWidth={2}>
    <group ref={groupRef} rotation={rotation} position={position} scale={scale} {...props} dispose={null} onClick={(e)=>{
       e.stopPropagation()
       dispatch(setPivotVisibility(true))
       if(target?.uuid!=groupRef?.current?.uuid){
        dispatch(setTarget(groupRef.current))
      }}}>
      {/* <PerspectiveCamera
        name="Camera"
        makeDefault={false}
        far={100}
        near={0.01}
        fov={49.996}
        position={[0, 0.75, 4]}
        rotation={[-0.087, 0, 0]}
        userData={{ name: "Camera" }}
      /> */}
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
