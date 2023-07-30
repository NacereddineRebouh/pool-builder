"use client";
import { Instances, Instance, useMask } from "@react-three/drei";
import React, { useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectPointer, setPointer, setRotation } from "@/slices/pointerSlice";
import { setHelper } from "@/slices/helperSlice";
import { RootState } from "@/store/store";
import { ThreeEvent } from "@react-three/fiber";
import {
  addPool as addNewPool,
  addChildren,
  PoolType,
} from "@/slices/poolsSlice";
import { setPivotVisibility } from "@/slices/targetSlice";
import * as THREE from "three";
enum sides {
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
}
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

  // ------- //
  const poolwidth = defaults.pool.width;
  const poolheight = defaults.pool.height;
  const pooldepth = defaults.pool.depth;
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
  }, [defaults]);

  const boxWidth = 3 / 5;
  const boxHeight = poolheight;
  const boxDepth = 4 / 5;

  const cornerHeight = 4;

  const swimJetBoxWidth = 3 / 3;
  const swimJetBoxHeight = poolheight / 3;
  const swimJetBoxDepth = 4 / 3;

  const infinityEdgeBoxWidth = 1 / 5;
  const infinityEdgeBoxHeight = 1 / 5;
  const infinityEdgeBoxDepth = pooldepth;

  const waterFallBoxWidth = 3;
  const waterFallBoxHeight = 2 / 5;
  const waterFallBoxDepth = 2;
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

  const [SnappingPosition, setSnappingPosition] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [ClosestIndex, setClosestIndex] = useState(0);
  const [ClosestPoolIndex, setClosestPoolIndex] = useState(0);
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
        type != "poolWithSteps" &&
        type != "L-Shape"
      ) {
        // find closest pool
        let dist = Infinity;
        let FilteredPools = [...Pools];
        // if (type != "SwimJet")
        //   FilteredPools = Pools.filter((pool) => pool.poolType != "hottub");

        let closestPool: PoolType = Pools[0];
        Pools?.map((pool, index) => {
          console.log("pool.poolType ::", pool.poolType);
          if (
            pool.poolType != "hottub" ||
            (type === "SwimJet" && pool.poolType === "hottub")
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
          console.log("closestPool ::", closestPool);
          RotationY = closestPool.sRotation[1];
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
                -closestPool.height / 2 + swimJetBoxHeight / 2,
                0,
              ],
              used: false,
            }, //left
            {
              position: [
                closestPool.width / 2 - 0,
                -closestPool.height / 2 + swimJetBoxHeight / 2,
                0,
              ],
              used: false,
            }, //right
            {
              position: [
                0,
                -closestPool.height / 2 + swimJetBoxHeight / 2,
                -closestPool.depth / 2 + 0,
              ],
              used: false,
            }, //top
            {
              position: [
                0,
                -closestPool.height / 2 + swimJetBoxHeight / 2,
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
              position: [-closestPool.width / 2 - 0, waterFallBoxHeight / 2, 0],
              used: false,
            }, //left
            {
              position: [closestPool.width / 2 + 0, waterFallBoxHeight / 2, 0],
              used: false,
            }, //right
            {
              position: [0, waterFallBoxHeight / 2, -closestPool.depth / 2 - 0],
              used: false,
            }, //top
            {
              position: [0, waterFallBoxHeight / 2, closestPool.depth / 2 + 0],
              used: false,
            }, //bottom
          ]);
          setbeach([
            { position: [-closestPool.width / 2 - 2, 2 / 2, 0], used: false }, //left
            { position: [closestPool.width / 2 + 2, 2 / 2, 0], used: false }, //right
            { position: [0, 2 / 2, -closestPool.depth / 2 - 2], used: false }, //top
            { position: [0, 2 / 2, closestPool.depth / 2 + 2], used: false }, //bottom
          ]);
          switch (true) {
            case type === "SquareSteps" ||
              type === "RoundSteps" ||
              type === "Steps":
              const available = stairs.filter((stair) => stair.used === false);
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
            case type === "SwimJet":
              const availableSwimJet = swimJet.filter(
                (obj) => obj.used === false
              );
              if (availableSwimJet.length > 0) {
                const res = GetClosest(
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
              const availableBeach = beach.filter((obj) => obj.used === false);
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
      switch (type) {
        case "pool":
          // console.log("adding pool ::---", {
          //   poolType: type,
          //   width: defaults.pool.width,
          //   height: defaults.pool.height,
          //   depth: defaults.pool.depth,
          //   sWidth: defaults.pool.width,
          //   sHeight: defaults.pool.height,
          //   sDepth: defaults.pool.depth,
          //   position: [e.point.x, e.point.y, e.point.z],
          //   scale: [1, 1, 1],
          //   sPosition: [e.point.x, e.point.y, e.point.z],
          //   sScale: [1, 1, 1],
          //   sRotation: [0, 0, 0],
          //   rotation: [0, 0, 0],
          //   childrens: [],
          // });
          // dispatch(addPool({shapeType:type, position:[coords.x,coords.y,coords.z], scale:[1,1,1]}))
          dispatch(
            addNewPool({
              poolType: type,
              width: defaults.pool.width,
              height: defaults.pool.height,
              depth: defaults.pool.depth,
              sWidth: defaults.pool.width,
              sHeight: defaults.pool.height,
              sDepth: defaults.pool.depth,
              position: [e.point.x, e.point.y, e.point.z],
              scale: [1, 1, 1],
              sPosition: [e.point.x, e.point.y, e.point.z],
              sScale: [1, 1, 1],
              sRotation: [0, 0, 0],
              rotation: [0, 0, 0],
              childrens: [],
            })
          );
          // dispatch(addNewPool({poolType:type, width:16, height:5, depth:12, sWidth:16, sHeight:5, sDepth:12, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1], sPosition:[0,0,0], sScale:[1,1,1], sRotation:[0,0,0], rotation:[0,0,0], childrens:[]}))
          break;
        case "hottub":
          // console.log("adding pool ::---", {
          //   poolType: type,
          //   width: defaults.pool.width,
          //   height: defaults.pool.height,
          //   depth: defaults.pool.depth,
          //   sWidth: defaults.pool.width,
          //   sHeight: defaults.pool.height,
          //   sDepth: defaults.pool.depth,
          //   position: [e.point.x, e.point.y, e.point.z],
          //   scale: [1, 1, 1],
          //   sPosition: [e.point.x, e.point.y, e.point.z],
          //   sScale: [1, 1, 1],
          //   sRotation: [0, 0, 0],
          //   rotation: [0, 0, 0],
          //   childrens: [],
          // });
          // dispatch(addPool({shapeType:type, position:[coords.x,coords.y,coords.z], scale:[1,1,1]}))
          dispatch(
            addNewPool({
              poolType: type,
              width: defaults.hottub.width,
              height: defaults.hottub.height,
              depth: defaults.hottub.depth,
              sWidth: defaults.hottub.width,
              sHeight: defaults.hottub.height,
              sDepth: defaults.hottub.depth,
              position: [e.point.x, e.point.y, e.point.z],
              scale: [1, 1, 1],
              sPosition: [e.point.x, e.point.y, e.point.z],
              sScale: [1, 1, 1],
              sRotation: [0, 0, 0],
              rotation: [0, 0, 0],
              childrens: [],
              nbSwimJet: defaults.hottub.nbSwimJet,
            })
          );
          // dispatch(addNewPool({poolType:type, width:16, height:5, depth:12, sWidth:16, sHeight:5, sDepth:12, position:[e.point.x,e.point.y,e.point.z], scale:[1,1,1], sPosition:[0,0,0], sScale:[1,1,1], sRotation:[0,0,0], rotation:[0,0,0], childrens:[]}))
          break;
        case "poolWithSteps": // hottub
          dispatch(
            addNewPool({
              poolType: type,
              width: defaults.pool.width,
              height: defaults.pool.height,
              depth: defaults.pool.depth,
              sWidth: defaults.pool.width,
              sHeight: defaults.pool.height,
              sDepth: defaults.pool.depth,
              position: [e.point.x, e.point.y, e.point.z],
              scale: [1, 1, 1],
              childrens: [],
            })
          );
          break;
        case "L-Shape":
          dispatch(
            addNewPool({
              poolType: type,
              width: defaults.pool.width,
              height: defaults.pool.height,
              depth: defaults.pool.depth,
              sWidth: defaults.pool.width,
              sHeight: defaults.pool.height,
              sDepth: defaults.pool.depth,
              position: [e.point.x, e.point.y, e.point.z],
              scale: [1, 1, 1],
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
              position: [e.point.x, e.point.y, e.point.z],
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
        case "WallWaterfall":
          if (SnappingPosition) {
            // const temp = fountain
            // temp[ClosestIndex].used = true;
            // setfountain(temp)
            let rotation = 0;
            let position = [0, -0.4 / 2 + 0.05, 0];
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
            let position = [0, -0.4 / 2 + 0.05, 0];
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
            let position = [0, -0.4 / 2 + 0.05, 0]; // box height/2 + border height
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
            let position = [0, -0.86, 0];
            let side = sides.Left;
            switch (ClosestIndex) {
              case 0:
                //left
                rotation = Math.PI / 2; // 90
                position[0] = 1.6;
                side = sides.Left;
                break;
              case 1:
                //right
                rotation = -Math.PI / 2; //-90
                position[0] = -1.6;
                side = sides.Right;
                break;
              case 2:
                rotation = 0; //180
                position[2] = 1.6;
                side = sides.Top;
                break;
              case 3:
                rotation = Math.PI; //0
                position[2] = -1.6;
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
      }
    }
  };
  // ------- //

  {
    /* Floor */
  }

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
  // pointer = {
  //   x: closest.position[0],
  //   y: closest.position[1],
  //   z: closest.position[2],
  // };
  // setSnappingPosition(pointer);
  // pointer = {
  //   x:
  //     closestObj.position.x,
  //   y:
  //     closestObj.position.y,
  //   z:
  //     closestObj.position.z,
  // };
}
