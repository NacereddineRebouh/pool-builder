// import { CSGGeometryRef, Geometry, Base, Subtraction } from "@react-three/csg";
// import { useGLTF, Mask } from "@react-three/drei";
// import { useRef } from "react";
// import { BufferGeometry } from "three";
// import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
// import Borders from "./Models/Pool/Borders";
// import * as THREE from "three";
// import { PivotControls } from "../UI/pivotControls";
// export const CustomBox = ({
//   width,
//   height,
//   depth,
// }: {
//   width: number;
//   height: number;
//   depth: number;
// }) => {
//   const geometry = new BufferGeometry();

//   const halfWidth = width / 2;
//   const halfHeight = height / 2;
//   const halfDepth = depth / 2;

//   // Vertex positions (x, y, z)
//   const vertices = [
//     // Bottom face
//     -halfWidth,
//     -halfHeight,
//     -halfDepth, // Vertex 0
//     halfWidth,
//     -halfHeight,
//     -halfDepth, // Vertex 1
//     halfWidth,
//     -halfHeight,
//     halfDepth, // Vertex 2
//     -halfWidth,
//     -halfHeight,
//     halfDepth, // Vertex 3

//     // Top face
//     -halfWidth,
//     halfHeight,
//     -halfDepth, // Vertex 4
//     halfWidth,
//     halfHeight,
//     -halfDepth, // Vertex 5
//     halfWidth,
//     halfHeight,
//     halfDepth, // Vertex 6
//     -halfWidth,
//     halfHeight,
//     halfDepth, // Vertex 7

//     // Front face (Side face 1)
//     -halfWidth,
//     -halfHeight,
//     halfDepth, // Vertex 8
//     -halfWidth,
//     halfHeight,
//     halfDepth, // Vertex 9
//     halfWidth,
//     halfHeight,
//     halfDepth, // Vertex 10
//     halfWidth,
//     -halfHeight,
//     halfDepth, // Vertex 11

//     // Back face (Side face 2)
//     -halfWidth,
//     -halfHeight,
//     -halfDepth, // Vertex 12
//     -halfWidth,
//     halfHeight,
//     -halfDepth, // Vertex 13
//     halfWidth,
//     halfHeight,
//     -halfDepth, // Vertex 14
//     halfWidth,
//     -halfHeight,
//     -halfDepth, // Vertex 15

//     // Left face (Side face 3)
//     -halfWidth,
//     -halfHeight,
//     -halfDepth, // Vertex 16
//     -halfWidth,
//     halfHeight,
//     -halfDepth, // Vertex 17
//     -halfWidth,
//     halfHeight,
//     halfDepth, // Vertex 18
//     -halfWidth,
//     -halfHeight,
//     halfDepth, // Vertex 19

//     // Right face (Side face 4)
//     halfWidth,
//     -halfHeight,
//     -halfDepth, // Vertex 20
//     halfWidth,
//     halfHeight,
//     -halfDepth, // Vertex 21
//     halfWidth,
//     halfHeight,
//     halfDepth, // Vertex 22
//     halfWidth,
//     -halfHeight,
//     halfDepth, // Vertex 23
//   ];

//   // Face indices (3 indices per triangle, forming 2 triangles per face)
//   const indices = [
//     // Bottom face (two triangles, indices in clockwise order)
//     0,
//     1,
//     2, // Triangle 1: Vertex 0, Vertex 1, Vertex 2
//     0,
//     2,
//     3, // Triangle 2: Vertex 0, Vertex 2, Vertex 3

//     // Top face (two triangles)
//     // 4, 5, 6,
//     // 4, 6, 7,

//     // Front face (Side face 1, two triangles)
//     8,
//     9,
//     10,
//     8,
//     10,
//     11,

//     // Back face (Side face 2, two triangles)
//     12,
//     13,
//     14,
//     12,
//     14,
//     15,

//     // Left face (Side face 3, two triangles)
//     16,
//     17,
//     18,
//     16,
//     18,
//     19,

//     // Right face (Side face 4, two triangles)
//     20,
//     21,
//     22,
//     20,
//     22,
//     23,
//   ];
//   const uvs = [
//     // Bottom face
//     0, 0, 1, 0, 1, 1, 0, 1,

//     // Top face
//     0, 0, 1, 0, 1, 1, 0, 1,

//     // Front face (Side face 1)
//     0, 0, 1, 0, 1, 1, 0, 1,

//     // Back face (Side face 2)
//     0, 0, 1, 0, 1, 1, 0, 1,

//     // Left face (Side face 3)
//     0, 0, 1, 0, 1, 1, 0, 1,

//     // Right face (Side face 4)
//     0, 0, 1, 0, 1, 1, 0, 1,
//   ];

//   const positionAttribute = new THREE.BufferAttribute(
//     new Float32Array(vertices),
//     3
//   );
//   const indexAttribute = new THREE.BufferAttribute(new Uint16Array(indices), 1);
//   const uvAttribute = new THREE.BufferAttribute(new Float32Array(uvs), 2); // 2 components (s, t) for each UV coordinate

//   geometry.setAttribute("uv", uvAttribute);
//   geometry.setAttribute("position", positionAttribute);
//   geometry.setIndex(indexAttribute);
//   geometry.computeVertexNormals();

//   const textureLoader = new THREE.TextureLoader();
//   const texture = textureLoader.load(
//     "/textures/tiles.jpg",
//     () => {
//       // Texture loaded callback
//       console.log("Texture loaded successfully.");
//     },
//     undefined,
//     (error) => {
//       // Texture loading error callback
//       console.error("Error loading texture:", error);
//     }
//   );
//   // Create the material with the texture
//   const material = new THREE.MeshStandardMaterial({
//     metalness: 0.2,
//     roughness: 0.15,
//     map: texture,
//     side: 2,
//     color: "lightblue",
//   });
//   if (material.map) {
//     material.map.wrapS = THREE.RepeatWrapping;
//     material.map.wrapT = THREE.RepeatWrapping;
//     material.map.repeat.set(1, 1);
//   }
//   const csg = useRef<CSGGeometryRef>(null);

//   type GLTFResult = GLTF & {
//     nodes: {
//       Inset_steps: THREE.Mesh;
//       mask: THREE.Mesh;
//     };
//     materials: {
//       ["Inset steps"]: THREE.MeshStandardMaterial;
//       mask: THREE.MeshStandardMaterial;
//     };
//   };
//   const { nodes, materials } = useGLTF(
//     "/models/newModels/InsetSteps2.glb"
//   ) as GLTFResult;
//   console.log(nodes);
//   return (
//     <>
//       <mesh material={material}>
//         <Geometry ref={csg} computeVertexNormals>
//           <Base>
//             <Geometry>
//               <Base geometry={geometry}>
//                 <meshStandardMaterial
//                   metalness={0.2}
//                   roughness={0.24}
//                   // map={texture}
//                   // attach={"material-0"}
//                   side={THREE.DoubleSide}
//                   color={"lightblue"}
//                 />
//               </Base>
//               <PivotControls
//                 snapTranslate={10}
//                 onDrag={() => {
//                   if (csg.current) csg.current.update();
//                 }}
//                 scale={75}
//                 depthTest={false}
//                 fixed
//                 disableSliders
//                 lineWidth={2}
//               >
//                 <Borders
//                   width={width}
//                   height={0.05}
//                   depth={height}
//                   outline={2}
//                   position={new THREE.Vector3(0, 1, 0)}
//                   side={"left"}
//                   poolWidth={width}
//                   poolDepth={depth}
//                 />
//                 <Borders
//                   width={width}
//                   height={0.05}
//                   depth={height}
//                   outline={2}
//                   position={new THREE.Vector3(0, 1, 0)}
//                   side={"top"}
//                   poolWidth={width}
//                   poolDepth={depth}
//                 />
//               </PivotControls>
//             </Geometry>
//           </Base>

//           <PivotControls
//             snapTranslate={10}
//             onDrag={() => {
//               if (csg.current) csg.current.update();
//             }}
//             scale={75}
//             depthTest={false}
//             fixed
//             disableSliders
//             lineWidth={2}
//           >
//             <group scale={[0.2, 0.2, 0.2]}>
//               <Subtraction>
//                 <Geometry>
//                   <Base geometry={nodes.mask.geometry}>
//                     <meshStandardMaterial
//                       side={THREE.DoubleSide}
//                       color={"lightblue"}
//                     />
//                   </Base>
//                   {/* <Base> <boxGeometry args={[5,5,5]}/></Base> */}

//                   {/* <meshNormalMaterial/> */}
//                 </Geometry>
//               </Subtraction>
//             </group>
//           </PivotControls>
//         </Geometry>
//       </mesh>
//       <PivotControls
//         snapTranslate={10}
//         onDrag={() => {
//           if (csg.current) csg.current.update();
//         }}
//         scale={75}
//         depthTest={false}
//         fixed
//         disableSliders
//         lineWidth={2}
//       >
//         <mesh geometry={nodes.Inset_steps.geometry} scale={[0.2, 0.2, 0.2]}>
//           <meshStandardMaterial color={"lightblue"} />
//         </mesh>
//       </PivotControls>

//       <Mask id={1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
//         <planeGeometry args={[width, depth]} />
//         {/* <meshBasicMaterial color={"salmon"}/> */}
//       </Mask>
//     </>
//   );
// };
