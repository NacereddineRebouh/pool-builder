"use client";
import React from "react";
import LShape from "@/public/icons/L-Shape.png";
import rectangle from "@/public/icons/rectangle.png";
import box from "@/public/icons/cube.png";
import cyl from "@/public/icons/cylinder.png";
import plus from "@/public/icons/plus.png";
import roundSteps from "@/public/icons/round-steps.png";
import waterblade from "@/public/icons/water-blade.png";
import wallwater from "@/public/icons/waterjet.png";
import infin from "@/public/icons/infinityEdge.png";
import poolWithSteps from "@/public/icons/pool-with-steps.png";
import fountain from "@/public/icons/fountain.png";
import corner from "@/public/icons/corner-steps.png";
import cornerRounded from "@/public/icons/corner-round-steps.png";
import swimjet from "@/public/icons/swim-jet.png";
import inset from "@/public/icons/insetStep.png";
import Icon from "./Icon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setHelper } from "@/slices/helperSlice";
import IconMenu from "./IconMenu";
import { RootState } from "@/store/store";
interface ISideBarProps {}

const SideBar: React.FC<ISideBarProps> = () => {
  const dispatch = useAppDispatch();
  // ------- //
  const OnMouseDownHandler = (
    event: React.PointerEvent<HTMLButtonElement>,
    typeShape: string
  ) => {
    dispatch(setHelper({ mouseDown: true, type: typeShape }));
  };
  // ------- //
  const Pools = useAppSelector((state: RootState) => state.pools.pools);

  return (
    <div className="absolute left-0 top-0 flex h-screen select-none flex-col items-center justify-start gap-y-1 bg-slate-950/90 p-2">
      <Icon
      disabled={false}
        icon={box.src}
        onPointerDown={(e) => OnMouseDownHandler(e, "hottub")}
      />
      <Icon
      disabled={false}
        icon={rectangle.src}
        onPointerDown={(e) => OnMouseDownHandler(e, "pool")}
      />
      <Icon
      disabled={false}
        icon={cyl.src}
        onPointerDown={(e) => OnMouseDownHandler(e, "cyl")}
      />
      <Icon
      disabled={false}
        icon={poolWithSteps.src}
        onPointerDown={(e) => OnMouseDownHandler(e, "poolWithSteps")}
      />
      <Icon
      disabled={false}
        icon={LShape.src}
        onPointerDown={(e) => OnMouseDownHandler(e, "lshape")}
      />
      <IconMenu icon={plus.src}>
        <div className="flex items-center justify-start gap-x-1">
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={cornerRounded.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "cornerRounded")}
          />
          {/* <Icon
          disabled={Pools.length>0 ?true: false} icon={roundSteps.src} onPointerDown={(e)=>OnMouseDownHandler(e,"roundSteps")}/> */}
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={corner.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "SquareSteps")}
          />
        </div>
        <div className="flex items-center justify-start gap-x-1">
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={fountain.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "Fountain")}
          />
          <Icon
            disabled={Pools.length > 0 ? false : true}
            key={1}
            icon={infin.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "InfinityEdge")}
          />
        </div>
        <div className="flex items-center justify-start gap-x-1">
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={swimjet.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "SwimJet")}
          />
          {/* <Icon
          disabled={Pools.length>0 ?true: false} icon={corner.src} onPointerDown={(e)=>OnMouseDownHandler(e,"Steps")}/> */}
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={inset.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "insetSteps")}
          />
        </div>
        <div className="flex items-center justify-start gap-x-1">
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={waterblade.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "Waterblade")}
          />
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={wallwater.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "WallWaterfall")}
          />
        </div>
        <div className="flex items-center justify-start gap-x-1">
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={roundSteps.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "RoundSteps")}
          />
          <Icon
            disabled={Pools.length > 0 ? false : true}
            icon={roundSteps.src}
            onPointerDown={(e) => OnMouseDownHandler(e, "Steps")}
          />
        </div>
      </IconMenu>
    </div>
  );
};

export default SideBar;
