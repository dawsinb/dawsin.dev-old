import { useState, useEffect, useRef } from "react";
import { animated } from "@react-spring/web";
import styled from "styled-components";
import { useStore } from "../../store";
import { useSpring, useSpringRef, useChain } from "@react-spring/core";
import { Track } from "./Track";
// ${(props) => (props.isMobile ? "auto" : "var(--size)")}
const Container = styled(animated.div)`
  position: fixed;
  right: ${(props) =>
    props.isMobile ? `calc(50% - ${props.width / 2}px)` : "0"};
  top: ${(props) =>
    props.isMobile ? "auto" : `calc(50% - ${props.height / 2}px)`};
  bottom: ${(props) => (props.isMobile ? "0" : "auto")};
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  z-index: 2;
  transform-origin: ${(props) =>
    props.isMobile ? "center bottom" : "center right"};
  transform: scale(var(--scale, 1));
`;

const Background = styled(animated.div)`
  position: absolute;
  right: ${(props) => (props.isMobile ? "auto" : 0)};
  bottom: ${(props) => (props.isMobile ? 0 : "auto")};
  height: ${(props) => (props.isMobile ? "var(--size, 100%)" : "100%")};
  width: ${(props) => (props.isMobile ? "100%" : "var(--size, 100%)")};
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
`;

function ScrollOverlay() {
  const numSections = useStore((state) => state.numSections);
  const breakpoints = useStore((state) => state.breakpoints);

  const size = Math.ceil(window.innerHeight / (9 * numSections));
  const offsetDistance = Math.ceil(size * 2.25);

  //const isMobile = window.innerWidth < window.innherHeight;
  const isMobile = true;

  const height = isMobile ? size * 4 : numSections * offsetDistance + size;
  const width = isMobile ? numSections * offsetDistance + size : size * 4;

  const bgMaxSize = isMobile ? 375 : 275;

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
      isMobile={isMobile}
      width={width}
      height={height}
      style={{
        "--scale": overlayToggle.to({ output: [1, 1.5] })
      }}
    >
      <Background
        isMobile={isMobile}
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
        isMobile={isMobile}
      />
    </Container>
  );
}

export { ScrollOverlay };
