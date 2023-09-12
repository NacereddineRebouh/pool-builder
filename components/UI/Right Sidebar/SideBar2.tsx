"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setHelper } from "@/slices/helperSlice";
import rectangle from "@/public/icons/rectangle.png";
import Image from "next/image";
import SceneElement from "../sceneElement";
import Position from "./Position";
import Rotation from "./Rotation";
import Scale from "./Scale";
import Properties from "./Properties";
import { Checkbox, Select, Tabs } from "@mantine/core";
import { MdOutlineGrid3X3 } from "react-icons/md";
import { HiMiniAdjustmentsHorizontal } from "react-icons/hi2";
import { RootState } from "@/store/store";
import { ReplaceChildren, ReplacePool, selectPool } from "@/slices/poolsSlice";
import {
  setDefaultTopCyl,
  setDefaultDepthPool,
  setDefaultHeightCyl,
  setDefaultHeightPool,
  setDefaultBottomCyl,
  setDefaultWidthPool,
  setDefaultWidthHottub,
  setDefaultDepthHottub,
  setDefaultHeightHottub,
  setDefaultNbSwimJetsHottub,
  setDefaultDepthLShape,
  setDefaultWidthLShape,
  setDefaultTHeightLShape,
  setDefaultBHeightLShape,
  setDefaultWidthSquarePool,
  setDefaultHeightSquarePool,
  setDefaultDepthSquarePool,
  setDefaultNbSwimJetsLShape,
} from "@/slices/defaultsSlice";
import Properties2 from "./Properties2";
import { setUseInches } from "@/slices/propertiesSlice";
interface ISideBarProps {}

const RightSideBar: React.FC<ISideBarProps> = () => {
  // ------ Defaults ------
  const [Default, setDefault] = useState<string | null>("pool");
  const [Dwidth, setDWidth] = useState<number | null>(16);
  const [Dheight, setDHeight] = useState<number | null>(5);
  const [Dbheight, setDbHeight] = useState<number | null>(5);
  const [Dtheight, setDtHeight] = useState<number | null>(5);
  const [Ddepth, setDDepth] = useState<number | null>(12);
  const [DnbSwimjet, setDnbSwimjet] = useState<number | null>(1);
  const defaults = useAppSelector((state: RootState) => state.defaults);
  const dispatch = useAppDispatch();

  const Inches = useAppSelector(
    (state: RootState) => state.properties.UseInches
  );

  // fetch & refetch

  useEffect(() => {
    // setDWidth()
    switch (Default) {
      case "cyl":
        setDWidth(defaults.cyl.top);
        setDHeight(defaults.cyl.height);
        setDDepth(defaults.cyl.bottom);
        break;
      case "pool":
        setDWidth(defaults.pool.width);
        setDHeight(defaults.pool.height);
        setDDepth(defaults.pool.depth);
        break;
      case "squarepool":
        setDWidth(defaults.squarepool.width);
        setDHeight(defaults.squarepool.height);
        setDDepth(defaults.squarepool.depth);
        break;
      case "hottub":
        setDWidth(defaults.hottub.width);
        setDHeight(defaults.hottub.height);
        setDDepth(defaults.hottub.depth);
        setDnbSwimjet(defaults.hottub.nbSwimJet);
        break;
      case "lshape":
        setDWidth(defaults.lshape.width);
        setDtHeight(defaults.lshape.theight);
        setDbHeight(defaults.lshape.bheight);
        setDDepth(defaults.lshape.depth);
        setDnbSwimjet(defaults.lshape.nbSwimJet);

        break;
    }
  }, [Default]);

  // change values
  useEffect(() => {
    // setDWidth()
    switch (Default) {
      case "cyl":
        dispatch(setDefaultTopCyl(Dwidth));
        dispatch(setDefaultHeightCyl(Dheight));
        dispatch(setDefaultBottomCyl(Ddepth));
        break;
      case "pool":
        dispatch(setDefaultWidthPool(Dwidth));
        dispatch(setDefaultHeightPool(Dheight));
        dispatch(setDefaultDepthPool(Ddepth));
        break;
      case "squarepool":
        dispatch(setDefaultWidthSquarePool(Dwidth));
        dispatch(setDefaultHeightSquarePool(Dheight));
        dispatch(setDefaultDepthSquarePool(Ddepth));
        break;
      case "hottub":
        dispatch(setDefaultWidthHottub(Dwidth));
        dispatch(setDefaultHeightHottub(Dheight));
        dispatch(setDefaultDepthHottub(Ddepth));
        dispatch(setDefaultNbSwimJetsHottub(DnbSwimjet));
        break;
      case "lshape":
        dispatch(setDefaultWidthLShape(Dwidth));
        dispatch(setDefaultTHeightLShape(Dtheight));
        dispatch(setDefaultBHeightLShape(Dbheight));
        dispatch(setDefaultDepthLShape(Ddepth));
        dispatch(setDefaultNbSwimJetsLShape(DnbSwimjet));
        break;
    }
  }, [Dwidth, Dheight, Ddepth, DnbSwimjet, Dtheight, Dbheight]);

  // ------------ Scene props ------------

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [targetPool, setTargetPool] = useState<number | null>(null);
  const [targetModel, setTargetModel] = useState<{
    pool: number;
    model: number;
  } | null>(null);
  const pools = useAppSelector((state: RootState) => state.pools.pools);
  const targetTitle = useAppSelector(
    (state: RootState) => state.target.targetTitle
  );
  useEffect(() => {
    setSelectedElement(targetTitle);
  }, [targetTitle]);

  //------ target Props -----
  // States
  const [type, setType] = useState<string | null>(null);
  const [position, setPosition] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [scale, setScale] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [rotation, setRotation] = useState<{
    x: number;
    y: number;
    z: number;
  } | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [bheight, setbHeight] = useState<number | null>(null);
  const [theight, settHeight] = useState<number | null>(null);
  const [bordersDepth, setbordersDepth] = useState<number | null>(null);
  const [bordersHeight, setbordersHeight] = useState<number | null>(null);
  const [depth, setDepth] = useState<number | null>(null);
  const [nbSwimJetLeft, setnbSwimJetLeft] = useState<number | null>(null);
  const [nbSwimJetRight, setnbSwimJetRight] = useState<number | null>(null);
  const [nbSwimJetTop, setnbSwimJetTop] = useState<number | null>(null);
  const [nbSwimJetBottom, setnbSwimJetBottom] = useState<number | null>(null);
  const [nbSwimJettTop, setnbSwimJettTop] = useState<number | null>(null);
  const [nbSwimJettLeft, setnbSwimJettLeft] = useState<number | null>(null);
  const [nbSwimJettRight, setnbSwimJettRight] = useState<number | null>(null);

  // ----- Fetch props from models ------
  // setting dimension on Mount
  // fetch pool
  useEffect(() => {
    if (targetPool != null) {
      setDepth(pools[targetPool]?.sDepth);
      if (pools[targetPool] && pools[targetPool]?.poolType === "lshape") {
        setbHeight(pools[targetPool]?.sbHeight);
        settHeight(pools[targetPool]?.stHeight);
      } else {
        setHeight(pools[targetPool]?.sHeight);
      }

      setnbSwimJetLeft(pools[targetPool]?.nbSwimJetLeft ?? 1);
      setnbSwimJetRight(pools[targetPool]?.nbSwimJetRight ?? 1);
      setnbSwimJetTop(pools[targetPool]?.nbSwimJetTop ?? 1);
      setnbSwimJetBottom(pools[targetPool]?.nbSwimJetBottom ?? 1);
      setnbSwimJettTop(pools[targetPool]?.nbSwimJetTop ?? 1);
      setnbSwimJettLeft(pools[targetPool]?.nbSwimJettLeft ?? 1);
      setnbSwimJettRight(pools[targetPool]?.nbSwimJettRight ?? 1);
      setWidth(pools[targetPool]?.sWidth);
      setbordersDepth(pools[targetPool]?.bordersDepth);
      setbordersHeight(pools[targetPool]?.bordersHeight);

      setScale({
        x: pools[targetPool]?.sScale[0],
        y: pools[targetPool]?.sScale[1],
        z: pools[targetPool]?.sScale[2],
      });
      setRotation({
        x: pools[targetPool]?.sRotation[0],
        y: pools[targetPool]?.sRotation[1],
        z: pools[targetPool]?.sRotation[2],
      });
      setPosition({
        x: pools[targetPool]?.sPosition[0],
        y: pools[targetPool]?.sPosition[1],
        z: pools[targetPool]?.sPosition[2],
      });
    }
  }, [targetPool, pools]);

  // fetch model
  useEffect(() => {
    if (targetModel) {
      setDepth(pools[targetModel.pool]?.childrens[targetModel.model]?.sDepth);
      setHeight(pools[targetModel.pool]?.childrens[targetModel.model]?.sHeight);
      setWidth(pools[targetModel.pool]?.childrens[targetModel.model]?.sWidth);
      setScale({
        x: pools[targetModel.pool]?.childrens[targetModel.model]?.sScale[0],
        y: pools[targetModel.pool]?.childrens[targetModel.model]?.sScale[1],
        z: pools[targetModel.pool]?.childrens[targetModel.model]?.sScale[2],
      });
      setRotation({
        x: pools[targetModel.pool]?.childrens[targetModel.model]?.sRotation[0],
        y: pools[targetModel.pool]?.childrens[targetModel.model]?.sRotation[1],
        z: pools[targetModel.pool]?.childrens[targetModel.model]?.sRotation[2],
      });
      setPosition({
        x: pools[targetModel.pool]?.childrens[targetModel.model]?.sPosition[0],
        y: pools[targetModel.pool]?.childrens[targetModel.model]?.sPosition[1],
        z: pools[targetModel.pool]?.childrens[targetModel.model]?.sPosition[2],
      });
    }
  }, [targetModel, pools]);

  return (
    <div className="absolute right-0 top-0 flex h-screen w-[30%] min-w-[280px] select-none flex-col items-start justify-start overflow-y-scroll bg-slate-950/90 p-2 px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-stone-600 scrollbar-track-rounded-full scrollbar-thumb-rounded-full">
      <Tabs variant="pills" defaultValue="defaults" className="w-full">
        <Tabs.List>
          <Tabs.Tab
            key={0}
            className="!text-stone-50 hover:text-slate-900"
            value="scene"
            icon={<MdOutlineGrid3X3 size="0.8rem" />}
          >
            Elements
          </Tabs.Tab>
          <Tabs.Tab
            key={1}
            className="!text-stone-50 hover:text-slate-900"
            value="defaults"
            icon={<HiMiniAdjustmentsHorizontal size="0.8rem" />}
          >
            Defaults
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel key={0} value="scene" pt="xs" className="">
          <div className=" flex flex-col items-start justify-start gap-y-3 ">
            {/* Scene elements */}
            <div className="flex w-full flex-col items-start justify-start gap-y-2">
              <div className="text-lg font-medium text-slate-50">
                Scene elements
              </div>
              <div className="flex aspect-[3/2] max-h-60 w-full flex-col items-start justify-start gap-y-1 overflow-auto rounded-md bg-stone-200 p-1 text-slate-900 ">
                {/* scene elements */}
                {pools.length > 0 &&
                  pools.map((pool, index) => {
                    return (
                      <Fragment key={index}>
                        <SceneElement
                          index={index}
                          selectedElement={selectedElement}
                          setSelectedElement={setSelectedElement}
                          setTargetModel={setTargetModel}
                          targetModel={null}
                          setTargetPool={setTargetPool}
                          targetPool={targetPool}
                          setType={setType}
                          type={pool.poolType}
                          icon={rectangle}
                          title={pool.poolType + " " + index}
                        />
                        {pool.childrens.length > 0 &&
                          pool.childrens.map((child, index2) => {
                            return (
                              <SceneElement
                                index={index}
                                setTargetModel={setTargetModel}
                                selectedElement={selectedElement}
                                setSelectedElement={setSelectedElement}
                                targetModel={targetModel}
                                setTargetPool={setTargetPool}
                                targetPool={null}
                                index2={index2}
                                setType={setType}
                                type={child.shapeType}
                                key={index2}
                                icon={rectangle}
                                title={child.shapeType + " " + index + index2}
                              />
                            );
                          })}
                      </Fragment>
                    );
                  })}
              </div>
            </div>

            {/* Details */}

            {/* type */}
            <div className="flex w-full items-center justify-start gap-x-6">
              <div className="w-full self-start text-lg font-medium text-slate-50">
                Type
              </div>
              <div className="w-full text-lg">{type}</div>
            </div>

            {/* Transforms */}
            <div className="flex items-center justify-start gap-x-2 text-lg font-medium text-slate-50">
              <div>Switch to</div>
              <Checkbox
                checked={Inches}
                onChange={(e) => {
                  dispatch(setUseInches(e.currentTarget.checked));
                }}
                label={"Inches?"}
              />
            </div>
            <div className="w-full gap-y-2 px-3">
              <Position
                inches={Inches}
                targetPool={targetPool}
                targetModel={targetModel}
                pools={pools}
                position={position}
              />
              <Rotation
                inches={Inches}
                targetPool={targetPool}
                targetModel={targetModel}
                pools={pools}
                rotation={rotation}
              />
              <Scale
                inches={Inches}
                targetPool={targetPool}
                targetModel={targetModel}
                pools={pools}
                scale={scale}
              />
            </div>

            {/* Properties and Dimensions */}
            <div className="justify-starttext-lg flex items-center font-medium text-slate-50">
              <div>Properties and Dimensions</div>
            </div>
            <div className="w-full px-3">
              <Properties2
                inches={Inches}
                defaults={Default}
                width={width}
                depth={depth}
                height={height}
                targetPool={targetPool}
                targetModel={targetModel}
                pools={pools}
                nbSwimJetLeft={nbSwimJetLeft}
                nbSwimJetRight={nbSwimJetRight}
                nbSwimJetTop={nbSwimJetTop}
                nbSwimJetBottom={nbSwimJetBottom}
                nbSwimJettTop={nbSwimJettTop}
                nbSwimJettLeft={nbSwimJettLeft}
                nbSwimJettRight={nbSwimJettRight}
                theight={theight}
                bheight={bheight}
                bordersDepth={bordersDepth}
                bordersHeight={bordersHeight}
              />
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel key={1} value="defaults" pt="xs">
          <div className="flex h-full w-full flex-col items-start justify-start gap-y-3">
            <Select
              label="Select a model type"
              placeholder="Pick a model"
              data={[
                { value: "pool", label: "Pool" },
                { value: "cyl", label: "Cylinder Pool" },
                { value: "hottub", label: "Hottub" },
                { value: "squarepool", label: "SquarePool" },
                { value: "lshape", label: "LShape" },
                // { value: 'Fountain', label: 'Fountain' },
              ]}
              onChange={(e) => {
                setDefault(e);
              }}
            />
            <div className="flex w-full items-center justify-start gap-x-6">
              <div className="w-full self-start text-lg font-medium text-slate-50">
                Defaults of:
              </div>
              <div className="w-full text-lg">{Default}</div>
            </div>
            <div className="w-full px-3">
              <Properties
                inches={Inches}
                defaults={Default}
                width={Dwidth}
                setWidth={setDWidth}
                depth={Ddepth}
                setDepth={setDDepth}
                height={Dheight}
                setHeight={setDHeight}
                nbSwimjet={DnbSwimjet}
                setnbSwimjet={setDnbSwimjet}
                theight={Dtheight}
                settHeight={setDtHeight}
                bheight={Dbheight}
                setbHeight={setDbHeight}
              />
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default RightSideBar;
