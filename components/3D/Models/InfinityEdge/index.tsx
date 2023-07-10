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
    mesh_0_4: THREE.Mesh;
  };
  materials: {
    ["I.E. edge"]: THREE.MeshStandardMaterial;
    ["I.E. stone"]: THREE.MeshStandardMaterial;
    ["I.E. mosaic"]: THREE.MeshStandardMaterial;
    Water: THREE.MeshStandardMaterial;
    ["I.E. mosaic grout"]: THREE.MeshStandardMaterial;
  };
};

const InfinityEdge = (props: JSX.IntrinsicElements["group"]) => {
  const { nodes, materials } = useGLTF(
    "/models/infinity-edge.glb"
  ) as GLTFResult;

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
      <group name="Infinity_edge" userData={{ name: "Infinity edge" }}>
        <mesh
          name="mesh_0"
          geometry={nodes.mesh_0.geometry}
          material={materials["I.E. edge"]}
        />
        <mesh
          name="mesh_0_1"
          geometry={nodes.mesh_0_1.geometry}
          material={materials["I.E. stone"]}
        />
        <mesh
          name="mesh_0_2"
          geometry={nodes.mesh_0_2.geometry}
          material={materials["I.E. mosaic"]}
        />
        <mesh
          name="mesh_0_3"
          geometry={nodes.mesh_0_3.geometry}
          material={materials.Water}
        />
        <mesh
          name="mesh_0_4"
          geometry={nodes.mesh_0_4.geometry}
          material={materials["I.E. mosaic grout"]}
        />
      </group>
    </group>
    </PivotControls>
  );
};

export default InfinityEdge;

useGLTF.preload("/models/infinity-edge.glb");
