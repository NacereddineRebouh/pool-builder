import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";

type GLTFResult = GLTF & {
  nodes: {
    Mesh_0010: THREE.Mesh;
    Mesh_0010_1: THREE.Mesh;
  };
  materials: {
    Faucet: THREE.MeshStandardMaterial;
    "Mesh_0010": THREE.MeshStandardMaterial;
  };
};
// type GLTFResult = GLTF & {
//   nodes: {
//     mesh_0: THREE.Mesh;
//     mesh_0_1: THREE.Mesh;
//   };
//   materials: {
//     Faucet: THREE.MeshStandardMaterial;
//     Water: THREE.MeshStandardMaterial;
//   };
// };

const Fountain = ({rotation, position, scale, ...props}:{rotation:THREE.Euler, position:THREE.Vector3, scale:THREE.Vector3, props?: JSX.IntrinsicElements["group"]}) => {
  const { nodes, materials } = useGLTF("/models/newModels/Fountain.glb") as GLTFResult;
  // const { nodes, materials } = useGLTF("/models/fountain.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null)
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  // materials.Water.metalness=0
  useEffect(() => {
    if(materials['Mesh_0010']?.color)
      materials['Mesh_0010'].color=new THREE.Color("lightblue");
  }, [materials])
  
  return (
      <PivotControls
       disableScaleAxes
       snapTranslate={5}
       visible={visible&& target?.uuid===groupRef.current?.uuid}
       displayValues
       scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
       depthTest={false}
       fixed
       offset={[groupRef.current? groupRef.current.position.x : position.x , groupRef.current? groupRef.current.position.y : position.y,groupRef.current? groupRef.current.position.z : position.z]}
       lineWidth={2}>
      <group {...props} ref={groupRef} rotation={rotation} position={position} scale={scale} dispose={null} onClick={(e)=>{
      // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
      e.stopPropagation()
      dispatch(setPivotVisibility(true))
      if(target?.uuid!=groupRef?.current?.uuid){
       dispatch(setTarget(groupRef.current))
      }
    }} name="Fountain">
          <mesh name="Mesh_0010" geometry={nodes.Mesh_0010.geometry} material={materials.Faucet} />
          <mesh name="Mesh_0010_1" geometry={nodes.Mesh_0010_1.geometry} material={materials['Mesh_0010']} />
      </group>
    </PivotControls>
  );
};

export default Fountain;

useGLTF.preload("/models/newModels/Fountain.glb");
