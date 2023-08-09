"use client";
import { CoordinatesContext } from "@/Context/CoordinateContext";
import { selectPointer } from "@/slices/pointerSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store/store";
import { CoordinatesContextType, CoordinatesType } from "@/types/coordinates";
import React, { useContext, useEffect, useRef, useState } from "react";
import PoolHelper from "./poolHelper";
import CylinderHelper from "./cylinderHelper";
import { selectSnappingPosition } from "@/slices/snappingSlice";
import { MathUtils } from "three";
import LShapeHelper from "./lshapeHelper";
interface HelperProps {}

const Helper: React.FC<HelperProps> = ({}) => {
  const helper = useAppSelector((state: RootState) => state.helper);
  const Coord = useAppSelector(selectPointer);
  const defaults = useAppSelector((state: RootState) => state.defaults);
  console.log("helper.type:", helper.type);
  switch (helper.type) {
    case "pool":
      return (
        helper.dragging && (
          <PoolHelper
            props={{
              position: [Coord.x, -defaults.pool.height / 2 + 0.2, Coord.z],
            }}
            height={defaults.pool.height}
            width={defaults.pool.width}
            depth={defaults.pool.depth}
          />
        )
      );
    case "squarepool":
      return (
        helper.dragging && (
          <PoolHelper
            props={{
              position: [
                Coord.x,
                -defaults.squarepool.height / 2 + 0.2,
                Coord.z,
              ],
            }}
            height={defaults.squarepool.height}
            width={defaults.squarepool.width}
            depth={defaults.squarepool.depth}
          />
        )
      );
    case "hottub":
      return (
        helper.dragging && (
          <PoolHelper
            props={{ position: [Coord.x, -5 / 2 + 0.5, Coord.z] }}
            height={defaults.hottub.height}
            width={defaults.hottub.width}
            depth={defaults.hottub.depth}
          />
        )
      );
    case "lshape":
      return (
        helper.dragging && (
          <LShapeHelper
            width={defaults.lshape.width}
            theight={defaults.lshape.theight}
            bheight={defaults.lshape.bheight}
            depth={defaults.lshape.depth}
            props={{ position: [Coord.x, -5 / 2 + 0.5, Coord.z] }}
          />
        )
      );
    case "cyl":
      return (
        helper.dragging && (
          <CylinderHelper
            props={{
              position: [Coord.x, -defaults.cyl.height / 2 + 0.5, Coord.z],
            }}
            bottom={defaults.cyl.bottom}
            top={defaults.cyl.top}
            height={defaults.cyl.height}
          />
        )
      );
    default:
      //Coord.y+.5
      return (
        helper.dragging && (
          <mesh
            rotation={[0, MathUtils.degToRad(Coord.RotationY), 0]}
            position={[Coord.x, Coord.y, Coord.z]}
          >
            <boxGeometry args={[4 / 5, 3 / 5, 4 / 5]} />
            <meshBasicMaterial color={"green"} transparent opacity={0.7} />
          </mesh>
        )
      );
  }
};

export default Helper;
