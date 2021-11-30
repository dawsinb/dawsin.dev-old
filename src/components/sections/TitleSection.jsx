import React, { useLayoutEffect, useRef } from "react"
import { FontLoader } from "three"
import { useThree, useFrame } from "@react-three/fiber"
import { useStore } from "../../store"
import { Section, SectionItem } from "./Section"
import { Html } from "@react-three/drei"
import { Refractor } from "../Refractor"
import { lerp } from "../../utils"
import BorisBlackBloxxDirty from "../../fonts/BorisBlackBloxxDirty.json"

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

  const titleX = 0
  const titleY = 0
  const titlePosition = [titleX, titleY, 1]
  const fontSize = width / 10

  const htmlX = -width / 2
  const htmlY = -height / 4
  const htmlPosition = [htmlX, htmlY, 10]

  const font = new FontLoader().parse(BorisBlackBloxxDirty)

  const textRef = useRef()
  useLayoutEffect(() => {
    textRef.current.geometry.computeBoundingBox()
    textRef.current.parent.position.x = (textRef.current.geometry.boundingBox.min.x - textRef.current.geometry.boundingBox.max.x) / 2
  }, [size])

  const textGroupRef = useRef()
  
  useFrame(({mouse}) => {
    textGroupRef.current.position.x = lerp(textGroupRef.current.position.x, mouse.x * width / 20, 0.07)
    textGroupRef.current.position.y = lerp(textGroupRef.current.position.y, mouse.y * height / 20, 0.07)
    textGroupRef.current.rotation.x = lerp(textGroupRef.current.rotation.x, -mouse.y / 1.5, 0.07)
    textGroupRef.current.rotation.y = lerp(textGroupRef.current.rotation.y, mouse.x / 1.5, 0.07)
  })

  return (
    <Section index={index} parallax={parallax} height={sectionHeight}>
      <SectionItem parallax={2}>
        <group ref={textGroupRef}>
          <group position={titlePosition}>
            <mesh ref={textRef} layers={1}>
              <textGeometry args={["dawsin", {font: font, size: fontSize, height: 1}]}/>
              <meshBasicMaterial color={primary} />
            </mesh>

            <mesh layers={1} position={[0, -fontSize / 1.5, 0.1]}>
              <textGeometry args={[".dev", {font: font, size: fontSize, height: 1}]}/>
              <meshBasicMaterial color={secondary} />
            </mesh>
          </group>
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


// <Text layers={1} font={"../../fonts/BorisBlackBloxxDirty.ttf"} fontSize={fontSize} color={primary} anchorX={"0%"} anchorY={"100%"}>
//   dawsin
// </Text>
// <Text layers={1} font={"../../fonts/BorisBlackBloxxDirty.ttf"} fontSize={fontSize} color={secondary} anchorX={"0%"} anchorY={"75%"}>
//   .dev
// </Text>