import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { ScrollHandler } from "./components/ScrollHandler";
import { ScrollOverlay } from "./components/scroll/ScrollOverlay";
import { ImageGallery } from "./components/ImageGallery/ImageGallery";
import styled from "styled-components";
import "./styles.css";

const Container = styled("div")`
  width: 100vw;
  height: 100vh;
`;

ReactDOM.render(
  <Container>
    <Suspense fallback={<div className="loading" children="Loading..." />}>
      <App />
    </Suspense>
    <ScrollHandler />
    <ScrollOverlay size={1} offsetDistance={2.25} />
    <ImageGallery />
  </Container>,

  document.getElementById("root")
);
