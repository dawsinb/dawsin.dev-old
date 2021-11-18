import React, { useMemo } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

function Svg({ url, color, ...props }) {
  // get shape data
  const { paths } = useLoader(SVGLoader, url);
  const svgData = useMemo(
    () =>
      paths.flatMap((path, index) =>
        path
          .toShapes(true)
          .map((shape) => ({ shape: shape, color: path.color, index }))
      ),
    [paths]
  );
  const shapes = svgData.map((data) => data.shape);

  // center the geometry after it is rendered
  const center = (self) => self.center();

  return (
    <mesh {...props}>
      <shapeGeometry onUpdate={center} args={[shapes, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export { Svg };
