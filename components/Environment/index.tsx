import { Sky, Cloud, Environment as Env } from "@react-three/drei";
import { FC, ReactElement, useMemo } from "react";

const Environment: FC = (): ReactElement => {
  const createClouds = useMemo(() => {
    const clouds = [];
    for (let i = 0; i < 20; i++) {
      clouds.push(
        <Cloud
          key={i}
          scale={[1, 1, 1]}
          position={[Math.random() * 100 - 50, 20, Math.random() * 100 - 50]}
        />
      );
    }
    return clouds;
  }, []);

  return (
    <group>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 5]} />
      {/* <Env preset="forest" /> */}
      {/* <Sky /> */}
      {/* {createClouds} */}
    </group>
  );
};

export default Environment;
