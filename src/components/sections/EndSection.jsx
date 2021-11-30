import React, { useRef, useLayoutEffect } from "react";
import { FontLoader } from "three"
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore } from "../../store";
import { Section, SectionItem } from "./Section";
import BorisBlackBloxx from "../../fonts/BorisBlackBloxx.json"

function EndSection({ index, parallax }) {
  const isMobile = false;

  // calculate base width and height
  const { size } = useThree();
  const marginX = useStore((state) => state.marginX);
  const width = size.width * (1 - marginX);
  const marginY = useStore((state) => state.marginY);
  const height = size.height * (1 - marginY);

  // adjust section height based on if mobile layout is used
  const sectionHeight = 100;

  // get colors
  const primary = useStore((state) => state.primaryColor);
  const secondary = useStore((state) => state.secondaryColor);

  /* Calculate Positions / sizes */

  const fontSize = width / 10;
  const textX = 0;
  const textY = fontSize / 2;
  const textPosition = [textX, textY, 0];
  

  const font = new FontLoader().parse(BorisBlackBloxx)


  const center = (self) => self.center();

  return (
    <Section index={index} parallax={parallax} height={sectionHeight}>
      <SectionItem parallax={2}>
        <group position={textPosition}>
          <mesh>
            <textGeometry onUpdate={center} args={["nine", {font: font, size: fontSize, height: 1}]}/>
            <meshBasicMaterial color={secondary} />
          </mesh>

          <mesh position={[0, -fontSize / 1.3, 0]}>
            <textGeometry onUpdate={center} args={["four", {font: font, size: fontSize, height: 1}]}/>
            <meshBasicMaterial color={primary} />
          </mesh>
        </group>
      </SectionItem>

      <SectionItem parallax={4}>
        <mesh rotation={[0, 0, Math.PI / 8]} position={[0, 0, -10]}>
          <planeGeometry args={[width * 3, height * 2, 32, 32]} />
          <meshBasicMaterial color={"#000"} />
        </mesh>
      </SectionItem>
    </Section>
  );
}

export { EndSection };

/*
<Text font={"/fonts/SawarabiMincho.ttf"} fontSize={fontSize} color={primary} anchorX={"50%"} anchorY={"90%"}>
  九
</Text>
<Text font={"/fonts/SawarabiMincho.ttf"} fontSize={fontSize} color={secondary} anchorX={"50%"} anchorY={"15%"}>
  四
</Text>
*/
