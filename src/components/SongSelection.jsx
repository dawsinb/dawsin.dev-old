import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { PlaybackButton } from "./PlaybackButton";
import { DynamicText } from "./DynamicText";

const Container = styled("div")`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const PlaybackButtonContainer = styled("div")`
  height: 100%;
  margin-right: 5%;
  width: 35%;
  min-height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TextContainer = styled("div")`
  width: 55%;
  height: 25%;
  text-overflow: clip;
  white-space: nowrap;
  display: block;
  color: rgba(255, 255, 255, 0.8);
`;

function SongSelection({
  playback,
  id,
  title,
  handler,
  color,
  scale,
  isPlaying
}) {
  const [progress, setProgress] = useState(0);

  // animation request
  const requestRef = useRef();

  const tick = () => {
    // update song progress
    setProgress(playback.getPlaybackTime() / playback.duration);

    // request next animation tick
    requestRef.current = requestAnimationFrame(tick);
  };
  // start animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <Container>
      <PlaybackButtonContainer onClick={handler(id)}>
        <PlaybackButton
          scale={scale}
          color={color}
          isPlaying={progress > 0}
          progress={progress}
        />
      </PlaybackButtonContainer>

      <TextContainer>
        <DynamicText>
          <i>{title}</i>
        </DynamicText>
      </TextContainer>
    </Container>
  );
}

export { SongSelection };
