import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
  setTargetTitle,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";

type GLTFResult = GLTF & {
  nodes: {
    Mesh_0010: THREE.Mesh;
    Mesh_0010_1: THREE.Mesh;
  };
  materials: {
    Faucet: THREE.MeshStandardMaterial;
    Mesh_0010: THREE.MeshStandardMaterial;
  };
};
const Fountain = ({
  sPosition,
  sRotation,
  sScale,
  index,
  poolIndex,
  model,
  rotation,
  position,
  scale,
  ...props
}: {
  poolIndex: number;
  index: number;
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  model: ChildrensType;
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  props?: JSX.IntrinsicElements["group"];
}) => {
  const { nodes, materials } = useGLTF(
    "/models/newModels/Fountain.glb"
  ) as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  // materials.Water.metalness=0
  useEffect(() => {
    if (materials["Mesh_0010"]?.color)
      materials["Mesh_0010"].color = new THREE.Color(0xb8d0e1);
  }, [materials]);
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
    setMat(comb);
  }, [sScale, sPosition, sRotation]);

  return (
    <PivotControls
      disableScaleAxes
      snapTranslate={5}
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
      matrix={Mat}
      translateP={[model.sPosition[0], model.sPosition[1], model.sPosition[2]]}
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position.z,
      ]}
      lineWidth={2}
    >
      <group
        {...props}
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
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
        name="Fountain"
      >
        <mesh name="Mesh_0010" geometry={nodes.Mesh_0010.geometry}>
          <meshStandardMaterial metalness={1} roughness={0.2} color="#a5a8ad" />
        </mesh>
        <mesh name="Mesh_0010_1" geometry={nodes.Mesh_0010_1.geometry}>
          <meshStandardMaterial
            roughness={0}
            transparent
            opacity={0.7}
            color="#6bd1ff"
          />
        </mesh>
      </group>
    </PivotControls>
  );
};

export default Fountain;

useGLTF.preload("/models/newModels/Fountain.glb");
