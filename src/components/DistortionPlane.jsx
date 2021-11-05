import React, { forwardRef, useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { lerp } from "../utils";
import "./distortionShaders/CustomMaterial";
import { useStore } from "../store";

const DistortionPlane = forwardRef(
  ({ color = "white", shift = 1, opacity = 1, args, map, ...props }, ref) => {
    const material = useRef();

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
    // var to hold previous scroll position to calculate delta
    let prevScrollPosition = 0;

    // set up animation loop for distoration effect
    const { size } = useThree();
    const intensity = (1 / size.height) * 25;
    const speed = 0.025;
    useFrame(() => {
      const scrollDelta = scrollRef.current - prevScrollPosition;

      // lerp shift value to the delta of the scroll position
      material.current.shift = lerp(
        material.current.shift,
        scrollDelta * intensity,
        speed
      );
      // update previous scroll position
      prevScrollPosition = scrollRef.current;
    });

    return (
      <mesh ref={ref} {...props}>
        <planeBufferGeometry args={args} />
        <customMaterial
          ref={material}
          color={color}
          map={map}
          transparent
          opacity={opacity}
        />
      </mesh>
    );
  }
);

export { DistortionPlane };
