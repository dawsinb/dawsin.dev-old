import React from "react";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";
import { TitleSection } from "./components/sections/TitleSection";
import { ContentSection } from "./components/sections/ContentSection";
import {
  AboutMe,
  CommercialWork,
  Research,
  Euphony,
  Music
} from "./components/sections/content/ContentIndex";
import { EndSection } from "./components/sections/EndSection";
import { useStore } from "./store";
import { Background } from "./components/Background";
import { Stats } from "@react-three/drei";

const CanvasContainer = styled("div")`
  width: 100%;
  height: 100%;
`;

function App() {
  return (
    <CanvasContainer>
      <Canvas
        linear
        orthographic
        camera={{ position: [0, 0, 10000], far: 11000 }}
      >
        <TitleSection index={0} parallax={1.5} />

        <ContentSection
          index={1}
          header={"about me"}
          bgText={"<meta>"}
          image="/images/self.jpg"
        >
          <AboutMe />
        </ContentSection>
        <ContentSection
          index={2}
          header={"commercial work"}
          bgText={"<main>"}
          image="/images/tree.jpg"
        >
          <CommercialWork />
        </ContentSection>
        <ContentSection
          index={3}
          header={"research"}
          bgText={"<data>"}
          image="/images/distorted.jpg"
        >
          <Research />
        </ContentSection>
        <ContentSection
          index={4}
          header={"euphony"}
          bgText={"<script>"}
          image="/images/music.jpg"
        >
          <Euphony />
        </ContentSection>
        <ContentSection
          index={5}
          header={"music"}
          bgText={"<audio>"}
          image="/images/line.jpg"
        >
          <Music />
        </ContentSection>

        <EndSection index={6} parallax={1.5} />
        <Background />
      </Canvas>
    </CanvasContainer>
  );
}

export { App };
