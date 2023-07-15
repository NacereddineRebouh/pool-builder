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
interface Steps {
  rotation:THREE.Euler;
  position:THREE.Vector3;
  scale:THREE.Vector3;
  gap: number;
  heightPerStep: number;
  width: number;
  poolHeight: number;
  side: sides;
  poolWidth: number;
  poolDepth: number;
  // rotation?: number;
  intersecting: boolean;
}

const Steps: FC<Steps> = ({
  position,
  width=6,
  rotation,
  scale,
  poolDepth,
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
  const steps = Math.round(poolHeight / heightPerStep); 
  const stepsArray = new Array(steps).fill(0);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null)
  const visible = useAppSelector(selectPivotVisibility);
  console.log(side)
  let newOffset:[number,number,number] =[position.x, position.y, position.z]
  switch (side) {
    case "Left":
      newOffset=[position.x, position.y, position.z]
      break;
    case "Right":
      newOffset=[position.x , position.y, position.z]
      break;
    case "Top":
      newOffset=[position.x, position.y, position.z]
      break;
    case "Bottom":
      newOffset=[position.x , position.y, position.z]
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
       e.stopPropagation()
            // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
            dispatch(setPivotVisibility(true))
            if(target?.uuid!=groupRef?.current?.uuid){
             dispatch(setTarget(groupRef.current))
            }}
          }
    >
      {stepsArray.map((step, idx) => {
          let newPosition =[0,0 ,0]
          switch (side) {
            case "Left":
              newPosition=[(gap * idx)/2 - 1.5+heightPerStep/2, poolHeight/2 - idx * heightPerStep, 0] //1.5 == boxWidth/2
              break;
            case "Right":
              newPosition=[-(gap * idx)/2 + 1.5-heightPerStep/2 , poolHeight/2 - idx * heightPerStep, 0]
              break;
            case "Top":
              newPosition=[0 , poolHeight/2 -  idx * heightPerStep, (gap * idx)/2 - 2 + heightPerStep/2]//2 == boxWidth/2
              break;
            case "Bottom":
              newPosition=[0 , poolHeight/2 -  idx * heightPerStep, -(gap * idx)/2 + 2 - heightPerStep/2]
              break;
          }

          let boxArgs=[poolWidth,poolWidth,poolWidth]
          switch (side) {
            case "Left":
              boxArgs=[heightPerStep+ gap * idx , heightPerStep, poolDepth]
              break;
            case "Right":
              boxArgs=[heightPerStep+ gap * idx , heightPerStep, poolDepth]
              break;
            case "Top":
              boxArgs=[poolWidth, heightPerStep, heightPerStep+ gap * idx]
              break;
            case "Bottom":
              boxArgs=[poolWidth, heightPerStep, heightPerStep+ gap * idx]
              break;
          }
        return (
          <mesh key={idx} position={new THREE.Vector3(...newPosition)}>
              <boxGeometry
                args={[
                  boxArgs[0],
                  boxArgs[1],
                  boxArgs[2]
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

export default Steps;

