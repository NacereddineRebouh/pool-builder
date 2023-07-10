import { FC, Fragment, useRef } from "react";
import SingleRoundStep from "./SingleRoundStep";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";

interface Props {
  position?: [number, number, number];
  width?: number;
  heightPerStep?: number;
  steps: number;
  poolHeight: number;
  
}

const RoundSteps: FC<Props> = ({
  position = [0, 1, 0],
  width = 1,
  steps=4,
  poolHeight
}) => {
  const setepsArray = new Array(steps).fill(0);
 const heightPerStep = poolHeight / steps;
 const dispatch = useAppDispatch();
 const target = useAppSelector(selectTarget);
 const groupRef = useRef<THREE.Group>(null)
 const visible = useAppSelector(selectPivotVisibility);

  return (
    <PivotControls
       disableScaleAxes
       snapTranslate={5}
       visible={visible&& target!=null}
       displayValues
       scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
       depthTest={false}
       fixed
       lineWidth={2}>
    <group ref={groupRef} onClick={(e)=>{
      // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
      dispatch(setPivotVisibility(true))
      if(target?.uuid!=groupRef?.current?.uuid){
       dispatch(setTarget(groupRef.current))
      }
    }}>
      {setepsArray.map((step, idx) => {
        return (
          <Fragment key={idx}>
            <SingleRoundStep
              width={width + 0.3 * idx}
              height={heightPerStep}
              position={[
                position[0],
                position[1] + idx * heightPerStep,
                position[2],
              ]}
            />
          </Fragment>
        );
      })}
    </group>
    </PivotControls>
  );
};

export default RoundSteps;
