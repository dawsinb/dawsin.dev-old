import React, { useMemo, useRef, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { lerp } from "../utils";
import { TextureLoader, NearestFilter, LinearFilter } from "three";
import "./shaders/TextureFader";

function Phone({ imageIndex, prevImageIndex, direction, imageUrls, displacementUrl, noiseUrl, ...props }) {
  const { nodes } = useGLTF("/models/phone.gltf");

  const group = useRef();
  const materialRef = useRef();

  const imageTextures = useTexture(imageUrls);
  const displacementTexture = useTexture(displacementUrl);
  const noiseTexture = useTexture(noiseUrl);

  useMemo(() => {
    imageTextures.forEach((texture) => {
      texture.flipY = false
      texture.minFilter = LinearFilter
      texture.magFilter = LinearFilter
    }) 
  }, [imageTextures]);
  useMemo(() => {
    displacementTexture.minFilter = displacementTexture.magFilter = NearestFilter
  }, [displacementTexture]);
  useMemo(() => {
    noiseTexture.minFilter = noiseTexture.magFilter = NearestFilter
  }, [noiseTexture]);

  useEffect(() => {
    // update index
    materialRef.current.index = imageIndex
    materialRef.current.prevIndex = prevImageIndex
    // update direction
    materialRef.current.direction = direction

    // update offsets
    materialRef.current.displacementOffset.fromArray([(materialRef.current.index * 17) / 7, (materialRef.current.index * 7) / 17])
    materialRef.current.noiseOffset.fromArray([(materialRef.current.index * 17) / 7, (materialRef.current.index * 7) / 17])

    materialRef.current.effectFactor = 1
  }, [imageIndex])

  useFrame(() => {
    materialRef.current.effectFactor = lerp(materialRef.current.effectFactor, 0, 0.04)
  })

  function mapGltf(node) {
    if (node.type === "Group") {
      return (
        <group
          key={node.name}
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
            key={node.name}
            position={node.position}
            scale={node.scale}
            rotation={node.rotation}
            geometry={node.geometry}
          >
            <textureFader 
              attach="material"
              ref={materialRef}
              args={[imageTextures.length]}
              imageTextures={imageTextures}
              noiseTexture={noiseTexture}
              displacementTexture={displacementTexture}
              noiseIntensity={0.2}
              displacementIntensity={1.5}
            />
          </mesh>
        );
      } else {
        return (
          <mesh
            key={node.name}
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
