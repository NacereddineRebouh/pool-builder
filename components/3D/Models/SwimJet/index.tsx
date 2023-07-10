"use client"
import * as THREE from "three";
import React, { useRef, useState } from "react";
import { TransformControls, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { PivotControls } from "@/components/UI/pivotControls";

type GLTFResult = GLTF & {
  nodes: {
    Swim_jet: THREE.Mesh;
  };
  materials: {
    ["Swim jet"]: THREE.MeshStandardMaterial;
  };
};

const SwimJet = ({position, scale, ...props}:{position:THREE.Vector3, scale:THREE.Vector3, props?: JSX.IntrinsicElements["group"]}) => {
  const { nodes, materials } = useGLTF("/models/swim-jet.glb") as GLTFResult;

  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
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
       offset={[groupRef.current? groupRef.current.position.x : position.x , groupRef.current? groupRef.current.position.y : position.y,groupRef.current? groupRef.current.position.z : position.z]}
       lineWidth={2}>
      <group ref={groupRef} {...props} dispose={null} onClick={(e)=>{
        // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
        dispatch(setPivotVisibility(true))
        if(target?.uuid!=groupRef?.current?.uuid){
         dispatch(setTarget(groupRef.current))
       }
      }}>
        <mesh
          name="Swim_jet"
          geometry={nodes.Swim_jet.geometry}
          userData={{ name: "Swim jet" }}
        >
          <meshStandardMaterial color={"white"} metalness={.3} roughness={.6}/>
        </mesh>
      </group>
      </PivotControls>
  );
};

export default SwimJet;

useGLTF.preload("/models/swim-jet.glb");
