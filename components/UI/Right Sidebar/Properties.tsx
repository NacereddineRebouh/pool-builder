"use client";
import { inchesToMeters, metersToInches } from "@/utils/getActiveAxis";
import { NumberInput } from "@mantine/core";
import * as React from "react";

interface IPropertiesProps {
  width: number | null;
  setWidth: React.Dispatch<React.SetStateAction<number | null>>;
  height: number | null;
  setHeight: React.Dispatch<React.SetStateAction<number | null>>;
  theight: number | null;
  settHeight: React.Dispatch<React.SetStateAction<number | null>>;
  bheight: number | null;
  setbHeight: React.Dispatch<React.SetStateAction<number | null>>;
  depth: number | null;
  setDepth: React.Dispatch<React.SetStateAction<number | null>>;
  nbSwimjet: number | null;
  setnbSwimjet: React.Dispatch<React.SetStateAction<number | null>>;
  defaults: string | null;
  inches: boolean;
}

const Properties: React.FunctionComponent<IPropertiesProps> = ({
  defaults,
  width,
  setWidth,
  height,
  setHeight,
  theight,
  settHeight,
  bheight,
  setbHeight,
  depth,
  setDepth,
  nbSwimjet,
  setnbSwimjet,
  inches,
}) => {
  return (
    <div className="flex w-full flex-col items-start justify-start">
      {/* Width (Length) */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {defaults === "cyl" ? "Top" : "Length"}
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
              setWidth(val);
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
      {/* Height (Depth) */}
      {defaults !== "lshape" ? (
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
                setHeight(val);
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
      ) : (
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
                  settHeight(val);
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
                name="bheight"
                onChange={(e) => {
                  let val = +e;
                  if (inches) {
                    val = inchesToMeters(+e);
                  }
                  setbHeight(val);
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
      )}
      {/* Depth (Width) */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {defaults === "cyl" ? "Bottom" : "Width"}
        </div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <NumberInput
            type="number"
            onChange={(e) => {
              let val = +e;
              if (inches) {
                val = inchesToMeters(+e);
              }
              setDepth(val);
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
      {defaults === "hottub" && (
        <div className="flex w-full items-center justify-start gap-x-6">
          <div className="w-full self-start text-lg text-slate-50">
            Number of SwimJets
          </div>
          <div className="flex w-full items-center justify-start gap-x-2">
            <NumberInput
              type="number"
              onChange={(e) => setnbSwimjet(+e)}
              name="nbSwimjet"
              className="max-w-[80px] bg-transparent text-slate-50"
              step={1}
              precision={0}
              value={nbSwimjet ? nbSwimjet : 0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
