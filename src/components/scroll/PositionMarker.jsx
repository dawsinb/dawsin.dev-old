import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useStore } from "../../store";
import { lerp } from "../../utils";
import { Square } from "./Square";
import { useSpring } from "@react-spring/core";
import { animated } from "@react-spring/web";

const Container = styled(animated.div)`
  z-index: 1;
  position: absolute;
  width: ${(props) => props.size * props.scalefactor}px;
  height: ${(props) => props.size * props.scalefactor}px;
  right: ${(props) =>
    props.ismobile
      ? `calc(50% - ${-props.offset}px)`
      : `${props.size * 1.5}px`};
  top: ${(props) =>
    props.ismobile ? "auto" : `calc(50% - ${props.offset}px)`};
  bottom: ${(props) => (props.ismobile ? `${props.size * 0.25}px` : "auto")};
  transform: translate(
      ${(props) => (props.size * props.scalefactor) / 2}px,
      ${(props) => (-props.size * props.scalefactor) / 2}px
    )
    translate(
      ${(props) =>
        props.ismobile ? `var(--shift, 0px), 0px` : `0px, var(--shift, 0px)`}
    )
    rotateZ(var(--rotate, 0rad));
`;

function PositionMarker({
  ismobile,
  size,
  offsetDistance,
  numSections,
  jumpDirection
}) {
  const scaleFactor = 2.25;
  const startOffset = (offsetDistance * (numSections - 1)) / 2;

  const [scrollPosition, setScrollPosition] = useState(0);

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

  // set up animation loop to keep scroll position up to date
  const animationRef = useRef();
  const animate = () => {
    // lerp towards scroll position for smooth ramp with damping
    setScrollPosition((prevPosition) => {
      return lerp(prevPosition, scrollRef.current, 0.07);
    });

    animationRef.current = requestAnimationFrame(animate);
  };
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const { rotate } = useSpring({
    to: {
      rotate: jumpDirection
    },
    from: {
      rotate: 0
    },
    config: { mass: 1, tension: 200, friction: 50 }
  });

  return (
    <Container
      size={size}
      scalefactor={scaleFactor}
      offset={startOffset}
      ismobile={ismobile}
      style={{
        "--shift": `${
          (scrollPosition / window.innerHeight) * offsetDistance
        }px`,
        "--rotate":
          jumpDirection !== 0
            ? rotate.to((value) => `${value * Math.PI}rad`)
            : `${(scrollPosition / window.innerHeight) * Math.PI}rad`
      }}
    >
      <Square size={size * scaleFactor} />
    </Container>
  );
}

export { PositionMarker };
