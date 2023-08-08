"use client";
import { PoolType, ReplaceChildren, ReplacePool } from "@/slices/poolsSlice";
import { useAppDispatch } from "@/store/hooks";
import { inchesToMeters, metersToInches } from "@/utils/getActiveAxis";
import { NumberInput } from "@mantine/core";
import * as React from "react";

interface IRotationProps {
  rotation: {
    x: number;
    y: number;
    z: number;
  } | null;
  targetPool: number | null;
  inches: boolean;
  targetModel: { pool: number; model: number } | null;
  pools: PoolType[];
}

const Rotation: React.FunctionComponent<IRotationProps> = ({
  rotation,
  targetModel,
  targetPool,
  pools,
  inches,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full items-center justify-start gap-x-3">
      <div className="w-1/5 self-start text-lg text-slate-50">Rotation</div>
      <div className="flex w-4/5 flex-row flex-wrap items-center justify-start gap-x-2">
        <NumberInput
          name="rotX"
          itemID="rotX"
          value={
            rotation?.x
              ? inches
                ? metersToInches(rotation?.x)
                : rotation?.x
              : 0
          }
          onChange={(e) => {
            let val = +e;
            if (inches) {
              val = inchesToMeters(+e);
            }
            if (rotation && targetPool != null && pools[targetPool]) {
              const pool = { ...pools[targetPool] };
              // rotation
              if (
                pool?.sRotation &&
                rotation &&
                (pool.sRotation[0] != val ||
                  pool.sRotation[2] != rotation.y ||
                  pool.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...pool.sRotation]; // Create a copy of the array
                // const temprot =
                updatedsRotation[0] = val;
                updatedsRotation[1] = rotation.y;
                updatedsRotation[2] = rotation.z;
                pool.sRotation = updatedsRotation; // Assign the updated array back to pool.sRotation
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (
              rotation &&
              targetModel != null &&
              pools[targetModel.pool] &&
              pools[targetModel.pool].childrens[targetModel.model]
            ) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sRotation &&
                rotation &&
                (model.sRotation[0] != val ||
                  model.sRotation[2] != rotation.y ||
                  model.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...model.sRotation]; // Create a copy of the array
                updatedsRotation[0] = val;
                updatedsRotation[1] = rotation.y;
                updatedsRotation[2] = rotation.z;
                model.sRotation = updatedsRotation; // Assign the updated array back to model.sRotation
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
          name="rotY"
          itemID="rotY"
          value={
            rotation?.y
              ? inches
                ? metersToInches(rotation?.y)
                : rotation?.y
              : 0
          }
          onChange={(e) => {
            let val = +e;
            if (inches) {
              val = inchesToMeters(+e);
            }
            if (rotation && targetPool != null && pools[targetPool]) {
              const pool = { ...pools[targetPool] };
              // rotation
              if (
                pool?.sRotation &&
                rotation &&
                (pool.sRotation[0] != rotation.x ||
                  pool.sRotation[2] != val ||
                  pool.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...pool.sRotation]; // Create a copy of the array
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = val;
                updatedsRotation[2] = rotation.z;
                pool.sRotation = updatedsRotation; // Assign the updated array back to pool.sRotation
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (
              rotation &&
              targetModel != null &&
              pools[targetModel.pool] &&
              pools[targetModel.pool].childrens[targetModel.model]
            ) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sRotation &&
                rotation &&
                (model.sRotation[0] != rotation.x ||
                  model.sRotation[2] != val ||
                  model.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...model.sRotation]; // Create a copy of the array
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = val;
                updatedsRotation[2] = rotation.z;
                model.sRotation = updatedsRotation; // Assign the updated array back to model.sRotation
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
          name="rotZ"
          itemID="rotZ"
          value={
            rotation?.z
              ? inches
                ? metersToInches(rotation?.z)
                : rotation?.z
              : 0
          }
          onChange={(e) => {
            let val = +e;
            if (inches) {
              val = inchesToMeters(+e);
            }
            if (rotation && targetPool != null && pools[targetPool]) {
              const pool = { ...pools[targetPool] };
              // rotation
              if (
                pool?.sRotation &&
                rotation &&
                (pool.sRotation[0] != rotation.x ||
                  pool.sRotation[2] != rotation.y ||
                  pool.sRotation[3] != val)
              ) {
                const updatedsRotation = [...pool.sRotation]; // Create a copy of the array
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = rotation.y;
                updatedsRotation[2] = val;
                pool.sRotation = updatedsRotation; // Assign the updated array back to pool.sRotation
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (
              rotation &&
              targetModel != null &&
              pools[targetModel.pool] &&
              pools[targetModel.pool].childrens[targetModel.model]
            ) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sRotation &&
                rotation &&
                (model.sRotation[0] != rotation.x ||
                  model.sRotation[2] != rotation.y ||
                  model.sRotation[3] != val)
              ) {
                const updatedsRotation = [...model.sRotation]; // Create a copy of the array
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = rotation.y;
                updatedsRotation[2] = val;
                model.sRotation = updatedsRotation; // Assign the updated array back to model.sRotation
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

export default Rotation;
