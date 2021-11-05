import React, { useEffect } from "react";
import { useStore } from "../store";
import { contentsEqual } from "../utils";

function ScrollHandler() {
  // breakpoints for snapping to each section
  const breakpoints = useStore(
    (state) => state.breakpoints,
    (oldBreakpoints, newBreakpoints) =>
      contentsEqual(oldBreakpoints, newBreakpoints)
  );

  // snap callback function
  const snapFunction = () => {
    const offset = window.innerHeight * 0.5;

    // get current scroll position
    const scrollPosition = useStore.getState().scrollPosition;

    // check if any breakpoints are near current scroll position
    let closeBreakpoint = null;
    breakpoints.forEach((breakpoint) => {
      if (
        breakpoint + offset >= scrollPosition &&
        breakpoint - offset <= scrollPosition
      ) {
        closeBreakpoint = breakpoint;
      }
    });
    // if close breakpoint was found snap to it
    if (closeBreakpoint) {
      useStore.setState({ scrollPosition: closeBreakpoint });
    }
  };

  const applyScrollDelta = useStore((state) => state.applyScrollDelta);
  useEffect(() => {
    let timeout = null;
    // scrolling via mouse wheel
    const handleWheel = (event) => {
      // adjust scroll position
      applyScrollDelta((event.deltaY / 100) * (window.innerHeight / 8));
      // clear timeout if one exists
      if (timeout) {
        clearTimeout(timeout);
      }
      // call snap function after short delay
      timeout = setTimeout(snapFunction, 500);
    };
    window.addEventListener("wheel", handleWheel);

    // scrolling via touch
    let previousY;
    // touch start
    const handleTouchstart = (event) => {
      if (event.touches.length === 1) {
        previousY = event.touches.item(0).clientY;
      }
    };
    window.addEventListener("touchstart", handleTouchstart);
    //touch move
    const handleTouchmove = (event) => {
      applyScrollDelta((previousY - event.touches.item(0).clientY) * 1.6);
      previousY = event.touches.item(0).clientY;
    };
    window.addEventListener("touchmove", handleTouchmove);
    //touch end
    const handleTouchend = (event) => {
      if (event.touches.lenghth === 0) {
        // clear timeout if one exists
        if (timeout) {
          clearTimeout(timeout);
        }
        // call snap function after short delay
        timeout = setTimeout(snapFunction, 500);
      }
    };
    window.addEventListener("touchend", handleTouchend);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchstart);
      window.removeEventListener("touchmove", handleTouchmove);
      window.removeEventListener("touchend", handleTouchend);
    };
  });

  return null;
}

export { ScrollHandler };
