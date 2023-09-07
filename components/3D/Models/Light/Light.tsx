import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";
import { getActiveAxis } from "@/utils/getActiveAxis";
type GLTFResult = GLTF & {
  nodes: {
    model_2: THREE.Mesh;
    model_2_1: THREE.Mesh;
    model_2_2: THREE.Mesh;
  };
  materials: {
    ["Mirror 02"]: THREE.MeshStandardMaterial;
    ["Mirror 01"]: THREE.MeshStandardMaterial;
    ["Translucent Glass Blue"]: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;
export function Model({
  poolIndex,
  index,
  model,
  sPosition,
  sRotation,
  sScale,
  rotation,
  position,
  scale,
  ...props
}: {
  poolIndex: number;
  index: number;
  model: ChildrensType;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  props?: JSX.IntrinsicElements["group"];
}) {
  const { nodes, materials } = useGLTF(
    "/models/newModels/light-transformed.glb"
  ) as GLTFResult;
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const groupRef = useRef<THREE.Group>(null);
  const visible = useAppSelector(selectPivotVisibility);
  const [Mat, setMat] = useState(new THREE.Matrix4());
  useEffect(() => {
    const position = new THREE.Vector3(
      sPosition[0],
      sPosition[1],
      sPosition[2]
    );
    const comb = new THREE.Matrix4();
    const radiansX = THREE.MathUtils.degToRad(sRotation[0]);
    const radiansY = THREE.MathUtils.degToRad(sRotation[1]);
    const radiansZ = THREE.MathUtils.degToRad(sRotation[2]);
    const qt = new THREE.Quaternion();
    qt.setFromEuler(new THREE.Euler(radiansX, radiansY, radiansZ, "XYZ"));
    // Create a new quaternion using Euler angles (XYZ order)
    comb.compose(
      position,
      qt,
      new THREE.Vector3(sScale[0], sScale[1], sScale[2])
    );
    // console.table(comb)

    setMat(comb);
  }, [sScale, sPosition, sRotation]);
  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={5}
      disableSliders
      disableRotations
      activeAxes={getActiveAxis(model.side)}
      visible={visible && target?.uuid === groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid === groupRef.current?.uuid ? 75 : 0}
      depthTest={false}
      fixed
      onDragEnd={(w, de, wl, delw) => {
        const position = new THREE.Vector3(); // create one and reuse it
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        w.decompose(position, quaternion, scale);
        const euler = new THREE.Euler().setFromQuaternion(quaternion);
        const pl = { ...model };
        const x = +position.x.toFixed(2);
        const y = +position.y.toFixed(2);
        const z = +position.z.toFixed(2);
        pl.sPosition = [x, y, z];

        pl.sScale = [scale.x, scale.y, scale.z];
        pl.sRotation = [
          THREE.MathUtils.radToDeg(euler.x),
          THREE.MathUtils.radToDeg(euler.y),
          THREE.MathUtils.radToDeg(euler.z),
        ];
        dispatch(
          ReplaceChildren({
            poolIndex: poolIndex,
            modelIndex: index,
            model: pl,
          })
        );
      }}
      translateP={[sPosition[0], sPosition[1], sPosition[2]]}
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position.z,
      ]}
      matrix={Mat}
      lineWidth={2}
    >
      <group
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        {...props}
        dispose={null}
        onClick={(e) => {
          e.stopPropagation();
          const title = model.shapeType + " " + poolIndex + index;
          dispatch(setTargetTitle(title));
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        <group position={[9.809, 0, -0.148]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            geometry={nodes.model_2.geometry}
            material={materials["Mirror 02"]}
          />
          <mesh
            geometry={nodes.model_2_1.geometry}
            material={materials["Mirror 01"]}
          />
          <mesh
            geometry={nodes.model_2_2.geometry}
            material={materials["Translucent Glass Blue"]}
          />
        </group>
      </group>
    </PivotControls>
  );
}

useGLTF.preload("/models/newModels/light-transformed.glb");
