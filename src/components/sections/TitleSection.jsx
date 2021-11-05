import React, { Suspense } from "react"
import { useThree } from "@react-three/fiber"
import { useStore } from "../../store"
import { Section, SectionItem } from "./Section"
import { Html, Text } from "@react-three/drei"
import { Refractor } from "../Refractor"

function TitleSection({ index, parallax, image, bgText, header, aspect, html }) {
  const isMobile = false

  // calculate base width and height
  const { size } = useThree()
  const marginX = useStore((state) => state.marginX)
  const width = size.width * (1 - marginX)
  const marginY = useStore((state) => state.marginY)
  const height = size.height * (1 - marginY)

  // adjust section height based on if mobile layout is used
  const sectionHeight = 100

  // get colors
  const primary = useStore((state) => state.primaryColor)
  const secondary = useStore((state) => state.secondaryColor)

  /* Calculate Positions / sizes */

  const titleX = -size.width / 4
  const titleY = 0
  const titlePosition = [titleX, titleY, 0]
  const fontSize = width / 6

  const htmlX = -width / 2
  const htmlY = -height / 4
  const htmlPosition = [htmlX, htmlY, 10]

  return (
    <Section index={index} parallax={parallax} height={sectionHeight}>
      <SectionItem parallax={2}>
        <group position={titlePosition}>
          <Text layers={1} font={"/fonts/BorisBlackBloxxDirty.ttf"} fontSize={fontSize} color={primary} anchorX={"0%"} anchorY={"100%"}>
            dawsin
          </Text>
          <Text layers={1} font={"/fonts/BorisBlackBloxxDirty.ttf"} fontSize={fontSize} color={secondary} anchorX={"0%"} anchorY={"75%"}>
            .dev
          </Text>
        </group>
      </SectionItem>

      <SectionItem parallax={3}>
        <Html style={{ color: "white" }} position={htmlPosition} zIndexRange={[16, 16]}>
          <div style={{ width: "50vw" }}>
            hello world o/
            <br />
            welcome to my portfolio
            <br />
            <br />
            scroll down to continue
          </div>
        </Html>
      </SectionItem>

      <SectionItem parallax={4}>
        <mesh rotation={[0, 0, Math.PI / 8]} position={[0, 0, -10]}>
          <planeGeometry args={[width * 3, height * 2, 32, 32]} />
          <meshBasicMaterial color={"#000"} />
        </mesh>
      </SectionItem>

      <SectionItem parallax={20}>
        <Refractor />
      </SectionItem>
    </Section>
  )
}

export { TitleSection }
