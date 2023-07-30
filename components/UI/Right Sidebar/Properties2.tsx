"use client";
import { PoolType, ReplaceChildren, ReplacePool } from "@/slices/poolsSlice";
import { useAppDispatch } from "@/store/hooks";
import { IgnoreOrderCompare } from "@/utils/getActiveAxis";
import { Checkbox, Group, NumberInput, Radio } from "@mantine/core";
import * as React from "react";

interface IPropertiesProps {
  width: number | null;
  setWidth: React.Dispatch<React.SetStateAction<number | null>>;
  height: number | null;
  setHeight: React.Dispatch<React.SetStateAction<number | null>>;
  depth: number | null;
  setDepth: React.Dispatch<React.SetStateAction<number | null>>;
  defaults: string | null;
  nbSwimjet: number | null;
  setnbSwimjet: React.Dispatch<React.SetStateAction<number | null>>;
  targetPool: number | null;
  targetModel: { pool: number; model: number } | null;
  pools: PoolType[];
}

const Properties2: React.FunctionComponent<IPropertiesProps> = ({
  targetModel,
  targetPool,
  pools,
  defaults,
  width,
  setWidth,
  height,
  setHeight,
  depth,
  setDepth,
  nbSwimjet,
  setnbSwimjet,
}) => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex w-full flex-col items-start justify-start">
      {/* Width */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {defaults === "cyl" ? "Top" : "Width"}
        </div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <NumberInput
            type="number"
            name="width"
            onChange={(e) => {
              if (targetPool != null && pools[targetPool]) {
                const pool = { ...pools[targetPool] };
                if (e != pool.sWidth) {
                  pool.sWidth = +e; // Assign the updated array back to pool.sRotation
                  dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
                }
                // setWidth(e.currentTarget.value as unknown as number)
              } else if (
                targetModel &&
                pools[targetModel.pool] &&
                pools[targetModel.pool].childrens[targetModel.model]
              ) {
                const model = {
                  ...pools[targetModel.pool].childrens[targetModel.model],
                };
                if (e != model.sWidth) {
                  model.sWidth = +e; // Assign the updated array back to pool.sRotation
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
            className="max-w-[80px] bg-transparent text-slate-50"
            step={0.1}
            value={width ? width : 0}
          />
        </div>
      </div>
      {/* Height */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">Height</div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <NumberInput
            type="number"
            name="height"
            onChange={(e) => {
              if (targetPool != null && pools[targetPool]) {
                const pool = { ...pools[targetPool] };
                if (+e != pool.sHeight) {
                  pool.sHeight = +e; // Assign the updated array back to pool.sRotation
                  dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
                }
                // height(e.currentTarget.value as unknown as number)
              } else if (
                targetModel &&
                pools[targetModel.pool] &&
                pools[targetModel.pool].childrens[targetModel.model]
              ) {
                const model = {
                  ...pools[targetModel.pool].childrens[targetModel.model],
                };
                if (+e != model.sHeight) {
                  model.sHeight = +e; // Assign the updated array back to pool.sRotation
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
            className="max-w-[80px] bg-transparent text-slate-50"
            step={0.1}
            value={height ? height : 0}
          />
        </div>
      </div>
      {/* Depth */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {defaults === "cyl" ? "Bottom" : "Depth"}
        </div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <NumberInput
            type="number"
            onChange={(e) => {
              if (targetPool != null && pools[targetPool]) {
                const pool = { ...pools[targetPool] };
                if (+e != pool.sDepth) {
                  pool.sDepth = +e; // Assign the updated array back to pool.sRotation
                  dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
                }
                // setdepth(e.currentTarget.value as unknown as number)
              } else if (
                targetModel &&
                pools[targetModel.pool] &&
                pools[targetModel.pool].childrens[targetModel.model]
              ) {
                const model = {
                  ...pools[targetModel.pool].childrens[targetModel.model],
                };
                if (+e != model.sDepth) {
                  model.sDepth = +e; // Assign the updated array back to pool.sRotation
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
            name="depth"
            className="max-w-[80px] bg-transparent text-slate-50"
            step={0.1}
            value={depth ? depth : 0}
          />
        </div>
      </div>
      {/* nbSwimjet */}
      {targetPool != null &&
        pools[targetPool] &&
        pools[targetPool].poolType === "hottub" && (
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Swimjets
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                onChange={(e) => {
                  if (targetPool != null && pools[targetPool]) {
                    const pool = { ...pools[targetPool] };
                    if (+e != pool.nbSwimJet) {
                      pool.nbSwimJet = +e; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: pool })
                      );
                    }
                    // setdepth(e.currentTarget.value as unknown as number)
                  }
                }}
                name="nbSwimJet"
                className="max-w-[80px] bg-transparent text-slate-50"
                step={0.1}
                value={nbSwimjet ? nbSwimjet : 0}
              />
            </div>
          </div>
        )}
      {/* BenchSeating */}
      {targetPool != null &&
        pools[targetPool] &&
        pools[targetPool].poolType === "hottub" && (
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              BenchSeatings
            </div>
            <div className="flex w-full items-center justify-start gap-x-2 text-slate-50">
              <Checkbox.Group
                onChange={(value) => {
                  const pool = { ...pools[targetPool] };
                  if (!IgnoreOrderCompare(value, pool.BenchSeatings)) {
                    pool.BenchSeatings = value; // Assign the updated array back to pool.sRotation
                    dispatch(
                      ReplacePool({ poolIndex: targetPool, pool: pool })
                    );
                  }
                }}
              >
                <Group mt="xs">
                  <Checkbox
                    checked={pools[targetPool]?.BenchSeatings?.includes("left")}
                    color="gray"
                    value="left"
                    label="Left"
                  />
                  <Checkbox
                    checked={pools[targetPool]?.BenchSeatings?.includes("top")}
                    color="gray"
                    value="top"
                    label="Top"
                  />
                  <Checkbox
                    checked={pools[targetPool]?.BenchSeatings?.includes(
                      "right"
                    )}
                    color="gray"
                    value="right"
                    label="Right"
                  />
                  <Checkbox
                    checked={pools[targetPool]?.BenchSeatings?.includes(
                      "bottom"
                    )}
                    color="gray"
                    value="bottom"
                    label="Bottom"
                  />
                </Group>
              </Checkbox.Group>
            </div>
          </div>
        )}
    </div>
  );
};

export default Properties2;
