"use client";
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
}) => {
  return (
    <div className="flex w-full flex-col items-start justify-start">
      {/* Width */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {defaults === "cyl" ? "Top" : "Width"}
        </div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <input
            type="number"
            name="width"
            onChange={(e) =>
              setWidth(e.currentTarget.value as unknown as number)
            }
            className="max-w-[80px] bg-transparent text-slate-50"
            step={0.1}
            value={width ? width : 0}
          />
        </div>
      </div>
      {/* Height */}
      {defaults !== "lshape" ? (
        <div className="flex w-full items-center justify-start gap-x-6">
          <div className="w-full self-start text-lg text-slate-50">Height</div>
          <div className="flex w-full items-center justify-start gap-x-2">
            <input
              type="number"
              name="height"
              onChange={(e) =>
                setHeight(e.currentTarget.value as unknown as number)
              }
              className="max-w-[80px] bg-transparent text-slate-50"
              step={0.1}
              value={height ? height : 0}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Top Height
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <input
                type="number"
                name="theight"
                onChange={(e) =>
                  settHeight(e.currentTarget.value as unknown as number)
                }
                className="max-w-[80px] bg-transparent text-slate-50"
                step={0.1}
                value={theight ? theight : 0}
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-start gap-x-6">
            <div className="w-full self-start text-lg text-slate-50">
              Bottom Height
            </div>
            <div className="flex w-full items-center justify-start gap-x-2">
              <input
                type="number"
                name="bheight"
                onChange={(e) =>
                  setbHeight(e.currentTarget.value as unknown as number)
                }
                className="max-w-[80px] bg-transparent text-slate-50"
                step={0.1}
                value={bheight ? bheight : 0}
              />
            </div>
          </div>
        </>
      )}
      {/* Depth */}
      <div className="flex w-full items-center justify-start gap-x-6">
        <div className="w-full self-start text-lg text-slate-50">
          {defaults === "cyl" ? "Bottom" : "Depth"}
        </div>
        <div className="flex w-full items-center justify-start gap-x-2">
          <input
            type="number"
            onChange={(e) =>
              setDepth(e.currentTarget.value as unknown as number)
            }
            name="depth"
            className="max-w-[80px] bg-transparent text-slate-50"
            step={0.1}
            value={depth ? depth : 0}
          />
        </div>
      </div>
      {/* nbSwimjet */}
      {defaults === "hottub" && (
        <div className="flex w-full items-center justify-start gap-x-6">
          <div className="w-full self-start text-lg text-slate-50">
            Number of SwimJets
          </div>
          <div className="flex w-full items-center justify-start gap-x-2">
            <input
              type="number"
              onChange={(e) =>
                setnbSwimjet(e.currentTarget.value as unknown as number)
              }
              name="nbSwimjet"
              className="max-w-[80px] bg-transparent text-slate-50"
              step={0.1}
              value={nbSwimjet ? nbSwimjet : 0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
