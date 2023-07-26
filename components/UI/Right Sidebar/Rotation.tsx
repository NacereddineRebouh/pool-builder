"use client";
import { PoolType, ReplaceChildren, ReplacePool } from "@/slices/poolsSlice";
import { useAppDispatch } from "@/store/hooks";
import { NumberInput } from "@mantine/core";
import * as React from "react";

interface IRotationProps {
  rotation: {
    x: number;
    y: number;
    z: number;
  } | null;
  targetPool: number | null;
  targetModel: { pool: number; model: number } | null;
  pools: PoolType[];
}

const Rotation: React.FunctionComponent<IRotationProps> = ({
  rotation,
  targetModel,
  targetPool,
  pools,
}) => {
  console.log("NewRotation::", rotation);
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full items-center justify-start gap-x-3">
      <div className="w-1/5 self-start text-lg text-slate-50">Rotation</div>
      <div className="flex w-4/5 flex-row flex-wrap items-center justify-start gap-x-2">
        <NumberInput
          name="rotX"
          itemID="rotX"
          value={rotation?.x}
          onChange={(e) => {
            if (rotation && targetPool != null) {
              const pool = { ...pools[targetPool] };
              // rotation
              if (
                pool?.sRotation &&
                rotation &&
                (pool.sRotation[0] != +e ||
                  pool.sRotation[2] != rotation.y ||
                  pool.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...pool.sRotation]; // Create a copy of the array
                // const temprot =
                updatedsRotation[0] = +e;
                updatedsRotation[1] = rotation.y;
                updatedsRotation[2] = rotation.z;
                pool.sRotation = updatedsRotation; // Assign the updated array back to pool.sRotation
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (rotation && targetModel != null) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sRotation &&
                rotation &&
                (model.sRotation[0] != +e ||
                  model.sRotation[2] != rotation.y ||
                  model.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...model.sRotation]; // Create a copy of the array
                updatedsRotation[0] = +e;
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
          value={rotation?.y}
          onChange={(e) => {
            if (rotation && targetPool != null) {
              const pool = { ...pools[targetPool] };
              // rotation
              if (
                pool?.sRotation &&
                rotation &&
                (pool.sRotation[0] != rotation.x ||
                  pool.sRotation[2] != +e ||
                  pool.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...pool.sRotation]; // Create a copy of the array
                // const temprot =
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = +e;
                updatedsRotation[2] = rotation.z;
                pool.sRotation = updatedsRotation; // Assign the updated array back to pool.sRotation
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (rotation && targetModel != null) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sRotation &&
                rotation &&
                (model.sRotation[0] != rotation.x ||
                  model.sRotation[2] != +e ||
                  model.sRotation[3] != rotation.z)
              ) {
                const updatedsRotation = [...model.sRotation]; // Create a copy of the array
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = +e;
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
          value={rotation?.z}
          onChange={(e) => {
            if (rotation && targetPool != null) {
              const pool = { ...pools[targetPool] };
              // rotation
              if (
                pool?.sRotation &&
                rotation &&
                (pool.sRotation[0] != rotation.x ||
                  pool.sRotation[2] != rotation.y ||
                  pool.sRotation[3] != +e)
              ) {
                const updatedsRotation = [...pool.sRotation]; // Create a copy of the array
                // const temprot =
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = rotation.y;
                updatedsRotation[2] = +e;
                pool.sRotation = updatedsRotation; // Assign the updated array back to pool.sRotation
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (rotation && targetModel != null) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sRotation &&
                rotation &&
                (model.sRotation[0] != rotation.x ||
                  model.sRotation[2] != rotation.y ||
                  model.sRotation[3] != +e)
              ) {
                const updatedsRotation = [...model.sRotation]; // Create a copy of the array
                updatedsRotation[0] = rotation.x;
                updatedsRotation[1] = rotation.y;
                updatedsRotation[2] = +e;
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
