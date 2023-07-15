import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, PerspectiveCamera, useTexture } from "@react-three/drei";
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

const InfinityEdge = ({poolWidth, poolHeight, poolDepth, rotation, position, scale, ...props}:{poolWidth:number,poolHeight:number,poolDepth:number, rotation:THREE.Euler, position:THREE.Vector3, scale:THREE.Vector3, props?: JSX.IntrinsicElements["group"]}) => {
  const { nodes, materials } = useGLTF(
    "/models/infinity-edge.glb"
  ) as GLTFResult;
  materials.Water.metalness=0
  materials.Water.opacity=1
  materials.Water.transparent=false
  const groupRef = useRef<THREE.Group>(null)
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  const width = rotation.y == Math.PI/2 || rotation.y == -Math.PI/2 ? poolDepth:poolWidth
  const texture = useTexture("/textures/grass.jpeg");
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(5,1/2)
 return (
    <PivotControls
      disableScaleAxes
      snapTranslate={5}
      visible={visible&& target?.uuid==groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid==groupRef.current?.uuid ?75:0}
      depthTest={false}
      fixed
      offset={[groupRef.current? groupRef.current.position.x : position.x-4 , groupRef.current? groupRef.current.position.y : position.y,   groupRef.current? groupRef.current.position.z : position?.z-4]}
      lineWidth={2}>
    <group renderOrder={0} {...props} dispose={null} ref={groupRef} rotation={rotation} position={position} scale={scale} {...props} onClick={(e)=>{
        e.stopPropagation()
       dispatch(setPivotVisibility(true))
       if(target?.uuid!=groupRef?.current?.uuid){
        dispatch(setTarget(groupRef.current))
      }
    }} >
      <mesh renderOrder={0} position={[0,0,0]}>
        <boxGeometry args={[width,2.6,2]}/>
        <meshStandardMaterial
          attach={"material-0"}
          side={1}
          map={texture}
        /> 
        <meshStandardMaterial
          attach={"material-1"}
          side={1}
          map={texture}
        /> 
        <meshStandardMaterial
          attach={"material-3"}
          side={1}
          map={texture}
        /> 
        <meshStandardMaterial
          attach={"material-4"}
          side={1}
          map={texture}
        /> 
        <meshStandardMaterial
          attach={"material-5"}
          side={1}
          map={texture}
        /> 
        <meshStandardMaterial
          attach={"material-2"}
          side={0}
          colorWrite={false}
          color={"red"}
        /> 
      </mesh>
      <group position={[0,0,-3.5]} name="Infinity_edge" userData={{ name: "Infinity edge" }}>
        <mesh
          renderOrder={0}
          name="mesh_0"
          geometry={nodes.mesh_0.geometry}
          material={materials["I.E. edge"]}
        />
        <mesh
          renderOrder={0}
          name="mesh_0_1"
          geometry={nodes.mesh_0_1.geometry}
          material={materials["I.E. stone"]}
        />
        <mesh
          renderOrder={0}
          name="mesh_0_2"
          geometry={nodes.mesh_0_2.geometry}
          material={materials["I.E. mosaic"]}
        />
        <mesh
          renderOrder={0}
          name="mesh_0_3"
          geometry={nodes.mesh_0_3.geometry}
          material={materials.Water}
        />
        <mesh
          renderOrder={0}
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
