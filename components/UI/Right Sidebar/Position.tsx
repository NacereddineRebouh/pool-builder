"use client";
import { PoolType, ReplaceChildren, ReplacePool } from "@/slices/poolsSlice";
import { useAppDispatch } from "@/store/hooks";
import { NumberInput } from "@mantine/core";
import * as React from "react";

interface IPositionProps {
  position: {
    x: number;
    y: number;
    z: number;
  } | null;
  targetPool: number | null;
  targetModel: { pool: number; model: number } | null;
  pools: PoolType[];
}

const Position: React.FunctionComponent<IPositionProps> = ({
  position,
  pools,
  targetModel,
  targetPool,
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full items-center justify-start gap-x-3">
      <div className="w-1/5 self-start text-lg text-slate-50">Position</div>
      <div className="flex w-4/5 flex-row flex-wrap items-center justify-start gap-x-2">
        <NumberInput
          name="posX"
          itemID="posX"
          value={position?.x}
          onChange={(e) => {
            if (position && targetPool != null) {
              const pool = { ...pools[targetPool] };
              // position
              if (
                pool?.sPosition &&
                position &&
                (pool.sPosition[0] != +e ||
                  pool.sPosition[2] != position.y ||
                  pool.sPosition[3] != position.z)
              ) {
                const updatedSPosition = [...pool.sPosition]; // Create a copy of the array
                updatedSPosition[0] = +e;
                updatedSPosition[1] = position.y;
                updatedSPosition[2] = position.z;
                pool.sPosition = updatedSPosition; // Assign the updated array back to pool.sPosition
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (position && targetModel != null) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sPosition &&
                position &&
                (model.sPosition[0] != +e ||
                  model.sPosition[2] != position.y ||
                  model.sPosition[3] != position.z)
              ) {
                const updatedSPosition = [...model.sPosition]; // Create a copy of the array
                updatedSPosition[0] = +e;
                updatedSPosition[1] = position.y;
                updatedSPosition[2] = position.z;
                model.sPosition = updatedSPosition; // Assign the updated array back to model.sPosition
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
          name="posY"
          itemID="posY"
          value={position?.y}
          onChange={(e) => {
            if (position && targetPool != null) {
              const pool = { ...pools[targetPool] };
              // position
              if (
                pool?.sPosition &&
                position &&
                (pool.sPosition[0] != position.x ||
                  pool.sPosition[2] != +e ||
                  pool.sPosition[3] != position.z)
              ) {
                const updatedSPosition = [...pool.sPosition]; // Create a copy of the array
                updatedSPosition[0] = position.x;
                updatedSPosition[1] = +e;
                updatedSPosition[2] = position.z;
                pool.sPosition = updatedSPosition; // Assign the updated array back to pool.sPosition
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (position && targetModel != null) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sPosition &&
                position &&
                (model.sPosition[0] != position.x ||
                  model.sPosition[2] != +e ||
                  model.sPosition[3] != position.z)
              ) {
                const updatedSPosition = [...model.sPosition]; // Create a copy of the array
                updatedSPosition[0] = position.x;
                updatedSPosition[1] = +e;
                updatedSPosition[2] = position.z;
                model.sPosition = updatedSPosition; // Assign the updated array back to model.sPosition
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
          name="posZ"
          itemID="posZ"
          value={position?.z}
          onChange={(e) => {
            if (position && targetPool != null) {
              const pool = { ...pools[targetPool] };
              // position
              if (
                pool?.sPosition &&
                position &&
                (pool.sPosition[0] != position.x ||
                  pool.sPosition[2] != position.y ||
                  pool.sPosition[3] != +e)
              ) {
                const updatedSPosition = [...pool.sPosition]; // Create a copy of the array
                updatedSPosition[0] = position.x;
                updatedSPosition[1] = position.y;
                updatedSPosition[2] = +e;
                pool.sPosition = updatedSPosition; // Assign the updated array back to pool.sPosition
                dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
              }
            } else if (position && targetModel != null) {
              const model = {
                ...pools[targetModel.pool].childrens[targetModel.model],
              };
              if (
                model?.sPosition &&
                position &&
                (model.sPosition[0] != position.x ||
                  model.sPosition[2] != position.y ||
                  model.sPosition[3] != +e)
              ) {
                const updatedSPosition = [...model.sPosition]; // Create a copy of the array
                updatedSPosition[0] = position.x;
                updatedSPosition[1] = position.y;
                updatedSPosition[2] = +e;
                model.sPosition = updatedSPosition; // Assign the updated array back to model.sPosition
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

export default Position;
