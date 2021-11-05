import React, { useRef, useLayoutEffect, useCallback } from "react";
import styled from "styled-components";

// create container and section div styles to handle scroll snapping
const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const Text = styled.span`
  width: 100%;
  height: 100%;
  display: block;
  font-size: 1px;
`;

function DynamicText({ children, ...props }) {
  const containerRef = useRef();
  const textRef = useRef();

  const resize = () => {
    // only run if div is loaded
    if (containerRef.current.clientHeight !== 0) {
      let i = 1;
      let overflow = false;
      // increase size until text overflows
      while (!overflow) {
        textRef.current.style.fontSize = `${i}px`;
        overflow =
          containerRef.current.clientHeight <
            containerRef.current.scrollHeight ||
          containerRef.current.clientWidth < containerRef.current.scrollWidth;
        if (!overflow) {
          i = i + 0.5;
        }
      }

      // revert to last state where no overflow happened:
      textRef.current.style.fontSize = `${i - 0.5}px`;
    }
    // retry in 100 ms if div isnt loaded
    else {
      setTimeout(resize, 100);
    }
  };

  // TODO: resize text when width or height of container changes
  useLayoutEffect(resize, []);
  useLayoutEffect(() => {
    window.addEventListener("keydown", () => {
      console.log("resize");

      resize();
    });
  }, []);

  return (
    <Container ref={containerRef}>
      <Text ref={textRef} {...props}>
        {children}
      </Text>
    </Container>
  );
}

export { DynamicText };
