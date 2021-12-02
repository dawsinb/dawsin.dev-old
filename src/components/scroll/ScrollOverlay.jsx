import { useState, useEffect } from "react";
import { animated } from "@react-spring/web";
import styled from "styled-components";
import { useStore } from "../../store";
import { useSpring, useSpringRef, useChain } from "@react-spring/core";
import { Track } from "./Track";

const Container = styled(animated.div)`
  position: fixed;
  right: ${(props) =>
    props.ismobile ? `calc(50% - ${props.width / 2}px)` : "0"};
  top: ${(props) =>
    props.ismobile ? "auto" : `calc(50% - ${props.height / 2}px)`};
  bottom: ${(props) => (props.ismobile ? "0" : "auto")};
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  z-index: 2;
  transform-origin: ${(props) =>
    props.ismobile ? "center bottom" : "center right"};
  transform: scale(var(--scale, 1));
`;

const Background = styled(animated.div)`
  position: absolute;
  right: ${(props) => (props.ismobile ? "auto" : 0)};
  bottom: ${(props) => (props.ismobile ? 0 : "auto")};
  height: ${(props) => (props.ismobile ? "var(--size, 100%)" : "100%")};
  width: ${(props) => (props.ismobile ? "100%" : "var(--size, 100%)")};
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
`;

function ScrollOverlay() {
  const numSections = useStore((state) => state.numSections);
  const breakpoints = useStore((state) => state.breakpoints);

  const size = Math.ceil(window.innerHeight / (9 * numSections));
  const offsetDistance = Math.ceil(size * 2.25);

  const [ismobile, setismobile] = useState(window.innerWidth < window.innerHeight)
  useEffect(() => {
    window.addEventListener("resize", () => {
      setismobile(window.innerWidth < window.innerHeight);
    });
  }, []);

  const height = ismobile ? size * 4 : numSections * offsetDistance + size;
  const width = ismobile ? numSections * offsetDistance + size : size * 4;

  const bgMaxSize = ismobile ? 400 : 275;

  // state toggle used to interpolate values for animations
  const [toggle, setToggle] = useState(false);

  // set up spring toggles
  const overlaySpringRef = useSpringRef();
  const overlayToggle = useSpring({
    ref: overlaySpringRef,
    toggle: Number(toggle)
  }).toggle;
  const bgSpringRef = useSpringRef();
  const bgToggle = useSpring({
    ref: bgSpringRef,
    toggle: Number(toggle)
  }).toggle;
  const textSpringRefs = [];
  const textToggles = [];
  for (let i = 0; i < numSections; i++) {
    textSpringRefs[i] = useSpringRef();
    textToggles[i] = useSpring({
      ref: textSpringRefs[i],
      toggle: Number(toggle)
    }).toggle;
  }

  // set up chain to handle the timing of delays between animations
  useChain(
    [overlaySpringRef, bgSpringRef, ...textSpringRefs],
    toggle
      ? [0, 50, ...textSpringRefs.map((_, index) => 175 + index * 100)]
      : [300, 450, ...textSpringRefs.map((_, index) => index * 50)],
    1
  );

  return (
    <Container
      onMouseEnter={() => setToggle(true)}
      onMouseLeave={() => setToggle(false)}
      ismobile={ismobile ? 1 : 0}
      width={width}
      height={height}
      style={{
        "--scale": overlayToggle.to({ output: [1, 1.5] })
      }}
    >
      <Background
        ismobile={ismobile ? 1 : 0}
        style={{
          "--size": bgToggle
            .to({ output: [100, bgMaxSize] })
            .to((value) => `${value}%`),
          opacity: bgToggle.to({ output: [0, 1] })
        }}
      />

      <Track
        size={size}
        offsetDistance={offsetDistance}
        numSections={numSections}
        breakpoints={breakpoints}
        textToggles={textToggles}
        isMobile={ismobile}
      />
    </Container>
  );
}

export { ScrollOverlay };
