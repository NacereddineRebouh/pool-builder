"use client"
import { PivotControls } from "@/components/UI/pivotControls";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTexture } from "@react-three/drei";
import { FC, Fragment, ReactElement, useRef } from "react";
import * as THREE from "three";

enum sides{
  Top = "Top",
  Bottom= "Bottom",
  Left = "Left",
  Right = "Right",
}
interface squareStepsProps {
  rotation:THREE.Euler;
  position:THREE.Vector3;
  scale:THREE.Vector3;
  gap: number;
  heightPerStep: number;
  width: number;
  poolHeight: number;
  side: sides;
  poolWidth: number;
  // rotation?: number;
  intersecting: boolean;
}

const SquareSteps: FC<squareStepsProps> = ({
  position,
  width=6,
  rotation,
  scale,
  heightPerStep=.4,
  gap=.2,
  side,
  intersecting,
  poolHeight,
  poolWidth,
}): ReactElement => {
  const depthPerStep = 1;

  // load tile texture
  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;
  const steps = Math.floor(poolHeight / heightPerStep); 
  const stepsArray = new Array(steps).fill(0);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null)
  const visible = useAppSelector(selectPivotVisibility);
  let newOffset:[number,number,number] =[position.x, position.y, position.z]
  switch (side) {
    case "Left":
      newOffset=[position.x - steps*gap/2, position.y, position.z]
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
      visible={visible&& target?.uuid===groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
      depthTest={false}
      fixed
      offset={newOffset}
      lineWidth={2}>
    <group ref={groupRef} rotation={rotation} position={position} scale={scale} onClick={(e)=>{
       e.stopPropagation()
            // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
            dispatch(setPivotVisibility(true))
            if(target?.uuid!=groupRef?.current?.uuid){
             dispatch(setTarget(groupRef.current))
            }}
          }
    >
      {stepsArray.map((step, idx) => {
          let newPosition =[0, 0, 0]
          switch (side) {
            case "Left":
              newPosition=[0 + gap/2 * idx, position.y +((stepsArray.length-1)*heightPerStep) - idx * heightPerStep, 0]
              // newPosition=[0-(multiplyByIndex(gap/2,stepsArray.length)) + gap/2 * idx, position.y +((stepsArray.length-1)*heightPerStep) - idx * heightPerStep, 0]
              break;
            case "Right":
              newPosition=[0 - gap/2 * idx, position.y +((stepsArray.length-1)*heightPerStep) - idx * heightPerStep, 0]
              // newPosition=[0-(multiplyByIndex(gap/2,stepsArray.length)) - gap/2 * idx, position.y +((stepsArray.length-1)*heightPerStep) - idx * heightPerStep, 0]
              break;
            case "Top":
              newPosition=[0, position.y +((stepsArray.length-1)*heightPerStep) - idx * heightPerStep, 0+ gap/2 * idx]
              break;
            case "Bottom":
              newPosition=[0 , position.y +((stepsArray.length-1)*heightPerStep) - idx * heightPerStep, 0 - gap/2 * idx]
              break;
          }
        return (
          <mesh key={idx} position={new THREE.Vector3(...newPosition)}>
              <boxGeometry
                args={[
                  width + gap * idx,
                  heightPerStep,
                  width + gap * idx,
                ]}
              />
              <meshStandardMaterial
                map={tileTexture}
                metalness={0.2}
                roughness={0.24}
                // color={"lightblue"}
              />
          </mesh>
        );
      })}
    </group>
    </PivotControls>
  );
};

export default SquareSteps;

