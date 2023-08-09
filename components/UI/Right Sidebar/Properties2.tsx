"use client";
import { PoolType, ReplaceChildren, ReplacePool } from "@/slices/poolsSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  IgnoreOrderCompare,
  inchesToMeters,
  metersToInches,
} from "@/utils/getActiveAxis";
import { Checkbox, Group, NumberInput, Radio } from "@mantine/core";
import * as React from "react";
import { useEffect, useState } from "react";

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
  theight: number | null;
  settHeight: React.Dispatch<React.SetStateAction<number | null>>;
  bheight: number | null;
  setbHeight: React.Dispatch<React.SetStateAction<number | null>>;
  inches: boolean;
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
  theight,
  settHeight,
  bheight,
  setbHeight,
  inches,
}) => {
  const dispatch = useAppDispatch();
  const [BenchSeatings, setBenchSeatings] = useState<string[]>([]);
  useEffect(() => {
    if (targetPool != null) {
      setBenchSeatings(pools[targetPool]?.BenchSeatings);
    }
  }, [pools, targetPool, targetModel]);
  return (
    <div className="flex w-full flex-col items-start justify-start">
      {/* Width (Length) */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {targetPool != null &&
          pools[targetPool] &&
          pools[targetPool].poolType === "cyl"
            ? "Top"
            : targetPool != null &&
              pools[targetPool] &&
              pools[targetPool].poolType === "lshape"
            ? "Width"
            : "Length"}
        </div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <NumberInput
            type="number"
            name="width"
            onChange={(e) => {
              let val = +e;
              if (inches) {
                val = inchesToMeters(+e);
              }
              if (targetPool != null && pools[targetPool]) {
                const pool = { ...pools[targetPool] };
                if (val != pool.sWidth) {
                  pool.sWidth = val; // Assign the updated array back to pool.sRotation
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
                if (val != model.sWidth) {
                  model.sWidth = val; // Assign the updated array back to pool.sRotation
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
            precision={2}
            value={width ? (inches ? metersToInches(width) : width) : 0}
          />
          <div className="mx-1 font-medium text-slate-50">
            {inches ? "Inches" : "Meters"}
          </div>
        </div>
      </div>
      {/* Height */}
      {targetPool != null &&
      pools[targetPool] &&
      pools[targetPool].poolType === "lshape" ? (
        <>
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Top Height
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                name="theight"
                onChange={(e) => {
                  let val = +e;
                  if (inches) {
                    val = inchesToMeters(+e);
                  }
                  if (targetPool != null && pools[targetPool]) {
                    const pool = { ...pools[targetPool] };
                    if (val != pool.stHeight) {
                      pool.stHeight = val; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: pool })
                      );
                    }
                    // height(e.currentTarget.value as unknown as number)
                  }
                }}
                className="max-w-[80px] bg-transparent text-slate-50"
                step={0.1}
                precision={2}
                value={
                  theight ? (inches ? metersToInches(theight) : theight) : 0
                }
              />
              <div className="mx-1 font-medium text-slate-50">
                {inches ? "Inches" : "Meters"}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Bottom Height
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                name="nheight"
                onChange={(e) => {
                  let val = +e;
                  if (inches) {
                    val = inchesToMeters(+e);
                  }
                  if (targetPool != null && pools[targetPool]) {
                    console.log("bHeight, lshape: ", pools[targetPool]);
                    const pool = { ...pools[targetPool] };
                    if (val != pool.sbHeight) {
                      console.log("changing ....");
                      pool.sbHeight = val; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: pool })
                      );
                    }
                    // height(e.currentTarget.value as unknown as number)
                  }
                }}
                className="max-w-[80px] bg-transparent text-slate-50"
                step={0.1}
                precision={2}
                value={
                  bheight ? (inches ? metersToInches(bheight) : bheight) : 0
                }
              />
              <div className="mx-1 font-medium text-slate-50">
                {inches ? "Inches" : "Meters"}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">Depth</div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                name="height"
                onChange={(e) => {
                  let val = +e;
                  if (inches) {
                    val = inchesToMeters(+e);
                  }
                  if (targetPool != null && pools[targetPool]) {
                    const pool = { ...pools[targetPool] };
                    if (val != pool.sHeight) {
                      pool.sHeight = val; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: pool })
                      );
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
                    if (val != model.sHeight) {
                      model.sHeight = val; // Assign the updated array back to pool.sRotation
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
                precision={2}
                value={height ? (inches ? metersToInches(height) : height) : 0}
              />
              <div className="mx-1 font-medium text-slate-50">
                {inches ? "Inches" : "Meters"}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Depth (Width) */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {targetPool != null &&
          pools[targetPool] &&
          pools[targetPool].poolType === "cyl"
            ? "Bottom"
            : targetPool != null &&
              pools[targetPool] &&
              pools[targetPool].poolType === "lshape"
            ? "Depth"
            : "Width"}
        </div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <NumberInput
            type="number"
            onChange={(e) => {
              let val = +e;
              if (inches) {
                val = inchesToMeters(+e);
              }
              if (targetPool != null && pools[targetPool]) {
                const pool = { ...pools[targetPool] };
                if (val != pool.sDepth) {
                  pool.sDepth = val; // Assign the updated array back to pool.sRotation
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
                if (val != model.sDepth) {
                  model.sDepth = val; // Assign the updated array back to pool.sRotation
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
            precision={2}
            value={depth ? (inches ? metersToInches(depth) : depth) : 0}
          />
          <div className="mx-1 font-medium text-slate-50">
            {inches ? "Inches" : "Meters"}
          </div>
        </div>
      </div>
      {/* nbSwimjet */}
      {targetPool != null &&
        pools[targetPool] &&
        // pools[targetPool].poolType === "hottub" &&
        pools[targetPool].childrens.filter(
          (obj) => obj.shapeType === "RegularJets"
        ).length > 0 && (
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
                step={1}
                value={nbSwimjet ? nbSwimjet : 0}
              />
            </div>
          </div>
        )}
      {/* BenchSeating */}
      {targetPool != null &&
        pools[targetPool] &&
        (pools[targetPool].poolType === "hottub" ||
          pools[targetPool].poolType === "pool") && (
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              BenchSeatings
            </div>
            <div className="flex w-full items-center justify-start gap-x-2 text-slate-50">
              <Checkbox.Group
                value={BenchSeatings}
                onChange={(value) => {
                  const pool = { ...pools[targetPool] };
                  if (!IgnoreOrderCompare(value, pool.BenchSeatings)) {
                    console.log(pool.BenchSeatings);
                    console.log(value);
                    pool.BenchSeatings = value;
                    dispatch(
                      ReplacePool({ poolIndex: targetPool, pool: pool })
                    );
                  }
                }}
              >
                <Group mt="xs">
                  <Checkbox color="gray" value="left" label="Left" />
                  <Checkbox color="gray" value="top" label="Top" />
                  <Checkbox color="gray" value="right" label="Right" />
                  <Checkbox color="gray" value="bottom" label="Bottom" />
                </Group>
              </Checkbox.Group>
            </div>
          </div>
        )}
    </div>
  );
};

export default Properties2;
