import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PlaySvg = styled("svg")`
  transform: scale(${(props) => props.scale});
  .ring {
    transition: stroke-dashoffset 0.35s;
    transform-origin: 50% 50%;
    transform: rotate(-90deg);
  }
  .icon {
    transform: scale(0.4);
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
  }
  :hover {
    .icon {
      transform: scale(0.45);
    }
  }
`;

function PlaybackButton({ scale, color, isPlaying, progress }) {
  const radius = 50;
  const stroke = 4;

  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (Math.min(progress, 1) - 1) * circumference;

  const playToStop = useRef(null);
  const stopToPlay = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      playToStop.current.beginElement();
    } else {
      stopToPlay.current.beginElement();
    }
  }, [isPlaying]);

  return (
    <PlaySvg scale={scale} viewBox={"0 0 110 110"}>
      <circle
        className="ring"
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset: strokeDashoffset }}
        r={radius}
        cx={radius + stroke}
        cy={radius + stroke / 2}
      />
      <polygon
        id="shape"
        className="icon"
        stroke="#c2c2c2"
        fill="#c2c2c2"
        points="10,0 100,60 100,60 10,100"
      >
        <animate
          ref={playToStop}
          begin="indefinite"
          attributeName="points"
          fill="freeze"
          dur="200ms"
          to="0,0 100,0 100,100 0,100"
        />
        <animate
          ref={stopToPlay}
          begin="indefinite"
          attributeName="points"
          fill="freeze"
          dur="200ms"
          to="10,0 100,60 100,60 10,100"
        />
      </polygon>
    </PlaySvg>
  );
}

export { PlaybackButton };
