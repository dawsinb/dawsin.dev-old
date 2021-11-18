import React, { useEffect, useState, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useStore } from "../../store";
import { Section, SectionItem } from "./Section";
import { useHelper, Html } from "@react-three/drei";
import { Laptop } from "../Laptop";
import { Phone } from "../Phone";
import { Svg } from "../Svg";
import { Arrow } from "../Arrow";
import { Slider } from "../Slider";
import { useSpring } from "@react-spring/core";
import { animated } from "@react-spring/three";
import { SpotLightHelper } from "three";
import styled from "styled-components";

const ArrowContainer = styled("div")`
  position: absolute;
  left: ${(props) => (props.isLeft ? "-35vw" : "35vw")};
  width: 6vw;
  transform: translate(-50%, -50%);
`;

const SliderContainer = styled("div")`
  position: absolute;
  bottom: -43vh;
  transform: translateX(-50%);
`;

function PortfolioSection({ index, parallax }) {
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

  const laptopRef = useRef();
  const phoneRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    laptopRef.current.rotation.x = Math.cos(t / 2) / 16;
    laptopRef.current.rotation.y = Math.sin(t / 3) / 8;
    laptopRef.current.rotation.z = Math.sin(t / 5) / 8;
    laptopRef.current.position.y = (Math.sin(t) * height) / 64;

    phoneRef.current.rotation.x = Math.sin(t / 2) / 16;
    phoneRef.current.rotation.y = Math.cos(t / 3) / 8;
    phoneRef.current.rotation.z = Math.cos(t / 5) / 8;
    phoneRef.current.position.y = (Math.cos(t) * height) / 64;
  });

  /* Calculate Positions / sizes */

  const sliderSize = 3;

  const phoneScale = height / 4.5;
  const phoneY = -phoneScale;
  const phonePosition = [0, phoneY, 0];

  const laptopScale = height / 36;
  const laptopY = -laptopScale * 8;
  const laptopPosition = [0, laptopY, 0];

  const [toggle, setToggle] = useState(false);
  const { colorSpring } = useSpring({
    colorSpring: Number(toggle),
    config: {
      mass: 1,
      tension: 280,
      friction: 120
    }
  });

  const lightRef = useRef();
  const lightRef_test = useRef();
  const lightTargetRef = useRef();
  //useHelper(lightRef, SpotLightHelper, 'cyan')
  useEffect(() => (lightRef.current.target = lightTargetRef.current), []);
  useEffect(() => (lightRef_test.current.target = lightTargetRef.current), []);
  const [deviceToggle, setDeviceToggle] = useState(false);
  const { deviceSpring } = useSpring({
    deviceSpring: Number(deviceToggle),
    config: {
      mass: 1,
      tension: 120,
      friction: 18
    }
  });

  const [hovered, setHovered] = useState(false);
  useEffect(
    () => void (document.body.style.cursor = hovered ? "pointer" : "auto"),
    [hovered]
  );

  return (
    <Section index={index} parallax={parallax} height={sectionHeight}>
      <animated.ambientLight
        intensity={1.8}
        color={colorSpring.to({ output: [primary, secondary] })}
      />
      <animated.directionalLight
        ref={lightRef_test}
        position={[500, 2500, 3000]}
        intensity={2}
        color={"#f0f0f0"}
      />
      <spotLight
        ref={lightRef}
        intensity={0.8}
        position={[500, 750, 5000]}
        angle={Math.PI / 5}
        color={"#f0f0f0"}
      />
      <object3D ref={lightTargetRef} position={[-2000, -1500, 0]} />

      <SectionItem parallax={1}>
        <Html zIndexRange={[0, 0]}>
          <ArrowContainer isLeft={true} onClick={() => setToggle(!toggle)}>
            <Arrow isLeft={true} color={secondary} />
          </ArrowContainer>
          <ArrowContainer isLeft={false} onClick={() => setToggle(!toggle)}>
            <Arrow isLeft={false} color={primary} />
          </ArrowContainer>
        </Html>
      </SectionItem>

      <SectionItem parallax={0.4}>
        <Html>
          <SliderContainer>
            <Slider
              toggle={deviceToggle}
              size={4}
              leftColor={primary}
              rightColor={secondary}
              onClick={() => setDeviceToggle(!deviceToggle)}
            />
          </SliderContainer>
        </Html>
      </SectionItem>

      <SectionItem parallax={0.4}>
        <group position={[0, 0, 1000]}>
          <animated.group
            ref={laptopRef}
            position-x={deviceSpring.to({ output: [0, width] })}
          >
            <Laptop
              scale={laptopScale}
              position={laptopPosition}
              rotation={[0.25, 0, 0]}
              onClick={() => setDeviceToggle(!deviceToggle)}
              onPointerEnter={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            />
          </animated.group>

          <animated.group
            ref={phoneRef}
            position-x={deviceSpring.to({ output: [-width, 0] })}
          >
            <Phone
              scale={phoneScale}
              position={phonePosition}
              rotation={[0, 0, 0]}
              onClick={() => setDeviceToggle(!deviceToggle)}
              onPointerEnter={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            />
          </animated.group>
        </group>
      </SectionItem>
    </Section>
  );
}

export { PortfolioSection };
