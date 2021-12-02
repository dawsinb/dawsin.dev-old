import React, { useRef, useEffect, useState } from "react";
import { FontLoader, TextGeometry, BufferAttribute, BufferGeometry } from "three"
import { useThree, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useStore } from "../../store";
import { Section, SectionItem } from "./Section";
import BorisBlackBloxx from "../../fonts/BorisBlackBloxx.json"
import Yuji_Syuku from "../../fonts/Yuji_Syuku.json"
import { lerp } from "../../utils";

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
  
  //

  const font = new FontLoader().parse(BorisBlackBloxx)
  const fontJp = new FontLoader().parse(Yuji_Syuku)

  const nineGeometry = new TextGeometry("nine", {
    font: font,
    size: fontSize,
    height: 0.01
  })
  nineGeometry.center()

  const nineGeometryJp = new TextGeometry("九", {
    font: fontJp,
    size: fontSize * 1.25,
    height: 0.01
  })
  nineGeometryJp.center()

  const nineBufferSize = Math.max(nineGeometry.attributes.position.count, nineGeometryJp.attributes.position.count) * 3

  const nineBuffer = new Float32Array(nineBufferSize)
  nineBuffer.set(nineGeometry.attributes.position.array)

  const nineBufferJp = new Float32Array(nineBufferSize)
  nineBufferJp.set(nineGeometryJp.attributes.position.array)

  nineGeometry.setAttribute("position", new BufferAttribute(nineBuffer, 3))
  nineGeometry.morphAttributes.position = [new BufferAttribute(nineBufferJp, 3)]


  const fourGeometry = new TextGeometry("four", {
    font: font,
    size: fontSize,
    height: 0.01
  })
  fourGeometry.center()

  const fourGeometryJp = new TextGeometry("四", {
    font: fontJp,
    size: fontSize * 1.25,
    height: 0.01
  })
  fourGeometryJp.center()

  const fourBufferSize = Math.max(fourGeometry.attributes.position.count, fourGeometryJp.attributes.position.count) * 3

  const fourBuffer = new Float32Array(fourBufferSize)
  fourBuffer.set(fourGeometry.attributes.position.array)

  const fourBufferJp = new Float32Array(fourBufferSize)
  fourBufferJp.set(fourGeometryJp.attributes.position.array)

  fourGeometry.setAttribute("position", new BufferAttribute(fourBuffer, 3))
  fourGeometry.morphAttributes.position = [new BufferAttribute(fourBufferJp, 3)]
  //

  const nineRef = useRef()
  const fourRef = useRef()
  useEffect(() => {
    nineRef.current.updateMorphTargets()
    fourRef.current.updateMorphTargets()
  }, [])

  const [nineHovered, setNineHovered] = useState(false)
  const [fourHovered, setFourHovered] = useState(false)

  const [nineState, setNineState] = useState(false)
  const [fourState, setFourState] = useState(false)

  useFrame(({clock}) => {
    const time = clock.getElapsedTime() / 4
    const hoverInfluenceNine = Math.sin(time) * 0.05 + 0.5
    const hoverInfluenceFour = Math.cos(time) * 0.05 + 0.5
    nineRef.current.morphTargetInfluences[0] = lerp(nineRef.current.morphTargetInfluences[0], nineHovered ? hoverInfluenceNine : Number(nineState), 0.03)
    fourRef.current.morphTargetInfluences[0] = lerp(fourRef.current.morphTargetInfluences[0], fourHovered ? hoverInfluenceFour : Number(fourState), 0.03)
  })

  return (
    <Section index={index} parallax={parallax} height={sectionHeight}>
      <SectionItem parallax={2}>
        <group position={textPosition}>
          <group>
            <mesh
              ref={nineRef}
              geometry={nineGeometry}
            >
              <meshBasicMaterial color={secondary} />
            </mesh>
            <mesh
              onPointerEnter={() => {setNineHovered(true); setNineState(!nineState)}}
              onPointerOut={() => {setNineHovered(false)}}
            >
              <planeGeometry args={[fontSize * 4, fontSize * 1.5]}/>
              <meshBasicMaterial transparent opacity={0}/>
            </mesh>
          </group>

          <group position={[0, -fontSize / 1.3, 1]}>
            <mesh 
              ref={fourRef}
              geometry={fourGeometry}
            >
              <meshBasicMaterial color={primary} />
            </mesh>
            <mesh
                onPointerEnter={() => {setFourHovered(true); setFourState(!fourState)}}
                onPointerOut={() => {setFourHovered(false)}}
              >
                <planeGeometry args={[fontSize * 4, fontSize * 1.5]}/>
                <meshBasicMaterial transparent opacity={0}/>
              </mesh>
          </group>
          
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

