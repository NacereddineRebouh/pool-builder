import { PivotControls } from "@/components/UI/pivotControls";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Addition, Base, Geometry, Subtraction } from "@react-three/csg";
import {
  TransformControls,
  useTexture,
} from "@react-three/drei";
import { FC, Fragment, ReactElement, useRef, useState } from "react";
import * as THREE from "three";

interface StepsProps {
  position: { x: number; y: number; z: number };
  steps: number;
  width: number;
  depthPerStep: number;
  intersecting: boolean;
  side?: "left" | "right" | "front" | "back";
  poolWidth: number;
  poolHeight: number;
  poolOutline: number;
}

const Steps: FC<StepsProps> = ({
  position,
  steps,
  width,
  depthPerStep = 1 / steps,
  side = "front",
  poolWidth,
  poolHeight,
  poolOutline,
}): ReactElement => {
  const stepsArray = new Array(steps).fill(0);

  let positionZ = position.z;
  let positionX = position.x;

  switch (side) {
    case "front":
      positionZ = position.z - (depthPerStep * steps) / 2 + poolOutline / 2;
      break;
    case "back":
      positionZ = position.z + (depthPerStep * steps) / 2 - poolOutline / 2;
      break;
    case "left":
      positionX = position.x - poolWidth / 2 + width / 2 + poolOutline / 2;
      break;
    case "right":
      positionX = position.x + poolWidth / 2 - width / 2 - poolOutline / 2;
    default:
      break;
  }

  const stepGroup = useRef<THREE.Group>(null);
  const heightPerStep = poolHeight / steps;
  const tl = useTexture("/textures/tiles2.jpg");
  
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null)
  const visible = useAppSelector(selectPivotVisibility);

  return (
    <>
      <PivotControls
       disableScaleAxes
       snapTranslate={5}
       visible={visible&& target?.uuid===groupRef.current?.uuid}
       displayValues
       scale={visible && target?.uuid===groupRef.current?.uuid ?75:0}
       depthTest={false}
       fixed
       offset={[position.x, position.y, position.z]}
       lineWidth={2}>
        <group ref={stepGroup} onClick={(e)=>{
        // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
        dispatch(setPivotVisibility(true))
        if(target?.uuid!=groupRef?.current?.uuid){
         dispatch(setTarget(groupRef.current))
       }
      }}>
          {stepsArray.map((_, index)=>{
            tl.wrapT = THREE.RepeatWrapping;
            tl.wrapS = THREE.RepeatWrapping;
            tl.repeat.set(depthPerStep * (steps/5), depthPerStep * (steps/5));
            return ( 
            <mesh key={index} position={[positionX, position.y + (index-2) * heightPerStep, positionZ- (depthPerStep / 2) * index ]}>
              <boxGeometry args={[width, heightPerStep, depthPerStep * (steps-index)]} />
              <meshStandardMaterial map={tl} color={"lightblue"} transparent opacity={1} />
            </mesh>)
          })}
        </group>
        </PivotControls>
    </>
  );
};

export default Steps;
