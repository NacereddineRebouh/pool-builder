"use client";
import React, {
  FC,
  RefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Mask, useMask, useTexture } from "@react-three/drei";
import Borders from "./Borders";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import {
  ChildrensType,
  PoolType,
  ReplacePool,
  sides,
} from "@/slices/poolsSlice";
import { CustomBoxGeometry } from "@/utils/getActiveAxis";
import { Addition, Base, CSGGeometryRef, Geometry } from "@react-three/csg";
import Watershape from "../../Ground/Watershape";
import { useControls } from "leva";

interface Props {
  index?: number;
  position: number[];
  sPosition: number[];
  sRotation: number[];
  rotation: number[];
  scale: number[];
  sScale: number[];
  width: number;
  sWidth: number;
  height: number;
  sHeight: number;
  depth: number;
  sDepth: number;
  key?: number;
  Texture?: THREE.Texture;
  TextureStone?: THREE.Texture;
  children?: React.ReactNode;
  children2?: React.ReactNode;
  pool: PoolType;
  csg: RefObject<CSGGeometryRef>;
}
const PoolBool: FC<Props> = ({
  width = 5,
  height = 2,
  depth = 3,
  position,
  sPosition,
  scale,
  sScale,
  sRotation,
  index,
  children,
  pool,
  Texture: poolTexture,
  TextureStone: poolOuterTexture,
  children2,
  csg,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const gp = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  const geometry = GetGeometry({ width, height, depth });
  const geometryOuter = GetGeometry({
    width: width + 0.05,
    height: height + 0.05,
    depth: depth + 0.05,
  });
  const [Texture, setTexture] = useState(poolTexture);
  const [TextureStone, setTextureStone] = useState(poolOuterTexture);
  // ------ ------- ------ //
  // Vertex positions (x, y, z)

  useEffect(() => {
    if (Texture) {
      Texture.wrapS = THREE.RepeatWrapping;
      Texture.wrapT = THREE.RepeatWrapping;
      Texture.repeat.set(1, 1);
    }
    if (TextureStone) {
      TextureStone.wrapS = THREE.RepeatWrapping;
      TextureStone.wrapT = THREE.RepeatWrapping;
      TextureStone.repeat.set(1, 1);
    }
  }, [Texture, TextureStone, width, height, depth]);

  // useEffect(() => {
  const [Mat, setMat] = useState(new THREE.Matrix4());
  useEffect(() => {
    const pos = new THREE.Vector3(
      0 + sPosition[0],
      0 + sPosition[1],
      0 + sPosition[2]
    );
    const comb = new THREE.Matrix4();
    const radiansX = THREE.MathUtils.degToRad(sRotation[0]);
    const radiansY = THREE.MathUtils.degToRad(sRotation[1]);
    const radiansZ = THREE.MathUtils.degToRad(sRotation[2]);
    const qt = new THREE.Quaternion();
    qt.setFromEuler(new THREE.Euler(radiansX, radiansY, radiansZ, "XYZ"));
    comb.compose(pos, qt, new THREE.Vector3(sScale[0], sScale[1], sScale[2]));
    setMat(comb);
  }, [sScale, sPosition, sRotation, pool]);

  const BenchWidth = 0.5;
  const BenchDepth = 0.5;
  const BenchHeight = height - 0.65;
  const BenchYPosition = -height + BenchHeight / 2;
  const left = pool?.BenchSeatings?.includes("left");
  const right = pool?.BenchSeatings?.includes("right");
  const top = pool?.BenchSeatings?.includes("top");
  const bottom = pool?.BenchSeatings?.includes("bottom");
  // Bench seatings
  const leftOffsetZPosition =
    top && bottom
      ? 0
      : top && !bottom
      ? BenchWidth / 2
      : !top && bottom
      ? -BenchWidth / 2
      : 0;
  const leftWidth = BenchWidth;
  const leftDepth =
    top && bottom
      ? depth - BenchWidth * 2
      : (top && !bottom) || (!top && bottom)
      ? depth - BenchWidth
      : depth;

  const rightOffsetZPosition =
    top && bottom
      ? 0
      : top && !bottom
      ? BenchWidth / 2
      : !top && bottom
      ? -BenchWidth / 2
      : 0;
  const rightWidth = BenchWidth;
  const rightDepth =
    top && bottom
      ? depth - BenchWidth * 2
      : (top && !bottom) || (!top && bottom)
      ? depth - BenchWidth
      : depth;
  const edges = pool.childrens.filter(
    (value) => value.shapeType === "InfinityEdge"
  );
  const stencil = useMask(2, true);

  // ------ ------- ------ //
  const cornerHeight = 0.2;
  const cornerHeightPosition = BenchYPosition + BenchHeight / 2 + cornerHeight;
  const cornerHeightBottomPosition =
    BenchYPosition - BenchHeight / 2 + cornerHeight;
  const isoscelesGeometry = GetTriangle({ BenchDepth, cornerHeight });
  const isoscelesGeometryBottom = GetTriangle({ BenchDepth, cornerHeight });

  // ------ ------- ------ //
  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={10}
      visible={visible && target?.uuid === groupRef.current?.uuid}
      displayValues={false}
      scale={visible && target?.uuid === groupRef.current?.uuid ? 75 : 0}
      depthTest={false}
      fixed
      disableSliders
      onDragEnd={(w, de, wl, delw) => {
        const pos = new THREE.Vector3(); // create one and reuse it
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        w.decompose(pos, quaternion, scale);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        const pl = { ...pool };
        const x = +pos.x.toFixed(2) + 0;
        const y = +pos.y.toFixed(2) + 0;
        const z = +pos.z.toFixed(2) + 0;
        pl.sPosition = [x, y, z];

        pl.sScale = [scale.x, scale.y, scale.z];
        pl.sRotation = [
          THREE.MathUtils.radToDeg(euler.x),
          THREE.MathUtils.radToDeg(euler.y),
          THREE.MathUtils.radToDeg(euler.z),
        ];
        dispatch(ReplacePool({ poolIndex: index, pool: pl }));
      }}
      ref={gp}
      matrix={Mat}
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
        <mesh position={[0, -height / 2, 0]}>
          <Geometry useGroups ref={csg} computeVertexNormals>
            <Base geometry={geometry}>
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.1}
                map={Texture}
                side={THREE.DoubleSide}
                color={"lightblue"}
                {...stencil}
              />
            </Base>
            <Addition geometry={geometryOuter} position={[0, -0.05 / 2, 0]}>
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.35}
                map={TextureStone}
                side={THREE.DoubleSide}
                {...stencil}
              />
            </Addition>

            {children2}
          </Geometry>
          <meshStandardMaterial
            metalness={0.2}
            roughness={0.1}
            map={Texture}
            side={THREE.DoubleSide}
            color={"lightblue"}
            {...stencil}
          />
        </mesh>
        {/* Mask */}
        <Mask id={1} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[width, depth]} />
          {/* <meshBasicMaterial color={"salmon"}/> */}
        </Mask>
        {pool.enableWater && (
          <Suspense>
            <Watershape
              // geometry={BasePlaneGeometry}
              width={width}
              height={depth}
              textureSize={512}
              reflectivity={0.2}
              flowX={0.1}
              flowY={0}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.06, 0]}
            />
          </Suspense>
        )}

        {/* ------------------- Borders  ---------------- */}
        <>
          {!(edges.filter((value) => value.side === sides.Left).length > 0) && (
            <Borders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new THREE.Vector3(0, 0, 0)}
              side={"left"}
              poolWidth={width}
              poolDepth={depth}
            />
          )}
          {!(edges.filter((value) => value.side === sides.Top).length > 0) && (
            <Borders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new THREE.Vector3(0, 0, 0)}
              side={"top"}
              poolWidth={width}
              poolDepth={depth}
            />
          )}
          {!(
            edges.filter((value) => value.side === sides.Bottom).length > 0
          ) && (
            <Borders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new THREE.Vector3(0, 0, 0)}
              side={"bottom"}
              poolWidth={width}
              poolDepth={depth}
            />
          )}
          {!(
            edges.filter((value) => value.side === sides.Right).length > 0
          ) && (
            <Borders
              width={width}
              height={pool.bordersHeight ?? 0.05}
              depth={pool.bordersDepth ?? 0.25}
              outline={2}
              position={new THREE.Vector3(0, 0, 0)}
              side={"right"}
              poolWidth={width}
              poolDepth={depth}
            />
          )}
        </>
        {/* ------------------- Snapping areas " stairs helper boxes "  ---------------- */}
        {/* BenchSeating */}
        {/* left */}
        <>
          {pool?.BenchSeatings?.includes("left") && (
            <mesh
              visible={true}
              position={[
                -width / 2 + BenchWidth / 2,
                BenchYPosition,
                rightOffsetZPosition,
              ]}
              geometry={CustomBoxGeometry({
                width: leftWidth,
                height: BenchHeight,
                depth: leftDepth,
                topFace: [true, true, true, true, true, true],
              })}
              renderOrder={0}
            >
              <meshStandardMaterial
                color={"lightblue"}
                roughness={0.22}
                metalness={0.15}
                side={2}
                map={Texture}
                {...stencil}
              />
            </mesh>
          )}
          {pool?.BenchSeatings?.includes("top") && (
            <mesh
              visible={true}
              position={[0, BenchYPosition, -depth / 2 + BenchWidth / 2]}
              renderOrder={2}
              geometry={CustomBoxGeometry({
                width: width,
                height: BenchHeight,
                depth: BenchDepth,
                topFace: [true, true, true, true, true, true],
              })}
            >
              {/* <boxGeometry args={[width, BenchHeight, BenchDepth]} /> */}
              <meshStandardMaterial
                color={"lightblue"}
                roughness={0.22}
                metalness={0.15}
                side={2}
                map={Texture}
              />
            </mesh>
          )}
          {pool?.BenchSeatings?.includes("bottom") && (
            <mesh
              visible={true}
              position={[0, BenchYPosition, depth / 2 - BenchWidth / 2]}
              renderOrder={3}
              geometry={CustomBoxGeometry({
                width: width,
                height: BenchHeight,
                depth: BenchDepth,
                topFace: [true, true, true, true, true, true],
              })}
            >
              {/* <boxGeometry args={[width, BenchHeight, BenchDepth]} /> */}
              <meshStandardMaterial
                color={"lightblue"}
                roughness={0.22}
                metalness={0.15}
                side={2}
                map={Texture}
              />
            </mesh>
          )}
          {pool?.BenchSeatings?.includes("right") && (
            <mesh
              visible={true}
              position={[
                width / 2 - BenchWidth / 2,
                BenchYPosition,
                rightOffsetZPosition,
              ]}
              renderOrder={1}
              geometry={CustomBoxGeometry({
                width: rightWidth,
                height: BenchHeight,
                depth: rightDepth,
                topFace: [true, true, true, true, true, true],
              })}
            >
              {/* <boxGeometry
                args={[rightWidth, BenchHeight, rightDepth]}
                // args={[BenchWidth, BenchHeight, depth - BenchWidth * 2]}
              /> */}
              <meshStandardMaterial
                color={"lightblue"}
                roughness={0.22}
                metalness={0.15}
                side={2}
                map={Texture}
              />
            </mesh>
          )}
        </>
        {/* BenchSeating steps */}
        {/* topLeft: Math.PI / 2 + Math.PI / 4   */}
        {/* topRight:-( Math.PI / 2 + Math.PI / 4) */}
        {/* bottomRight: -Math.PI / 4  */}
        {/* bottomLeft: Math.PI / 4  */}
        {/* BenchSeating Top */}
        <>
          {pool?.BenchSeatings?.includes("left") &&
            pool?.BenchSeatings?.includes("top") && (
              <mesh
                position={[
                  -pool.sWidth / 2,
                  cornerHeightPosition,
                  -pool.sDepth / 2,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={Math.PI / 2 + Math.PI / 4}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
          {pool?.BenchSeatings?.includes("left") &&
            pool?.BenchSeatings?.includes("bottom") && (
              <mesh
                position={[
                  -pool.sWidth / 2,
                  cornerHeightPosition,
                  pool.sDepth / 2,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={Math.PI / 4}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
          {pool?.BenchSeatings?.includes("right") &&
            pool?.BenchSeatings?.includes("top") && (
              <mesh
                position={[
                  pool.sWidth / 2,
                  cornerHeightPosition,
                  -pool.sDepth / 2,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={-(Math.PI / 2 + Math.PI / 4)}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
          {pool?.BenchSeatings?.includes("right") &&
            pool?.BenchSeatings?.includes("bottom") && (
              <mesh
                position={[
                  pool.sWidth / 2,
                  cornerHeightPosition,
                  pool.sDepth / 2,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={-Math.PI / 4}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
        </>
        {/* BenchSeating Bottom */}
        <>
          {pool?.BenchSeatings?.includes("left") &&
            pool?.BenchSeatings?.includes("top") && (
              <mesh //TopLeft
                position={[
                  -pool.sWidth / 2 + BenchDepth,
                  cornerHeightBottomPosition,
                  -pool.sDepth / 2 + BenchDepth,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={Math.PI / 2 + Math.PI / 4}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
          {pool?.BenchSeatings?.includes("left") &&
            pool?.BenchSeatings?.includes("bottom") && (
              <mesh // bottomLeft
                position={[
                  -pool.sWidth / 2 + BenchDepth,
                  cornerHeightBottomPosition,
                  pool.sDepth / 2 - BenchDepth,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={Math.PI / 4}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
          {pool?.BenchSeatings?.includes("right") &&
            pool?.BenchSeatings?.includes("top") && (
              <mesh // TopRight
                position={[
                  pool.sWidth / 2 - BenchDepth,
                  cornerHeightBottomPosition,
                  -pool.sDepth / 2 + BenchDepth,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={-(Math.PI / 2 + Math.PI / 4)}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
          {pool?.BenchSeatings?.includes("right") &&
            pool?.BenchSeatings?.includes("bottom") && (
              <mesh //bottomRight
                position={[
                  pool.sWidth / 2 - BenchDepth,
                  cornerHeightBottomPosition,
                  pool.sDepth / 2 - BenchDepth,
                ]}
                rotation-x={Math.PI / 2}
                rotation-z={-Math.PI / 4}
                geometry={isoscelesGeometry}
              >
                <meshStandardMaterial
                  color={"lightblue"}
                  roughness={0.22}
                  metalness={0.15}
                  side={2}
                  map={Texture}
                  {...stencil}
                />
              </mesh>
            )}
        </>
        {/* Childrens */}
        {children}
      </group>
    </PivotControls>
  );
};

export default PoolBool;

const GetGeometry = ({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;
  const geometry = new THREE.BufferGeometry();
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
    0,
    0,
    0,
    0,
    0,
    0,

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

  const PositionAttribute = new THREE.BufferAttribute(
    new Float32Array(vertices),
    3
  );
  const indexAttribute = new THREE.BufferAttribute(new Uint16Array(Indices), 1);
  const uvAttribute = new THREE.BufferAttribute(new Float32Array(UVS), 2); // 2 components (s, t) for each UV coordinate

  geometry.setAttribute("uv", uvAttribute);
  geometry.setAttribute("position", PositionAttribute);
  geometry.setIndex(indexAttribute);
  geometry.computeVertexNormals();
  return geometry;
};
const GetTriangle = ({
  BenchDepth,
  cornerHeight,
}: {
  BenchDepth: number;
  cornerHeight: number;
}) => {
  const isoscelesGeometry = new THREE.ExtrudeGeometry(
    new THREE.Shape([
      new THREE.Vector2(0, 0), // Top vertex
      new THREE.Vector2(-BenchDepth, -BenchDepth), // Bottom-left vertex
      new THREE.Vector2(BenchDepth, -BenchDepth), // Bottom-right vertex
      new THREE.Vector2(0, 0), // Close the shape by repeating the top vertex
    ]),
    {
      depth: cornerHeight, // Extrusion depth
      bevelEnabled: false, // Disable bevel
    }
  );
  isoscelesGeometry.computeVertexNormals();
  return isoscelesGeometry;
};
