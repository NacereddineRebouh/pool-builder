import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { Mask, useTexture } from "@react-three/drei";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { sides as Sides, sides } from "@/slices/defaultsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";
import Watershape from "../../Ground/Watershape";
const InfinityEdge2 = ({
  sides,
  sPosition,
  sRotation,
  sScale,
  poolIndex,
  index,
  model,
  poolWidth,
  poolHeight,
  poolbHeight = 0,
  pooltHeight = 0,
  poolDepth,
  poolType,
  rotation,
  position,
  poolPosition,
  scale,
  ...props
}: {
  sides?: ChildrensType[];
  sPosition: number[];
  poolPosition: number[];
  sRotation: number[];
  sScale: number[];
  poolIndex: number;
  index: number;
  model: any;
  poolWidth: number;
  poolHeight: number;
  pooltHeight: number;
  poolbHeight: number;
  poolDepth: number;
  poolType: string;
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  props?: JSX.IntrinsicElements["group"];
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  let width =
    rotation.y == Math.PI / 2 || rotation.y == -Math.PI / 2
      ? poolDepth
      : poolWidth;
  let LRheight = 0.2;
  let LRwidth = 0.25;
  let LRdepth = 1.2;

  // ----------------------- Combine Edges -----------------------//
  let offsetLeftPosition = 0;
  let offsetRightPosition = 0;
  let offsetLeftWidth = 0;
  let offsetRightWidth = 0;
  let offsetMiddlePosition = 0;
  let offsetMiddleWidth = 0;
  let offsetWaterWidth = 0;
  let offsetWaterPosition = 0;
  let offsetMaskWidth = 0;
  let offsetMaskPosition = 0;
  let fillGab = 0;
  let offsetWaterWallWidth = 0;
  let offsetWaterWallPosition = 0;
  let offsetFrontWallWidthRight = 0;
  let offsetFrontWallWidthLeft = 0;
  let offsetFrontWallPositionLeft = 0;
  let offsetFrontWallPositionRight = 0;
  let SideWallRight = 1;
  let SideWallLeft = 1;
  const removeArray = [false, false]; //Right, Left posts to remove LRdepth - LRwidth / 2 + LRwidth / 2
  if (sides) {
    let filtered: ChildrensType[] = [];
    filtered = sides.filter((value, index) => {
      if (value.side === Sides.Top || value.side === Sides.Bottom) {
        return value.side;
      }
    });
    switch (model.side) {
      case "Left":
        let left = false;
        if (
          sides.filter((value, index) => value.side === Sides.Top).length > 0
        ) {
          left = true;
          offsetRightWidth = LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetRightPosition = (LRdepth - LRwidth / 2 + LRwidth / 2) / 2; //x axis
          offsetMiddleWidth = offsetRightWidth;
          offsetMiddlePosition = offsetRightPosition;
          offsetWaterWidth = offsetMiddleWidth;
          offsetWaterPosition = offsetMiddlePosition;
          offsetMaskWidth = LRdepth - LRwidth;
          offsetMaskPosition = -(LRdepth - LRwidth) / 2;
          offsetWaterWallWidth = LRwidth / 2;
          offsetWaterWallPosition = LRwidth / 2;
          offsetFrontWallWidthLeft = LRdepth - LRwidth;
          offsetFrontWallPositionLeft = (LRdepth - LRwidth / 2) / 2;
          removeArray[0] = true;
        }
        if (
          sides.filter((value, index) => value.side === Sides.Bottom).length > 0
        ) {
          offsetLeftWidth = LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetLeftPosition = -(LRdepth - LRwidth / 2 + LRwidth / 2) / 2;
          offsetMiddleWidth += offsetLeftWidth;
          offsetMiddlePosition += offsetLeftPosition;
          offsetWaterWidth = offsetMiddleWidth;
          offsetWaterPosition = offsetMiddlePosition;
          offsetMaskWidth += LRdepth - LRwidth;
          offsetMaskPosition += (LRdepth - LRwidth) / 2;
          offsetWaterWallWidth += LRwidth / 2;
          if (left) offsetWaterWallPosition = LRwidth / 2;

          offsetFrontWallWidthRight = LRdepth - LRwidth;
          offsetFrontWallPositionRight += -(LRdepth - LRwidth / 2) / 2;

          removeArray[1] = true;
        }
        break;
      case "Right":
        let bottom =
          sides.filter((value, index) => value.side === Sides.Bottom).length >
          0;
        if (
          sides.filter((value, index) => value.side === Sides.Top).length > 0
        ) {
          offsetLeftWidth = LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetLeftPosition = -(LRdepth - LRwidth / 2 + LRwidth / 2) / 2;
          offsetMiddleWidth = offsetLeftWidth;
          offsetWaterWidth = offsetMiddleWidth;
          offsetMiddlePosition = offsetLeftPosition;
          offsetWaterPosition = offsetMiddlePosition;
          offsetMaskWidth = LRdepth - LRwidth;
          offsetMaskPosition = (LRdepth - LRwidth) / 2;
          offsetWaterWallWidth = LRwidth / 2;
          if (bottom) offsetWaterWallPosition = LRwidth / 2;

          offsetFrontWallWidthRight = LRdepth - LRwidth;
          offsetFrontWallPositionRight = (LRdepth - LRwidth / 2) / 2;
          removeArray[1] = true;
        }
        if (
          sides.filter((value, index) => value.side === Sides.Bottom).length > 0
        ) {
          offsetRightWidth = LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetRightPosition = (LRdepth - LRwidth / 2 + LRwidth / 2) / 2; //x axis
          offsetMiddleWidth += offsetRightWidth;
          offsetWaterWidth = offsetMiddleWidth;
          offsetMiddlePosition += offsetRightPosition;
          offsetWaterPosition = offsetMiddlePosition;
          offsetMaskWidth += LRdepth - LRwidth;
          offsetMaskPosition += -(LRdepth - LRwidth) / 2;
          offsetWaterWallWidth += LRwidth / 2;
          offsetWaterWallPosition = LRwidth / 2;

          offsetFrontWallWidthLeft = LRdepth - LRwidth;
          offsetFrontWallPositionLeft += -(LRdepth - LRwidth / 2) / 2;
          removeArray[0] = true;
        }
        break;
      case "Top":
        if (
          sides.filter((value, index) => value.side === Sides.Left).length > 0
        ) {
          offsetMiddleWidth = LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetMiddlePosition = -(LRdepth - LRwidth / 2 + LRwidth / 2) / 2;
          fillGab = LRwidth;
          SideWallRight = 0;
          // offsetWaterPosition = -fillGab / 2;
          removeArray[1] = true;
        }

        if (
          sides.filter((value, index) => value.side === Sides.Right).length > 0
        ) {
          offsetMiddleWidth += LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetMiddlePosition += (LRdepth - LRwidth / 2 + LRwidth / 2) / 2;
          fillGab = LRwidth;
          SideWallLeft = 0;
          // offsetWaterPosition = fillGab / 2;
          removeArray[0] = true;
        }
        break;
      case "Bottom":
        if (
          sides.filter((value, index) => value.side === Sides.Left).length > 0
        ) {
          offsetMiddleWidth = LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetMiddlePosition = (LRdepth - LRwidth / 2 + LRwidth / 2) / 2;
          fillGab = LRwidth;
          SideWallLeft = 0;
          // offsetWaterPosition = fillGab / 2;
          removeArray[0] = true;
        }
        if (
          sides.filter((value, index) => value.side === Sides.Right).length > 0
        ) {
          offsetMiddleWidth += LRdepth - LRwidth / 2 + LRwidth / 2;
          offsetMiddlePosition += -(LRdepth - LRwidth / 2 + LRwidth / 2) / 2;
          fillGab = LRwidth;
          SideWallRight = 0;
          // offsetWaterPosition = -fillGab / 2;
          removeArray[1] = true;
        }
        break;
    }
  }

  //Water
  // Constants
  const waterSize = 1;
  const height = 0.2;
  const depth = 0.25;

  // Width
  let Waterfall_Width = poolWidth;

  let YPosition =
    LRheight -
    0.5 -
    (poolPosition[1] > poolHeight
      ? poolHeight - LRheight - 0.5
      : poolPosition[1]);
  if (poolType === "lshape") {
    YPosition =
      LRheight -
      0.5 -
      (poolPosition[1] > poolDepth
        ? poolDepth - LRheight - 0.5
        : poolPosition[1]);
  }
  let EdgePosition = [0, YPosition, 0];
  let mask_WallZoffset = 0.1 / 2;
  switch (true) {
    case model.side === "Left":
      Waterfall_Width = poolDepth;
      EdgePosition[2] = position.x + poolWidth / 2 + LRdepth - depth / 2; // + poolWidth / 2 + LRdepth - depth / 2
      if (poolType === "lshape") {
        mask_WallZoffset = 0.15;
        width = poolWidth;
        Waterfall_Width = poolWidth;
        EdgePosition[2] = position.z + LRdepth / 2 + 0.02;
      } else {
        width = poolDepth;
      }
      break;
    case model.side === "Top":
      Waterfall_Width = poolWidth;
      if (poolType === "lshape") {
        mask_WallZoffset = 0.15;
        width = poolbHeight - poolWidth - 0.05 * 5;
        Waterfall_Width = width;
        EdgePosition[2] = +LRdepth / 2 + 0.02;
      } else {
        EdgePosition[2] = position.z + poolDepth / 2 + LRdepth - depth / 2;
        width = poolWidth;
      }
      break;
    case model.side === "Bottom":
      Waterfall_Width = poolWidth;
      // EdgePosition[0]=position.z - poolDepth / 2 + LRdepth - depth / 2
      if (poolType === "lshape") {
        mask_WallZoffset = 0.15;
        // width = poolbHeight;
        width = poolbHeight;
        Waterfall_Width = width;
        EdgePosition[2] = +LRdepth / 2 + 0.02;
      } else {
        EdgePosition[2] = -position.z + poolDepth / 2 + LRdepth - depth / 2;
        width = poolWidth;
      }
      break;
    case model.side === "Right":
      Waterfall_Width = poolDepth;
      EdgePosition[2] = -position.x + poolWidth / 2 + LRdepth - depth / 2;
      width = poolDepth;
      break;
    case model.side === "tLeft":
      mask_WallZoffset = 0.15;
      width = pooltHeight - poolWidth - 0.05 * 5;
      Waterfall_Width = width;
      EdgePosition[2] = +LRdepth / 2 + 0.02;
      break;
    case model.side === "tRight":
      mask_WallZoffset = 0.15;
      width = pooltHeight;
      Waterfall_Width = pooltHeight;
      EdgePosition[2] = +LRdepth / 2 + 0.02;
      break;
    case model.side === "tTop":
      mask_WallZoffset = 0.15;
      Waterfall_Width = poolWidth;
      width = poolWidth;
      EdgePosition[2] = +LRdepth / 2 + 0.02;
      break;
  }
  const texture = useTexture("/textures/grass.jpeg");
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(5, 1 / 2);

  const [Mat, setMat] = useState(new THREE.Matrix4());
  useEffect(() => {
    const position = new THREE.Vector3(
      sPosition[0],
      sPosition[1],
      sPosition[2]
    );
    const comb = new THREE.Matrix4();
    const radiansX = THREE.MathUtils.degToRad(sRotation[0]);
    const radiansY = THREE.MathUtils.degToRad(sRotation[1]);
    const radiansZ = THREE.MathUtils.degToRad(sRotation[2]);
    const qt = new THREE.Quaternion();
    qt.setFromEuler(new THREE.Euler(radiansX, radiansY, radiansZ, "XYZ"));
    // Create a new quaternion using Euler angles (XYZ order)
    comb.compose(position, qt, new THREE.Vector3(1, 1, 1));
    setMat(comb);
  }, [sScale, sPosition, sRotation]);

  // geometry
  const grassTexture = useTexture(
    "textures/grass/textures/leafy_grass_diff_1k.jpg"
  );
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(1, 1);
  const stoneTexture = useTexture("/textures/stone/stone-9_diffuse.png");
  stoneTexture.wrapT = THREE.RepeatWrapping;
  stoneTexture.wrapS = THREE.RepeatWrapping;
  const stoneNormalTexture = useTexture("/textures/stone/stone-9_normal.jpg");
  stoneNormalTexture.wrapT = THREE.RepeatWrapping;
  stoneNormalTexture.wrapS = THREE.RepeatWrapping;

  let halfWidth = LRwidth / 2;
  let halfHeight = LRheight / 2;
  let halfDepth = LRdepth / 2;

  // ------ ------- ------ //
  const uvLRHeight = LRheight / 2;
  const uvLRHeight2 = (Math.abs(YPosition) + LRheight) / 2;
  const uvLRWidth = LRwidth / 2;
  const uvLRDepth = LRdepth / 2;
  const UVS = [
    // Back face
    0,
    uvLRHeight, // Bottom-left corner
    uvLRDepth,
    uvLRHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRDepth,
    0, // Top-right corner

    // Front face
    0,
    uvLRHeight, // Bottom-left corner
    uvLRDepth,
    uvLRHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRDepth,
    0, // Top-right corner

    // Top face (Side face 1)
    0,
    uvLRDepth, // Bottom-left corner
    uvLRWidth,
    uvLRDepth, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner

    // Bottom face (Side face 2)
    0,
    0, // Bottom-left corner
    uvLRWidth,
    0, // Bottom-right corner
    0,
    uvLRDepth, // Top-left corner
    uvLRWidth,
    uvLRDepth, // Top-right corner

    // Left face (Side face 3)
    0,
    uvLRHeight, // Bottom-left corner
    uvLRWidth,
    uvLRHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner

    // Right face (Side face 4)
    0,
    uvLRHeight, // Bottom-left corner
    uvLRWidth,
    uvLRHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner
  ];
  const UVSPost = [
    // Back face
    0,
    uvLRHeight2, // Bottom-left corner
    uvLRWidth,
    uvLRHeight2, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner

    // Front face
    0,
    uvLRHeight2, // Bottom-left corner
    uvLRWidth,
    uvLRHeight2, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner

    // Top face (Side face 1)
    0,
    uvLRWidth, // Bottom-left corner
    uvLRWidth,
    uvLRWidth, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner

    // Bottom face (Side face 2)
    0,
    0, // Bottom-left corner
    uvLRWidth,
    0, // Bottom-right corner
    0,
    uvLRWidth, // Top-left corner
    uvLRWidth,
    uvLRWidth, // Top-right corner

    // Left face (Side face 3)
    0,
    uvLRHeight2, // Bottom-left corner
    uvLRWidth,
    uvLRHeight2, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner

    // Right face (Side face 4)
    0,
    uvLRHeight2, // Bottom-left corner
    uvLRWidth,
    uvLRHeight2, // Bottom-right corner
    0,
    0, // Top-left corner
    uvLRWidth,
    0, // Top-right corner
  ];
  const UVSBase = [
    // Back face width, LRdepth
    0,
    uvLRDepth, // Bottom-left corner
    width / 3,
    uvLRDepth, // Bottom-right corner
    0,
    0, // Top-left corner
    width / 3,
    0, // Top-right corner
  ];

  halfWidth = width / 2;
  halfHeight = height / 2;
  halfDepth = depth / 2;
  const uvHeight = height / 3;
  const uvWidth = width / 3;
  const uvDepth = depth / 3;
  const middleUVS = [
    // Back face
    0,
    uvHeight, // Bottom-left corner
    uvWidth,
    uvHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvWidth,
    0, // Top-right corner

    // Front face
    0,
    uvHeight, // Bottom-left corner
    uvWidth,
    uvHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvWidth,
    0, // Top-right corner

    // Top face (Side face 1)
    0,
    uvDepth, // Bottom-left corner
    uvWidth,
    uvDepth, // Bottom-right corner
    0,
    0, // Top-left corner
    uvWidth,
    0, // Top-right corner

    // Bottom face (Side face 2)
    0,
    0, // Bottom-left corner
    uvWidth,
    0, // Bottom-right corner
    0,
    uvDepth, // Top-left corner
    uvWidth,
    uvDepth, // Top-right corner

    // Left face (Side face 3)
    0,
    uvHeight, // Bottom-left corner
    uvWidth,
    uvHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvWidth,
    0, // Top-right corner

    // Right face (Side face 4)
    0,
    uvHeight, // Bottom-left corner
    uvWidth,
    uvHeight, // Bottom-right corner
    0,
    0, // Top-left corner
    uvWidth,
    0, // Top-right corner
  ];
  const uvAttribute = new THREE.BufferAttribute(new Float32Array(UVS), 2); // 2 components (s, t) for each UV coordinate
  const uvAttributePosts = new THREE.BufferAttribute(
    new Float32Array(UVSPost),
    2
  ); // 2 components (s, t) for each UV coordinate
  const middleUvAttribute = new THREE.BufferAttribute(
    new Float32Array(middleUVS),
    2
  ); // 2 components (s, t) for each UV coordinate
  const uvAttributeBasePlane = new THREE.BufferAttribute(
    new Float32Array(UVSBase),
    2
  ); // 2 components (s, t) for each UV coordinate
  const BasePlaneGeometry = new THREE.PlaneGeometry(
    width + offsetRightWidth + offsetLeftWidth,
    LRdepth - LRwidth / 2
  );
  const leftGeometry = new THREE.BoxGeometry(LRwidth + 0.01, LRheight, LRdepth);
  const leftPostGeometry = new THREE.BoxGeometry(
    LRwidth,
    Math.abs(YPosition) + LRheight,
    LRwidth + 0.01
  );
  const rightGeometry = new THREE.BoxGeometry(
    LRwidth + 0.01,
    LRheight,
    LRdepth
  );
  const rightPostGeometry = new THREE.BoxGeometry(
    LRwidth,
    Math.abs(YPosition) + LRheight,
    LRwidth + 0.01
  );
  const middleGeometry = new THREE.BoxGeometry(
    width + offsetMiddleWidth,
    height,
    depth
  );
  BasePlaneGeometry.setAttribute("uv", uvAttributeBasePlane);
  leftGeometry.setAttribute("uv", uvAttribute);
  leftPostGeometry.setAttribute("uv", uvAttributePosts);
  rightGeometry.setAttribute("uv", uvAttribute);
  rightPostGeometry.setAttribute("uv", uvAttributePosts);
  middleGeometry.setAttribute("uv", middleUvAttribute);

  BasePlaneGeometry.computeVertexNormals();
  leftGeometry.computeVertexNormals();
  leftPostGeometry.computeVertexNormals();
  rightGeometry.computeVertexNormals();
  rightPostGeometry.computeVertexNormals();
  middleGeometry.computeVertexNormals();
  const left = [-width / 2 - LRwidth / 2, 0, LRdepth / 2 - depth / 2];
  const right = [+width / 2 + LRwidth / 2, 0, LRdepth / 2 - depth / 2];
  const Waterfall = [0, 0, LRdepth / 2 - depth / 2];
  const middle = [offsetMiddlePosition, 0, 0];

  // water
  const extrudeSettings = {
    depth: Waterfall_Width + offsetWaterWallWidth,
    bevelEnabled: false,
    // bevelOffset: .01,
  };
  const squareShape = new THREE.Shape()
    .moveTo(0, -(Math.abs(YPosition) + LRheight + height) / 2)
    .lineTo(0, (Math.abs(YPosition) + LRheight + height) / 2)
    .lineTo(0 + LRwidth / 2, (Math.abs(YPosition) + LRheight + height) / 2)
    .lineTo(0 + LRwidth / 2, -(Math.abs(YPosition) + LRheight + height) / 2);
  const waterGeometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);
  waterGeometry.computeVertexNormals();

  const waterGroundOffset = 0.1;
  const waterFallGeometry = new THREE.PlaneGeometry(
    Waterfall_Width,
    Math.abs(YPosition) + LRheight + height - waterGroundOffset
  );

  const WallsGeom = GetMask({
    width: Waterfall_Width + 2 * LRwidth,
    height: Math.abs(YPosition) + LRheight + height,
    depth: LRdepth,
    offsetFrontWallWidthLeft: offsetFrontWallWidthLeft,
    offsetFrontWallWidthRight: offsetFrontWallWidthRight,
    offsetFrontWallPositionLeft: offsetFrontWallPositionLeft,
    offsetFrontWallPositionRight: offsetFrontWallPositionRight,
    side: model.side,
    SideWallLeft: SideWallLeft,
    SideWallRight: SideWallRight,
  });

  return (
    <PivotControls
      disableScaleAxes
      disableSliders
      snapTranslate={5}
      visible={visible && target?.uuid == groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid == groupRef.current?.uuid ? 75 : 0}
      depthTest={false}
      fixed
      onDragEnd={(w, de, wl, delw) => {
        const position = new THREE.Vector3(); // create one and reuse it
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        w.decompose(position, quaternion, scale);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        const pl = { ...model };
        const x = +position.x.toFixed(2);
        const y = +position.y.toFixed(2);
        const z = +position.z.toFixed(2);
        pl.sPosition = [x, y, z];

        pl.sScale = [1, 1, 1];
        pl.sRotation = [
          THREE.MathUtils.radToDeg(euler.x),
          THREE.MathUtils.radToDeg(euler.y),
          THREE.MathUtils.radToDeg(euler.z),
        ];
        dispatch(
          ReplaceChildren({
            poolIndex: poolIndex,
            modelIndex: index,
            model: pl,
          })
        );
      }}
      matrix={Mat}
      translateP={[sPosition[0], sPosition[1], sPosition[2]]}
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x - 4,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position?.z - 4,
      ]}
      lineWidth={2}
    >
      <group
        renderOrder={0}
        {...props}
        dispose={null}
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={[1, 1, 1]}
        {...props}
        onClick={(e) => {
          e.stopPropagation();
          const title = model.shapeType + " " + poolIndex + index;
          dispatch(setTargetTitle(title));
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        {/* stick to the ground*/}
        <mesh
          renderOrder={0}
          position={[0, YPosition / 2 - 0.005 + height / 2, mask_WallZoffset]}
          geometry={WallsGeom}
        >
          <meshBasicMaterial side={2} map={grassTexture} />
        </mesh>

        {/* Width == 10 */}
        <PivotControls
          disableScaleAxes
          disableSliders
          activeAxes={[false, true, false]}
          snapTranslate={5}
          visible={visible && target?.uuid == groupRef.current?.uuid}
          displayValues
          scale={visible && target?.uuid == groupRef.current?.uuid ? 75 : 0}
          depthTest={false}
          offset={[0, 2, 0]}
          fixed
        >
          <group
            position={[EdgePosition[0], EdgePosition[1], EdgePosition[2]]}
            rotation={[0, Math.PI, 0]}
            name="Infinity_edge"
            userData={{ name: "Infinity edge" }}
          >
            <mesh
              position={[
                offsetRightPosition + offsetLeftPosition,
                -LRheight / 2,
                LRdepth / 2 - depth / 2,
              ]}
              rotation={[Math.PI / 2, 0, 0]}
              geometry={BasePlaneGeometry}
            >
              {/* <planeGeometry args={[width, LRdepth]} /> */}
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.3}
                map={stoneTexture}
                normalMap={stoneNormalTexture}
                side={2}
              />
            </mesh>
            <Watershape
              // geometry={BasePlaneGeometry}
              width={width + fillGab + offsetWaterWidth}
              height={LRdepth - LRwidth / 2}
              flowX={0}
              flowY={0}
              position={[
                offsetWaterPosition,
                -LRheight / 2 + 0.1,
                LRdepth / 2 - depth / 2 - LRwidth / 2 / 2,
              ]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
            {/* <mesh
              position={[0, -LRheight / 2 + 0.1, LRdepth / 2 - depth / 2]}
              rotation={[Math.PI / 2, 0, 0]}
              geometry={water.geometry}
              material={water.material}
            /> */}
            {/* Left & Post */}
            {!removeArray[1] && (
              <>
                <mesh
                  geometry={leftGeometry}
                  position={[left[0], left[1], left[2]]}
                >
                  <meshStandardMaterial
                    metalness={0.1}
                    roughness={0.16}
                    map={stoneTexture}
                    normalMap={stoneNormalTexture}
                  />
                </mesh>
                <mesh
                  geometry={leftPostGeometry}
                  rotation={[0, Math.PI / 2, 0]}
                  position={[
                    left[0],
                    left[1] + Math.abs(YPosition) / 2 + LRheight,
                    left[2] + LRdepth / 2 - LRwidth / 2,
                  ]}
                >
                  <meshStandardMaterial
                    flatShading
                    metalness={0.1}
                    roughness={0.16}
                    map={stoneTexture}
                    normalMap={stoneNormalTexture}
                  />
                </mesh>
              </>
            )}
            {/* Middle */}
            <mesh
              geometry={middleGeometry}
              position={[middle[0], middle[1], middle[2]]}
            >
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.3}
                map={stoneTexture}
                normalMap={stoneNormalTexture}
              />
            </mesh>
            {/* Right & Post*/}
            {!removeArray[0] && (
              <>
                <mesh
                  geometry={rightGeometry}
                  position={[right[0], right[1], right[2]]}
                >
                  <meshStandardMaterial
                    metalness={0.2}
                    roughness={0.3}
                    map={stoneTexture}
                    normalMap={stoneNormalTexture}
                  />
                </mesh>
                <mesh
                  geometry={rightPostGeometry}
                  rotation={[0, Math.PI / 2, 0]}
                  position={[
                    right[0],
                    right[1] + Math.abs(YPosition) / 2 + LRheight,
                    right[2] + LRdepth / 2 - LRwidth / 2,
                  ]}
                >
                  <meshStandardMaterial
                    flatShading
                    metalness={0.2}
                    roughness={0.3}
                    map={stoneTexture}
                    normalMap={stoneNormalTexture}
                  />
                </mesh>
              </>
            )}

            {/* Waterfall */}
            {/* stone */}
            <mesh
              position={[
                Waterfall[0] + Waterfall_Width / 2 + offsetWaterWallPosition,
                Waterfall[1] + Math.abs(YPosition) / 2 + LRheight - height / 2,
                Waterfall[2] + LRdepth / 2 - LRwidth / 2 - 0.003,
              ]}
              rotation={[0, -Math.PI / 2, 0]}
              geometry={waterGeometry}
            >
              <meshStandardMaterial
                metalness={0.2}
                roughness={0.3}
                map={stoneTexture}
                normalMap={stoneNormalTexture}
              />
            </mesh>
            {/* waterfall */}
            <Watershape
              width={Waterfall_Width}
              height={
                Math.abs(YPosition) + LRheight + height - waterGroundOffset
              }
              flowX={0}
              flowY={1}
              position={[
                Waterfall[0],
                Waterfall[1] +
                  Math.abs(YPosition) / 2 +
                  LRheight -
                  height / 2 +
                  waterGroundOffset / 2,
                Waterfall[2] + LRdepth / 2 - LRwidth / 2 - 0.007,
              ]}
              rotation={[0, Math.PI, 0]}
              scaleArray={[1, 1, 1]}
              scale={0.3}
              // scaleArray={[-1, 1, -1]}
            />
          </group>
          {/* mask -- stick to the ground*/}

          <Mask
            id={1}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
              offsetMaskPosition,
              LRheight + height / 2 - 0.005,
              mask_WallZoffset,
            ]}
          >
            <planeGeometry
              args={[Waterfall_Width + 2 * LRwidth + offsetMaskWidth, LRdepth]}
            />
            {/* <meshBasicMaterial color={"salmon"}/> */}
          </Mask>
        </PivotControls>
      </group>
    </PivotControls>
  );
};

export default InfinityEdge2;

const GetMask = ({
  width,
  height,
  depth,
  offsetFrontWallWidthLeft,
  offsetFrontWallWidthRight,
  offsetFrontWallPositionLeft,
  offsetFrontWallPositionRight,
  side,
  SideWallLeft,
  SideWallRight,
}: {
  width: number;
  height: number;
  depth: number;
  offsetFrontWallWidthLeft: number;
  offsetFrontWallWidthRight: number;
  offsetFrontWallPositionLeft: number;
  offsetFrontWallPositionRight: number;
  SideWallLeft: number;
  SideWallRight: number;
  side: sides;
}) => {
  const geometry = new THREE.BufferGeometry();
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfDepth = depth / 2;
  const offsetBackFaceLeft =
    offsetFrontWallWidthLeft > 0 || SideWallLeft == 0 ? -0.25 / 2 : 0;
  const offsetBackFaceRight =
    offsetFrontWallWidthRight > 0 || SideWallRight == 0 ? -0.25 / 2 : 0;
  // ------ ------- ------ //
  // Vertex positions (x, y, z)
  const vertices = [
    // Front face
    -halfWidth - offsetFrontWallWidthLeft,
    halfHeight,
    halfDepth, // 0
    halfWidth + offsetFrontWallWidthRight,
    halfHeight,
    halfDepth, // 1
    halfWidth + offsetFrontWallWidthRight,
    -halfHeight,
    halfDepth, // 2
    -halfWidth - offsetFrontWallWidthLeft,
    -halfHeight,
    halfDepth, // 3

    // Back face
    halfWidth + offsetBackFaceRight,
    halfHeight,
    -halfDepth, // 4
    -halfWidth - offsetBackFaceLeft,
    halfHeight,
    -halfDepth, // 5
    -halfWidth - offsetBackFaceLeft,
    -halfHeight,
    -halfDepth, // 6
    halfWidth + offsetBackFaceRight,
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
    (-halfWidth - offsetFrontWallWidthLeft) * SideWallLeft,
    halfHeight * SideWallLeft,
    -halfDepth * SideWallLeft, // 16
    (-halfWidth - offsetFrontWallWidthLeft) * SideWallLeft,
    halfHeight * SideWallLeft,
    halfDepth * SideWallLeft, // 17
    (-halfWidth - offsetFrontWallWidthLeft) * SideWallLeft,
    -halfHeight * SideWallLeft,
    halfDepth * SideWallLeft, // 18
    (-halfWidth - offsetFrontWallWidthLeft) * SideWallLeft,
    -halfHeight * SideWallLeft,
    -halfDepth * SideWallLeft, // 19

    // Right face
    (halfWidth + offsetFrontWallWidthRight) * SideWallRight,
    halfHeight * SideWallRight,
    halfDepth * SideWallRight, // 20
    (halfWidth + offsetFrontWallWidthRight) * SideWallRight,
    halfHeight * SideWallRight,
    -halfDepth * SideWallRight, // 21
    (halfWidth + offsetFrontWallWidthRight) * SideWallRight,
    -halfHeight * SideWallRight,
    -halfDepth * SideWallRight, // 22
    (halfWidth + offsetFrontWallWidthRight) * SideWallRight,
    -halfHeight * SideWallRight,
    halfDepth * SideWallRight, // 23
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
    width / 10,
    0,
    width / 10,
    height / 10,
    0,
    height / 10,

    // Front face
    0,
    0,
    width / 10,
    0,
    width / 10,
    height / 10,
    0,
    height / 10,

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
    width / 10,
    0,
    width / 10,
    depth / 10,
    0,
    depth / 10,

    // Left face (Side face 3)
    0,
    0,
    depth / 10,
    0,
    depth / 10,
    height / 10,
    0,
    height / 10,

    // Right face (Side face 4)
    0,
    0,
    depth / 10,
    0,
    depth / 10,
    height / 10,
    0,
    height / 10,
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
