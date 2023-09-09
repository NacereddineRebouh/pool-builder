import { sides } from "@/slices/defaultsSlice";
import {
  BufferAttribute,
  BufferGeometry,
  ExtrudeGeometry,
  Shape,
  Vector2,
} from "three";

export function getActiveAxis(params: sides): [boolean, boolean, boolean] {
  let pos: [boolean, boolean, boolean] = [true, true, true];
  switch (params) {
    case "Left":
      //Topleft
      pos[0] = false;
      pos[1] = true;
      pos[2] = true;
      break;
    case "Right":
      pos[0] = false;
      pos[1] = true;
      pos[2] = true;
      break;
    case "Top":
      //bottom Left
      pos[0] = true;
      pos[1] = true;
      pos[2] = false;
      break;
    case "Bottom":
      pos[0] = true;
      pos[1] = true;
      pos[2] = false;
      break;
  }

  return pos;
}

export const IgnoreOrderCompare = (a: string[], b: string[]) => {
  if (a?.length !== b?.length) return false;
  // if(a?.length==0) return false
  const elements = new Set<string>([...a, ...b]);
  for (const x of elements) {
    const count1 = a.filter((e) => e === x).length;
    const count2 = b.filter((e) => e === x).length;
    if (count1 !== count2) return false;
  }
  return true;
};

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export const AspectRatio = (x: number, y: number) => {
  const gcdValue = gcd(x, y);
  const aspectRatioX = x / gcdValue;
  const aspectRatioY = y / gcdValue;
  return { aspectRatioX, aspectRatioY };
};

export function metersToInches(meters: number): number {
  const inchesPerMeter = 39.3701; // 1 meter = 39.3701 inches
  return meters * inchesPerMeter;
}

export function inchesToMeters(inches: number): number {
  const metersPerInch = 0.0254; // 1 inch = 0.0254 meters
  return inches * metersPerInch;
}

export function CustomBoxGeometry({
  width,
  height,
  depth,
  topFace = [true, true, true, true, true, true],
}: {
  width: number;
  height: number;
  depth: number;
  topFace?: [Boolean, Boolean, Boolean, Boolean, Boolean, Boolean];
}) {
  const geometry = new BufferGeometry();

  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;
  const vertices = [
    // Front face
    -halfWidth,
    halfHeight,
    halfDepth, // 0
    halfWidth,
    halfHeight,
    halfDepth, // 1
    halfWidth,
    -halfHeight,
    halfDepth, // 2
    -halfWidth,
    -halfHeight,
    halfDepth, // 3

    // Back face
    halfWidth,
    halfHeight,
    -halfDepth, // 4
    -halfWidth,
    halfHeight,
    -halfDepth, // 5
    -halfWidth,
    -halfHeight,
    -halfDepth, // 6
    halfWidth,
    -halfHeight,
    -halfDepth, // 7

    // Top face
    -halfWidth,
    halfHeight,
    -halfDepth, // 8
    halfWidth,
    halfHeight,
    -halfDepth, // 9
    halfWidth,
    halfHeight,
    halfDepth, // 10
    -halfWidth,
    halfHeight,
    halfDepth, // 11

    // Bottom face
    -halfWidth,
    -halfHeight,
    halfDepth, // 12
    halfWidth,
    -halfHeight,
    halfDepth, // 13
    halfWidth,
    -halfHeight,
    -halfDepth, // 14
    -halfWidth,
    -halfHeight,
    -halfDepth, // 15

    // Left face
    -halfWidth,
    halfHeight,
    -halfDepth, // 16
    -halfWidth,
    halfHeight,
    halfDepth, // 17
    -halfWidth,
    -halfHeight,
    halfDepth, // 18
    -halfWidth,
    -halfHeight,
    -halfDepth, // 19

    // Right face
    halfWidth,
    halfHeight,
    halfDepth, // 20
    halfWidth,
    halfHeight,
    -halfDepth, // 21
    halfWidth,
    -halfHeight,
    -halfDepth, // 22
    halfWidth,
    -halfHeight,
    halfDepth, // 23
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
    4,
    5,
    6,
    4,
    6,
    7,

    // Front face (Side face 1, two triangles)
    8,
    9,
    10,
    8,
    10,
    11,

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
  const indices2: number[] = [];
  topFace.map((e, index) => {
    if (e) indices2.push(...Indices.slice(6 * index, 6 * index + 6));
  });
  const UVS = [
    // Back face
    0,
    0,
    width / 2,
    0,
    width / 2,
    height / 2,
    0,
    height / 2,

    // Front face
    0,
    0,
    width / 2,
    0,
    width / 2,
    height / 2,
    0,
    height / 2,

    // Top face (Side face 1) // removed
    0,
    0,
    width / 2,
    0,
    width / 2,
    depth / 2,
    0,
    depth / 2,

    // bottom face (Side face 2)
    0,
    0,
    width / 2,
    0,
    width / 2,
    depth / 2,
    0,
    depth / 2,

    // Left face (Side face 3)
    0,
    0,
    depth / 2,
    0,
    depth / 2,
    height / 2,
    0,
    height / 2,

    // Right face (Side face 4)
    0,
    0,
    depth / 2,
    0,
    depth / 2,
    height / 2,
    0,
    height / 2,
  ];

  const PositionAttribute = new BufferAttribute(new Float32Array(vertices), 3);
  const indexAttribute = new BufferAttribute(new Uint16Array(indices2), 1);
  const uvAttribute = new BufferAttribute(new Float32Array(UVS), 2); // 2 components (s, t) for each UV coordinate
  geometry.setAttribute("uv", uvAttribute);
  geometry.setAttribute("position", PositionAttribute);
  geometry.setIndex(indexAttribute);
  geometry.computeVertexNormals();
  return geometry;
}

export const GetTriangle = ({
  BenchDepth,
  cornerHeight,
}: {
  BenchDepth: number;
  cornerHeight: number;
}) => {
  const isoscelesGeometry = new ExtrudeGeometry(
    new Shape([
      new Vector2(0, 0), // Top vertex
      new Vector2(-BenchDepth, -BenchDepth), // Bottom-left vertex
      new Vector2(BenchDepth, -BenchDepth), // Bottom-right vertex
      new Vector2(0, 0), // Close the shape by repeating the top vertex
    ]),
    {
      depth: cornerHeight, // Extrusion depth
      bevelEnabled: false, // Disable bevel
    }
  );
  isoscelesGeometry.computeVertexNormals();
  return isoscelesGeometry;
};
