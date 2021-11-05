function Square({ size }) {
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
      <rect
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        stroke={"white"}
        fill={"white"}
        fillOpacity={0.1}
      />
    </svg>
  );
}

export { Square };
