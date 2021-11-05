import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { useStore } from "../store"
import { contentsEqual } from "../utils"

// create container and section div styles to handle scroll snapping
const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  scroll-snap-type: y ${(props) => props.snapType};
  overflow-y: scroll;
`
const Section = styled.div`
  width: 100%;
  height: ${(props) => props.height}%;
  scroll-snap-align: start;
`

/**
 * Creates an inisible scroll area overlay which updates the scroll context
 *
 * Must be placed within a ScrollProvider, along with the other consumers who also need to import the ScrollContext
 * @component
 */
function ScrollArea({ snapType }) {
  const sections = useStore(
    (state) => state.sections,
    (oldSections, newSections) => contentsEqual(oldSections, newSections)
  )

  const onScroll = (e) => {
    useStore.setState({ scrollPosition: e.target.scrollTop })
  }

  return (
    <Container onScroll={onScroll} snapType={snapType}>
      {sections.map((height, index) => (
        <Section key={index} height={height} />
      ))}
    </Container>
  )
}

ScrollArea.propTypes = {
  snapType: PropTypes.string
}
ScrollArea.defaultProps = {
  snapType: "none"
}

export { ScrollArea }
