import React, { useMemo, useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { lerp } from "../utils";
import { TextureLoader, NearestFilter, LinearFilter } from "three";
import "./shaders/TextureFader";

function Phone({ index, ...props }) {
  const { nodes } = useGLTF("/models/phone.gltf");

  const group = useRef();

  const imageTextures = useTexture([
    "/images/sites/mlmp/mobile/home_dark.png",
    "/images/sites/mlmp/mobile/home_light.png",
    "/images/sites/mlmp/mobile/module_dark.png",
    "/images/sites/mlmp/mobile/module_light.png"
  ]);
  const displacementTexture = useTexture("/images/displacement.jpg");

  useMemo(() => {
    imageTextures.forEach((texture) => {
      texture.flipY = false
      texture.minFilter = NearestFilter
      texture.magFilter = LinearFilter
    }) 
  }, [imageTextures]);

  const textureRef = useRef()

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
            <textureFader index={0} textures={imageTextures} displacementTexture={displacementTexture} />
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
