import React, { useMemo, useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { lerp } from "../utils";
import { TextureLoader, LinearFilter, Color } from "three";

function Phone({ ...props }) {
  const { nodes } = useGLTF("/models/phone.gltf");

  const group = useRef();

  const imageTexture = useLoader(TextureLoader, "/images/self.jpg");
  useMemo(() => (imageTexture.minFilter = LinearFilter), [imageTexture]);

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
      if (node.name === "SCREEN") {
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

export { Phone };
