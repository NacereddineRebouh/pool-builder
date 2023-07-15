import { FC, Fragment, useRef } from "react";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import * as THREE from "three";
import { CornerRoundStep } from "./CornerRoundStep";

enum sides{
  Top = "Top",
  Bottom= "Bottom",
  Left = "Left",
  Right = "Right",
}
interface Props {
  rotation:THREE.Euler;
  position:THREE.Vector3;
  scale:THREE.Vector3;
  poolHeight: number;
  gap: number;
  heightPerStep?: number;
  width: number;
  side: sides;
  poolWidth: number;
}

const CornerRoundSteps: FC<Props> = ({
  position,
  rotation,
  scale,
  gap,
  side,
  heightPerStep=.63,
  poolHeight
}) => {
 const dispatch = useAppDispatch();
 const target = useAppSelector(selectTarget);
 const groupRef = useRef<THREE.Group>(null)
 const visible = useAppSelector(selectPivotVisibility);
 const steps = Math.floor(poolHeight / heightPerStep); 
 const stepsArray = new Array(steps).fill(0);
 let newOffset:[number,number,number] =[position.x, position.y, position.z]
 switch (side) {
   case "Left":
     newOffset=[position.x, position.y, position.z]
     break;
   case "Right":
     newOffset=[position.x + steps*gap/2, position.y, position.z]
     break;
   case "Top":
     newOffset=[position.x, position.y, position.z - steps*gap/2]
     break;
   case "Bottom":
     newOffset=[position.x , position.y, position.z + steps*gap/2]
     break;
 }
 function multiplyByIndex(value: number, size: number): number {
  const result: number[] = [];
  
  for (let i = 0; i < size; i++) {
    result.push(value * i);
  }
  
  return result[result.length-1];
}

  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={5}
      visible={visible && target?.uuid===groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
      depthTest={false}
      fixed
      offset={newOffset}
      lineWidth={2}>
    <group ref={groupRef} rotation={rotation} position={position} scale={scale} onClick={(e)=>{
      // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
      e.stopPropagation()
      dispatch(setPivotVisibility(true))
      if(target?.uuid!=groupRef?.current?.uuid){
       dispatch(setTarget(groupRef.current))
      }
    }}>
      {stepsArray.map((step, idx) => {
          let newPosition =[0, heightPerStep - idx * heightPerStep , 0]
        return (
          <CornerRoundStep key={idx} scale={new THREE.Vector3(1 + gap * idx, 5, 1 + gap * idx)} position={new THREE.Vector3(...newPosition)} rotation={new THREE.Euler(0,0,0)}/>
        );
      })}
      </group>
    </PivotControls>
  );
};

export default CornerRoundSteps;
