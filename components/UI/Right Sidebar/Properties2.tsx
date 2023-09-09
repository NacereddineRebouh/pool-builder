"use client";
import { PoolType, ReplaceChildren, ReplacePool } from "@/slices/poolsSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  IgnoreOrderCompare,
  inchesToMeters,
  metersToInches,
} from "@/utils/getActiveAxis";
import {
  Button,
  Checkbox,
  Group,
  Menu,
  NumberInput,
  Radio,
} from "@mantine/core";
import * as React from "react";
import { useEffect, useState } from "react";

interface IPropertiesProps {
  width: number | null;
  height: number | null;
  depth: number | null;
  bordersDepth: number | null;
  bordersHeight: number | null;
  defaults: string | null;
  targetPool: number | null;
  targetModel: { pool: number; model: number } | null;
  pools: PoolType[];
  theight: number | null;
  bheight: number | null;
  inches: boolean;
  nbSwimJetLeft: number | null;
  nbSwimJetRight: number | null;
  nbSwimJetTop: number | null;
  nbSwimJetBottom: number | null;
}

const Properties2: React.FunctionComponent<IPropertiesProps> = ({
  targetModel,
  targetPool,
  pools,
  width,
  bordersHeight,
  bordersDepth,
  height,
  depth,
  theight,
  bheight,
  inches,
  nbSwimJetLeft,
  nbSwimJetRight,
  nbSwimJetTop,
  nbSwimJetBottom,
}) => {
  const dispatch = useAppDispatch();
  const [BenchSeatings, setBenchSeatings] = useState<string[]>([]);
  const [CornerSteps, setCornerSteps] = useState<string[]>([]);
  const [enableWater, setEnableWater] = useState<boolean>(false);
  useEffect(() => {
    if (targetPool != null) {
      setBenchSeatings(pools[targetPool]?.BenchSeatings);
      setCornerSteps(pools[targetPool]?.CornerSteps);
      setEnableWater(pools[targetPool]?.enableWater);
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
      <div className="my-1 flex w-full items-center justify-start gap-x-6">
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

      {/* bordersDepth (Wall Thickness)*/}
      {targetPool != null && pools[targetPool] && (
        <div className="my-1 flex w-full items-center justify-start gap-x-6">
          <div className="w-full self-start text-lg text-slate-50">
            Wall Thickness
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
                  if (val != pool.bordersDepth) {
                    pool.bordersDepth = val; // Assign the updated array back to pool.sRotation
                    dispatch(
                      ReplacePool({ poolIndex: targetPool, pool: pool })
                    );
                  }
                  // setdepth(e.currentTarget.value as unknown as number)
                }
              }}
              name="depth"
              className="max-w-[80px] bg-transparent text-slate-50"
              step={0.1}
              precision={2}
              value={
                bordersDepth
                  ? inches
                    ? metersToInches(bordersDepth)
                    : bordersDepth
                  : metersToInches(0.25)
              }
            />
            <div className="mx-1 font-medium text-slate-50">
              {inches ? "Inches" : "Meters"}
            </div>
          </div>
        </div>
      )}

      {/* bordersHeight (Wall Height)*/}
      {targetPool != null && pools[targetPool] && (
        <div className="my-1 flex w-full items-center justify-start gap-x-6">
          <div className="w-full self-start text-lg text-slate-50">
            Wall Height
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
                  if (val != pool.bordersHeight) {
                    pool.bordersHeight = val; // Assign the updated array back to pool.sRotation
                    dispatch(
                      ReplacePool({ poolIndex: targetPool, pool: pool })
                    );
                  }
                  // setdepth(e.currentTarget.value as unknown as number)
                }
              }}
              name="height"
              className="max-w-[80px] bg-transparent text-slate-50"
              step={0.1}
              precision={2}
              value={
                bordersHeight
                  ? inches
                    ? metersToInches(bordersHeight)
                    : bordersHeight
                  : metersToInches(0.05)
              }
            />
            <div className="mx-1 font-medium text-slate-50">
              {inches ? "Inches" : "Meters"}
            </div>
          </div>
        </div>
      )}

      <RegularJets
        targetPool={targetPool}
        pool={pools}
        nbSwimJetLeft={nbSwimJetLeft}
        nbSwimJetRight={nbSwimJetRight}
        nbSwimJetTop={nbSwimJetTop}
        nbSwimJetBottom={nbSwimJetBottom}
      />
      {/* BenchSeating */}
      {targetPool != null &&
        pools[targetPool] &&
        (pools[targetPool].poolType === "hottub" ||
          pools[targetPool].poolType === "pool" ||
          pools[targetPool].poolType === "squarepool") && (
          <div className="my-2 flex w-full items-center justify-start gap-x-6">
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
      {/* Upper CornerSteps */}
      {/* {targetPool != null &&
        pools[targetPool] &&
        (pools[targetPool].poolType === "hottub" ||
          pools[targetPool].poolType === "pool" ||
          pools[targetPool].poolType === "squarepool") && (
          <div className="my-2 flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Upper Corner Steps
            </div>
            <div className="flex w-full items-center justify-start gap-x-2 text-slate-50">
              <Menu closeOnItemClick={false}>
                <Menu.Target>
                  <Button color="gray">Menu</Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Checkbox.Group
                    value={CornerSteps}
                    onChange={(value) => {
                      const pool = { ...pools[targetPool] };
                      if (!IgnoreOrderCompare(value, pool.CornerSteps)) {
                        console.log(pool.CornerSteps);
                        console.log(value);
                        pool.CornerSteps = value;
                        dispatch(
                          ReplacePool({ poolIndex: targetPool, pool: pool })
                        );
                      }
                    }}
                  >
                    <Group>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="topleft" />
                          <p>TopLeft</p>
                        </div>
                      </Menu.Item>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="topright" />
                          <p>TopRight</p>
                        </div>
                      </Menu.Item>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="bottomright" />
                          <p>BottomRight</p>
                        </div>
                      </Menu.Item>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="bottomleft" />
                          <p>BottomLeft</p>
                        </div>
                      </Menu.Item>
                    </Group>
                  </Checkbox.Group>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        )} */}
      {/* Lower CornerSteps */}
      {/* {targetPool != null &&
        pools[targetPool] &&
        (pools[targetPool].poolType === "hottub" ||
          pools[targetPool].poolType === "pool" ||
          pools[targetPool].poolType === "squarepool") && (
          <div className="my-2 flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Lower Corner Steps
            </div>
            <div className="flex w-full items-center justify-start gap-x-2 text-slate-50">
              <Menu closeOnItemClick={false}>
                <Menu.Target>
                  <Button color="gray">Menu2</Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Checkbox.Group
                    value={CornerSteps}
                    onChange={(value) => {
                      const pool = { ...pools[targetPool] };
                      if (!IgnoreOrderCompare(value, pool.CornerSteps)) {
                        console.log(pool.CornerSteps);
                        console.log(value);
                        pool.CornerSteps = value;
                        dispatch(
                          ReplacePool({ poolIndex: targetPool, pool: pool })
                        );
                      }
                    }}
                  >
                    <Group>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="lowertopleft" />
                          <p>TopLeft</p>
                        </div>
                      </Menu.Item>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="lowertopright" />
                          <p>TopRight</p>
                        </div>
                      </Menu.Item>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="lowerbottomright" />
                          <p>BottomRight</p>
                        </div>
                      </Menu.Item>
                      <Menu.Item className="font-medium text-slate-900">
                        <div className="flex items-center justify-start gap-x-4">
                          <Checkbox color="gray" value="lowerbottomleft" />
                          <p>BottomLeft</p>
                        </div>
                      </Menu.Item>
                    </Group>
                  </Checkbox.Group>
                </Menu.Dropdown>
              </Menu>
            </div>
          </div>
        )} */}

      {/* Enable water */}
      {targetPool != null &&
        pools[targetPool] &&
        (pools[targetPool].poolType === "hottub" ||
          pools[targetPool].poolType === "pool" ||
          pools[targetPool].poolType === "lshape" ||
          pools[targetPool].poolType === "squarepool") && (
          <div className="my-1 flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Water surface
            </div>
            <div className="flex w-full items-center justify-start gap-x-2 text-slate-50">
              <Checkbox
                checked={enableWater}
                onChange={(event) => {
                  setEnableWater(event.currentTarget.checked);
                  const pool = { ...pools[targetPool] };
                  pool.enableWater = event.currentTarget.checked;
                  dispatch(ReplacePool({ poolIndex: targetPool, pool: pool }));
                }}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default Properties2;

const RegularJets = ({
  targetPool,
  pool,
  nbSwimJetLeft,
  nbSwimJetRight,
  nbSwimJetTop,
  nbSwimJetBottom,
}: {
  targetPool: number | null;
  pool: PoolType[];
  nbSwimJetLeft: number | null;
  nbSwimJetRight: number | null;
  nbSwimJetTop: number | null;
  nbSwimJetBottom: number | null;
}) => {
  const dispatch = useAppDispatch();
  return (
    <>
      {/* nbSwimjet Left */}
      {targetPool != null &&
        pool[targetPool] &&
        pool[targetPool].childrens.filter(
          (obj) => obj.shapeType === "RegularJets"
        ).length > 0 && (
          <div className="my-2 flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              RegularJets Left
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                onChange={(e) => {
                  if (targetPool != null && pool[targetPool]) {
                    const temppool = { ...pool[targetPool] };
                    if (+e != temppool.nbSwimJetLeft) {
                      temppool.nbSwimJetLeft = +e; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: temppool })
                      );
                    }
                    // setdepth(e.currentTarget.value as unknown as number)
                  }
                }}
                name="nbSwimJetLeft"
                className="max-w-[80px] bg-transparent text-slate-50"
                step={1}
                value={nbSwimJetLeft ? nbSwimJetLeft : 0}
              />
            </div>
          </div>
        )}
      {/* nbSwimjet Right */}
      {targetPool != null &&
        pool[targetPool] &&
        pool[targetPool].childrens.filter(
          (obj) => obj.shapeType === "RegularJets"
        ).length > 0 && (
          <div className="my-2 flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              RegularJets Right
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                onChange={(e) => {
                  if (targetPool != null && pool[targetPool]) {
                    const temppool = { ...pool[targetPool] };
                    if (+e != temppool.nbSwimJetRight) {
                      temppool.nbSwimJetRight = +e; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: temppool })
                      );
                    }
                    // setdepth(e.currentTarget.value as unknown as number)
                  }
                }}
                name="nbSwimJetRight"
                className="max-w-[80px] bg-transparent text-slate-50"
                step={1}
                value={nbSwimJetRight ? nbSwimJetRight : 0}
              />
            </div>
          </div>
        )}
      {/* nbSwimjet Top */}
      {targetPool != null &&
        pool[targetPool] &&
        pool[targetPool].childrens.filter(
          (obj) => obj.shapeType === "RegularJets"
        ).length > 0 && (
          <div className="my-2 flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              RegularJets Top
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                onChange={(e) => {
                  if (targetPool != null && pool[targetPool]) {
                    const temppool = { ...pool[targetPool] };
                    if (+e != temppool.nbSwimJetTop) {
                      temppool.nbSwimJetTop = +e; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: temppool })
                      );
                    }
                    // setdepth(e.currentTarget.value as unknown as number)
                  }
                }}
                name="nbSwimJetTop"
                className="max-w-[80px] bg-transparent text-slate-50"
                step={1}
                value={nbSwimJetTop ? nbSwimJetTop : 0}
              />
            </div>
          </div>
        )}
      {/* nbSwimjet Bottom */}
      {targetPool != null &&
        pool[targetPool] &&
        pool[targetPool].childrens.filter(
          (obj) => obj.shapeType === "RegularJets"
        ).length > 0 && (
          <div className="my-2 flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              RegularJets Bottom
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <NumberInput
                type="number"
                onChange={(e) => {
                  if (targetPool != null && pool[targetPool]) {
                    const temppool = { ...pool[targetPool] };
                    if (+e != temppool.nbSwimJetBottom) {
                      temppool.nbSwimJetBottom = +e; // Assign the updated array back to pool.sRotation
                      dispatch(
                        ReplacePool({ poolIndex: targetPool, pool: temppool })
                      );
                    }
                    // setdepth(e.currentTarget.value as unknown as number)
                  }
                }}
                name="nbSwimJetBottom"
                className="max-w-[80px] bg-transparent text-slate-50"
                step={1}
                value={nbSwimJetBottom ? nbSwimJetBottom : 0}
              />
            </div>
          </div>
        )}
    </>
  );
};
