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
  };
  materials: {
    Faucet: THREE.MeshStandardMaterial;
    Water: THREE.MeshStandardMaterial;
  };
};

const Fountain = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF("/models/fountain.glb") as GLTFResult;
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
      <group name="Faucet" userData={{ name: "Faucet" }}>
        <mesh
          name="mesh_0"
          geometry={nodes.mesh_0.geometry}
          material={materials.Faucet}
        />
        <mesh
          name="mesh_0_1"
          geometry={nodes.mesh_0_1.geometry}
          material={materials.Water}
          // material={new THREE.MeshBasicMaterial({ color: "blue" })}
        />
        <directionalLight intensity={0.5} />
      </group>
    </group>
    </PivotControls>
  );
};

export default Fountain;

useGLTF.preload("/models/fountain.glb");
