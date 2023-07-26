import Image, { StaticImageData } from "next/image";
import * as React from "react";
import rectangle from "@/public/icons/rectangle.png";
import { off } from "process";

interface SceneElementProps {
  icon?: StaticImageData;
  title: string;
  type: string;
  index: number;
  index2?: number;
  setType: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedElement: React.Dispatch<React.SetStateAction<string | null>>;
  selectedElement: string | null;
  targetPool: number | null;
  setTargetPool: React.Dispatch<React.SetStateAction<number | null>>;
  targetModel: { pool: number; model: number } | null;
  setTargetModel: React.Dispatch<
    React.SetStateAction<{ pool: number; model: number } | null>
  >;
}

const SceneElement: React.FunctionComponent<SceneElementProps> = ({
  icon,
  selectedElement,
  setSelectedElement,
  type,
  setTargetModel,
  targetModel,
  targetPool,
  setTargetPool,
  setType,
  index,
  index2,
  title = "Pool",
}) => {
  return (
    <div
      onClick={(e) => {
        setSelectedElement(title);
        e.stopPropagation();
        setType(type.toLocaleUpperCase());
        console.log(type);
        if (
          type === "pool" ||
          type === "poolWithSteps" ||
          type === "L-Shape" ||
          type === "cyl"
        ) {
          setTargetModel(null);
          if (targetPool != index) {
            setTargetPool(index);
          }
        } else {
          // if((targetModel?.model!=index2 || targetModel?.pool!= index || !targetModel)){
          setTargetPool(null);
          console.log(targetModel, index, index2);
          if (targetModel == null && index2 != undefined) {
            console.log(0);
            setTargetModel({ pool: index, model: index2 });
            // Model changed && !pool changed
          } else if (
            targetModel &&
            index2 != undefined &&
            index != undefined &&
            targetModel.model != index2 &&
            targetModel.pool == index
          ) {
            console.log(1);
            setTargetModel({ pool: index, model: index2 });
            // Model changed && pool changed
          } else if (
            targetModel &&
            index2 != undefined &&
            index != undefined &&
            targetModel.model != index2 &&
            targetModel.pool != index
          ) {
            console.log(2);
            setTargetModel({ pool: index, model: index2 });
          }
          // }
        }
      }}
      className={`${
        selectedElement == title
          ? "scale-[.98] bg-slate-900/10 shadow-md"
          : "scale-100 shadow-none"
      } relative flex h-8 w-full cursor-pointer items-center justify-start gap-x-2 rounded-md border-[1px] border-slate-800 transition-all duration-75 hover:bg-slate-900/10 active:bg-slate-900/20`}
    >
      <Image
        src={rectangle.src}
        width={30}
        alt={"Icon"}
        height={100}
        className="aspect-auto h-full object-scale-down"
      />
      <div>{title}</div>
    </div>
  );
};

export default SceneElement;
