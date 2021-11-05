import React, { createContext, useRef, useContext, useEffect } from "react"
import PropTypes from "prop-types"
import { useFrame, useThree } from "@react-three/fiber"
import { lerp } from "../../utils"
import { useStore } from "../../store"

/**
 * TODO: add desc
 */
const ParallaxContext = createContext({ offset: 0, parallax: 1 })

/**
 * TODO: add desc
 */
function Section({ index, height, parallax, children, ...props }) {
  const { size } = useThree()

  // retrieve sections and update
  const sections = useStore.getState().sections
  sections[index] = (height / 100) * size.height
  useStore.setState({ sections: [...sections] })
  useStore.setState({ maxScroll: sections.reduce((sum, height) => sum + height, 0) - size.height })

  // calculate total height up to this section
  const totalHeight = sections.slice(0, index).reduce((sum, height) => (sum += height), 0)
  // calculate position (adjust for parallax factor)
  const position = -totalHeight * parallax
  // record breakpoint
  const breakpoints = useStore.getState().breakpoints
  breakpoints[index] = totalHeight
  useStore.setState({ breakpoints: [...breakpoints] })

  // set up a ref to the sub group so that we can scroll it relative to the position
  const subgroupRef = useRef()
  // set up transient subscription to the scroll position
  const scrollRef = useRef(useStore.getState().scrollPosition)
  useEffect(
    () =>
      useStore.subscribe(
        (scrollPosition) => (scrollRef.current = scrollPosition),
        (state) => state.scrollPosition
      ),
    []
  )
  // lerp y position to scroll position (adjusted for parallax) for a smooth scroll effect
  useFrame(() => {
    subgroupRef.current.position.y = lerp(subgroupRef.current.position.y, scrollRef.current * parallax, 0.07)
  })

  return (
    <ParallaxContext.Provider value={{ offset: position, parallax: parallax }}>
      <group position={[0, position, 0]} {...props}>
        <group ref={subgroupRef}>{children}</group>
      </group>
    </ParallaxContext.Provider>
  )
}
// define props
Section.propTypes = {
  index: PropTypes.number.isRequired,
  height: PropTypes.number,
  parallax: PropTypes.number
}
Section.defaultProps = {
  height: 100,
  parallax: 0
}

/**
 * TODO: add Desc
 *
 */
function SectionItem({ parallax, children }) {
  // calculate position from offset and parallax factor
  const { offset: parentOffset, parallax: parentParallax } = useContext(ParallaxContext)
  const position = parentOffset * parallax

  // set up a ref to the sub group so that we can scroll it relative to the position
  const subgroupRef = useRef()
  // set up transient subscription to the scroll position
  const scrollRef = useRef(useStore.getState().scrollPosition)
  useEffect(
    () =>
      useStore.subscribe(
        (scrollPosition) => (scrollRef.current = scrollPosition),
        (state) => state.scrollPosition
      ),
    []
  )
  // lerp y position to scroll position (adjusted for parallax) for a smooth scroll effect
  useFrame(() => {
    subgroupRef.current.position.y = lerp(subgroupRef.current.position.y, scrollRef.current * parallax * parentParallax, 0.1)
  })

  return (
    <group position={[0, position, 0]}>
      <group ref={subgroupRef}>{children}</group>
    </group>
  )
}
// define props
SectionItem.propTypes = {
  parallax: PropTypes.number
}
SectionItem.defaultProps = {
  parallax: 1
}

export { Section, SectionItem }
