import React, { useMemo } from "react";
import { useThree, useLoader } from "@react-three/fiber";
import styled from "styled-components";
import { useStore } from "../../store";
import { Section, SectionItem } from "./Section";
import { Html, Text } from "@react-three/drei";
import { DistortionPlane } from "../DistortionPlane";
import { TextureLoader, LinearFilter } from "three";

const Content = styled("div")`
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.7);
  span {
    ::selection {
      background-color: ${(props) => props.highlightColor};
    }
  }
  br {
    ::selection {
      background-color: ${(props) => props.highlightColor};
    }
  }
  i {
    ::selection {
      background-color: ${(props) => props.highlightColor};
    }
  }
  em {
    color: ${(props) => props.color};
    ::selection {
      background-color: ${(props) => props.highlightColor};
    }
  }
  a {
    text-decoration: none;
    color: ${(props) => props.color};
    ::selection {
      background-color: ${(props) => props.highlightColor};
    }
  }
  button {
    background-color: transparent;
    border: none;
    opacity: 1;
    font-size: inherit;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: ${(props) => props.color};
    ::selection {
      background-color: ${(props) => props.highlightColor};
    }
  }
`;

function ContentSection({ index, image, bgText, header, children }) {
  const { size } = useThree();

  // use mobile layout if vertical orientation
  const isMobile = size.width < size.height;

  // calculate base width and height
  const marginX = useStore((state) => state.marginX);
  const width = size.width * (1 - marginX);
  const marginY = useStore((state) => state.marginY);
  const height = size.height * (1 - marginY);

  // alternate based on index
  const alternate = Boolean(index % 2);

  // alternate colors
  const primary = useStore((state) => state.primaryColor);
  const secondary = useStore((state) => state.secondaryColor);
  const primaryBright = useStore((state) => state.primaryBright);
  const secondaryBright = useStore((state) => state.secondaryBright);
  const color = index % 2 ? primary : secondary;
  const colorBright = index % 2 ? primaryBright : secondaryBright;
  const altColorBright = index % 2 ? secondaryBright : primaryBright;

  // load image
  const imageTexture = useLoader(TextureLoader, image);
  useMemo(() => (imageTexture.minFilter = LinearFilter), [imageTexture]);

  /* Calculate Positions / sizes */

  // padding between image and html
  const padding = isMobile ? height * 0.02 : width * 0.03;

  // calculate image width/height
  const imageHeight = isMobile ? height * 0.3 : height * 0.7;
  const imageWidth = isMobile ? width : width / 1.8;
  // calculate image position
  const imageX = isMobile
    ? 0
    : (width / 2 - imageWidth / 2) * (alternate ? -1 : 1);
  const imageY = isMobile ? height / 4 : -height * 0.05;
  const imagePosition = [imageX, imageY, 0];

  // calculate html width/height
  const htmlHeight = isMobile ? (height - imageHeight) * 0.75 : imageHeight;
  const htmlWidth = isMobile ? width : width - imageWidth - padding;
  // calculate image position (uses top-left coords instead of centered)
  const htmlX =
    isMobile || !alternate ? -width / 2 : imageX + imageWidth / 2 + padding;
  const htmlY = isMobile
    ? imageY - imageHeight / 2 - padding
    : imageY + imageHeight / 2;
  const htmlPosition = [htmlX, htmlY, 10];

  // calculate header position
  const headerX = (width / 2) * (alternate ? -1 : 1);
  const headerY = imageHeight / 2 + imageY + padding;
  const headerPosition = [headerX, headerY, -1];
  const headerFontSize = isMobile ? width / 15 : width / 20;

  // calculate bg text position
  const bgTextX = (width / 2) * (alternate ? 1 : -1);
  const bgTextY = height / 2;
  const bgTextPosition = [bgTextX, bgTextY, -10];
  const bgTextFontSize = width / 6;

  return (
    <Section
      index={index}
      parallax={1 + (isMobile || alternate ? 0 : 0.5)}
      height={100}
    >
      {/* html content*/}
      <SectionItem parallax={0}>
        <Html
          style={{ width: htmlWidth, height: htmlHeight }}
          position={htmlPosition}
          zIndexRange={[0, 0]}
        >
          <Content color={colorBright} highlightColor={altColorBright}>
            {children}
          </Content>
        </Html>
      </SectionItem>

      {/* image */}
      <SectionItem parallax={0}>
        <DistortionPlane
          map={imageTexture}
          args={[imageWidth, imageHeight, 32, 32]}
          position={imagePosition}
          shift={75}
        />
      </SectionItem>

      {/* header */}
      <SectionItem parallax={1.0}>
        <Text
          font={"/fonts/Mont-Heavy.otf"}
          fontSize={headerFontSize}
          color={color}
          anchorX={alternate ? "left" : "right"}
          anchorY={"bottom"}
          position={headerPosition}
        >
          {header}
        </Text>
      </SectionItem>

      {/* bg text */}
      <SectionItem parallax={-2.0}>
        <Text
          font={"/fonts/modenine.ttf"}
          fontSize={bgTextFontSize}
          anchorX={alternate ? "right" : "left"}
          anchorY={"top"}
          position={bgTextPosition}
        >
          {bgText}
          <meshBasicMaterial transparent color={"#ffffff"} opacity={0.04} />
        </Text>
      </SectionItem>
    </Section>
  );
}

export { ContentSection };
