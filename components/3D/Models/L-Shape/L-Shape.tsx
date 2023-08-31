import { PivotControls } from "@/components/UI/pivotControls";
import { PoolType, ReplacePool, sides } from "@/slices/poolsSlice";
import {
  selectTarget,
  selectPivotVisibility,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AspectRatio } from "@/utils/getActiveAxis";
import {
  Addition,
  Base,
  CSGGeometryRef,
  Geometry,
  Subtraction,
} from "@react-three/csg";
import { Mask, useGLTF, useTexture } from "@react-three/drei";
import React, { RefObject, Suspense, useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Euler,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  RepeatWrapping,
  Texture,
  TextureLoader,
  Vector3,
} from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import LShapeBorders from "./Borders";
import Watershape from "../../Ground/Watershape";
// import * as THREE from "three"
type Props = {
  index: number;
  theight: number;
  bheight: number;
  stHeight: number;
  sbHeight: number;
  position: number[];
  sPosition: number[];
  sRotation: number[];
  rotation: number[];
  scale: number[];
  sScale: number[];
  width: number;
  sWidth: number;
  depth: number;
  sDepth: number;
  key?: number;
  PoolTexture: Texture | undefined;
  StoneTexture: Texture | undefined;
  children?: React.ReactNode;
  childrenTop?: React.ReactNode;
  childrenBottom?: React.ReactNode;
  pool: PoolType;
  csg: RefObject<CSGGeometryRef>;
  csg2: RefObject<CSGGeometryRef>;
};

export default function LShape({
  width,
  stHeight,
  sbHeight,
  depth,
  position,
  sPosition,
  scale,
  sScale,
  sRotation,
  index,
  children,
  childrenTop,
  childrenBottom,
  PoolTexture,
  StoneTexture,
  pool,
  csg,
  csg2,
}: Props) {
  // INIT
  const [Texture, setTexture] = useState<Texture | undefined>(PoolTexture);
  const [Texture2, setTexture2] = useState<Texture | undefined>(PoolTexture);
  const [TextureStone, setTextureStone] = useState<Texture | undefined>(
    StoneTexture
  );
  const [TextureStone2, setTextureStone2] = useState<Texture | undefined>(
    StoneTexture
  );
  const tWidth = width;
  const tHeight1 = stHeight;
  const tHeight2 = stHeight / 2 - width;
  const bWidth = width;
  const bHeight1 = sbHeight;
  const bHeight2 = sbHeight / 2 - width;

  const tHalfWidth = tWidth / 2;
  const tHalfHeight1 = tHeight1 / 2;
  const bHalfWidth = bWidth / 2;
  const bHalfHeight1 = bHeight1 / 2;
  const bHalfHeight2 = bHeight2 / 2;

  const halfDepth = depth / 2;
  const { geometry, geometry2 } = GetGeometry({
    tWidth,
    tHeight1,
    tHeight2,
    bWidth,
    bHeight1,
    bHeight2,
    halfDepth,
    tHalfWidth,
    tHalfHeight1,
    bHalfWidth,
    bHalfHeight1,
    bHalfHeight2,
    width,
    depth,
  });
  const { geometry: geometryOuter, geometry2: geometryOuter2 } = GetGeometry({
    tWidth: tWidth + 0.05,
    tHeight1: tHeight1 + 0.05,
    tHeight2: tHeight2,
    bWidth: bWidth + 0.05,
    bHeight1: bHeight1 + 0.05,
    bHeight2: bHeight2,
    halfDepth: halfDepth + 0.05 / 2,
    tHalfWidth: tHalfWidth + 0.05,
    tHalfHeight1: tHalfHeight1 + 0.05,
    bHalfWidth: bHalfWidth + 0.05,
    bHalfHeight1: bHalfHeight1 + 0.05,
    bHalfHeight2: bHalfHeight2 + 0.05,
    width: width + 0.05,
    depth: depth + 0.05 / 2,
  });

  const groupRef = useRef<THREE.Group>(null);
  const gp = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);

  useEffect(() => {
    const XConstant = tWidth / 4;
    const YConstant = Math.max(tHeight1, tHeight2) / 8;
    if (Texture) {
      Texture.wrapS = RepeatWrapping;
      Texture.wrapT = RepeatWrapping;
      Texture.repeat.set(XConstant, YConstant);
    }
    if (TextureStone) {
      TextureStone.wrapS = RepeatWrapping;
      TextureStone.wrapT = RepeatWrapping;
      TextureStone.repeat.set(XConstant, YConstant);
    }
    const XConstant2 = bWidth / 4;
    const YConstant2 = Math.max(bHeight1, bHeight2) / 4;
    if (Texture2) {
      Texture2.wrapS = RepeatWrapping;
      Texture2.wrapT = RepeatWrapping;
      Texture2.repeat.set(XConstant2, YConstant2);
    }
    if (TextureStone2) {
      TextureStone2.wrapS = RepeatWrapping;
      TextureStone2.wrapT = RepeatWrapping;
      TextureStone2.repeat.set(XConstant2, YConstant2);
    }
  }, []);
  // Offset Position
  const tPosition = [0, -depth / 2 + 0.005, -tHalfHeight1 + width / 2];
  const bPosition = [-bHalfHeight1 + width / 2, -depth / 2 + 0.005, 0];

  const [Mat, setMat] = useState(new Matrix4());
  useEffect(() => {
    const pos = new Vector3(
      0 + sPosition[0],
      0 + sPosition[1],
      0 + sPosition[2]
    );
    const comb = new Matrix4();
    const radiansX = MathUtils.degToRad(sRotation[0]);
    const radiansY = MathUtils.degToRad(sRotation[1]);
    const radiansZ = MathUtils.degToRad(sRotation[2]);
    const qt = new Quaternion();
    qt.setFromEuler(new Euler(radiansX, radiansY, radiansZ, "XYZ"));
    comb.compose(pos, qt, new Vector3(sScale[0], sScale[1], sScale[2]));
    setMat(comb);
  }, [sScale, sPosition, sRotation, pool]);

  const insets = pool.childrens.filter((obj) => obj.shapeType === "insetSteps");
  const rotate = insets.filter(
    (obj) => obj.side === "Left" || obj.side === "Top" || obj.side === "Bottom"
  );
  let LshapeTZPosition = -stHeight / 2 + width / 2;
  let LshapeBXPosition = -sbHeight / 2 + width / 2;
  let LshapeBTopCenterPosition = -(sbHeight - width) / 2 - width / 2;
  let LshapeTLeftCenterPosition = -(stHeight - width) / 2 - width / 2;

  const edges = pool.childrens.filter(
    (value) => value.shapeType === "InfinityEdge"
  );
  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={10}
      visible={visible && target?.uuid === groupRef.current?.uuid}
      displayValues={true}
      scale={visible && target?.uuid === groupRef.current?.uuid ? 75 : 0}
      depthTest={false}
      fixed
      disableSliders
      matrix={Mat}
      onDragEnd={(w, de, wl, delw) => {
        const pos = new Vector3(); // create one and reuse it
        const quaternion = new Quaternion();
        const scale = new Vector3();
        w.decompose(pos, quaternion, scale);
        const euler = new Euler().setFromQuaternion(quaternion);
        const pl = { ...pool };
        const x = +pos.x.toFixed(2) + 0;
        const y = +pos.y.toFixed(2) + 0;
        const z = +pos.z.toFixed(2) + 0;
        pl.sPosition = [x, y, z];
        pl.sScale = [scale.x, scale.y, scale.z];
        pl.sRotation = [
          MathUtils.radToDeg(euler.x),
          MathUtils.radToDeg(euler.y),
          MathUtils.radToDeg(euler.z),
        ];
        dispatch(ReplacePool({ poolIndex: index, pool: pl }));
      }}
      ref={gp}
      lineWidth={2}
    >
      <group
        ref={groupRef}
        onClick={(e) => {
          dispatch(setPivotVisibility(true));
          const title = pool.poolType + " " + index;
          dispatch(setTargetTitle(title));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        <mesh position={new Vector3(...tPosition)}>
          <Geometry useGroups ref={csg} computeVertexNormals>
            <Base geometry={geometry}>
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.1}
                map={Texture}
                side={DoubleSide}
                color={"lightblue"}
              />
            </Base>
            <Addition
              geometry={geometryOuter}
              position={[0, -0.05 / 2 - 0.01, 0]}
            >
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.35}
                map={TextureStone}
                side={DoubleSide}
              />
            </Addition>

            {childrenTop}
          </Geometry>
          <meshStandardMaterial
            metalness={0.2}
            roughness={0.1}
            map={Texture}
            side={DoubleSide}
            color={"lightblue"}
          />
        </mesh>
        <mesh
          position={new Vector3(...bPosition)}
          // rotation={[0, rotate.length > 0 ? 0 : Math.PI / 2, 0]}
        >
          <Geometry useGroups ref={csg2} computeVertexNormals>
            {/* <group rotation={[0, Math.PI / 2, 0]}> */}
            <Base geometry={geometry2} rotation={[0, Math.PI / 2, 0]}>
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.1}
                map={Texture2}
                side={DoubleSide}
                color={"lightblue"}
              />
            </Base>

            <Addition
              rotation={[0, Math.PI / 2, 0]}
              position={[0, -0.05 / 2 - 0.01, 0]}
            >
              {/** Combining two boxes into a cross */}
              <Geometry useGroups>
                <Base geometry={geometryOuter2}>
                  <meshStandardMaterial
                    metalness={0.2}
                    roughness={0.35}
                    map={TextureStone2}
                    side={DoubleSide}
                  />
                </Base>

                {/* </group> */}
              </Geometry>
            </Addition>
            {childrenBottom}
          </Geometry>
          <meshStandardMaterial
            metalness={0.2}
            roughness={0.1}
            map={Texture2}
            side={DoubleSide}
            color={"lightblue"}
          />
        </mesh>
        {/* Mask */}
        <Mask
          id={1}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[tPosition[0], 0 + 0.005, tPosition[2]]}
        >
          <planeGeometry args={[tWidth, stHeight]} />
        </Mask>
        {/* Mask2 */}
        <Mask
          id={1}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position={[bPosition[0], 0 + 0.005, bPosition[2]]}
        >
          <planeGeometry args={[bWidth, sbHeight]} />
        </Mask>

        {/* Water */}
        {pool.enableWater && (
          <Suspense>
            <Watershape
              // geometry={BasePlaneGeometry}
              width={tWidth}
              height={stHeight}
              textureSize={512}
              reflectivity={0.05}
              flowX={0.1}
              flowY={0}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[tPosition[0], 0.005 - 0.06, tPosition[2]]}
            />
            <Watershape
              // geometry={BasePlaneGeometry}
              width={bWidth}
              height={sbHeight - bWidth}
              textureSize={512}
              reflectivity={0.05}
              flowX={0.1}
              flowY={0}
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
              position={[bPosition[0] - bWidth / 2, 0.005 - 0.06, bPosition[2]]}
            />
          </Suspense>
        )}

        {/* Borders */}
        <>
          {!(edges.filter((value) => value.side === sides.Left).length > 0) && (
            <LShapeBorders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new Vector3(LshapeBXPosition, 0, 0)}
              side={"left"}
              poolWidth={width}
              poolbHeight={sbHeight}
              pooltHeight={stHeight}
            />
          )}
          {!(edges.filter((value) => value.side === sides.Top).length > 0) && (
            <LShapeBorders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new Vector3(LshapeBTopCenterPosition, 0, 0)}
              side={"top"}
              poolWidth={width}
              poolbHeight={sbHeight}
              pooltHeight={stHeight}
            />
          )}
          {!(
            edges.filter((value) => value.side === sides.Bottom).length > 0
          ) && (
            <LShapeBorders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new Vector3(LshapeBXPosition, 0, 0)}
              side={"bottom"}
              poolWidth={width}
              poolbHeight={sbHeight}
              pooltHeight={stHeight}
            />
          )}
          {!(
            edges.filter((value) => value.side === sides.tLeft).length > 0
          ) && (
            <LShapeBorders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new Vector3(0, 0, LshapeTLeftCenterPosition)}
              side={"tleft"}
              poolWidth={width}
              poolbHeight={sbHeight}
              pooltHeight={stHeight}
            />
          )}
          {!(edges.filter((value) => value.side === sides.tTop).length > 0) && (
            <LShapeBorders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new Vector3(0, 0, LshapeTZPosition)}
              side={"ttop"}
              poolWidth={width}
              poolbHeight={sbHeight}
              pooltHeight={stHeight}
            />
          )}
          {!(
            edges.filter((value) => value.side === sides.tRight).length > 0
          ) && (
            <LShapeBorders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new Vector3(0, 0, LshapeTZPosition)}
              side={"tright"}
              poolWidth={width}
              poolbHeight={sbHeight}
              pooltHeight={stHeight}
            />
          )}
        </>
        <group position={[0, 1, 0]}>{children}</group>
      </group>
    </PivotControls>
  );
}
const GetGeometry = ({
  tWidth,
  tHeight1,
  tHeight2,
  bWidth,
  bHeight1,
  bHeight2,
  halfDepth,
  tHalfWidth,
  tHalfHeight1,
  bHalfWidth,
  bHalfHeight1,
  bHalfHeight2,
  width,
  depth,
}: {
  width: number;
  depth: number;
  tWidth: number;
  tHeight1: number;
  tHeight2: number;
  bWidth: number;
  bHeight1: number;
  bHeight2: number;
  halfDepth: number;
  tHalfWidth: number;
  tHalfHeight1: number;
  bHalfWidth: number;
  bHalfHeight1: number;
  bHalfHeight2: number;
}) => {
  const geometry = new BufferGeometry();
  const geometry2 = new BufferGeometry();
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
  const tUVS = [
    // Back face
    0,
    0,
    width / 8,
    0,
    width / 8,
    (tHeight1 - width) / 20,
    0,
    (tHeight1 - width) / 20,

    // Front face
    0,
    0,
    1,
    0,
    1,
    1,
    0,
    1,

    // Top face (Side face 1) // removed
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    // bottom face (Side face 2)
    0,
    0,
    depth / 8,
    0,
    depth / 8,
    width / 20,
    0,
    width / 20,

    // Left face (Side face 3)
    0,
    0,
    depth / 8,
    0,
    depth / 8,
    (tHeight1 - width) / 20,
    0,
    (tHeight1 - width) / 20,

    // Right face (Side face 4)
    0,
    0,
    depth / 8,
    0,
    depth / 8,
    tHeight1 / 20,
    0,
    tHeight1 / 20,
  ];
  const bUVS = [
    // Back face
    0 + 1,
    0,
    width / 8 + 1,
    0,
    width / 8 + 1,
    bHeight1 / 20,
    0 + 1,
    bHeight1 / 20,

    // Front face
    0,
    0,
    1,
    0,
    1,
    1,
    0,
    1,

    // Top face (Side face 1) // removed
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,

    // bottom face (Side face 2)
    0,
    0,
    depth / 8,
    0,
    depth / 8,
    width / 20,
    0,
    width / 20,

    // Right face (Side face 4)
    0,
    0,
    depth / 8,
    0,
    depth / 8,
    bHeight1 / 20,
    0,
    bHeight1 / 20,

    // Left face (Side face 3)
    0,
    0,
    depth / 8,
    0,
    depth / 8,
    (bHeight1 - width) / 20,
    0,
    (bHeight1 - width) / 20,
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
  const uvAttribute = new BufferAttribute(new Float32Array(tUVS), 2); // 2 components (s, t) for each UV coordinate
  const bIndexAttribute = new BufferAttribute(new Uint16Array(Indices), 1);
  const bUvAttribute = new BufferAttribute(new Float32Array(bUVS), 2); // 2 components (s, t) for each UV coordinate

  geometry.setAttribute("uv", uvAttribute);
  geometry.setAttribute("position", tPositionAttribute);
  geometry.setIndex(indexAttribute);
  geometry.computeVertexNormals();
  geometry2.setAttribute("uv", bUvAttribute);
  geometry2.setAttribute("position", bPositionAttribute);
  geometry2.setIndex(bIndexAttribute);
  geometry2.computeVertexNormals();
  return { geometry, geometry2 };
};
