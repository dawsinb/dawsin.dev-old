import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../store";
import { Svg } from "./Svg";
import { lerp, seedRandomRange } from "../utils";
import seedRandom from "seedrandom";

function Background() {
  const { size } = useThree();

  // generate seed for bgBrush generation
  const baseSeed = useStore((state) => state.baseSeed);

  // generate a brush section for each section
  const numSections = 8;
  const brushSections = [];
  for (let i = 0; i < numSections; i++) {
    const seed = new seedRandom(baseSeed + i);

    // generate 1 to 3 brushes
    const brushes = [];
    const count = Math.floor(seedRandomRange(seed, 2, 4));
    for (let i = 0; i < count; i++) {
      // generate brush
      const svg = `/svg/brush${Math.floor(seedRandomRange(seed, 0, 6)) + 1}.svg`;

      // generate position
      const x = seedRandomRange(seed, -size.width / 2, size.width / 2);
      const y = seedRandomRange(seed, -size.height / 2, size.height / 2);
      const position = [x, y, 0];
      // generate rotation
      const rotation = [0, 0, Math.PI * seedRandomRange(seed, -0.3, 0.3)];
      // generate scale
      const scale = [
        seedRandomRange(seed, 0.5, 1.1),
        seedRandomRange(seed, 0.5, 1.1),
        0
      ];

      brushes.push({
        svg: svg,
        position: position,
        rotation: rotation,
        scale: scale
      });
    }

    brushSections[i] = brushes;
  }
  // set up a ref to the sub group so that we can scroll it relative to the position
  const groupRef = useRef();
  // set up transient subscription to the scroll position
  const scrollRef = useRef(useStore.getState().scrollPosition);
  useEffect(
    () =>
      useStore.subscribe(
        (scrollPosition) => (scrollRef.current = scrollPosition),
        (state) => state.scrollPosition
      ),
    []
  );
  // lerp y position to scroll position (adjusted for parallax) for a smooth scroll effect
  useFrame(() => {
    groupRef.current.position.y = lerp(
      groupRef.current.position.y,
      scrollRef.current,
      0.07
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, -1000]}>
      {brushSections.map((brushSection, index) => (
        <group key={index} position={[0, -size.height * index, 0]}>
          {brushSection.map((brush, index) => (
            <Svg
              key={index}
              url={brush.svg}
              position={brush.position}
              rotation={brush.rotation}
              scale={brush.scale}
              color={"#181818"}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

export { Background };
