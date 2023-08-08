"use client";
import { PoolType, ReplaceChildren, ReplacePool } from "@/slices/poolsSlice";
import { useAppDispatch } from "@/store/hooks";
import { inchesToMeters, metersToInches } from "@/utils/getActiveAxis";
import { NumberInput } from "@mantine/core";
import * as React from "react";

interface IScaleProps {
  scale: {
    x: number;
    y: number;
    z: number;
  } | null;
  targetPool: number | null;
  inches: boolean;
  pools: PoolType[];
  targetModel: { pool: number; model: number } | null;
}

const Scale: React.FunctionComponent<IScaleProps> = ({
  scale,
  targetPool,
  pools,
  inches,
  targetModel,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full items-center justify-start gap-x-3">
      <div className="w-1/5 self-start text-lg text-slate-50">Scale</div>
      <div className="flex w-4/5 flex-row flex-wrap items-center justify-start gap-x-2">
        <NumberInput
          value={scale?.x ? (inches ? metersToInches(scale?.x) : scale?.x) : 1}
          onChange={(e) => {
            let val = +e;
            if (inches) {
              val = inchesToMeters(+e);
            }
            if (scale && targetPool != null && pools[targetPool]) {
              const pool = { ...pools[targetPool] };
              if (
                pool?.sScale &&
                scale &&
                (pool.sScale[0] != val ||
                  pool.sScale[2] != scale.y ||
                  pool.sScale[3] != scale.z)
              ) {
                const updatedSScale = [...pool.sScale]; // Create a copy of the array
                updatedSScale[0] = val;
                updatedSScale[1] = scale.y;
                updatedSScale[2] = scale.z;
                pool.sScale = updatedSScale;
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
                // Assign the updated array back to pool.sPosition
              }
            } else if (
              scale &&
              targetModel != null &&
              pools[targetModel.pool] &&
              pools[targetModel.pool].childrens[targetModel.model]
            ) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sScale &&
                scale &&
                (model.sScale[0] != val ||
                  model.sScale[2] != scale.y ||
                  model.sScale[3] != scale.z)
              ) {
                const updatedsScale = [...model.sScale]; // Create a copy of the array
                updatedsScale[0] = val;
                updatedsScale[1] = scale.y;
                updatedsScale[2] = scale.z;
                model.sScale = updatedsScale; // Assign the updated array back to model.sscale
                dispatch(
                  ReplaceChildren({
                    poolIndex: targetModel.pool,
                    modelIndex: targetModel.model,
                    model: model,
                  })
                );
              }
            }
          }}
          className="w-[75px] max-w-[90px]"
          step={0.05}
          precision={2}
        />
        <NumberInput
          value={scale?.y ? (inches ? metersToInches(scale?.y) : scale?.y) : 1}
          onChange={(e) => {
            let val = +e;
            if (inches) {
              val = inchesToMeters(+e);
            }
            if (scale && targetPool != null && pools[targetPool]) {
              const pool = { ...pools[targetPool] };
              if (
                pool?.sScale &&
                scale &&
                (pool.sScale[0] != scale.x ||
                  pool.sScale[2] != +e ||
                  pool.sScale[3] != scale.z)
              ) {
                const updatedSScale = [...pool.sScale]; // Create a copy of the array
                let val = +e;
                if (inches) {
                  val = inchesToMeters(+e);
                }
                updatedSScale[0] = scale.x;
                updatedSScale[1] = val;
                updatedSScale[2] = scale.z;
                pool.sScale = updatedSScale;
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
                // Assign the updated array back to pool.sPosition
              }
            } else if (
              scale &&
              targetModel != null &&
              pools[targetModel.pool] &&
              pools[targetModel.pool].childrens[targetModel.model]
            ) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sScale &&
                scale &&
                (model.sScale[0] != scale.x ||
                  model.sScale[2] != +e ||
                  model.sScale[3] != scale.z)
              ) {
                const updatedsScale = [...model.sScale]; // Create a copy of the array

                updatedsScale[0] = scale.x;
                updatedsScale[1] = val;
                updatedsScale[2] = scale.z;
                model.sScale = updatedsScale; // Assign the updated array back to model.sscale
                dispatch(
                  ReplaceChildren({
                    poolIndex: targetModel.pool,
                    modelIndex: targetModel.model,
                    model: model,
                  })
                );
              }
            }
          }}
          className="w-[75px] max-w-[90px]"
          step={0.05}
          precision={2}
        />
        <NumberInput
          value={scale?.z ? (inches ? metersToInches(scale?.z) : scale?.z) : 1}
          onChange={(e) => {
            let val = +e;
            if (inches) {
              val = inchesToMeters(+e);
            }
            if (scale && targetPool != null && pools[targetPool]) {
              const pool = { ...pools[targetPool] };
              if (
                pool?.sScale &&
                scale &&
                (pool.sScale[0] != scale.x ||
                  pool.sScale[2] != val ||
                  pool.sScale[3] != val)
              ) {
                const updatedSScale = [...pool.sScale]; // Create a copy of the array
                updatedSScale[0] = scale.x;
                updatedSScale[1] = scale.y;
                updatedSScale[2] = val;
                pool.sScale = updatedSScale;
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
                // Assign the updated array back to pool.sPosition
              }
            } else if (
              scale &&
              targetModel != null &&
              pools[targetModel.pool] &&
              pools[targetModel.pool].childrens[targetModel.model]
            ) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sScale &&
                scale &&
                (model.sScale[0] != scale.x ||
                  model.sScale[2] != scale.y ||
                  model.sScale[3] != val)
              ) {
                const updatedsScale = [...model.sScale]; // Create a copy of the array
                updatedsScale[0] = scale.x;
                updatedsScale[1] = scale.y;
                updatedsScale[2] = val;
                model.sScale = updatedsScale; // Assign the updated array back to model.sscale
                dispatch(
                  ReplaceChildren({
                    poolIndex: targetModel.pool,
                    modelIndex: targetModel.model,
                    model: model,
                  })
                );
              }
            }
          }}
          className="w-[75px] max-w-[90px]"
          step={0.05}
          precision={2}
        />
      </div>
    </div>
  );
};

export default Scale;
