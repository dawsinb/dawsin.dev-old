import styled from "styled-components";
import { useSpring } from "@react-spring/core";
import { animated } from "@react-spring/web";
import { useState } from "react";

const Container = styled(animated.div)`
  height: ${(props) => props.size}vh;
  width: ${(props) => props.size * 5}vh;
  background-color: var(--color);
  border-radius: ${(props) => props.size}vh;
  cursor: pointer;
  transform: translateX(1px);
`;

const Marker = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 50%;
  height: ${(props) => props.size}vh;
  width: ${(props) => props.size}vh;
  background-color: black;
  border-radius: 100%;
  z-index: 1;
  transform-origin: center;
  transform: translateX(-50%) translateX(var(--offset, 0)) scale(0.85);
`;

const Text = styled(animated.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: ${(props) => props.size / 1.5}vh;
  color: var(--color);
  transform: translate(-50%, -50%);
  user-select: none;
`;

function Slider({ toggle, size, leftColor, rightColor, onClick }) {
  const { markerToggle } = useSpring({
    markerToggle: Number(toggle),
    config: {
      mass: 1,
      tension: 210,
      friction: 30,
      clamp: true
    }
  });
  const { colorToggle } = useSpring({
    colorToggle: Number(toggle),
    config: {
      mass: 1,
      tension: 120,
      friction: 40
    }
  });

  return (
    <Container
      size={size}
      onClick={onClick}
      style={{
        "--color": colorToggle.to({ output: [leftColor, rightColor] })
      }}
    >
      <Text
        size={size}
        style={{
          "--color": colorToggle.to({ output: ["#cccccc", "#000000"] })
        }}
      >
        <b>{toggle ? "mobile" : "desktop"}</b>
      </Text>
      <Marker
        size={size}
        style={{
          "--offset": markerToggle
            .to({ output: [-size * 2, size * 2] })
            .to((value) => `${value}vh`)
        }}
      />
    </Container>
  );
}

export { Slider };
