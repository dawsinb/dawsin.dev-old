import React from "react";
import { useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore } from "../../store";
import { Section, SectionItem } from "./Section";

function EndSection({ index, parallax, image, bgText, header, aspect, html }) {
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

  // padding between image and html
  const textX = 0;
  const textY = 0;
  const textPosition = [textX, textY, 0];
  const fontSize = width / 6;

  return (
    <Section index={index} parallax={parallax} height={sectionHeight}>
      <SectionItem parallax={2}>
        <group position={textPosition}>
          {/* japanese text */}

          {/* english text */}
          <Text
            font={"../../fonts/BorisBlackBloxxDirty.ttf"}
            fontSize={fontSize}
            color={secondary}
            fillOpacity={0.8}
            anchorX={"50%"}
            anchorY={"100%"}
          >
            nine
          </Text>
          <Text
            font={"../../fonts/BorisBlackBloxxDirty.ttf"}
            fontSize={fontSize}
            color={primary}
            fillOpacity={0.8}
            anchorX={"50%"}
            anchorY={"50%"}
          >
            four
          </Text>
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
