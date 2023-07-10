"use client"
import { PivotControls } from "@/components/UI/pivotControls";
import { selectPivotVisibility, selectTarget, setPivotVisibility, setTarget } from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTexture } from "@react-three/drei";
import { FC, Fragment, ReactElement, useRef } from "react";
import * as THREE from "three";

interface squareStepsProps {
  position: { x: number; y: number; z: number };
  steps: number;
  gap: number;
  width: number;
  poolHeight: number;
  poolWidth: number;
  rotation?: number;
  intersecting: boolean;
}

const SquareSteps: FC<squareStepsProps> = ({
  position,
  steps,
  width=6,
  rotation,
  gap=.2,
  intersecting,
  poolHeight,
  poolWidth,
}): ReactElement => {
  const depthPerStep = 1;

  // load tile texture
  const tileTexture = useTexture("/textures/tiles.jpg");
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.wrapS = THREE.RepeatWrapping;
  const heightPerStep = poolHeight / steps; 
  const stepsArray = new Array(steps).fill(0);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null)
  const visible = useAppSelector(selectPivotVisibility);
  return (
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
    <group ref={groupRef} onClick={(e)=>{
       e.stopPropagation()
            // console.log(target?.uuid,"::::",groupRef?.current?.uuid)
            dispatch(setPivotVisibility(true))
            if(target?.uuid!=groupRef?.current?.uuid){
             dispatch(setTarget(groupRef.current))
            }}
          }
   >
      {stepsArray.map((step, idx) => {
        return (
          <mesh key={idx} position={[
            position.x,
            position.y +((stepsArray.length-1)*heightPerStep) - idx * heightPerStep,
            position.z,
          ]}>
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
                color={"lightblue"}
              />
          </mesh>
        );
      })}
    </group>
    </PivotControls>
  );
};

export default SquareSteps;
