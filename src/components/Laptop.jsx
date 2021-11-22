import React, { useMemo, useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { TextureLoader, NearestFilter, LinearFilter } from "three";

function Laptop({ ...props }) {
  const { nodes } = useGLTF("/models/laptop.gltf");

  const group = useRef();

  const imageTexture = useLoader(TextureLoader, "/images/sites/mlmp/desktop/home_dark.png");
  useMemo(() => {
    imageTexture.minFilter = NearestFilter
    imageTexture.magFilter = LinearFilter
  }, [imageTexture]);

  function mapGltf(node) {
    if (node.type === "Group") {
      return (
        <group
          position={node.position}
          scale={node.scale}
          rotation={node.rotation}
        >
          {node.children.map((node) => mapGltf(node))}
        </group>
      );
    } else if (node.type === "Mesh") {
      if (node.name === "screen") {
        return (
          <mesh
            position={node.position}
            scale={node.scale}
            rotation={node.rotation}
            geometry={node.geometry}
          >
            <meshBasicMaterial map={imageTexture} />
          </mesh>
        );
      } else {
        return (
          <mesh
            position={node.position}
            scale={node.scale}
            rotation={node.rotation}
            geometry={node.geometry}
            material={node.material}
          />
        );
      }
    }
  }

  return (
    <group ref={group}>
      <group {...props}>{mapGltf(nodes.Scene)}</group>
    </group>
  );
}

export { Laptop };
