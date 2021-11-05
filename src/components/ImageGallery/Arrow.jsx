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

const ArrowSvg = styled("svg")`
  transform: rotateY(${(props) => (props.isLeft ? 180 : 0)}deg);
`;

function Arrow({ color, isLeft }) {
  return (
    <Container>
      <ArrowSvg viewBox="0 0 60 100" isLeft={isLeft}>
        <polygon fill={color} points="0,0 60,50 0,100 0,75 25,50 0,25" />
      </ArrowSvg>
    </Container>
  );
}

export { Arrow };
