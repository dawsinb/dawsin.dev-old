function Circle({ size }) {
  const strokeWidth = 1.5;
  return (
    <svg
      style={{ display: "block", margin: "auto" }}
      viewBox={`
        ${-strokeWidth / 2} 
        ${-strokeWidth / 2} 
        ${size + strokeWidth} 
        ${size + strokeWidth}
      `}
    >
      <circle
        r={size / 2}
        cx={size / 2}
        cy={size / 2}
        strokeWidth={2}
        stroke={"white"}
        fill={"white"}
        fillOpacity={0.1}
      />
    </svg>
  );
}

export { Circle };
