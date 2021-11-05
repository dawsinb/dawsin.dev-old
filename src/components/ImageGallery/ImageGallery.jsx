import { CaptionedImage, BaseImage } from "./CaptionedImage";
import { Arrow } from "./Arrow";
import { X } from "./X";
import { useSpring } from "@react-spring/core";
import { useState } from "react";
import styled from "styled-components";
import { animated } from "@react-spring/web";
import { useStore } from "../../store";

const images = [
  {
    src: "/images/sites/desktop_base2.jpg",
    header: "Sekeh's Lab - Home",
    description:
      "Home page for Dr. Salimeh Yasaei Sekeh's lab and personal site"
  },
  {
    src: "/images/sites/sekeh-site2.jpg",
    header: "Sekeh's Lab - Home",
    description:
      "Home page for Dr. Salimeh Yasaei Sekeh's lab and personal site"
  },
  {
    src: "/images/sites/sekeh-site3.jpg",
    header: "Sekeh's Lab - Home",
    description:
      "Home page for Dr. Salimeh Yasaei Sekeh's lab and personal site"
  }
];

const GalleryContainer = styled(animated.div)`
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(3px);
`;

const ArrowContainer = styled("div")`
  width: 4.5%;
  padding: 2.5%;
`;

const ImageContainer = styled("div")`
  position: relative;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const XContainer = styled("div")`
  z-index: 1;
  position: absolute;
  top: 2.5%;
  right: calc(2.5% * ${(props) => props.aspectRatio});
  width: 5%;
`;

function ImageGallery() {
  const [currentIndex, setIndex] = useState(0);

  const toggles = [];
  for (let i = 0; i < images.length; i++) {
    toggles[i] = useSpring({
      toggle: currentIndex === i ? 1 : 0
    }).toggle;
  }

  const primary = useStore((state) => state.primaryBright);
  const secondary = useStore((state) => state.secondaryBright);

  const aspectRatio = 0.7;
  const width = Math.round(window.innerWidth * 0.6);
  const height = Math.round(width * aspectRatio);

  return (
    <GalleryContainer>
      <ArrowContainer>
        <Arrow isLeft color={secondary} />
      </ArrowContainer>

      <ImageContainer height={height} width={width}>
        <XContainer aspectRatio={aspectRatio}>
          <X />
        </XContainer>

        <BaseImage src={"/images/sites/base.jpg"} />
        {images.map((image, index) => (
          <CaptionedImage
            src={image.src}
            header={image.header}
            description={image.description}
            toggle={toggles[index]}
          />
        ))}
      </ImageContainer>

      <ArrowContainer>
        <Arrow color={primary} />
      </ArrowContainer>
    </GalleryContainer>
  );
}

export { ImageGallery };
