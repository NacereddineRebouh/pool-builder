"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { MeshTransmissionMaterial, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Environment from "../Environment";
import { Perf } from "r3f-perf";
import Ground from "./Ground/Ground";
import Helper from "./Helpers/Helper";
import { useAppSelector } from "@/store/hooks";
import { selectPools, selectShapes } from "@/slices/shapesSlice";
import { selectPools as selectAllPools } from "@/slices/poolsSlice";
import Pool from "./Models/Pool/Pool";
import SwimJet from "./Models/SwimJet";
import WallWaterfall from "./Models/WallWaterfall";
import Waterblade from "./Models/Waterblade/Waterblade";
import Steps from "./Models/Steps";
import InfinityEdge from "./Models/InfinityEdge";
import Fountain from "./Models/Fountain";
import SquareSteps from "./Models/squareSteps";
import { InsetSteps } from "./Models/insetSteps/InsetSteps";
import CornerRoundSteps from "./Models/CornerRoundSteps";
import RoundSteps from "./Models/RoundSteps";
import { PivotControls } from "../UI/pivotControls";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Addition, Base, CSGGeometryRef, Geometry, Subtraction } from "@react-three/csg";

type Props = {};
enum sides {
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
}

const box = new THREE.BoxGeometry()
const cyl = new THREE.CylinderGeometry(1, 1, 2, 20)
const tri = new THREE.CylinderGeometry(1, 1, 2, 3)

export default function Scene({}: Props) {
  const cameraRef = useRef<any>(null);
  const { nodes, materials } = useGLTF(
    "/models/newModels/InsetSteps.glb"
  ) as GLTFResult;
  return (
    <Canvas>
      <Perf position={"bottom-right"} />
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault={true}
        position={[0, 1, 2]}
        near={0.1}
        far={200}
      />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2} />
      <Environment />
      <Ground />
      <Geometry>
     <mesh>
      <sphereGeometry args={[0.7, 30, 30]} attach="geometry" />
      <meshBasicMaterial color={0xfff1ef} attach="material" />
   </mesh>
    </Geometry>
      {/* <Test/> */}
     
      {/* <CrossGeometry/> */}
      {/* <mesh receiveShadow castShadow> */}
      {/** This will yield a regular THREE.BufferGeometry that needs to be paired with a mesh.
           If "useGroups" is true each op can have its own material. */}
      {/* <Geometry useGroups>
        <Base>
          <boxGeometry args={[1, 1.5, 1]} />
          <meshNormalMaterial />
        </Base> 
      </Geometry> */}
    {/* </mesh> */}
      
      <Helper />
      {/* <POOLS /> */}
    </Canvas>
  );
}
const POOLS = () => {
  const Pools = useAppSelector(selectAllPools);
  return (
    <>
      {Pools.map((pool, poolIndex) => {
        switch (pool.poolType) {
          case "pool":
            return (
              <Pool
                key={poolIndex}
                pool={pool}
                index={poolIndex}
                width={pool.sWidth}
                height={pool.sHeight}
                depth={pool.sDepth}
                scale={pool.scale}
                position={pool.position}
                sPosition={pool.sPosition}
                sRotation={pool.sRotation}
                rotation={pool.rotation}
                sScale={pool.sScale}
                sWidth={pool.sWidth}
                sHeight={pool.sHeight}
                sDepth={pool.sDepth}
              >
                {pool.childrens.length > 0 &&
                  pool.childrens.map((shape, index) => {
                    const pos = [...shape.position];
                    const offsetWidth = pool.sWidth - pool.width;
                    const offsetHeight = pool.sHeight - pool.height;
                    const offsetDepth = pool.sDepth - pool.depth;
                    switch (shape.shapeType) {
                      case "SwimJet":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <SwimJet
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "WallWaterfall":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <WallWaterfall
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "Waterblade":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <Waterblade
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "Steps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <Steps
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            key={index}
                            position={new THREE.Vector3(...pos)}
                            width={3}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                            gap={0.2}
                            poolDepth={pool.sDepth}
                            intersecting={false}
                          />
                        );
                      case "cornerRounded":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }

                        return (
                          <CornerRoundSteps
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                            width={3}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                            gap={0.2}
                            sScale={[1, 1, 1]}
                          />
                        );
                      case "RoundSteps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <RoundSteps
                            key={index}
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            scale={new THREE.Vector3(...shape.scale)}
                            rotation={new THREE.Euler(...shape.rotation)}
                            position={new THREE.Vector3(...pos)}
                            width={3}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                            gap={0.2}
                          />
                        );
                      case "InfinityEdge":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <InfinityEdge
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            poolWidth={pool.sWidth}
                            poolHeight={pool.sHeight}
                            poolDepth={pool.sDepth}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "Fountain":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <Fountain
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                      case "SquareSteps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <SquareSteps
                            model={shape}
                            gap={0.2}
                            index={index}
                            poolIndex={poolIndex}
                            key={index}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                            width={.5}
                            intersecting={false}
                            poolHeight={pool.sHeight}
                            poolWidth={pool.sWidth}
                            side={shape.side}
                            heightPerStep={0.2}
                          />
                        );
                      case "insetSteps":
                        switch (shape.side) {
                          case "Left":
                            //Topleft
                            pos[0] = shape.position[0] - offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Right":
                            pos[0] = shape.position[0] + offsetWidth / 2;
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2];
                            break;
                          case "Top":
                            //bottom Left
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] - offsetDepth / 2;
                            break;
                          case "Bottom":
                            pos[0] = shape.position[0];
                            pos[1] = shape.position[1];
                            pos[2] = shape.position[2] + offsetDepth / 2;
                            break;
                        }
                        return (
                          <InsetSteps
                            model={shape}
                            index={index}
                            poolIndex={poolIndex}
                            sPosition={shape.sPosition}
                            sRotation={shape.sRotation}
                            sScale={shape.sScale}
                            key={index}
                            rotation={new THREE.Euler(...shape.rotation)}
                            scale={new THREE.Vector3(...shape.scale)}
                            position={new THREE.Vector3(...pos)}
                          />
                        );
                    }
                  })}
              </Pool>
            );
        }
      })}
    </>
  );
};

export const MemoisedScene = React.memo(Scene);

type GLTFResult = GLTF & {
  nodes: {
    Inset_steps: THREE.Mesh;
  };
  materials: {
    ["Inset steps"]: THREE.MeshStandardMaterial;
  };
};
const Test = ()=>{
 
  return (
    <>
     {/* <group
        dispose={null}
      position={[0,0,0]}
        scale={[.3,.3,.3]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Inset_steps.geometry}
          material={materials["Inset steps"]}
        />
      </group> */}
      
    </>
  )
}

// function CrossGeometry() {
//   return (
//     <Geometry>
//      <mesh>
//       <sphereGeometry args={[0.7, 30, 30]} attach="geometry" />
//       <meshBasicMaterial color={0xfff1ef} attach="material" />
//    </mesh>
//     </Geometry>
//   )
// }


// function House(props:any) {
//   const csg = useRef<CSGGeometryRef>(null)
//   return (
//     <mesh receiveShadow castShadow {...props}>
//       <Geometry ref={csg} computeVertexNormals>
//         <Base name="base" geometry={box} scale={[3, 3, 3]} />
//         <Subtraction name="cavity" geometry={box} scale={[2.7, 2.7, 2.7]} />
//         <Addition name="roof" geometry={tri} scale={[2.5, 1.5, 1.425]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 2.2, 0]} />
//         <Chimney scale={0.5} position={[-0.75, 3, 0.8]} />
//         <Window position={[1.1, 2.5, 0]} scale={0.6} rotation={[0, Math.PI / 2, 0]} />
//         <Window position={[0, 2.5, 1.5]} scale={0.6} rotation={[0, 0, 0]} />
//         <PivotControls activeAxes={[false, true, true]} rotation={[0, Math.PI / 2, 0]} scale={1} anchor={[0, 0, 0.4]} onDrag={() => {
//           if(csg.current)
//             csg.current.update()
//         }}>
//           <Window position={[0, 0.25, 1.5]} scale={1.25} />
//         </PivotControls>
//         <PivotControls activeAxes={[false, true, true]} rotation={[0, Math.PI, 0]} scale={1} anchor={[0.4, 0, 0]} onDrag={() => {
//           if(csg.current)
//           csg.current.update()
//         }}>
//           <Window rotation={[0, Math.PI / 2, 0]} position={[1.425, 0.25, 0]} scale={1.25} />
//         </PivotControls>
//         <PivotControls activeAxes={[false, true, true]} scale={1} anchor={[-0.5, 0, 0]} onDrag={() =>{
//           if(csg.current)
//           csg.current.update()
//         }}>
//           <Door rotation={[0, Math.PI / 2, 0]} position={[-1.425, -0.45, 0]} scale={[1, 0.9, 1]} />
//         </PivotControls>
//       </Geometry>
//       <meshStandardMaterial envMapIntensity={0.25} />
//     </mesh>
//   )
// }

// const Door = (props:any) => (
//   <Subtraction {...props}>
//     <Geometry>
//       <Base geometry={box} scale={[1, 2, 1]} />
//       <Addition geometry={cyl} scale={0.5} rotation={[Math.PI / 2, 0, 0]} position={[0, 1, 0]} />
//     </Geometry>
//   </Subtraction>
// )

// const Window = (props:any) => (
//   <Subtraction {...props}>
//     <Geometry>
//       <Base geometry={box} />
//       <Subtraction geometry={box} scale={[0.05, 1, 1]} />
//       <Subtraction geometry={box} scale={[1, 0.05, 1]} />
//     </Geometry>
//   </Subtraction>
// )

// const Chimney = (props:any) => (
//   <Addition name="chimney" {...props}>
//     <Geometry>
//       <Base name="base" geometry={box} scale={[1, 2, 1]} />
//       <Subtraction name="hole" geometry={box} scale={[0.7, 2, 0.7]} position={[0, 0.5, 0]} />
//     </Geometry>
//   </Addition>
// )
