import { animated } from "@react-spring/web";
import styled from "styled-components";

const Container = styled("div")`
  width: 100%;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: translateY(2%);
  }
`;

function X() {
  const size = 100;
  const strokeWidth = 1.5;

  return (
    <Container>
      <svg
        viewBox={`
          ${-strokeWidth / 2} 
          ${-strokeWidth / 2} 
          ${size + strokeWidth} 
          ${size + strokeWidth}
        `}
      >
        <polygon
          fill={"#ffffff"}
          stroke={"#000000"}
          strokeWidth={strokeWidth}
          points="0,100 10,100 50,60 90,100 100,100 100,90 60,50 100,10 100,0 90,0 50,40 10,0 0,0 0,10 40,50 0,90"
        />
      </svg>
    </Container>
  );
}

export { X };
