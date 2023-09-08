"use client";
import { Instances, Instance, useMask, useTexture } from "@react-three/drei";
import React, { useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPointer, setPointer, setRotation } from "@/slices/pointerSlice";
import { setHelper } from "@/slices/helperSlice";
import { RootState } from "@/store/store";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  addPool as addNewPool,
  addChildren,
  PoolType,
} from "@/slices/poolsSlice";
import { setPivotVisibility } from "@/slices/targetSlice";
import * as THREE from "three";
import { sides } from "@/slices/defaultsSlice";
type Props = {};

export default function Ground({}: Props) {
  const color = new THREE.TextureLoader().load(
    "textures/grass/textures/leafy_grass_diff_1k.jpg"
  );
  color.wrapS = THREE.RepeatWrapping;
  color.wrapT = THREE.RepeatWrapping;
  color.repeat.set(4, 4);
  return (
    <>
      <Grid textureMap={color} />
      {/* <Pool/> */}
      {/* <WallWaterfall position={[15,1,0]}/> */}
    </>
  );
}

const Grid = ({
  textureMap,
  number = 23,
  lineWidth = 0.026,
  height = 0.5,
}: {
  textureMap: THREE.Texture;
  number?: number;
  lineWidth?: number;
  height?: number;
}) => {
  const help = useAppSelector((state: RootState) => state.helper);
  const type = useAppSelector((state: RootState) => state.helper.type);
  const visibility = useAppSelector(
    (state: RootState) => state.target.pivotVisibility
  );
  const defaults = useAppSelector((state: RootState) => state.defaults);

  const dispatch = useAppDispatch();
  const Pools = useAppSelector((state: RootState) => state.pools.pools);
  const stencil = useMask(1, true);

  // -------------- Defaults --------------//
  const poolwidth = defaults.pool.width;
  const poolheight = defaults.pool.height;
  const pooldepth = defaults.pool.depth;

  const lShapeWidth = defaults.lshape.width;
  const lShapeTHeight = defaults.lshape.theight;
  const lShapeBHeight = defaults.lshape.bheight;
  const lShapeDepth = defaults.lshape.depth;

  let LshapeTZPosition = -lShapeTHeight / 2 + lShapeWidth / 2;
  let LshapeBXPosition = -lShapeBHeight / 2 + lShapeWidth / 2;
  useEffect(() => {
    setCorner([
      {
        position: [
          -poolwidth / 2 + 3 / 2,
          -height + 4 / 2,
          -pooldepth / 2 + 3 / 2,
        ],
        used: false,
      }, //left
      {
        position: [
          poolwidth / 2 - 3 / 2,
          -height + 4 / 2,
          -pooldepth / 2 + 3 / 2,
        ],
        used: false,
      }, //right
      {
        position: [
          -poolwidth / 2 + 3 / 2,
          -height + 4 / 2,
          pooldepth / 2 - 3 / 2,
        ],
        used: false,
      }, //top
      {
        position: [
          poolwidth / 2 - 3 / 2,
          -height + 4 / 2,
          pooldepth / 2 - 3 / 2,
        ],
        used: false,
      }, //bottom
    ]);
    setstairs([
      {
        position: [
          -poolwidth / 2 + boxWidth / 2,
          -poolheight + boxHeight / 2,
          0,
        ],
        used: false,
      }, //left
      {
        position: [
          poolwidth / 2 - boxWidth / 2,
          -poolheight + boxHeight / 2,
          0,
        ],
        used: false,
      }, //right
      {
        position: [
          0,
          -poolheight + boxHeight / 2,
          -pooldepth / 2 + boxDepth / 2,
        ],
        used: false,
      }, //top
      {
        position: [
          0,
          -poolheight + boxHeight / 2,
          pooldepth / 2 - boxDepth / 2,
        ],
        used: false,
      }, //bottom
    ]);
    setswimJet([
      {
        position: [
          -poolwidth / 2 + swimJetBoxWidth / 2,
          -poolheight / 2 + swimJetBoxHeight / 2,
          0,
        ],
        used: false,
      }, //left
      {
        position: [
          poolwidth / 2 - swimJetBoxWidth / 2,
          -poolheight / 2 + swimJetBoxHeight / 2,
          0,
        ],
        used: false,
      }, //right
      {
        position: [
          0,
          -poolheight / 2 + swimJetBoxHeight / 2,
          -pooldepth / 2 + swimJetBoxWidth / 2,
        ],
        used: false,
      }, //top
      {
        position: [
          0,
          -poolheight / 2 + swimJetBoxHeight / 2,
          pooldepth / 2 - swimJetBoxWidth / 2,
        ],
        used: false,
      }, //bottom
    ]);
    setinfinityEdge([
      {
        position: [
          -poolwidth / 2 - infinityEdgeBoxWidth,
          infinityEdgeBoxHeight / 2,
          0,
        ],
        used: false,
      }, //left
      {
        position: [
          poolwidth / 2 + infinityEdgeBoxWidth,
          infinityEdgeBoxHeight / 2,
          0,
        ],
        used: false,
      }, //right
      {
        position: [
          0,
          infinityEdgeBoxHeight / 2,
          -pooldepth / 2 - infinityEdgeBoxWidth,
        ],
        used: false,
      }, //top
      {
        position: [
          0,
          infinityEdgeBoxHeight / 2,
          pooldepth / 2 + infinityEdgeBoxWidth,
        ],
        used: false,
      }, //bottom
    ]);
    setfountain([
      {
        position: [-poolwidth / 2 - 0, waterFallBoxHeight / 2, 0],
        used: false,
      }, //left
      { position: [poolwidth / 2 + 0, waterFallBoxHeight / 2, 0], used: false }, //right
      {
        position: [0, waterFallBoxHeight / 2, -pooldepth / 2 - 0],
        used: false,
      }, //top
      { position: [0, waterFallBoxHeight / 2, pooldepth / 2 + 0], used: false }, //bottom
    ]);
    setbeach([
      { position: [-poolwidth / 2 - 2, 2 / 2, 0], used: false }, //left
      { position: [poolwidth / 2 + 2, 2 / 2, 0], used: false }, //right
      { position: [0, 2 / 2, -pooldepth / 2 - 2], used: false }, //top
      { position: [0, 2 / 2, pooldepth / 2 + 2], used: false }, //bottom
    ]);

    // ------ //
    setstairsLShape([
      {
        position: [LshapeBXPosition - lShapeTHeight / 2, lShapeDepth / 2, 0],
        used: false,
      }, //BOTTOM - left
      // {
      //   position: [poolwidth / 2 - boxWidth / 2, lShapeDepth / 2, 0],
      //   used: false,
      // }, //BOTTOM - right Doesnt Exist
      {
        position: [
          LshapeBXPosition,
          lShapeDepth / 2,
          -lShapeDepth / 2 + boxDepth / 2,
        ],
        used: false,
      }, //BOTTOM - top
      {
        position: [
          LshapeBXPosition,
          lShapeDepth / 2,
          lShapeDepth / 2 - boxDepth / 2,
        ],
        used: false,
      }, //BOTTOM - bottom
      // ---------------------------------------------------------------------- //
      {
        position: [-lShapeWidth / 2, lShapeDepth / 2, LshapeTZPosition],
        used: false,
      }, //TOP - left
      {
        position: [lShapeWidth / 2, lShapeDepth / 2, LshapeTZPosition],
        used: false,
      }, //TOP - right
      {
        position: [
          0,
          lShapeDepth / 2,
          LshapeTZPosition - lShapeTHeight / 2 + boxDepth / 2,
        ],
        used: false,
      }, //TOP - top
      {
        position: [
          0,
          lShapeDepth / 2,
          LshapeTZPosition + lShapeTHeight / 2 - boxDepth / 2,
        ],
        used: false,
      }, //TOP - bottom
    ]);
  }, [defaults]);

  const borderHeight = 0.1;

  const boxWidth = 3 / 5;
  const boxHeight = poolheight;
  const boxDepth = 4 / 5;

  const swimJetBoxWidth = 3 / 3;
  const swimJetBoxHeight = poolheight / 3;

  const infinityEdgeBoxWidth = 1 / 5;
  const infinityEdgeBoxHeight = 1 / 5;

  const waterFallBoxHeight = 2 / 5;

  const [stairs, setstairs] = useState([
    {
      position: [-poolwidth / 2 + boxWidth / 2, -height + boxHeight / 2, 0],
      used: false,
    }, //left
    {
      position: [poolwidth / 2 - boxWidth / 2, -height + boxHeight / 2, 0],
      used: false,
    }, //right
    {
      position: [0, -height + boxHeight / 2, -pooldepth / 2 + boxDepth / 2],
      used: false,
    }, //top
    {
      position: [0, -height + boxHeight / 2, pooldepth / 2 - boxDepth / 2],
      used: false,
    }, //bottom
  ]);
  const [swimJet, setswimJet] = useState([
    {
      position: [
        -poolwidth / 2 + swimJetBoxWidth / 2,
        -poolheight / 2 + swimJetBoxHeight / 2,
        0,
      ],
      used: false,
    }, //left
    {
      position: [
        poolwidth / 2 - swimJetBoxWidth / 2,
        -poolheight / 2 + swimJetBoxHeight / 2,
        0,
      ],
      used: false,
    }, //right
    {
      position: [
        0,
        -poolheight / 2 + swimJetBoxHeight / 2,
        -pooldepth / 2 + swimJetBoxWidth / 2,
      ],
      used: false,
    }, //top
    {
      position: [
        0,
        -poolheight / 2 + swimJetBoxHeight / 2,
        pooldepth / 2 - swimJetBoxWidth / 2,
      ],
      used: false,
    }, //bottom
  ]);
  const [infinityEdge, setinfinityEdge] = useState([
    {
      position: [
        -poolwidth / 2 - infinityEdgeBoxWidth,
        infinityEdgeBoxHeight / 2,
        0,
      ],
      used: false,
    }, //left
    {
      position: [
        poolwidth / 2 + infinityEdgeBoxWidth,
        infinityEdgeBoxHeight / 2,
        0,
      ],
      used: false,
    }, //right
    {
      position: [
        0,
        infinityEdgeBoxHeight / 2,
        -pooldepth / 2 - infinityEdgeBoxWidth,
      ],
      used: false,
    }, //top
    {
      position: [
        0,
        infinityEdgeBoxHeight / 2,
        pooldepth / 2 + infinityEdgeBoxWidth,
      ],
      used: false,
    }, //bottom
  ]);
  const [fountain, setfountain] = useState([
    { position: [-poolwidth / 2 - 0, waterFallBoxHeight / 2, 0], used: false }, //left
    { position: [poolwidth / 2 + 0, waterFallBoxHeight / 2, 0], used: false }, //right
    { position: [0, waterFallBoxHeight / 2, -pooldepth / 2 - 0], used: false }, //top
    { position: [0, waterFallBoxHeight / 2, pooldepth / 2 + 0], used: false }, //bottom
  ]);
  const [Corner, setCorner] = useState([
    {
      position: [
        -poolwidth / 2 + 3 / 2,
        -height + 4 / 2 / 5,
        -pooldepth / 2 + 3 / 2,
      ],
      used: false,
    }, //left
    {
      position: [
        poolwidth / 2 - 3 / 2,
        -height + 4 / 2 / 5,
        -pooldepth / 2 + 3 / 2,
      ],
      used: false,
    }, //right
    {
      position: [
        -poolwidth / 2 + 3 / 2,
        -height + 4 / 2 / 5,
        pooldepth / 2 - 3 / 2,
      ],
      used: false,
    }, //top
    {
      position: [
        poolwidth / 2 - 3 / 2,
        -height + 4 / 2 / 5,
        pooldepth / 2 - 3 / 2,
      ],
      used: false,
    }, //bottom
  ]);
  const [beach, setbeach] = useState([
    { position: [-poolwidth / 2 - 2, 2 / 2, 0], used: false }, //left
    { position: [poolwidth / 2 + 2, 2 / 2, 0], used: false }, //right
    { position: [0, 2 / 2, -pooldepth / 2 - 2], used: false }, //top
    { position: [0, 2 / 2, pooldepth / 2 + 2], used: false }, //bottom
  ]);
  const [Light, setLight] = useState([
    {
      position: [-poolwidth / 2 + swimJetBoxWidth / 2, -poolheight, 0],
      used: false,
    }, //left
    {
      position: [poolwidth / 2 - swimJetBoxWidth / 2, -poolheight, 0],
      used: false,
    }, //right
    {
      position: [0, -poolheight, -pooldepth / 2 + swimJetBoxWidth / 2],
      used: false,
    }, //top
    {
      position: [0, -poolheight, pooldepth / 2 - swimJetBoxWidth / 2],
      used: false,
    }, //bottom
  ]);
  const BenchHeight = poolheight - 0.65;
  let BenchYPosition = -poolheight + BenchHeight / 2;
  const cornerHeight = 0.2;
  const BenchDepth = 0.5;
  let cornerHeightPosition = BenchYPosition + BenchHeight / 2 + cornerHeight;
  const cornerHeightBottomPosition =
    BenchYPosition - BenchHeight / 2 + cornerHeight;
  // const [CornerStep, setCornerStep] = useState([
  //   {
  //     position: [-poolwidth / 2, cornerHeightPosition, -pooldepth / 2],
  //     used: false,
  //   }, //left (TopLeft)
  //   {
  //     position: [-poolwidth / 2,
  //     cornerHeightPosition,
  //     pooldepth / 2],
  //     used: false,
  //   }, //right (TopRight)
  //   {
  //     position: [ poolwidth / 2,
  //     cornerHeightPosition,
  //     pooldepth / 2],
  //     used: false,
  //   }, //top (BottomRight)
  //   {
  //     position: [ -poolwidth / 2,
  //     cornerHeightPosition,
  //     pooldepth / 2],
  //     used: false,
  //   }, //bottom (BottomLeft)
  //   // ------ ------ ------ //
  //   {
  //     position: [ -poolwidth / 2 + BenchDepth,
  //     cornerHeightBottomPosition,
  //     -pooldepth / 2 + BenchDepth],
  //     used: false,
  //   }, //bottomleft (TopLeft)
  //   {
  //     position: [ poolwidth / 2 - BenchDepth,
  //     cornerHeightBottomPosition,
  //     -pooldepth / 2 + BenchDepth],
  //     used: false,
  //   }, //bottomright (TopRight)
  //   {
  //     position: [poolwidth / 2 - BenchDepth,
  //     cornerHeightBottomPosition,
  //     pooldepth / 2 - BenchDepth,],
  //     used: false,
  //   }, //bottomtop (BottomRight)
  //   {
  //     position: [ -poolwidth / 2 + BenchDepth,
  //     cornerHeightBottomPosition,
  //     pooldepth / 2 - BenchDepth],
  //     used: false,
  //   }, //bottombottom (BottomLeft)
  // ]);

  // -------------------- LSHAPE Model Positions -------------------- //
  const [stairsLShape, setstairsLShape] = useState([
    {
      position: [LshapeBXPosition - lShapeTHeight / 2, lShapeDepth / 2, 0],
      used: false,
    }, //BOTTOM - left
    // {
    //   position: [poolwidth / 2 - boxWidth / 2, lShapeDepth / 2, 0],
    //   used: false,
    // }, //BOTTOM - right Doesnt Exist
    {
      position: [
        LshapeBXPosition,
        lShapeDepth / 2,
        -lShapeDepth / 2 + boxDepth / 2,
      ],
      used: false,
    }, //BOTTOM - top
    {
      position: [
        LshapeBXPosition,
        lShapeDepth / 2,
        lShapeDepth / 2 - boxDepth / 2,
      ],
      used: false,
    }, //BOTTOM - bottom
    // ---------------------------------------------------------------------- //
    {
      position: [-lShapeWidth / 2, lShapeDepth / 2, LshapeTZPosition],
      used: false,
    }, //TOP - left
    {
      position: [lShapeWidth / 2, lShapeDepth / 2, LshapeTZPosition],
      used: false,
    }, //TOP - right
    {
      position: [
        0,
        lShapeDepth / 2,
        LshapeTZPosition - lShapeTHeight / 2 + boxDepth / 2,
      ],
      used: false,
    }, //TOP - top
    // {
    //   position: [
    //     0,
    //     lShapeDepth / 2,
    //     LshapeTZPosition + lShapeTHeight / 2 - boxDepth / 2,
    //   ],
    //   used: false,
    // }, //TOP - bottom Doesnt Exist
  ]);
  const [CornerLShape, setCornerLShape] = useState([
    {
      position: [
        LshapeBXPosition - lShapeBHeight / 2,
        -4 / 2 / 5,
        -lShapeWidth / 2 + 3 / 2,
      ],
      used: false,
    }, //left top  (TOP)
    {
      position: [
        LshapeBXPosition - lShapeBHeight / 2,
        -4 / 2 / 5,
        lShapeWidth / 2 - 3 / 2,
      ],
      used: false,
    }, //left bottom (LEFT)
    {
      position: [
        LshapeBXPosition + lShapeBHeight / 2,
        -4 / 2 / 5,
        lShapeWidth / 2 - 3 / 2,
      ],
      used: false,
    }, //right bottom (RIGHT)
    {
      position: [
        -lShapeWidth / 2 + 3 / 2,
        -4 / 2 / 5,
        LshapeTZPosition - lShapeTHeight / 2,
      ],
      used: false,
    }, //Left Top (tLeft)
    {
      position: [
        lShapeWidth / 2 - 3 / 2,
        -4 / 2 / 5,
        LshapeTZPosition + lShapeTHeight / 2,
      ],
      used: false,
    }, //Right Top (tRight)
  ]);
  const [fountainLShape, setfountainLShape] = useState([
    {
      position: [LshapeBXPosition - lShapeBHeight / 2, 0, 0],
      used: false,
    }, //BOTTOM - left
    // {
    //   position: [poolwidth / 2 - boxWidth / 2, 0, 0],
    //   used: false,
    // }, //BOTTOM - right Doesnt Exist
    {
      position: [LshapeBXPosition, 0, -lShapeWidth / 2 + boxDepth / 2],
      used: false,
    }, //BOTTOM - top
    {
      position: [LshapeBXPosition, 0, lShapeWidth / 2 - boxDepth / 2],
      used: false,
    }, //BOTTOM - bottom
    // ---------------------------------------------------------------------- //
    {
      position: [-lShapeWidth / 2, 0, LshapeTZPosition],
      used: false,
    }, //TOP - left
    {
      position: [lShapeWidth / 2, 0, LshapeTZPosition],
      used: false,
    }, //TOP - right
    {
      position: [
        0,
        lShapeDepth / 2,
        LshapeTZPosition - lShapeTHeight / 2 + boxDepth / 2,
      ],
      used: false,
    }, //TOP - top
    // {
    //   position: [
    //     0,
    //     lShapeDepth / 2,
    //     LshapeTZPosition + lShapeTHeight / 2 - boxDepth / 2,
    //   ],
    //   used: false,
    // }, //TOP - bottom Doesnt Exist
  ]);
  const [swimJetLShape, setswimJetLShape] = useState([
    {
      position: [
        LshapeBXPosition - lShapeTHeight / 2 + swimJetBoxWidth / 2,
        -lShapeDepth / 2 + swimJetBoxHeight / 2,
        0,
      ],
      used: false,
    }, //BOTTOM - left
    {
      position: [
        LshapeBXPosition,
        -lShapeDepth / 2 + swimJetBoxHeight / 2,
        -lShapeWidth / 2 + swimJetBoxWidth / 2,
      ],
      used: false,
    }, //BOTTOM - top
    {
      position: [
        LshapeBXPosition,
        -lShapeDepth / 2 + swimJetBoxHeight / 2,
        -lShapeWidth / 2 + swimJetBoxWidth / 2,
      ],
      used: false,
    }, //BOTTOM - bottom
    // ---------------------------------------------------------------------- //
    {
      position: [
        -lShapeWidth / 2 + swimJetBoxWidth / 2,
        -lShapeDepth / 2 + swimJetBoxHeight / 2,
        LshapeTZPosition,
      ],
      used: false,
    }, //TOP - left
    {
      position: [
        lShapeWidth / 2 - swimJetBoxWidth / 2,
        -lShapeDepth / 2 + swimJetBoxHeight / 2,
        LshapeTZPosition,
      ],
      used: false,
    }, //TOP - right
    {
      position: [
        0,
        -lShapeDepth / 2 + swimJetBoxHeight / 2,
        LshapeTZPosition - lShapeTHeight / 2 + swimJetBoxWidth / 2,
      ],
      used: false,
    }, //TOP - top
  ]);
  const [infinityEdgeLShape, setinfinityEdgeLShape] = useState([
    {
      position: [
        LshapeBXPosition - lShapeTHeight / 2 + infinityEdgeBoxWidth / 2,
        infinityEdgeBoxHeight / 2,
        0,
      ],
      used: false,
    }, //BOTTOM - left
    {
      position: [
        LshapeBXPosition,
        infinityEdgeBoxHeight / 2,
        -lShapeWidth / 2 - infinityEdgeBoxWidth / 2,
      ],
      used: false,
    }, //BOTTOM - top
    {
      position: [
        LshapeBXPosition,
        infinityEdgeBoxHeight / 2,
        lShapeWidth / 2 + infinityEdgeBoxWidth / 2,
      ],
      used: false,
    }, //BOTTOM - bottom
    // ---------------------------------------------------------------------- //
    {
      position: [
        -lShapeWidth / 2 - infinityEdgeBoxWidth / 2,
        infinityEdgeBoxHeight / 2,
        LshapeTZPosition,
      ],
      used: false,
    }, //TOP - left
    {
      position: [
        lShapeWidth / 2 + infinityEdgeBoxWidth / 2,
        infinityEdgeBoxHeight / 2,
        LshapeTZPosition,
      ],
      used: false,
    }, //TOP - right
    {
      position: [
        0,
        infinityEdgeBoxHeight / 2,
        LshapeTZPosition - lShapeTHeight / 2 - infinityEdgeBoxWidth / 2,
      ],
      used: false,
    }, //TOP - top
  ]);
  const [beachLShape, setbeachLShape] = useState([
    {
      position: [LshapeBXPosition - lShapeBHeight / 2, -0.5, 0],
      used: false,
    }, //BOTTOM - left
    {
      position: [LshapeBXPosition, 0, -lShapeWidth / 2 + boxDepth / 2],
      used: false,
    }, //BOTTOM - top
    {
      position: [LshapeBXPosition, 0, lShapeWidth / 2 - boxDepth / 2],
      used: false,
    }, //BOTTOM - bottom
    // ---------------------------------------------------------------------- //
    {
      position: [-lShapeWidth / 2, 0, LshapeTZPosition],
      used: false,
    }, //TOP - left
    {
      position: [lShapeWidth / 2, 0, LshapeTZPosition],
      used: false,
    }, //TOP - right
    {
      position: [
        0,
        lShapeDepth / 2,
        LshapeTZPosition - lShapeTHeight / 2 + boxDepth / 2,
      ],
      used: false,
    }, //TOP - top
  ]);
  const [LightLShape, setLightLShape] = useState([
    {
      position: [
        LshapeBXPosition - lShapeTHeight / 2,
        -lShapeDepth / 2 + 0.01,
        0,
      ],
      used: false,
    }, //BOTTOM - left
    {
      position: [LshapeBXPosition, -lShapeDepth / 2 + 0.01, -lShapeWidth / 2],
      used: false,
    }, //BOTTOM - top
    {
      position: [LshapeBXPosition, -lShapeDepth / 2 + 0.01, -lShapeWidth / 2],
      used: false,
    }, //BOTTOM - bottom
    // ---------------------------------------------------------------------- //
    {
      position: [-lShapeWidth / 2, -lShapeDepth / 2 + 0.01, LshapeTZPosition],
      used: false,
    }, //TOP - left
    {
      position: [
        lShapeWidth / 2 - swimJetBoxWidth / 2,
        -lShapeDepth / 2 + 0.01,
        LshapeTZPosition,
      ],
      used: false,
    }, //TOP - right
    {
      position: [
        0,
        -lShapeDepth / 2 + 0.01,
        LshapeTZPosition - lShapeTHeight / 2,
      ],
      used: false,
    }, //TOP - top
  ]);

  const [SnappingPosition, setSnappingPosition] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [ClosestIndex, setClosestIndex] = useState(0);
  const [ClosestPoolIndex, setClosestPoolIndex] = useState(0);
  const [ClosestPoolType, setClosestPoolType] = useState<string>("");
  // ------- //
  const OnPointerMoveHandler = (e: ThreeEvent<PointerEvent>) => {
    let pointer = { x: e.point.x, y: e.point.y, z: e.point.z };
    let RotationY = 0;

    if (help.mouseDown) {
      dispatch(setHelper({ dragging: true }));
      if (
        type != "pool" &&
        type != "hottub" &&
        type != "cyl" &&
        type != "squarepool" &&
        type != "lshape"
      ) {
        // find closest pool
        let dist = Infinity;
        let closestPool: PoolType = Pools[0];
        Pools?.map((pool, index) => {
          if (
            pool.poolType != "hottub" ||
            ((type === "SwimJet" || type === "RegularJets") &&
              pool.poolType === "hottub")
          ) {
            const temp = Math.sqrt(
              Math.pow(e.point.x - pool.sPosition[0], 2) +
                Math.pow(e.point.y - pool.sPosition[1], 2) +
                Math.pow(e.point.z - pool.sPosition[2], 2)
            );
            if (temp < dist) {
              dist = temp;
              closestPool = pool;
              setClosestPoolIndex(index);
            }
          }
        });

        // find closest snap area according to type
        if (closestPool) {
          setClosestPoolType(closestPool.poolType);
          // console.log("closestPool ::", closestPool);
          RotationY = closestPool.sRotation[1];
          if (closestPool.poolType === "lshape") {
            LshapeTZPosition = -closestPool.tHeight / 2 + closestPool.width / 2;
            LshapeBXPosition = -closestPool.bHeight / 2 + closestPool.width / 2;
            setstairsLShape([
              {
                position: [
                  LshapeBXPosition - closestPool.bHeight / 2,
                  -closestPool.depth / 2,
                  0,
                ],
                used: false,
              }, //BOTTOM - left
              {
                position: [
                  LshapeBXPosition - closestPool.width / 2,
                  -closestPool.depth / 2,
                  -closestPool.width / 2 + boxDepth / 2,
                ],
                used: false,
              }, //BOTTOM - top
              {
                position: [
                  LshapeBXPosition,
                  -closestPool.depth / 2,
                  closestPool.width / 2 - boxDepth / 2,
                ],
                used: false,
              }, //BOTTOM - bottom
              // ---------------------------------------------------------------------- //
              {
                position: [
                  -closestPool.width / 2,
                  -closestPool.depth / 2,
                  LshapeTZPosition - closestPool.width / 2,
                ],
                used: false,
              }, //TOP - left
              {
                position: [
                  closestPool.width / 2,
                  -closestPool.depth / 2,
                  LshapeTZPosition,
                ],
                used: false,
              }, //TOP - right
              {
                position: [
                  0,
                  -closestPool.depth / 2,
                  LshapeTZPosition - closestPool.tHeight / 2 + boxDepth / 2,
                ],
                used: false,
              }, //TOP - top
            ]);
            setCornerLShape([
              {
                position: [
                  LshapeBXPosition - closestPool.bHeight / 2,
                  -height - 4 / 2 / 5 - 0.3,
                  -closestPool.width / 2,
                ],
                used: false,
              }, //left top  (TOP)
              {
                position: [
                  LshapeBXPosition - closestPool.bHeight / 2,
                  -height - 4 / 2 / 5 - 0.3,
                  closestPool.width / 2,
                ],
                used: false,
              }, //left bottom (LEFT)
              {
                position: [
                  LshapeBXPosition + closestPool.bHeight / 2,
                  -height - 4 / 2 / 5 - 0.3,
                  closestPool.width / 2,
                ],
                used: false,
              }, //right bottom (RIGHT)
              {
                position: [
                  -closestPool.width / 2,
                  -height - 4 / 2 / 5 - 0.3,
                  LshapeTZPosition - closestPool.tHeight / 2,
                ],
                used: false,
              }, //Left Top (tLeft)
              {
                position: [
                  closestPool.width / 2,
                  -height - 4 / 2 / 5 - 0.3,
                  LshapeTZPosition - closestPool.tHeight / 2,
                ],
                used: false,
              }, //Right Top (tRight)
            ]);
            setfountainLShape([
              {
                position: [
                  LshapeBXPosition - closestPool.bHeight / 2,
                  borderHeight / 2,
                  0,
                ],
                used: false,
              }, //BOTTOM - left
              {
                position: [
                  LshapeBXPosition - closestPool.width / 2,
                  borderHeight / 2,
                  -closestPool.width / 2 + 0,
                ],
                used: false,
              }, //BOTTOM - top
              {
                position: [
                  LshapeBXPosition,
                  borderHeight / 2,
                  closestPool.width / 2 - 0,
                ],
                used: false,
              }, //BOTTOM - bottom
              // ---------------------------------------------------------------------- //
              {
                position: [
                  -closestPool.width / 2,
                  borderHeight / 2,
                  LshapeTZPosition - closestPool.width / 2,
                ],
                used: false,
              }, //TOP - left
              {
                position: [
                  closestPool.width / 2,
                  borderHeight / 2,
                  LshapeTZPosition,
                ],
                used: false,
              }, //TOP - right
              {
                position: [
                  0,
                  borderHeight / 2,
                  LshapeTZPosition - closestPool.tHeight / 2 + 0,
                ],
                used: false,
              }, //TOP - top
            ]);
            setswimJetLShape([
              {
                position: [
                  LshapeBXPosition - closestPool.bHeight / 2,
                  -closestPool.depth / 2 + swimJetBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //BOTTOM - left
              {
                position: [
                  LshapeBXPosition - closestPool.width / 2,
                  -closestPool.depth / 2 + swimJetBoxHeight / 2,
                  -closestPool.width / 2,
                ],
                used: false,
              }, //BOTTOM - top
              {
                position: [
                  LshapeBXPosition,
                  -closestPool.depth / 2 + swimJetBoxHeight / 2,
                  closestPool.width / 2,
                ],
                used: false,
              }, //BOTTOM - bottom
              // ---------------------------------------------------------------------- //
              {
                position: [
                  -closestPool.width / 2,
                  -closestPool.depth / 2 + swimJetBoxHeight / 2,
                  LshapeTZPosition - closestPool.width / 2,
                ],
                used: false,
              }, //TOP - left
              {
                position: [
                  closestPool.width / 2,
                  -closestPool.depth / 2 + swimJetBoxHeight / 2,
                  LshapeTZPosition,
                ],
                used: false,
              }, //TOP - right
              {
                position: [
                  0,
                  -closestPool.depth / 2 + swimJetBoxHeight / 2,
                  LshapeTZPosition - closestPool.tHeight / 2,
                ],
                used: false,
              }, //TOP - top
            ]);
            setinfinityEdgeLShape([
              {
                position: [
                  LshapeBXPosition -
                    closestPool.bHeight / 2 -
                    infinityEdgeBoxWidth / 2,
                  infinityEdgeBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //BOTTOM - left
              {
                position: [
                  LshapeBXPosition - closestPool.width / 2,
                  infinityEdgeBoxHeight / 2,
                  -closestPool.width / 2 - infinityEdgeBoxWidth / 2,
                ],
                used: false,
              }, //BOTTOM - top
              {
                position: [
                  LshapeBXPosition,
                  infinityEdgeBoxHeight / 2,
                  closestPool.width / 2 + infinityEdgeBoxWidth / 2,
                ],
                used: false,
              }, //BOTTOM - bottom
              // ---------------------------------------------------------------------- //
              {
                position: [
                  -closestPool.width / 2 - infinityEdgeBoxWidth / 2,
                  infinityEdgeBoxHeight / 2,
                  LshapeTZPosition - closestPool.width / 2,
                ],
                used: false,
              }, //TOP - left
              {
                position: [
                  closestPool.width / 2 + infinityEdgeBoxWidth / 2,
                  infinityEdgeBoxHeight / 2,
                  LshapeTZPosition,
                ],
                used: false,
              }, //TOP - right
              {
                position: [
                  0,
                  infinityEdgeBoxHeight / 2,
                  LshapeTZPosition -
                    closestPool.tHeight / 2 -
                    infinityEdgeBoxWidth / 2,
                ],
                used: false,
              }, //TOP - top
            ]);
            setbeachLShape([
              {
                position: [LshapeBXPosition - closestPool.bHeight / 2, -0.5, 0],
                used: false,
              }, //BOTTOM - left
              {
                position: [
                  LshapeBXPosition - closestPool.width / 2,
                  -0.5,
                  -closestPool.width / 2 + 0,
                ],
                used: false,
              }, //BOTTOM - top
              {
                position: [LshapeBXPosition, -0.5, closestPool.width / 2 - 0],
                used: false,
              }, //BOTTOM - bottom
              // ---------------------------------------------------------------------- //
              {
                position: [
                  -closestPool.width / 2,
                  -0.5,
                  LshapeTZPosition - closestPool.width / 2,
                ],
                used: false,
              }, //TOP - left
              {
                position: [closestPool.width / 2, -0.5, LshapeTZPosition],
                used: false,
              }, //TOP - right
              {
                position: [
                  0,
                  -0.5,
                  LshapeTZPosition - closestPool.tHeight / 2 + 0,
                ],
                used: false,
              }, //TOP - top
            ]);
            setLightLShape([
              {
                position: [
                  LshapeBXPosition - closestPool.bHeight / 2 + 0.01,
                  -closestPool.sDepth + swimJetBoxWidth / 3,
                  0,
                ],
                used: false,
              }, //BOTTOM - left
              {
                position: [
                  LshapeBXPosition - closestPool.width / 2,
                  -closestPool.sDepth + swimJetBoxWidth / 3,
                  -closestPool.width / 2 + 0.01,
                ],
                used: false,
              }, //BOTTOM - top
              {
                position: [
                  LshapeBXPosition,
                  -closestPool.sDepth + swimJetBoxWidth / 3,
                  closestPool.width / 2 - 0.01,
                ],
                used: false,
              }, //BOTTOM - bottom
              // ---------------------------------------------------------------------- //
              {
                position: [
                  -closestPool.width / 2 + 0.01,
                  -closestPool.sDepth + swimJetBoxWidth / 3,
                  LshapeTZPosition - closestPool.width / 2,
                ],
                used: false,
              }, //TOP - left
              {
                position: [
                  closestPool.width / 2 - 0.01,
                  -closestPool.sDepth + swimJetBoxWidth / 3,
                  LshapeTZPosition,
                ],
                used: false,
              }, //TOP - right
              {
                position: [
                  0,
                  -closestPool.sDepth + swimJetBoxWidth / 3,
                  LshapeTZPosition - closestPool.tHeight / 2 + 0.01,
                ],
                used: false,
              }, //TOP - top
            ]);
            switch (true) {
              case type === "SquareSteps" ||
                type === "RoundSteps" ||
                type === "Steps":
                const available = stairsLShape.filter(
                  (stair) => stair.used === false
                );
                if (available.length > 0) {
                  const res = GetClosestLShape(
                    available,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "cornerRounded":
                const availableCorner = CornerLShape.filter(
                  (obj) => obj.used === false
                );
                if (availableCorner.length > 0) {
                  const res = GetClosestLShapeCorner(
                    availableCorner,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "Fountain" ||
                type === "WallWaterfall" ||
                type === "Waterblade":
                const availableFountain = fountainLShape.filter(
                  (obj) => obj.used === false
                );
                if (availableFountain.length > 0) {
                  const res = GetClosestLShape(
                    availableFountain,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "SwimJet" || type === "RegularJets":
                const availableSwimJet = swimJetLShape.filter(
                  (obj) => obj.used === false
                );
                if (availableSwimJet.length > 0) {
                  const res = GetClosestLShape(
                    availableSwimJet,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "InfinityEdge":
                const availableInfinityEdge = infinityEdgeLShape.filter(
                  (obj) => obj.used === false
                );
                if (availableInfinityEdge.length > 0) {
                  const res = GetClosestLShape(
                    availableInfinityEdge,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "insetSteps" || type === "beachEntry":
                const availableBeach = beachLShape.filter(
                  (obj) => obj.used === false
                );
                if (availableBeach.length > 0) {
                  const res = GetClosestLShape(
                    availableBeach,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "light":
                const availableLight = LightLShape.filter(
                  (obj) => obj.used === false
                );
                if (availableLight.length > 0) {
                  const res = GetClosestLShape(
                    availableLight,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1] - 1,
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
            }
          } else {
            setCorner([
              {
                position: [
                  -closestPool.width / 2 + 3 / 2 / 5,
                  -height + 4 / 2 / 5,
                  -closestPool.depth / 2 + 4 / 2 / 5,
                ],
                used: false,
              }, //left
              {
                position: [
                  closestPool.width / 2 - 3 / 2 / 5,
                  -height + 4 / 2 / 5,
                  -closestPool.depth / 2 + 4 / 2 / 5,
                ],
                used: false,
              }, //right
              {
                position: [
                  -closestPool.width / 2 + 3 / 2 / 5,
                  -height + 4 / 2 / 5,
                  closestPool.depth / 2 - 4 / 2 / 5,
                ],
                used: false,
              }, //top
              {
                position: [
                  closestPool.width / 2 - 3 / 2 / 5,
                  -height + 4 / 2 / 5,
                  closestPool.depth / 2 - 4 / 2 / 5,
                ],
                used: false,
              }, //bottom
            ]);
            setstairs([
              {
                position: [-closestPool.width / 2 + boxWidth / 2, 0, 0],
                used: false,
              }, //left
              {
                position: [closestPool.width / 2 - boxWidth / 2, 0, 0],
                used: false,
              }, //right
              {
                position: [0, 0, -closestPool.depth / 2 + boxDepth / 2],
                used: false,
              }, //top
              {
                position: [0, 0, closestPool.depth / 2 - boxDepth / 2],
                used: false,
              }, //bottom
            ]);
            setswimJet([
              {
                position: [
                  -closestPool.width / 2 + 0,
                  -closestPool.sHeight / 2 + swimJetBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //left
              {
                position: [
                  closestPool.width / 2 - 0,
                  -closestPool.sHeight / 2 + swimJetBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //right
              {
                position: [
                  0,
                  -closestPool.sHeight / 2 + swimJetBoxHeight / 2,
                  -closestPool.depth / 2 + 0,
                ],
                used: false,
              }, //top
              {
                position: [
                  0,
                  -closestPool.sHeight / 2 + swimJetBoxHeight / 2,
                  closestPool.depth / 2 - 0,
                ],
                used: false,
              }, //bottom
            ]);
            setinfinityEdge([
              {
                position: [
                  -closestPool.width / 2 - infinityEdgeBoxWidth,
                  infinityEdgeBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //left
              {
                position: [
                  closestPool.width / 2 + infinityEdgeBoxWidth,
                  infinityEdgeBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //right
              {
                position: [
                  0,
                  infinityEdgeBoxHeight / 2,
                  -closestPool.depth / 2 - infinityEdgeBoxWidth,
                ],
                used: false,
              }, //top
              {
                position: [
                  0,
                  infinityEdgeBoxHeight / 2,
                  closestPool.depth / 2 + infinityEdgeBoxWidth,
                ],
                used: false,
              }, //bottom
            ]);
            setfountain([
              {
                position: [
                  -closestPool.width / 2 - 0,
                  waterFallBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //left
              {
                position: [
                  closestPool.width / 2 + 0,
                  waterFallBoxHeight / 2,
                  0,
                ],
                used: false,
              }, //right
              {
                position: [
                  0,
                  waterFallBoxHeight / 2,
                  -closestPool.depth / 2 - 0,
                ],
                used: false,
              }, //top
              {
                position: [
                  0,
                  waterFallBoxHeight / 2,
                  closestPool.depth / 2 + 0,
                ],
                used: false,
              }, //bottom
            ]);
            setbeach([
              { position: [-closestPool.width / 2, -0.5, 0], used: false }, //left
              { position: [closestPool.width / 2, -0.5, 0], used: false }, //right
              { position: [0, -0.5, -closestPool.depth / 2], used: false }, //top
              { position: [0, -0.5, closestPool.depth / 2], used: false }, //bottom
            ]);
            setLight([
              {
                position: [
                  -closestPool.width / 2 + 0.01,
                  -closestPool.sHeight + swimJetBoxWidth / 3,
                  0,
                ],
                used: false,
              }, //left
              {
                position: [
                  closestPool.width / 2 - 0.01,
                  -closestPool.sHeight + swimJetBoxWidth / 3,
                  0,
                ],
                used: false,
              }, //right
              {
                position: [
                  0,
                  -closestPool.sHeight + swimJetBoxWidth / 3,
                  -closestPool.depth / 2 + 0.01,
                ],
                used: false,
              }, //top
              {
                position: [
                  0,
                  -closestPool.sHeight + swimJetBoxWidth / 3,
                  closestPool.depth / 2 - 0.01,
                ],
                used: false,
              }, //bottom
            ]);
            BenchYPosition = -closestPool.sHeight + BenchHeight / 2;
            // setCornerStep([
            //   {
            //     position: [-closestPool.width / 2, cornerHeightPosition, -closestPool.sHeight / 2],
            //     used: false,
            //   }, //left (TopLeft)
            //   {
            //     position: [-closestPool.width / 2,
            //     cornerHeightPosition,
            //     closestPool.sHeight / 2],
            //     used: false,
            //   }, //right (TopRight)
            //   {
            //     position: [ closestPool.width / 2,
            //     cornerHeightPosition,
            //     closestPool.sHeight / 2],
            //     used: false,
            //   }, //top (BottomRight)
            //   {
            //     position: [ -closestPool.width / 2,
            //     cornerHeightPosition,
            //     closestPool.sHeight / 2],
            //     used: false,
            //   }, //bottom (BottomLeft)
            //   // ------ ------ ------ //
            //   {
            //     position: [ -closestPool.width / 2 + BenchDepth,
            //     cornerHeightBottomPosition,
            //     -closestPool.sHeight / 2 + BenchDepth],
            //     used: false,
            //   }, //bottomleft (TopLeft)
            //   {
            //     position: [ closestPool.width / 2 - BenchDepth,
            //     cornerHeightBottomPosition,
            //     -closestPool.sHeight / 2 + BenchDepth],
            //     used: false,
            //   }, //bottomright (TopRight)
            //   {
            //     position: [closestPool.width / 2 - BenchDepth,
            //     cornerHeightBottomPosition,
            //     closestPool.sHeight / 2 - BenchDepth,],
            //     used: false,
            //   }, //bottomtop (BottomRight)
            //   {
            //     position: [ -closestPool.width / 2 + BenchDepth,
            //     cornerHeightBottomPosition,
            //     closestPool.sHeight / 2 - BenchDepth],
            //     used: false,
            //   }, //bottombottom (BottomLeft)
            // ]);
            switch (true) {
              case type === "SquareSteps" ||
                type === "RoundSteps" ||
                type === "Steps":
                const available = stairs.filter(
                  (stair) => stair.used === false
                );
                if (available.length > 0) {
                  const res = GetClosest(
                    available,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "SwimJet" || type === "RegularJets":
                const availableSwimJet = swimJet.filter(
                  (obj) => obj.used === false
                );
                if (swimJet.length > 0 && availableSwimJet.length > 0) {
                  const res = GetClosest(
                    swimJet,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                } else {
                  setSnappingPosition(null);
                  pointer = {
                    x: 0,
                    y: -5,
                    z: 0,
                  };
                }
                break;
              case type === "InfinityEdge":
                const availableInfinityEdge = infinityEdge.filter(
                  (obj) => obj.used === false
                );
                if (availableInfinityEdge.length > 0) {
                  const res = GetClosest(
                    availableInfinityEdge,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "Fountain" ||
                type === "WallWaterfall" ||
                type === "Waterblade":
                const availableFountain = fountain.filter(
                  (obj) => obj.used === false
                );
                if (availableFountain.length > 0) {
                  const res = GetClosest(
                    availableFountain,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "cornerRounded":
                const availableCorner = Corner.filter(
                  (obj) => obj.used === false
                );
                if (availableCorner.length > 0) {
                  const res = GetClosestCorner(
                    availableCorner,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "insetSteps" || type === "beachEntry":
                const availableBeach = beach.filter(
                  (obj) => obj.used === false
                );
                if (availableBeach.length > 0) {
                  const res = GetClosest(
                    availableBeach,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                }
                break;
              case type === "light":
                const availableLights = Light.filter(
                  (obj) => obj.used === false
                );
                if (Light.length > 0 && availableLights.length > 0) {
                  const res = GetClosest(
                    Light,
                    closestPool,
                    setClosestIndex,
                    e
                  );
                  pointer = {
                    x: res.closest.position[0],
                    y: res.closest.position[1],
                    z: res.closest.position[2],
                  };
                  setSnappingPosition(pointer);
                  pointer = {
                    x: res.closestObj.position.x,
                    y: res.closestObj.position.y,
                    z: res.closestObj.position.z,
                  };
                } else {
                  setSnappingPosition(null);
                  pointer = {
                    x: 0,
                    y: -5,
                    z: 0,
                  };
                }
                break;
              // case type === "cornerStep":
              //   const availableCornerStep = CornerStep.filter(
              //     (obj) => obj.used === false
              //   );
              //   if (CornerStep.length > 0 && availableCornerStep.length > 0) {
              //     const res = GetClosestCornerStep(
              //       CornerStep,
              //       closestPool,
              //       setClosestIndex,
              //       e
              //     );
              //     pointer = {
              //       x: res.closest.position[0],
              //       y: res.closest.position[1],
              //       z: res.closest.position[2],
              //     };
              //     setSnappingPosition(pointer);
              //     pointer = {
              //       x: res.closestObj.position.x,
              //       y: res.closestObj.position.y,
              //       z: res.closestObj.position.z,
              //     };
              //   } else {
              //     setSnappingPosition(null);
              //     pointer = {
              //       x: 0,
              //       y: -5,
              //       z: 0,
              //     };
              //   }
              //   break;
            }
          }
        }
      }
    } else {
      dispatch(setHelper({ dragging: false }));
    }
    dispatch(setPointer(pointer));
    dispatch(setRotation(RotationY));
  };
  const OnPointerUpHandler = (e: ThreeEvent<PointerEvent>) => {
    if (help.mouseDown) {
      dispatch(setHelper({ mouseDown: false, dragging: false }));
      if (
        type != "pool" &&
        type != "hottub" &&
        type != "squarepool" &&
        type != "cyl" &&
        type != "lshape" &&
        ClosestPoolType === "lshape"
      ) {
        switch (type) {
          case "Steps": // will be replaced
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              // setstairs(temp)
              let rotation = 0;
              let position = [0, 0, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = 0; // 90
                  position[0] = boxWidth / 2;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = 0; //-90
                  position[0] = 0;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = 0; //180
                  position[2] = 0;
                  side = sides.Bottom;
                  break;
                case 3:
                  rotation = 0; //0
                  position[0] = boxWidth / 2;
                  side = sides.tLeft;
                  break;

                case 4:
                  rotation = 0; //0
                  position[0] = -boxWidth / 2;
                  side = sides.tRight;
                  break;

                case 5:
                  rotation = 0; //0
                  position[2] = 0;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    side: side,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "SquareSteps":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              // setstairs(temp)
              let rotation = 0;
              let position = [0, 0, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = 0; // 90
                  position[0] = boxWidth / 2;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = 0; //-90
                  position[2] = 0.05;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = 0; //180
                  position[2] = -0.05;
                  side = sides.Bottom;
                  break;
                case 3:
                  rotation = 0; //0
                  position[0] = boxWidth / 2;
                  side = sides.tLeft;
                  break;

                case 4:
                  rotation = 0; //0
                  position[0] = -boxWidth / 2;
                  side = sides.tRight;
                  break;

                case 5:
                  rotation = 0; //0
                  position[2] = 0.05;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    side: side,
                    rotation: [0, 0, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "RoundSteps":
            if (SnappingPosition) {
              let rotation = 0;
              const offset = boxWidth / 2;
              const offsetZ = boxWidth / 2 + 0.2 / 2;
              let position = [0, 0, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = -offsetZ;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = offsetZ;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[2] = -offset;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[2] = offset;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = -offsetZ;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    side: side,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "cornerRounded":
            if (SnappingPosition) {
              // const temp = Corner
              // temp[ClosestIndex].used = true;
              // setCorner(temp)
              let rotation = 0;
              let position = [0, -0.05, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //Topleft
                  rotation = 0;
                  position[0] = -boxWidth / 2;
                  position[2] = -boxDepth / 2;
                  side = sides.Top;
                  break;
                case 1:
                  //Bottom Left
                  rotation = Math.PI / 2; //-90
                  position[0] = boxWidth / 2;
                  position[2] = -boxDepth / 2;
                  side = sides.Left;
                  break;
                case 2:
                  //bottom Right
                  rotation = -Math.PI; //-90
                  position[2] = boxDepth / 2;
                  position[0] = -boxWidth / 2;
                  side = sides.Right;
                  break;
                case 3:
                  //Top Left
                  rotation = 0; //-90
                  position[2] = boxDepth / 2;
                  position[0] = boxWidth / 2;
                  side = sides.tLeft;
                  break;
                case 4:
                  //Top Right
                  rotation = -Math.PI / 2; //-90
                  position[2] = boxDepth / 2;
                  position[0] = boxWidth / 2;
                  side = sides.tRight;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + 0,
                      SnappingPosition.y + 0,
                      SnappingPosition.z + 0,
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    side: side,
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "Fountain":
            if (SnappingPosition) {
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation = 0;
              let position = [0, -1, 0]; // box height/2 + border height
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = 0.4 / 2 - 0.05;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[0] = 0.4 / 2 - 0.05;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              // switch (ClosestIndex) {
              //   case 0:
              //     //left
              //     rotation = Math.PI / 2; // 90
              //     position[0] = -0.4 / 2 + 0.05;
              //     side = sides.Left;
              //     break;
              //   case 1:
              //     //right
              //     rotation = -Math.PI / 2; //-90
              //     position[0] = 0.4 / 2 - 0.05;
              //     side = sides.Right;
              //     break;
              //   case 2:
              //     rotation = 0; //180
              //     position[2] = -0.4 / 2 + 0.05;
              //     side = sides.Top;
              //     break;
              //   case 3:
              //     rotation = Math.PI; //0
              //     position[2] = 0.4 / 2 - 0.05;
              //     side = sides.Bottom;
              //     break;

              //   default:
              //     break;
              // }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.3, 0.3, 0.3],
                    side: side,
                  },
                })
              );
            }
            break;
          case "WallWaterfall":
            if (SnappingPosition) {
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation = 0;
              let position = [0, -1, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = 0.4 / 2 - 0.05;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[0] = 0.4 / 2 - 0.05;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.4, 0.4, 0.4],
                    side: side,
                  },
                })
              );
            }
            break;
          case "Waterblade":
            if (SnappingPosition) {
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation = 0;
              let position = [0, -1, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = 0.4 / 2 - 0.05;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[0] = 0.4 / 2 - 0.05;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.3, 0.3, 0.3],
                    side: side,
                  },
                })
              );
            }
            break;
          case "SwimJet":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              let side = sides.Left;
              let rotation = 0;
              let position = [0, -1, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0.02;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = 0.02;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = -0.02;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[0] = 0.02;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[0] = -0.02;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = 0.02;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.4, 0.4, 0.4],
                    side: side,
                  },
                })
              );
            }
            break;
          case "RegularJets":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              let side = sides.Left;
              let rotation = 0;
              let position = [0, -1, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0.02;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = 0.02;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = -0.02;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[0] = 0.02;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[0] = -0.02;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = 0.02;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.28, 0.28, 0.28],
                    side: side,
                  },
                })
              );
            }
            break;
          case "InfinityEdge":
            if (SnappingPosition) {
              // const temp = infinityEdge
              // temp[ClosestIndex].used = true;
              // setinfinityEdge(temp)
              let rotation = 0;
              let position = [0, -0.8 / 2 - 1, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = -Math.PI / 2; // 90
                  position[0] = -0.36;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = Math.PI; //180
                  position[2] = -0.36;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = 0; //0
                  position[2] = 0.36;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = -Math.PI / 2; //90
                  position[0] = -0.36;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = Math.PI / 2; //0
                  position[0] = 0.36;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = Math.PI; //0
                  position[2] = -0.36;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 0.3, 0.3],
                    side: side,
                  },
                })
              );
            }
            break;
          case "insetSteps":
            if (SnappingPosition) {
              // const temp = beach
              // temp[ClosestIndex].used = true;
              // setbeach(temp)
              let rotation = 0;
              let position = [0, 0.1, 0]; // box height/2 + border height
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.55;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = -0.55;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = 0.55;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[0] = -0.55;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[0] = 0.55;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = -0.55;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                    side: side,
                  },
                })
              );
            }
            break;
          case "light":
            if (SnappingPosition) {
              let side = sides.Left;
              let rotation = 0;
              let position = [0, 0, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0;
                  side = sides.Left;
                  break;
                case 1:
                  rotation = 0; //180
                  position[2] = 0;
                  side = sides.Top;
                  break;
                case 2:
                  rotation = Math.PI; //0
                  position[2] = 0;
                  side = sides.Bottom;
                  break;

                case 3:
                  rotation = Math.PI / 2; //90
                  position[0] = 0;
                  side = sides.tLeft;
                  break;
                case 4:
                  rotation = -Math.PI / 2; //0
                  position[0] = 0;
                  side = sides.tRight;
                  break;
                case 5:
                  rotation = 0; //0
                  position[2] = 0;
                  side = sides.tTop;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    poolInitialHeight: Pools[ClosestPoolIndex].sDepth,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                    side: side,
                  },
                })
              );
            }
            break;
        }
      } else if (
        type != "pool" &&
        type != "hottub" &&
        type != "cyl" &&
        type != "squarepool" &&
        type != "lshape" &&
        ClosestPoolType === "hottub"
      ) {
        switch (type) {
          case "SwimJet":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              let side = sides.Left;
              let rotation = 0;
              let position = [0, 0, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0.04;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = -0.04;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = 0.04;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = -0.04;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y,
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.4, 0.4, 0.4],
                    side: side,
                  },
                })
              );
            }
            break;
          case "RegularJets":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              let side = sides.Left;
              let rotation = 0;
              let position = [0, 0, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0.04;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = -0.04;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = 0.04;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = -0.04;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y,
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.28, 0.28, 0.28],
                    side: side,
                  },
                })
              );
            }
            break;
          case "light":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              let side = sides.Left;
              let rotation = 0;
              let position = [0, 0, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = 0;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = 0;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = 0;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    poolInitialHeight: Pools[ClosestPoolIndex].sHeight,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y,
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.6, 0.6, 0.6],
                    side: side,
                  },
                })
              );
            }
            break;
        }
      } else {
        switch (type) {
          case "pool":
            dispatch(
              addNewPool({
                poolType: type,
                width: defaults.pool.width,
                height: defaults.pool.height,
                depth: defaults.pool.depth,
                sWidth: defaults.pool.width,
                sHeight: defaults.pool.height,
                sDepth: defaults.pool.depth,
                position: [e.point.x, e.point.y + 0.05, e.point.z],
                scale: [1, 1, 1],
                sPosition: [e.point.x, e.point.y + 0.05, e.point.z],
                sScale: [1, 1, 1],
                sRotation: [0, 0, 0],
                rotation: [0, 0, 0],
                childrens: [],
              })
            );
            break;

          case "squarepool":
            dispatch(
              addNewPool({
                poolType: type,
                width: defaults.squarepool.width,
                height: defaults.squarepool.height,
                depth: defaults.squarepool.depth,
                sWidth: defaults.squarepool.width,
                sHeight: defaults.squarepool.height,
                sDepth: defaults.squarepool.depth,
                position: [e.point.x, e.point.y + 0.05, e.point.z],
                scale: [1, 1, 1],
                sPosition: [e.point.x, e.point.y + 0.05, e.point.z],
                sScale: [1, 1, 1],
                sRotation: [0, 0, 0],
                rotation: [0, 0, 0],
                childrens: [],
              })
            );
            break;
          case "hottub":
            dispatch(
              addNewPool({
                poolType: type,
                width: defaults.hottub.width,
                height: defaults.hottub.height,
                depth: defaults.hottub.depth,
                sWidth: defaults.hottub.width,
                sHeight: defaults.hottub.height,
                sDepth: defaults.hottub.depth,
                position: [e.point.x, e.point.y + 0.05, e.point.z],
                scale: [1, 1, 1],
                sPosition: [e.point.x, e.point.y + 0.05, e.point.z],
                sScale: [1, 1, 1],
                sRotation: [0, 0, 0],
                rotation: [0, 0, 0],
                childrens: [],
                nbSwimJet: defaults.hottub.nbSwimJet,
              })
            );
            // dispatch(addNewPool({poolType:type, width:16, height:5, depth:12, sWidth:16, sHeight:5, sDepth:12, position:[e.point.x,e.point.y + 0.05,e.point.z], scale:[1,1,1], sPosition:[0,0,0], sScale:[1,1,1], sRotation:[0,0,0], rotation:[0,0,0], childrens:[]}))
            break;
          case "lshape":
            dispatch(
              addNewPool({
                poolType: type,
                width: defaults.lshape.width,
                depth: defaults.lshape.depth,
                tHeight: defaults.lshape.theight,
                stHeight: defaults.lshape.theight,
                bHeight: defaults.lshape.bheight,
                sbHeight: defaults.lshape.bheight,
                sWidth: defaults.lshape.width,
                sDepth: defaults.lshape.depth,
                position: [e.point.x, e.point.y + 0.05, e.point.z],
                scale: [1, 1, 1],
                sPosition: [e.point.x, e.point.y + 0.05, e.point.z],
                sScale: [1, 1, 1],
                sRotation: [0, 0, 0],
                rotation: [0, 0, 0],
                childrens: [],
              })
            );
            break;
          case "cyl":
            dispatch(
              addNewPool({
                poolType: type,
                width: defaults.cyl.top,
                height: defaults.cyl.height,
                depth: defaults.cyl.bottom,
                sWidth: defaults.cyl.top,
                sHeight: defaults.cyl.height,
                sDepth: defaults.cyl.bottom,
                position: [e.point.x, e.point.y + 0.05, e.point.z],
                scale: [1, 1, 1],
                childrens: [],
              })
            );
            break;

          case "SwimJet":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              let side = sides.Left;
              let rotation = 0;
              let position = [0, 0, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0.04;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = -0.04;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = 0.04;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = -0.04;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y,
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.4, 0.4, 0.4],
                    side: side,
                  },
                })
              );
            }
            break;
          case "RegularJets":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              let side = sides.Left;
              let rotation = 0;
              let position = [0, 0, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0.04;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = -0.04;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = 0.04;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = -0.04;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y,
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.28, 0.28, 0.28],
                    side: side,
                  },
                })
              );
            }
            break;

          case "WallWaterfall":
            if (SnappingPosition) {
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation = 0;
              let position = [0, -0.4 / 2, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = 0.4 / 2 - 0.05;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = -0.4 / 2 - 0.05;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = 0.4 / 2 + 0.05;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.4, 0.4, 0.4],
                    side: side,
                  },
                })
              );
            }
            break;
          case "Waterblade":
            if (SnappingPosition) {
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation = 0;
              let position = [0, -0.4 / 2, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = 0.4 / 2 - 0.05;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = 0.4 / 2 - 0.05;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.3, 0.3, 0.3],
                    side: side,
                  },
                })
              );
            }
            break;
          case "Steps": // will be replaced
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              // setstairs(temp)
              let rotation = 0;
              let position = [0, 0, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = 0; // 90
                  position[0] = 0;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = 0; //-90
                  position[0] = 0;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //180
                  position[2] = 0;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = 0; //0
                  position[2] = 0;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    side: side,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "cornerRounded":
            if (SnappingPosition) {
              // const temp = Corner
              // temp[ClosestIndex].used = true;
              // setCorner(temp)
              let rotation = 0;
              let position = [0, -0.05, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //Topleft
                  rotation = 0;
                  position[0] = -boxWidth / 2;
                  position[2] = -boxDepth / 2;
                  side = sides.Left;
                  break;
                case 1:
                  //Top right
                  rotation = -Math.PI / 2; //-90
                  position[0] = boxWidth / 2;
                  position[2] = -boxDepth / 2;
                  side = sides.Right;
                  break;
                case 2:
                  //bottom Left
                  rotation = Math.PI / 2; //-90
                  position[2] = boxDepth / 2;
                  position[0] = -boxWidth / 2;
                  side = sides.Top;
                  break;
                case 3:
                  //bottom Right
                  rotation = -Math.PI; //-90
                  position[2] = boxDepth / 2;
                  position[0] = boxWidth / 2;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    side: side,
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "InfinityEdge":
            if (SnappingPosition) {
              // const temp = infinityEdge
              // temp[ClosestIndex].used = true;
              // setinfinityEdge(temp)
              let rotation = 0;
              let position = [0, 0, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = -Math.PI / 2; // 90
                  position[0] = -0.36;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = Math.PI / 2; //-90
                  position[0] = 0.36;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = Math.PI; //180
                  position[2] = -0.36;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = 0; //0
                  position[2] = 0.36;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y - 0.8 / 2,
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 0.3, 0.3],
                    side: side,
                  },
                })
              );
            }
            break;
          case "Fountain":
            if (SnappingPosition) {
              // const temp = fountain
              // temp[ClosestIndex].used = true;
              // setfountain(temp)
              let rotation = 0;
              let position = [0, -0.4 / 2, 0]; // box height/2 + border height
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.4 / 2 + 0.05;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = 0.4 / 2 - 0.05;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //180
                  position[2] = -0.4 / 2 + 0.05;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //0
                  position[2] = 0.4 / 2 - 0.05;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.3, 0.3, 0.3],
                    side: side,
                  },
                })
              );
            }
            break;
          case "SquareSteps":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              // setstairs(temp)
              let rotation = 0;
              let position = [0, 0, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = 0; // 90
                  position[0] = 0;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = 0; //-90
                  position[0] = 0;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //180
                  position[2] = 0;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = 0; //0
                  position[2] = 0;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    side: side,
                    rotation: [0, 0, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "RoundSteps":
            if (SnappingPosition) {
              // const temp = stairs
              // temp[ClosestIndex].used = true;
              // setstairs(temp)
              //boxWidth/2 +gap/2
              let rotation = 0;
              const offset = boxWidth / 2;
              const offsetZ = boxWidth / 2 + 0.2 / 2;
              let position = [0, 0, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -offset;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = offset;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //180
                  position[2] = -offsetZ;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //0
                  position[2] = offsetZ;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    side: side,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [1, 1, 1],
                  },
                })
              );
            }
            break;
          case "insetSteps":
            if (SnappingPosition) {
              // const temp = beach
              // temp[ClosestIndex].used = true;
              // setbeach(temp)
              let rotation = 0;
              let position = [0, 0.22, 0];
              let side = sides.Left;
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = -0.36;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = 0.36;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = Math.PI; //180
                  position[2] = -0.36;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //0
                  position[2] = 0.36;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    rotation: [Math.PI / 2, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y + position[1],
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.7, 0.7, 0.7],
                    side: side,
                  },
                })
              );
            }
            break;
          case "light":
            if (SnappingPosition) {
              let side = sides.Left;
              let rotation = 0;
              let position = [0, 0, 0];
              switch (ClosestIndex) {
                case 0:
                  //left
                  rotation = Math.PI / 2; // 90
                  position[0] = 0;
                  side = sides.Left;
                  break;
                case 1:
                  //right
                  rotation = -Math.PI / 2; //-90
                  position[0] = 0;
                  side = sides.Right;
                  break;
                case 2:
                  rotation = 0; //-90
                  position[2] = 0;
                  side = sides.Top;
                  break;
                case 3:
                  rotation = Math.PI; //-90
                  position[2] = 0;
                  side = sides.Bottom;
                  break;

                default:
                  break;
              }
              // setswimJet(temp)
              dispatch(
                addChildren({
                  poolIndex: ClosestPoolIndex,
                  children: {
                    shapeType: type,
                    poolInitialHeight: Pools[ClosestPoolIndex].sHeight,
                    rotation: [0, rotation, 0],
                    position: [
                      SnappingPosition.x + position[0],
                      SnappingPosition.y,
                      SnappingPosition.z + position[2],
                    ],
                    sPosition: [0, 0, 0],
                    sScale: [1, 1, 1],
                    sRotation: [0, 0, 0],
                    scale: [0.6, 0.6, 0.6],
                    side: side,
                  },
                })
              );
            }
            break;
          // case "cornerStep":
          //     if (SnappingPosition) {
          //       let rotation = 0;
          //       let position = [0, 0, 0];
          //       let side = sides.Left;
          //       switch (ClosestIndex) {
          //         case 0:

          //           side = sides.Left;
          //           break;
          //         case 1:

          //           side = sides.Right;
          //           break;
          //         case 2:

          //           side = sides.Top;
          //           break;
          //         case 3:

          //           side = sides.Bottom;
          //           break;

          //         case 4:

          //           side = sides.BottomLeft;
          //           break;
          //         case 5:

          //           side = sides.BottomRight;
          //           break;
          //         case 6:

          //           side = sides.BottomTop;
          //           break;
          //         case 7:

          //           side = sides.BottomBottom;
          //           break;
          //       }
          //       dispatch(
          //         addChildren({
          //           poolIndex: ClosestPoolIndex,
          //           children: {
          //             shapeType: type,
          //             rotation: [0, rotation, 0],
          //             position: [
          //               SnappingPosition.x + position[0],
          //               SnappingPosition.y + position[1],
          //               SnappingPosition.z + position[2],
          //             ],
          //             sPosition: [0, 0, 0],
          //             sScale: [1, 1, 1],
          //             sRotation: [0, 0, 0],
          //             side: side,
          //             scale: [1, 1, 1],
          //           },
          //         })
          //       );
          //     }
          //     break;
        }
      }
    }
  };

  return (
    <mesh
      dispose={null}
      onClick={(e) => {
        if (visibility) dispatch(setPivotVisibility(false));
      }}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={1}
      position={[0, 0, 0]}
      onPointerUp={(e) => OnPointerUpHandler(e)}
      onPointerMove={(e) => OnPointerMoveHandler(e)}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial map={textureMap} {...stencil} />
    </mesh>
  );
};

function rotateAboutPoint(
  obj: THREE.Object3D,
  point: THREE.Vector3,
  axis: THREE.Vector3,
  theta: number,
  pointIsWorld: boolean
): THREE.Object3D {
  pointIsWorld = pointIsWorld === undefined ? false : pointIsWorld;

  if (pointIsWorld && obj?.parent) {
    obj?.parent?.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if (pointIsWorld && obj?.parent) {
    obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  obj.rotateOnAxis(axis, theta);
  return obj; // rotate the OBJECT
}

function RotateAroundPoint2(
  Rotation: number[],
  Position: number[],
  RotationPoint: number[]
) {
  let obj = new THREE.Object3D();
  const radiansX = THREE.MathUtils.degToRad(Rotation[0]);
  const radiansY = THREE.MathUtils.degToRad(Rotation[1]);
  const radiansZ = THREE.MathUtils.degToRad(Rotation[2]);
  obj.position.copy(new THREE.Vector3(Position[0], Position[1], Position[2]));
  obj = rotateAboutPoint(
    obj,
    new THREE.Vector3(RotationPoint[0], RotationPoint[1], RotationPoint[2]),
    new THREE.Vector3(1, 0, 0),
    radiansX,
    true
  );
  obj = rotateAboutPoint(
    obj,
    new THREE.Vector3(RotationPoint[0], RotationPoint[1], RotationPoint[2]),
    new THREE.Vector3(0, 1, 0),
    radiansY,
    true
  );
  obj = rotateAboutPoint(
    obj,
    new THREE.Vector3(RotationPoint[0], RotationPoint[1], RotationPoint[2]),
    new THREE.Vector3(0, 0, 1),
    radiansZ,
    true
  );

  return obj;
}

function GetClosest(
  availableCorner: {
    position: number[];
    used: boolean;
  }[],
  closestPool: PoolType,
  setClosestIndex: React.Dispatch<React.SetStateAction<number>>,
  e: ThreeEvent<PointerEvent>
) {
  let obj2 = new THREE.Object3D();
  obj2.position.copy(
    new THREE.Vector3(
      closestPool.sPosition[0] + availableCorner[0].position[0],
      closestPool.sPosition[1] + availableCorner[0].position[1],
      closestPool.sPosition[2] + availableCorner[0].position[2]
    )
  );
  let offsetHelperPos = { ...obj2.position };
  const offsetWidth = closestPool.sWidth - closestPool.width;
  const offsetHeight = closestPool.sHeight - closestPool.height;
  const offsetDepth = closestPool.sDepth - closestPool.depth;
  offsetHelperPos.x -= offsetWidth / 2;
  obj2.position.copy(
    new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
  );
  if (
    closestPool.sRotation[0] != 0 ||
    closestPool.sRotation[1] != 0 ||
    closestPool.sRotation[2] != 0
  ) {
    obj2 = RotateAroundPoint2(
      closestPool.sRotation,
      [obj2.position.x, obj2.position.y, obj2.position.z],
      closestPool.sPosition
    );
  }
  let closestObj = {
    used: false,
    position: {
      x: obj2.position.x,
      y: obj2.position.y,
      z: obj2.position.z,
    },
  };
  let closest = availableCorner[0];
  let closestindex = 0;
  setClosestIndex(0);
  let newdist = Math.sqrt(
    Math.pow(e.point.x - obj2.position.x, 2) +
      Math.pow(e.point.y + 0.05 - obj2.position.y, 2) +
      Math.pow(e.point.z - obj2.position.z, 2)
  );
  availableCorner.map((corner, index) => {
    if (!corner.used) {
      obj2.position.copy(
        new THREE.Vector3(
          closestPool.sPosition[0] + corner.position[0],
          closestPool.sPosition[1] + corner.position[1],
          closestPool.sPosition[2] + corner.position[2]
        )
      );

      offsetHelperPos = { ...obj2.position };
      switch (index) {
        case 0:
          //Topleft
          offsetHelperPos.x -= offsetWidth / 2;
          break;
        case 1:
          offsetHelperPos.x += offsetWidth / 2;
          break;
        case 2:
          //bottom Left
          offsetHelperPos.z -= offsetDepth / 2;
          break;
        case 3:
          offsetHelperPos.z += offsetDepth / 2;
          break;
      }
      obj2.position.copy(
        new THREE.Vector3(
          offsetHelperPos.x,
          offsetHelperPos.y,
          offsetHelperPos.z
        )
      );
      if (
        closestPool.sRotation[0] != 0 ||
        closestPool.sRotation[1] != 0 ||
        closestPool.sRotation[2] != 0
      )
        obj2 = RotateAroundPoint2(
          closestPool.sRotation,
          [obj2.position.x, obj2.position.y, obj2.position.z],
          closestPool.sPosition
        );
      const temp = Math.sqrt(
        Math.pow(e.point.x - obj2.position.x, 2) +
          Math.pow(e.point.y - obj2.position.y, 2) +
          Math.pow(e.point.z - obj2.position.z, 2)
      );
      if (temp < newdist) {
        newdist = temp;
        closest = corner;
        closestObj = {
          used: false,
          position: {
            x: obj2.position.x,
            y: obj2.position.y,
            z: obj2.position.z,
          },
        };
        setClosestIndex(index);
        closestindex = index;
      }
    }
  });
  return {
    ClosestIndex: closestindex,
    closest: closest,
    closestObj: closestObj,
  };
}
function GetClosestCorner(
  availableCorner: {
    position: number[];
    used: boolean;
  }[],
  closestPool: PoolType,
  setClosestIndex: React.Dispatch<React.SetStateAction<number>>,
  e: ThreeEvent<PointerEvent>
) {
  const pos = [
    closestPool.sPosition[0] + availableCorner[0].position[0],
    closestPool.sPosition[1] + availableCorner[0].position[1],
    closestPool.sPosition[2] + availableCorner[0].position[2],
  ];
  let obj2 = new THREE.Object3D();
  obj2.position.copy(
    new THREE.Vector3(
      closestPool.sPosition[0] + availableCorner[0].position[0],
      closestPool.sPosition[1] + availableCorner[0].position[1],
      closestPool.sPosition[2] + availableCorner[0].position[2]
    )
  );
  let offsetHelperPos = { ...obj2.position };
  const offsetWidth = closestPool.sWidth - closestPool.width;
  const offsetHeight = closestPool.sHeight - closestPool.height;
  const offsetDepth = closestPool.sDepth - closestPool.depth;
  offsetHelperPos.x -= offsetWidth / 2;
  offsetHelperPos.z -= offsetDepth / 2;
  obj2.position.copy(
    new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
  );
  if (
    closestPool.sRotation[0] != 0 ||
    closestPool.sRotation[1] != 0 ||
    closestPool.sRotation[2] != 0
  ) {
    obj2 = RotateAroundPoint2(
      closestPool.sRotation,
      [obj2.position.x, obj2.position.y, obj2.position.z],
      closestPool.sPosition
    );
  }
  let closestObj = {
    used: false,
    position: {
      x: obj2.position.x,
      y: obj2.position.y,
      z: obj2.position.z,
    },
  };
  let closest = availableCorner[0];
  let closestindex = 0;
  setClosestIndex(0);
  let newdist = Math.sqrt(
    Math.pow(e.point.x - obj2.position.x, 2) +
      Math.pow(e.point.y - obj2.position.y, 2) +
      Math.pow(e.point.z - obj2.position.z, 2)
  );
  availableCorner.map((corner, index) => {
    const pos = [
      closestPool.sPosition[0] + corner.position[0],
      closestPool.sPosition[1] + corner.position[1],
      closestPool.sPosition[2] + corner.position[2],
    ];
    obj2.position.copy(
      new THREE.Vector3(
        closestPool.sPosition[0] + corner.position[0],
        closestPool.sPosition[1] + corner.position[1],
        closestPool.sPosition[2] + corner.position[2]
      )
    );

    offsetHelperPos = { ...obj2.position };
    switch (index) {
      case 0:
        //Topleft
        offsetHelperPos.x -= offsetWidth / 2;
        offsetHelperPos.z -= offsetDepth / 2;
        break;
      case 1:
        offsetHelperPos.z -= offsetDepth / 2;
        offsetHelperPos.x += offsetWidth / 2;
        break;
      case 2:
        //bottom Left
        offsetHelperPos.x -= offsetWidth / 2;
        offsetHelperPos.z += offsetDepth / 2;
        break;
      case 3:
        offsetHelperPos.x += offsetWidth / 2;
        offsetHelperPos.z += offsetDepth / 2;
        break;
    }
    obj2.position.copy(
      new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
    );
    if (
      closestPool.sRotation[0] != 0 ||
      closestPool.sRotation[1] != 0 ||
      closestPool.sRotation[2] != 0
    )
      obj2 = RotateAroundPoint2(
        closestPool.sRotation,
        [obj2.position.x, obj2.position.y, obj2.position.z],
        closestPool.sPosition
      );
    const temp = Math.sqrt(
      Math.pow(e.point.x - obj2.position.x, 2) +
        Math.pow(e.point.y - obj2.position.y, 2) +
        Math.pow(e.point.z - obj2.position.z, 2)
    );
    if (temp < newdist) {
      newdist = temp;
      closest = corner;
      closestObj = {
        used: false,
        position: {
          x: obj2.position.x,
          y: obj2.position.y,
          z: obj2.position.z,
        },
      };
      setClosestIndex(index);
      closestindex = index;
    }
  });
  return {
    ClosestIndex: closestindex,
    closest: closest,
    closestObj: closestObj,
  };
}
// function GetClosestCornerStep(
//   availableCorner: {
//     position: number[];
//     used: boolean;
//   }[],
//   closestPool: PoolType,
//   setClosestIndex: React.Dispatch<React.SetStateAction<number>>,
//   e: ThreeEvent<PointerEvent>
// ) {
//   const pos = [
//     closestPool.sPosition[0] + availableCorner[0].position[0],
//     closestPool.sPosition[1] + availableCorner[0].position[1],
//     closestPool.sPosition[2] + availableCorner[0].position[2],
//   ];
//   let obj2 = new THREE.Object3D();
//   obj2.position.copy(
//     new THREE.Vector3(
//       closestPool.sPosition[0] + availableCorner[0].position[0],
//       closestPool.sPosition[1] + availableCorner[0].position[1],
//       closestPool.sPosition[2] + availableCorner[0].position[2]
//     )
//   );
//   let offsetHelperPos = { ...obj2.position };
//   const offsetWidth = closestPool.sWidth - closestPool.width;
//   const offsetHeight = closestPool.sHeight - closestPool.height;
//   const offsetDepth = closestPool.sDepth - closestPool.depth;
//   offsetHelperPos.x -= offsetWidth / 2;
//   offsetHelperPos.z -= offsetDepth / 2;
//   obj2.position.copy(
//     new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
//   );
//   if (
//     closestPool.sRotation[0] != 0 ||
//     closestPool.sRotation[1] != 0 ||
//     closestPool.sRotation[2] != 0
//   ) {
//     obj2 = RotateAroundPoint2(
//       closestPool.sRotation,
//       [obj2.position.x, obj2.position.y, obj2.position.z],
//       closestPool.sPosition
//     );
//   }
//   let closestObj = {
//     used: false,
//     position: {
//       x: obj2.position.x,
//       y: obj2.position.y,
//       z: obj2.position.z,
//     },
//   };
//   let closest = availableCorner[0];
//   let closestindex = 0;
//   setClosestIndex(0);
//   let newdist = Math.sqrt(
//     Math.pow(e.point.x - obj2.position.x, 2) +
//       Math.pow(e.point.y - obj2.position.y, 2) +
//       Math.pow(e.point.z - obj2.position.z, 2)
//   );
//   availableCorner.map((corner, index) => {
//     const pos = [
//       closestPool.sPosition[0] + corner.position[0],
//       closestPool.sPosition[1] + corner.position[1],
//       closestPool.sPosition[2] + corner.position[2],
//     ];
//     obj2.position.copy(
//       new THREE.Vector3(
//         closestPool.sPosition[0] + corner.position[0],
//         closestPool.sPosition[1] + corner.position[1],
//         closestPool.sPosition[2] + corner.position[2]
//       )
//     );

//     offsetHelperPos = { ...obj2.position };
//     switch (true) {
//       case index===0 || index===4:
//         //Topleft
//         offsetHelperPos.x -= offsetWidth / 2;
//         offsetHelperPos.z -= offsetDepth / 2;
//         break;
//       case index===1 || index===5:
//         offsetHelperPos.z -= offsetDepth / 2;
//         offsetHelperPos.x += offsetWidth / 2;
//         break;
//       case index===2 || index===6:
//         //bottom Left
//         offsetHelperPos.x -= offsetWidth / 2;
//         offsetHelperPos.z += offsetDepth / 2;
//         break;
//       case index===3 || index===7:
//         offsetHelperPos.x += offsetWidth / 2;
//         offsetHelperPos.z += offsetDepth / 2;
//         break;
//     }
//     obj2.position.copy(
//       new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
//     );
//     if (
//       closestPool.sRotation[0] != 0 ||
//       closestPool.sRotation[1] != 0 ||
//       closestPool.sRotation[2] != 0
//     )
//       obj2 = RotateAroundPoint2(
//         closestPool.sRotation,
//         [obj2.position.x, obj2.position.y, obj2.position.z],
//         closestPool.sPosition
//       );
//     const temp = Math.sqrt(
//       Math.pow(e.point.x - obj2.position.x, 2) +
//         Math.pow(e.point.y - obj2.position.y, 2) +
//         Math.pow(e.point.z - obj2.position.z, 2)
//     );
//     if (temp < newdist) {
//       newdist = temp;
//       closest = corner;
//       closestObj = {
//         used: false,
//         position: {
//           x: obj2.position.x,
//           y: obj2.position.y,
//           z: obj2.position.z,
//         },
//       };
//       setClosestIndex(index);
//       closestindex = index;
//     }
//   });
//   return {
//     ClosestIndex: closestindex,
//     closest: closest,
//     closestObj: closestObj,
//   };
//   // pointer = {
//   //   x: closest.position[0],
//   //   y: closest.position[1],
//   //   z: closest.position[2],
//   // };
//   // setSnappingPosition(pointer);
//   // pointer = {
//   //   x:
//   //     closestObj.position.x,
//   //   y:
//   //     closestObj.position.y,
//   //   z:
//   //     closestObj.position.z,
//   // };
// }

// -------------------  LSHAPE  -------------------
function GetClosestLShape(
  availablePositions: {
    position: number[];
    used: boolean;
  }[],
  closestPool: PoolType,
  setClosestIndex: React.Dispatch<React.SetStateAction<number>>,
  e: ThreeEvent<PointerEvent>
) {
  let obj2 = new THREE.Object3D();
  obj2.position.copy(
    new THREE.Vector3(
      closestPool.sPosition[0] + availablePositions[0].position[0],
      closestPool.sPosition[1] + availablePositions[0].position[1],
      closestPool.sPosition[2] + availablePositions[0].position[2]
    )
  );
  let offsetHelperPos = { ...obj2.position };
  const offsetWidth = closestPool.sWidth - closestPool.width;
  const offsettHeight = closestPool.stHeight - closestPool.tHeight;
  const offsetbHeight = closestPool.sbHeight - closestPool.bHeight;
  const offsetDepth = closestPool.sDepth - closestPool.depth;
  offsetHelperPos.x = offsetHelperPos.x - offsetbHeight + offsetWidth / 2;

  obj2.position.copy(
    new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
  );
  if (
    closestPool.sRotation[0] != 0 ||
    closestPool.sRotation[1] != 0 ||
    closestPool.sRotation[2] != 0
  ) {
    obj2 = RotateAroundPoint2(
      closestPool.sRotation,
      [obj2.position.x, obj2.position.y, obj2.position.z],
      closestPool.sPosition
    );
  }
  let closestObj = {
    used: false,
    position: {
      x: obj2.position.x,
      y: obj2.position.y,
      z: obj2.position.z,
    },
  };
  let closest = availablePositions[0];
  let closestindex = 0;
  setClosestIndex(0);
  let newdist = Math.sqrt(
    Math.pow(e.point.x - obj2.position.x, 2) +
      Math.pow(e.point.y - obj2.position.y, 2) +
      Math.pow(e.point.z - obj2.position.z, 2)
  );
  availablePositions.map((corner, index) => {
    obj2.position.copy(
      new THREE.Vector3(
        closestPool.sPosition[0] + corner.position[0],
        closestPool.sPosition[1] + corner.position[1],
        closestPool.sPosition[2] + corner.position[2]
      )
    );

    offsetHelperPos = { ...obj2.position };
    switch (index) {
      case 0:
        //left
        offsetHelperPos.x -= offsetbHeight / 2 + offsetWidth;
        break;
      case 1:
        //top
        offsetHelperPos.z -= offsetWidth / 2;
        break;
      case 2:
        //bottom
        offsetHelperPos.z += offsetWidth / 2;
        break;
      case 3:
        //tleft
        offsetHelperPos.x -= offsetWidth / 2;
        break;
      case 4:
        //tright
        offsetHelperPos.x += offsetWidth / 2;
        break;
      case 5:
        //ttop
        offsetHelperPos.z = offsetHelperPos.z - offsettHeight + offsetWidth / 2;
        break;
    }
    obj2.position.copy(
      new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
    );
    if (
      closestPool.sRotation[0] != 0 ||
      closestPool.sRotation[1] != 0 ||
      closestPool.sRotation[2] != 0
    )
      obj2 = RotateAroundPoint2(
        closestPool.sRotation,
        [obj2.position.x, obj2.position.y, obj2.position.z],
        closestPool.sPosition
      );
    const temp = Math.sqrt(
      Math.pow(e.point.x - obj2.position.x, 2) +
        Math.pow(e.point.y - obj2.position.y, 2) +
        Math.pow(e.point.z - obj2.position.z, 2)
    );
    if (temp < newdist) {
      newdist = temp;
      closest = corner;
      closestObj = {
        used: false,
        position: {
          x: obj2.position.x,
          y: obj2.position.y,
          z: obj2.position.z,
        },
      };
      setClosestIndex(index);
      closestindex = index;
    }
  });
  return {
    ClosestIndex: closestindex,
    closest: closest,
    closestObj: closestObj,
  };
}
function GetClosestLShapeCorner(
  availablePositions: {
    position: number[];
    used: boolean;
  }[],
  closestPool: PoolType,
  setClosestIndex: React.Dispatch<React.SetStateAction<number>>,
  e: ThreeEvent<PointerEvent>
) {
  let obj2 = new THREE.Object3D();
  obj2.position.copy(
    new THREE.Vector3(
      closestPool.sPosition[0] + availablePositions[0].position[0],
      closestPool.sPosition[1] + availablePositions[0].position[1],
      closestPool.sPosition[2] + availablePositions[0].position[2]
    )
  );
  let offsetHelperPos = { ...obj2.position };
  const offsetWidth = closestPool.sWidth - closestPool.width;
  const offsetDepth = closestPool.sDepth - closestPool.depth;
  const offsettHeight = closestPool.stHeight - closestPool.tHeight;
  const offsetbHeight = closestPool.sbHeight - closestPool.bHeight;
  offsetHelperPos.x = offsetHelperPos.x - offsetbHeight + offsetWidth / 2;
  offsetHelperPos.z = offsetHelperPos.z - offsetWidth / 2;
  obj2.position.copy(
    new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
  );
  if (
    closestPool.sRotation[0] != 0 ||
    closestPool.sRotation[1] != 0 ||
    closestPool.sRotation[2] != 0
  ) {
    obj2 = RotateAroundPoint2(
      closestPool.sRotation,
      [obj2.position.x, obj2.position.y, obj2.position.z],
      closestPool.sPosition
    );
  }
  let closestObj = {
    used: false,
    position: {
      x: obj2.position.x,
      y: obj2.position.y,
      z: obj2.position.z,
    },
  };
  let closest = availablePositions[0];
  let closestindex = 0;
  setClosestIndex(0);
  let newdist = Math.sqrt(
    Math.pow(e.point.x - obj2.position.x, 2) +
      Math.pow(e.point.y - obj2.position.y, 2) +
      Math.pow(e.point.z - obj2.position.z, 2)
  );
  availablePositions.map((corner, index) => {
    obj2.position.copy(
      new THREE.Vector3(
        closestPool.sPosition[0] + corner.position[0],
        closestPool.sPosition[1] + corner.position[1],
        closestPool.sPosition[2] + corner.position[2]
      )
    );

    offsetHelperPos = { ...obj2.position };
    // switch (index) {
    //   case 0:
    //     //Topleft
    //     offsetHelperPos.x -= offsetWidth / 2;
    //     break;
    //   case 1:
    //     offsetHelperPos.x += offsetWidth / 2;
    //     break;
    //   case 2:
    //     //bottom Left
    //     offsetHelperPos.z -= offsetDepth / 2;
    //     break;
    //   case 3:
    //     offsetHelperPos.z += offsetDepth / 2;
    //     break;
    // }
    // obj2.position.copy(
    //   new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
    // );
    switch (index) {
      case 0:
        //Top Left
        offsetHelperPos.x = offsetHelperPos.x - offsetbHeight + offsetWidth / 2;
        offsetHelperPos.z = offsetHelperPos.z - offsetWidth / 2;
        break;

      case 1:
        //Bottom left
        offsetHelperPos.x = offsetHelperPos.x - offsetbHeight + offsetWidth / 2;
        offsetHelperPos.z = offsetHelperPos.z + offsetWidth / 2;
        break;

      case 2:
        //Bottom right
        offsetHelperPos.x = offsetHelperPos.x + offsetbHeight + offsetWidth / 2;
        offsetHelperPos.z = offsetHelperPos.z + offsetWidth / 2;
        break;

      case 3:
        //Topleft
        offsetHelperPos.x = offsetHelperPos.x - offsetWidth / 2;
        offsetHelperPos.z = offsetHelperPos.z - offsettHeight + offsetWidth / 2;
        break;

      case 4:
        offsetHelperPos.x = offsetHelperPos.x + offsetWidth / 2;
        offsetHelperPos.z = offsetHelperPos.z - offsettHeight + offsetWidth / 2;
        break;
    }
    obj2.position.copy(
      new THREE.Vector3(offsetHelperPos.x, offsetHelperPos.y, offsetHelperPos.z)
    );
    if (
      closestPool.sRotation[0] != 0 ||
      closestPool.sRotation[1] != 0 ||
      closestPool.sRotation[2] != 0
    )
      obj2 = RotateAroundPoint2(
        closestPool.sRotation,
        [obj2.position.x, obj2.position.y, obj2.position.z],
        closestPool.sPosition
      );
    const temp = Math.sqrt(
      Math.pow(e.point.x - obj2.position.x, 2) +
        Math.pow(e.point.y - obj2.position.y, 2) +
        Math.pow(e.point.z - obj2.position.z, 2)
    );
    if (temp < newdist) {
      newdist = temp;
      closest = corner;
      closestObj = {
        used: false,
        position: {
          x: obj2.position.x,
          y: obj2.position.y,
          z: obj2.position.z,
        },
      };
      setClosestIndex(index);
      closestindex = index;
    }
  });
  return {
    ClosestIndex: closestindex,
    closest: closest,
    closestObj: closestObj,
  };
}
