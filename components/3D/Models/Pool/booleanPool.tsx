// "use client";
// import React, { FC, useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { Mask, useGLTF, useTexture } from "@react-three/drei";
// import Borders from "./Borders";
// import {
//   selectPivotVisibility,
//   selectTarget,
//   setPivotVisibility,
//   setTarget,
// } from "@/slices/targetSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { PivotControls } from "@/components/UI/pivotControls";
// import { ChildrensType, ReplacePool } from "@/slices/poolsSlice";
// import {
//   Addition,
//   Base,
//   CSGGeometryRef,
//   Geometry,
//   Subtraction,
// } from "@react-three/csg";
// import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
// interface Props {
//   index?: number;
//   position: number[];
//   sPosition: number[];
//   sRotation: number[];
//   rotation: number[];
//   scale: number[];
//   sScale: number[];
//   width: number;
//   sWidth: number;
//   height: number;
//   sHeight: number;
//   depth: number;
//   sDepth: number;
//   key?: number;
//   children?: React.ReactNode;
//   pool: PoolType;
// }
// enum sides {
//   Top = "Top",
//   Bottom = "Bottom",
//   Left = "Left",
//   Right = "Right",
// }
// export interface PoolType {
//   poolType: string;
//   position: number[];
//   sPosition: number[];
//   sRotation: number[];
//   rotation: number[];
//   scale: number[];
//   sScale: number[];
//   width: number;
//   sWidth: number;
//   height: number;
//   sHeight: number;
//   depth: number;
//   sDepth: number;
//   childrens: ChildrensType[];
// }
// const BoolPool: FC<Props> = ({
//   width = 5,
//   height = 2,
//   depth = 3,
//   position,
//   sPosition,
//   scale,
//   sScale,
//   sRotation,
//   index,
//   children,
//   pool,
// }) => {
//   const csg = useRef<CSGGeometryRef>(null);
//   const bx = useRef<THREE.BoxGeometry>(null);
//   const geometry = new THREE.BufferGeometry();

//   // create a simple square shape. We duplicate the top left and bottom right
//   // vertices because each vertex needs to appear once per triangle.
//   const vertices = new Float32Array([
//     -1.0,
//     -1.0,
//     1.0, // v0
//     1.0,
//     -1.0,
//     1.0, // v1
//     1.0,
//     1.0,
//     1.0, // v2

//     1.0,
//     1.0,
//     1.0, // v3
//     -1.0,
//     1.0,
//     1.0, // v4
//     -1.0,
//     -1.0,
//     1.0, // v5
//   ]);

//   // itemSize = 3 because there are 3 values (components) per vertex
//   geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
//   // load tile texture
//   const texture = useTexture("/textures/tiles.jpg");
//   texture.wrapT = THREE.RepeatWrapping;
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.repeat.set(2, 1);
//   const groupRef = useRef<THREE.Group>(null);
//   const gp = useRef<THREE.Group>(null);
//   const dispatch = useAppDispatch();
//   const target = useAppSelector(selectTarget);
//   const visible = useAppSelector(selectPivotVisibility);

//   // Snapping box
//   const boxWidth = 3;
//   const boxHeight = height;
//   const boxDepth = 4;

//   const swimJetBoxWidth = 3 / 3;
//   const swimJetBoxHeight = height / 3;
//   const swimJetBoxDepth = 4 / 3;

//   const infinityEdgeBoxWidth = 1;
//   const infinityEdgeBoxHeight = 1;
//   const infinityEdgeBoxDepth = depth;

//   const waterFallBoxWidth = 3;
//   const waterFallBoxHeight = 2;
//   const waterFallBoxDepth = 2;

//   // useEffect(() => {
//   const [Mat, setMat] = useState(new THREE.Matrix4());
//   useEffect(() => {
//     console.log("useffect pool:", sPosition);

//     const pos = new THREE.Vector3(
//       0 + sPosition[0],
//       0 + sPosition[1],
//       0 + sPosition[2]
//     );
//     const comb = new THREE.Matrix4();
//     const radiansX = THREE.MathUtils.degToRad(sRotation[0]);
//     const radiansY = THREE.MathUtils.degToRad(sRotation[1]);
//     const radiansZ = THREE.MathUtils.degToRad(sRotation[2]);
//     const qt = new THREE.Quaternion();
//     qt.setFromEuler(new THREE.Euler(radiansX, radiansY, radiansZ, "XYZ"));
//     comb.compose(pos, qt, new THREE.Vector3(sScale[0], sScale[1], sScale[2]));
//     setMat(comb);
//   }, [sScale, sPosition, sRotation, pool]);
//   return (
//     <PivotControls
//       disableScaleAxes
//       snapTranslate={10}
//       visible={visible && target?.uuid === groupRef.current?.uuid}
//       displayValues={false}
//       scale={visible && target?.uuid === groupRef.current?.uuid ? 75 : 0}
//       depthTest={false}
//       fixed
//       disableSliders
//       onDragEnd={(w, de, wl, delw) => {
//         const pos = new THREE.Vector3(); // create one and reuse it
//         const quaternion = new THREE.Quaternion();
//         const scale = new THREE.Vector3();
//         w.decompose(pos, quaternion, scale);
//         const euler = new THREE.Euler().setFromQuaternion(quaternion);
//         const pl = { ...pool };
//         const x = +pos.x.toFixed(2) + 0;
//         const y = +pos.y.toFixed(2) + 0;
//         const z = +pos.z.toFixed(2) + 0;
//         pl.sPosition = [x, y, z];

//         pl.sScale = [scale.x, scale.y, scale.z];
//         pl.sRotation = [
//           THREE.MathUtils.radToDeg(euler.x),
//           THREE.MathUtils.radToDeg(euler.y),
//           THREE.MathUtils.radToDeg(euler.z),
//         ];
//         dispatch(ReplacePool({ poolIndex: index, pool: pl }));
//       }}
//       ref={gp}
//       matrix={Mat}
//       lineWidth={2}
//     >
//       <group
//         ref={groupRef}
//         onClick={(e) => {
//           dispatch(setPivotVisibility(true));
//           if (target?.uuid != groupRef?.current?.uuid) {
//             dispatch(setTarget(groupRef.current));
//           }
//         }}
//       >
//         {/* Pool */}
//         <mesh>
//           <Geometry showOperations ref={csg} computeVertexNormals>
//             <Base position={[0, -height / 2, 0]}>
//               {/* <boxGeometry ref={bx} args={[width, height, depth]} /> */}
//               <planeGeometry args={[width, height, depth]} />
//               <meshStandardMaterial
//                 metalness={0.2}
//                 roughness={0.24}
//                 map={texture}
//                 attach={"material-0"}
//                 side={2}
//                 color={"lightblue"}
//               />
//               <meshStandardMaterial
//                 metalness={0.2}
//                 roughness={0.24}
//                 map={texture}
//                 attach={"material-1"}
//                 side={2}
//                 color={"lightblue"}
//               />
//               <meshStandardMaterial
//                 metalness={0.2}
//                 roughness={0.24}
//                 map={texture}
//                 attach={"material-3"}
//                 side={2}
//                 color={"lightblue"}
//               />
//               <meshStandardMaterial
//                 metalness={0.2}
//                 roughness={0.24}
//                 map={texture}
//                 attach={"material-4"}
//                 side={2}
//                 color={"lightblue"}
//               />
//               <meshStandardMaterial
//                 metalness={0.2}
//                 roughness={0.24}
//                 map={texture}
//                 attach={"material-5"}
//                 side={2}
//                 color={"lightblue"}
//               />
//               <meshStandardMaterial
//                 metalness={0.2}
//                 roughness={0.24}
//                 map={texture}
//                 attach={"material-2"}
//                 side={1}
//                 colorWrite={false}
//                 color={"lightblue"}
//                 // transparent
//                 // opacity={0}
//               />
//             </Base>
//             <PivotControls
//               disableScaleAxes
//               snapTranslate={10}
//               onDragEnd={() => {
//                 if (csg.current) csg.current.update();
//               }}
//               scale={75}
//               depthTest={false}
//               fixed
//               disableSliders
//               lineWidth={2}
//             >
//               <Test />
//             </PivotControls>

//             {/* Mask */}
//             <Mask
//               id={1}
//               rotation={[-Math.PI / 2, 0, 0]}
//               position={[0, 0.025, 0]}
//             >
//               <planeGeometry args={[width, depth]} />
//               <meshBasicMaterial color={"salmon"} />
//             </Mask>

//             {/* Borders */}
//             {/* <Addition>
//                 <Geometry>
//                  <Base>
//                     <Borders
//                       width={width}
//                       height={0.05}
//                       depth={height}
//                       outline={2}
//                       position={new THREE.Vector3(0, 0, 0)}
//                       side={"left"}
//                       poolWidth={width}
//                       poolDepth={depth}
//                     />
//                     <Borders
//                       width={width}
//                       height={0.05}
//                       depth={height}
//                       outline={2}
//                       position={new THREE.Vector3(0, 0, 0)}
//                       side={"top"}
//                       poolWidth={width}
//                       poolDepth={depth}
//                     />
//                     <Borders
//                       width={width}
//                       height={0.05}
//                       depth={height}
//                       outline={2}
//                       position={new THREE.Vector3(0, 0, 0)}
//                       side={"bottom"}
//                       poolWidth={width}
//                       poolDepth={depth}
//                     />
//                     <Borders
//                       width={width}
//                       height={0.05}
//                       depth={height}
//                       outline={2}
//                       position={new THREE.Vector3(0, 0, 0)}
//                       side={"right"}
//                       poolWidth={width}
//                       poolDepth={depth}
//                     />

//                  </Base>
//                 </Geometry>
//               </Addition> */}

//             {/* Childrens */}
//           </Geometry>
//           <meshStandardMaterial
//             metalness={0.2}
//             roughness={0.24}
//             map={texture}
//             attach={"material-0"}
//             side={2}
//             color={"lightblue"}
//           />
//           <meshStandardMaterial
//             metalness={0.2}
//             roughness={0.24}
//             map={texture}
//             attach={"material-1"}
//             side={2}
//             color={"lightblue"}
//           />
//           <meshStandardMaterial
//             metalness={0.2}
//             roughness={0.24}
//             map={texture}
//             attach={"material-3"}
//             side={2}
//             color={"lightblue"}
//           />
//           <meshStandardMaterial
//             metalness={0.2}
//             roughness={0.24}
//             map={texture}
//             attach={"material-4"}
//             side={2}
//             color={"lightblue"}
//           />
//           <meshStandardMaterial
//             metalness={0.2}
//             roughness={0.24}
//             map={texture}
//             attach={"material-5"}
//             side={2}
//             color={"lightblue"}
//           />
//           <meshStandardMaterial
//             metalness={0.2}
//             roughness={0.24}
//             map={texture}
//             attach={"material-2"}
//             side={1}
//             colorWrite={false}
//             color={"lightblue"}
//           />
//         </mesh>
//         {children}
//       </group>
//     </PivotControls>
//   );
// };

// export default BoolPool;

// const Test = () => {
//   const { nodes, materials } = useGLTF(
//     "/models/newModels/InsetSteps.glb"
//   ) as GLTFResult;
//   return (
//     <>
//       {/* // <Subtraction> */}
//       {/* <Geometry showOperations> */}
//       {/* <Base name="ss"> */}
//       {/* <group
//                 dispose={null}
//                 > */}
//       <mesh
//         position={[-3, -0.5, 0]}
//         scale={[0.2, 0.2, 0.2]}
//         castShadow
//         receiveShadow
//         geometry={nodes.Inset_steps.geometry}
//         material={materials["Inset steps"]}
//       />
//       {/* <Addition position={[-3, -.5, 0]}>
//                   <boxGeometry  args={[.2,.2,.2]}></boxGeometry>
//                 </Addition> */}
//       {/* </group> */}
//       {/* </Base> */}
//       {/* </Geometry> */}
//       {/* </Subtraction> */}
//     </>
//   );
// };
// type GLTFResult = GLTF & {
//   nodes: {
//     Inset_steps: THREE.Mesh;
//   };
//   materials: {
//     ["Inset steps"]: THREE.MeshStandardMaterial;
//   };
// };
// useGLTF.preload("/models/newModels/insetSteps.glb");

// const PoolMat = (texture: any) => (
//   <>
//     <meshStandardMaterial
//       metalness={0.2}
//       roughness={0.24}
//       map={texture}
//       attach={"material-0"}
//       side={2}
//       color={"lightblue"}
//     />
//     <meshStandardMaterial
//       metalness={0.2}
//       roughness={0.24}
//       map={texture}
//       attach={"material-1"}
//       side={2}
//       color={"lightblue"}
//     />
//     <meshStandardMaterial
//       metalness={0.2}
//       roughness={0.24}
//       map={texture}
//       attach={"material-3"}
//       side={2}
//       color={"lightblue"}
//     />
//     <meshStandardMaterial
//       metalness={0.2}
//       roughness={0.24}
//       map={texture}
//       attach={"material-4"}
//       side={2}
//       color={"lightblue"}
//     />
//     <meshStandardMaterial
//       metalness={0.2}
//       roughness={0.24}
//       map={texture}
//       attach={"material-5"}
//       side={2}
//       color={"lightblue"}
//     />
//     <meshStandardMaterial
//       metalness={0.2}
//       roughness={0.24}
//       map={texture}
//       attach={"material-2"}
//       side={1}
//       colorWrite={false}
//       color={"lightblue"}
//       // transparent
//       // opacity={0}
//     />
//   </>
// );
