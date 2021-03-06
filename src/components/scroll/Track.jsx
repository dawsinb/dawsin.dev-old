import { useState, useEffect, useRef } from "react";
import { animated } from "@react-spring/web";
import styled from "styled-components";
import { useStore } from "../../store";
import { Square } from "./Square";
import { Circle } from "./Circle";
import { PositionMarker } from "./PositionMarker";
// top: calc(50% - ${(props) => props.offset}px)
const MarkerContainer = styled("div")`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  right: ${(props) =>
    props.ismobile
      ? `calc(50% - ${-props.offset}px)`
      : `${props.size * 1.5}px`};
  top: ${(props) =>
    props.ismobile ? "auto" : `calc(50% - ${props.offset}px)`};
  bottom: ${(props) => (props.ismobile ? `${props.size * 1.5}px` : "auto")};
  transform: translate(
    ${(props) => props.size / 2}px,
    ${(props) => -props.size / 2}px
  );
  cursor: pointer;
`;

function Marker({
  isStartEnd,
  size,
  offset,
  breakpoint,
  setJumpDirection,
  timeoutRef,
  ismobile
}) {
  const handleClick = () => {
    setJumpDirection((prevValue) => {
      let newValue =
        prevValue + Math.sign(breakpoint - useStore.getState().scrollPosition);
      if (newValue === 0) {
        newValue = Math.sign(breakpoint - useStore.getState().scrollPosition);
      }
      return newValue;
    });
    // update the scroll position now that
    useStore.setState({ scrollPosition: breakpoint });

    // clear timeout if one currently exists
    clearTimeout(timeoutRef.current);
    // reset the rotation factor after travel is complete
    timeoutRef.current = setTimeout(() => {
      setJumpDirection(0);
    }, 2000);
  };

  return (
    <MarkerContainer
      ismobile={ismobile}
      onClick={handleClick}
      size={size}
      offset={offset}
    >
      {isStartEnd ? <Circle size={size} /> : <Square size={size} />}
    </MarkerContainer>
  );
}

const TextContainer = styled(animated.div)`
  position: absolute;
  right: ${(props) =>
    props.ismobile ? `calc(50% - ${-props.offset}px)` : `${props.size * 4}px`};
  top: ${(props) =>
    props.ismobile ? "auto" : `calc(50% - ${props.offset}px)`};
  bottom: ${(props) => (props.ismobile ? `${props.size * 4}px` : "auto")};
  transform: translate(
      ${(props) =>
        props.ismobile
          ? `${props.size / 2.2}px, ${-props.size}px`
          : `0px, ${-props.size / 1.7}px`}
    )
    translate(
      ${(props) =>
        props.ismobile ? `0px, var(--offset, 0px)` : `var(--offset, 0px), 0px`}
    );
  white-space: nowrap;
  text-align: right;
  font-size: ${(props) => props.size * (props.ismobile ? 0.8 : 0.9)}px;
  writing-mode: ${(props) =>
    props.ismobile ? "vertical-lr" : "horizontal-lr"};
  text-orientation: ${(props) => (props.ismobile ? "upright" : "horizontal")};
  user-select: none;
`;

function Track({
  size,
  offsetDistance,
  numSections,
  breakpoints,
  textToggles,
  ismobile
}) {
  const offsetFactors = [...Array(numSections)].map(
    (_, index) => -(index - (numSections - 1) / 2)
  );

  const timeoutRef = useRef();
  const [jumpDirection, setJumpDirection] = useState(0);

  const sectionNames = [
    "",
    "about me",
    "commercial",
    "portfolio",
    "research",
    "euphony",
    "music",
    ""
  ];
  return (
    <>
      {offsetFactors.map((offsetFactor, index) => (
        <Marker
          key={index}
          isStartEnd={index === 0 || index === offsetFactors.length - 1}
          size={size}
          offset={offsetFactor * offsetDistance}
          breakpoint={breakpoints[index]}
          setJumpDirection={setJumpDirection}
          timeoutRef={timeoutRef}
          ismobile={ismobile}
        />
      ))}
      {sectionNames.map((name, index) => (
        <TextContainer
          key={index}
          size={size}
          offset={offsetFactors[index] * offsetDistance}
          ismobile={ismobile}
          style={{
            opacity: textToggles[index].to({ output: [0, 1] }),
            "--offset": textToggles[index]
              .to({ output: [size * 2, 0] })
              .to((value) => `${value}px`)
          }}
        >
          {name}
        </TextContainer>
      ))}

      <PositionMarker
        size={size}
        offsetDistance={offsetDistance}
        numSections={numSections}
        jumpDirection={jumpDirection}
        ismobile={ismobile}
      />
    </>
  );
}

export { Track };
