import { animated } from "@react-spring/web";
import styled from "styled-components";

const Container = styled(animated.div)`
  height: 100%;
  width: 100%;
`;

const Image = styled("img")`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  transform: translateY(-50%);
`;

const CaptionContainer = styled("div")`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 15%;
  background-color: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(9px);
`;

function CaptionedImage({ src, header, description, toggle }) {
  return (
    <Container
      style={{
        opacity: toggle.to({ output: [0, 100] }).to((value) => `${value}%`)
      }}
    >
      <Image src={src} />
      <CaptionContainer>a</CaptionContainer>
    </Container>
  );
}

function BaseImage({ src }) {
  return (
    <Container>
      <Image src={src} />
    </Container>
  );
}

export { CaptionedImage, BaseImage };
