import { PivotControls } from "@/components/UI/pivotControls";
import { AspectRatio } from "@/utils/getActiveAxis";
import { CSGGeometryRef } from "@react-three/csg";
import { Mask, useTexture } from "@react-three/drei";
import React, { useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  MeshStandardMaterial,
  RepeatWrapping,
  TextureLoader,
  Vector3,
} from "three";
// import * as THREE from "three"
type Props = {
  props: JSX.IntrinsicElements["group"];
  width: number;
  theight: number;
  bheight: number;
  depth: number;
};

export default function LShapeHelper({
  width,
  theight,
  bheight,
  depth,
  props,
}: Props) {
  // INIT
  const geometry = new BufferGeometry();
  const geometry2 = new BufferGeometry();
  const tWidth = width;
  const tHeight1 = theight;
  const tHeight2 = theight / 2 - width;
  const bWidth = width;
  const bHeight1 = bheight;
  const bHeight2 = bheight / 2 - width;

  const tHalfWidth = tWidth / 2;
  const tHalfHeight1 = tHeight1 / 2;
  const bHalfWidth = bWidth / 2;
  const bHalfHeight1 = bHeight1 / 2;
  const bHalfHeight2 = bHeight2 / 2;

  const halfDepth = depth / 2;

  // Offset Position
  const tPosition = [0, 0, -tHalfHeight1 + width / 2];
  const bPosition = [-bHalfHeight1 + width / 2, 0, 0];

  // Vertex positions (x, y, z)
  const tVertices = [
    // Bottom face
    -tHalfWidth,
    -halfDepth,
    -tHalfHeight1, // Vertex 0
    tHalfWidth,
    -halfDepth,
    -tHalfHeight1, // Vertex 1
    tHalfWidth,
    -halfDepth,
    tHeight2, // Vertex 2
    -tHalfWidth,
    -halfDepth,
    tHeight2, // Vertex 3

    // Top face
    -tHalfWidth,
    halfDepth,
    -tHalfHeight1, // Vertex 4
    tHalfWidth,
    halfDepth,
    -tHalfHeight1, // Vertex 5
    tHalfWidth,
    halfDepth,
    tHalfHeight1, // Vertex 6
    -tHalfWidth,
    halfDepth,
    tHalfHeight1, // Vertex 7

    // Front face (Side face 1)
    -tHalfWidth,
    -halfDepth,
    tHalfHeight1, // Vertex 8
    -tHalfWidth,
    halfDepth,
    tHalfHeight1, // Vertex 9
    tHalfWidth,
    halfDepth,
    tHalfHeight1, // Vertex 10
    tHalfWidth,
    -halfDepth,
    tHalfHeight1, // Vertex 11

    // Back face (Side face 2)
    -tHalfWidth,
    -halfDepth,
    -tHalfHeight1, // Vertex 12
    -tHalfWidth,
    halfDepth,
    -tHalfHeight1, // Vertex 13
    tHalfWidth,
    halfDepth,
    -tHalfHeight1, // Vertex 14
    tHalfWidth,
    -halfDepth,
    -tHalfHeight1, // Vertex 15

    // Left face (Side face 3)
    -tHalfWidth,
    -halfDepth,
    -tHalfHeight1, // Vertex 16
    -tHalfWidth,
    halfDepth,
    -tHalfHeight1, // Vertex 17
    -tHalfWidth,
    halfDepth,
    tHeight2, // Vertex 18
    -tHalfWidth,
    -halfDepth,
    tHeight2, // Vertex 19

    // Right face (Side face 4)
    tHalfWidth,
    -halfDepth,
    -tHalfHeight1, // Vertex 20
    tHalfWidth,
    halfDepth,
    -tHalfHeight1, // Vertex 21
    tHalfWidth,
    halfDepth,
    tHalfHeight1, // Vertex 22
    tHalfWidth,
    -halfDepth,
    tHalfHeight1, // Vertex 23
  ];

  // Face indices (3 indices per triangle, forming 2 triangles per face)
  const Indices = [
    // Bottom face (two triangles, indices in clockwise order)
    0,
    1,
    2, // Triangle 1: Vertex 0, Vertex 1, Vertex 2
    0,
    2,
    3, // Triangle 2: Vertex 0, Vertex 2, Vertex 3

    // Top face (two triangles)
    // 4, 5, 6,
    // 4, 6, 7,

    // Front face (Side face 1, two triangles)
    // 8,
    // 9,
    // 10,
    // 8,
    // 10,
    // 11,

    // Back face (Side face 2, two triangles)
    12,
    13,
    14,
    12,
    14,
    15,

    // Left face (Side face 3, two triangles)
    16,
    17,
    18,
    16,
    18,
    19,

    // Right face (Side face 4, two triangles)
    20,
    21,
    22,
    20,
    22,
    23,
  ];
  const UVS = [
    // Bottom face
    0, 0, 1, 0, 1, 1, 0, 1,

    // Top face
    0, 0, 1, 0, 1, 1, 0, 1,

    // Front face (Side face 1)
    0, 0, 1, 0, 1, 1, 0, 1,

    // Back face (Side face 2)
    0, 0, 1, 0, 1, 1, 0, 1,

    // Left face (Side face 3)
    0, 0, 1, 0, 1, 1, 0, 1,

    // Right face (Side face 4)
    0, 0, 1, 0, 1, 1, 0, 1,
  ];

  const bVertices = [
    // Bottom face
    -bHalfWidth,
    -halfDepth,
    -bHalfHeight1, // Vertex 0
    bHalfWidth,
    -halfDepth,
    -bHalfHeight1, // Vertex 1
    bHalfWidth,
    -halfDepth,
    bHalfHeight1, // Vertex 2
    -bHalfWidth,
    -halfDepth,
    bHalfHeight1, // Vertex 3

    // Top face
    -bHalfWidth,
    halfDepth,
    0, // Vertex 4
    bHalfWidth,
    halfDepth,
    0, // Vertex 5
    bHalfWidth,
    halfDepth,
    0, // Vertex 6
    -bHalfWidth,
    halfDepth,
    0, // Vertex 7

    // Front face (Side face 1)
    -bHalfWidth,
    -halfDepth,
    0, // Vertex 8
    -bHalfWidth,
    halfDepth,
    0, // Vertex 9
    bHalfWidth,
    halfDepth,
    0, // Vertex 10
    bHalfWidth,
    -halfDepth,
    0, // Vertex 11

    // Back face (Side face 2)
    -bHalfWidth,
    -halfDepth,
    -bHalfHeight1, // Vertex 12
    -bHalfWidth,
    halfDepth,
    -bHalfHeight1, // Vertex 13
    bHalfWidth,
    halfDepth,
    -bHalfHeight1, // Vertex 14
    bHalfWidth,
    -halfDepth,
    -bHalfHeight1, // Vertex 15

    // Left face (Side face 3)
    -bHalfWidth,
    -halfDepth,
    -bHalfHeight1, // Vertex 16
    -bHalfWidth,
    halfDepth,
    -bHalfHeight1, // Vertex 17
    -bHalfWidth,
    halfDepth,
    bHalfHeight1, // Vertex 18
    -bHalfWidth,
    -halfDepth,
    bHalfHeight1, // Vertex 19

    // Right face (Side face 4)
    bHalfWidth,
    -halfDepth,
    -bHalfHeight1, // Vertex 20
    bHalfWidth,
    halfDepth,
    -bHalfHeight1, // Vertex 21
    bHalfWidth,
    halfDepth,
    bHeight2, // Vertex 22
    bHalfWidth,
    -halfDepth,
    bHeight2, // Vertex 23
  ];

  const tPositionAttribute = new BufferAttribute(
    new Float32Array(tVertices),
    3
  );
  const bPositionAttribute = new BufferAttribute(
    new Float32Array(bVertices),
    3
  );
  const indexAttribute = new BufferAttribute(new Uint16Array(Indices), 1);
  const uvAttribute = new BufferAttribute(new Float32Array(UVS), 2); // 2 components (s, t) for each UV coordinate
  const bIndexAttribute = new BufferAttribute(new Uint16Array(Indices), 1);
  const bUvAttribute = new BufferAttribute(new Float32Array(UVS), 2); // 2 components (s, t) for each UV coordinate

  geometry.setAttribute("uv", uvAttribute);
  geometry.setAttribute("position", tPositionAttribute);
  geometry.setIndex(indexAttribute);
  geometry.computeVertexNormals();
  geometry2.setAttribute("uv", bUvAttribute);
  geometry2.setAttribute("position", bPositionAttribute);
  geometry2.setIndex(bIndexAttribute);
  geometry2.computeVertexNormals();
  const texture = useTexture("/textures/cement.jpg");
  const texture2 = useTexture("/textures/cement.jpg");
  // Create the material with the texture
  const material = new MeshStandardMaterial({
    metalness: 0.2,
    roughness: 0.1,
    map: texture,
    side: 2,
    color: "lightblue",
  });
  const material2 = new MeshStandardMaterial({
    metalness: 0.2,
    roughness: 0.1,
    map: texture2,
    side: 2,
    color: "lightblue",
  });
  const { aspectRatioX, aspectRatioY } = AspectRatio(
    tWidth,
    Math.max(tHeight1, tHeight2)
  );
  const XConstant = tWidth / 4;
  const YConstant = Math.max(tHeight1, tHeight2) / 8;
  if (material.map) {
    material.map.wrapS = RepeatWrapping;
    material.map.wrapT = RepeatWrapping;
    material.map.repeat.set(XConstant, YConstant);
  }
  const XConstant2 = bWidth / 4;
  const YConstant2 = Math.max(bHeight1, bHeight2) / 4;
  if (material2.map) {
    texture2.wrapS = RepeatWrapping;
    texture2.wrapT = RepeatWrapping;
    texture2.repeat.set(XConstant2, YConstant2);
  }
  //   const csg = useRef<CSGGeometryRef>(null);

  return (
    <group position={[0, 1, 0]} {...props}>
      <mesh geometry={geometry} position={new Vector3(...tPosition)}>
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.1}
          map={texture}
          side={DoubleSide}
          color={"#aa8873"}
        />
      </mesh>
      <mesh
        geometry={geometry2}
        rotation={[0, Math.PI / 2, 0]}
        position={new Vector3(...bPosition)}
      >
        <meshStandardMaterial
          metalness={0.2}
          roughness={0.1}
          map={texture2}
          side={DoubleSide}
          color={"#aa8873"}
        />
      </mesh>

      {/* Mask */}
      <Mask
        id={1}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[tPosition[0], depth / 2, tPosition[2]]}
      >
        <planeGeometry args={[tWidth, theight]} />
        {/* <meshBasicMaterial color={"salmon"}/> */}
      </Mask>
      {/* Mask2 */}
      <Mask
        id={1}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[bPosition[0], depth / 2, bPosition[2]]}
      >
        <planeGeometry args={[bWidth, bheight]} />
        {/* <meshBasicMaterial color={"salmon"}/> */}
      </Mask>
    </group>
  );
}
