import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Vector2 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { lerp } from "../utils";
import "./shaders/DistortionMaterial";
import { useStore } from "../store";

function DistortionPlane({ color = "white", shift = 1, opacity = 1, args, map, ...props }) {
  const materialRef = useRef();

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
  let prevScrollPosition = scrollRef.current;

  // set up animation loop for distoration effect
  const { size } = useThree();
  const [effectFactor, setEffectFactor] = useState(0)
  const [mousePosition, setMousePosition] = useState(new Vector2(0.5, 0.5))
  
  useFrame(({mouse}) => {
    const scrollDelta = (scrollRef.current - prevScrollPosition) / size.height;

    // lerp direction to the direction of the mouse
    materialRef.current.direction.lerp(mouse.normalize(), 0.01).normalize()
    materialRef.current.mousePosition.lerp(mousePosition, 0.03)
    // lerp towards current effect factor
    materialRef.current.effectFactor = lerp(materialRef.current.effectFactor, effectFactor, 0.01)

    // lerp shift value to the delta of the scroll position
    materialRef.current.scrollFactor = lerp(materialRef.current.scrollFactor, scrollDelta, 0.025);
    // update previous scroll position
    prevScrollPosition = scrollRef.current;
  });

  return (
    <mesh 
      {...props}
      onPointerMove={(e) => setMousePosition(e.intersections[0].uv)}
      onPointerEnter={() => setEffectFactor(1)}
      onPointerOut={() => setEffectFactor(0)}
    >
      <planeBufferGeometry args={args} />
      <distortionMaterial
        attach="material"
        ref={materialRef}
        imageTexture={map} 
        scrollIntensity={5.0}
        displacementIntensity={20.0}
      />
    </mesh>
  );
}

export { DistortionPlane };
