import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, PerspectiveCamera, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import {
  selectPivotVisibility,
  selectTarget,
  setPivotVisibility,
  setTarget,
} from "@/slices/targetSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { PivotControls } from "@/components/UI/pivotControls";
import { ChildrensType, ReplaceChildren } from "@/slices/poolsSlice";

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
    mesh_0_1: THREE.Mesh;
    mesh_0_2: THREE.Mesh;
    mesh_0_3: THREE.Mesh;
    mesh_0_4: THREE.Mesh;
  };
  materials: {
    ["I.E. edge"]: THREE.MeshStandardMaterial;
    ["I.E. stone"]: THREE.MeshStandardMaterial;
    ["I.E. mosaic"]: THREE.MeshStandardMaterial;
    Water: THREE.MeshStandardMaterial;
    ["I.E. mosaic grout"]: THREE.MeshStandardMaterial;
  };
};

const InfinityEdge = ({
  sPosition,
  sRotation,
  sScale,
  poolIndex,
  index,
  model,
  poolWidth,
  poolHeight,
  poolbHeight = 0,
  pooltHeight = 0,
  poolDepth,
  poolType,
  rotation,
  position,
  scale,
  ...props
}: {
  sPosition: number[];
  sRotation: number[];
  sScale: number[];
  poolIndex: number;
  index: number;
  model: ChildrensType;
  poolWidth: number;
  poolHeight: number;
  pooltHeight: number;
  poolbHeight: number;
  poolDepth: number;
  poolType: string;
  rotation: THREE.Euler;
  position: THREE.Vector3;
  scale: THREE.Vector3;
  props?: JSX.IntrinsicElements["group"];
}) => {
  const { nodes, materials } = useGLTF(
    "/models/infinity-edge.glb"
  ) as GLTFResult;
  materials.Water.metalness = 0;
  materials.Water.opacity = 1;
  materials.Water.transparent = false;
  const groupRef = useRef<THREE.Group>(null);
  const dispatch = useAppDispatch();
  const target = useAppSelector(selectTarget);
  const visible = useAppSelector(selectPivotVisibility);
  let width =
    rotation.y == Math.PI / 2 || rotation.y == -Math.PI / 2
      ? poolDepth
      : poolWidth;
  switch (true) {
    case model.side === "Left":
      if (poolType === "lshape") width = poolWidth;
      else width = poolDepth;
      break;
    case model.side === "Top":
      if (poolType === "lshape") width = poolbHeight - poolWidth;
      else width = poolWidth;
      break;
    case model.side === "Bottom":
      if (poolType === "lshape") width = poolbHeight;
      else width = poolWidth;
      break;
    case model.side === "Right":
      width = poolDepth;
      break;
    case model.side === "tLeft":
      width = pooltHeight - poolWidth;
      break;
    case model.side === "tRight":
      width = pooltHeight;
      break;
    case model.side === "tTop":
      width = poolWidth;
      break;
  }
  const texture = useTexture("/textures/grass.jpeg");
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(5, 1 / 2);

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
      disableSliders
      snapTranslate={5}
      visible={visible && target?.uuid == groupRef.current?.uuid}
      displayValues
      scale={visible && target?.uuid == groupRef.current?.uuid ? 75 : 0}
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
      translateP={[sPosition[0], sPosition[1], sPosition[2]]}
      offset={[
        groupRef.current ? groupRef.current.position.x : position.x - 4,
        groupRef.current ? groupRef.current.position.y : position.y,
        groupRef.current ? groupRef.current.position.z : position?.z - 4,
      ]}
      lineWidth={2}
    >
      <group
        renderOrder={0}
        {...props}
        dispose={null}
        ref={groupRef}
        rotation={rotation}
        position={position}
        scale={scale}
        {...props}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(setPivotVisibility(true));
          if (target?.uuid != groupRef?.current?.uuid) {
            dispatch(setTarget(groupRef.current));
          }
        }}
      >
        <mesh renderOrder={0} position={[0, 0, 0]}>
          <boxGeometry args={[width, 2.05, 2]} />
          <meshStandardMaterial attach={"material-0"} side={1} map={texture} />
          <meshStandardMaterial attach={"material-1"} side={1} map={texture} />
          <meshStandardMaterial attach={"material-3"} side={1} map={texture} />
          <meshStandardMaterial attach={"material-4"} side={1} map={texture} />
          <meshStandardMaterial attach={"material-5"} side={1} map={texture} />
          <meshStandardMaterial
            attach={"material-2"}
            side={0}
            colorWrite={false}
            color={"red"}
          />
        </mesh>

        {/* Width == 10 */}
        <group
          position={[0, 0, -3.5]}
          scale={[(width * 1) / 10, 1, 1]}
          name="Infinity_edge"
          userData={{ name: "Infinity edge" }}
        >
          <mesh
            renderOrder={0}
            name="mesh_0"
            geometry={nodes.mesh_0.geometry}
            material={materials["I.E. edge"]}
          />
          <mesh
            renderOrder={0}
            name="mesh_0_1"
            geometry={nodes.mesh_0_1.geometry}
            material={materials["I.E. stone"]}
          />
          <mesh
            renderOrder={0}
            name="mesh_0_2"
            geometry={nodes.mesh_0_2.geometry}
            material={materials["I.E. mosaic"]}
          />
          <mesh
            renderOrder={0}
            name="mesh_0_3"
            geometry={nodes.mesh_0_3.geometry}
            material={materials.Water}
          />
          <mesh
            renderOrder={0}
            name="mesh_0_4"
            geometry={nodes.mesh_0_4.geometry}
            material={materials["I.E. mosaic grout"]}
          />
        </group>
      </group>
    </PivotControls>
  );
};

export default InfinityEdge;

useGLTF.preload("/models/infinity-edge.glb");
