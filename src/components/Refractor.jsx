import React, { useMemo, useRef, useLayoutEffect } from "react"
import { Vector3 } from "three"
import { useThree, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import { WebGLRenderTarget } from "three"
import { BackfaceMaterial } from "./refractionShaders/backfaceMaterial"
import { RefractionMaterial } from "./refractionShaders/refractionMaterial"

function Refractor() {
  const { nodes } = useGLTF("/models/rock.gltf")
  const { size, gl, scene, camera } = useThree()
  const model = useRef()

  // Create Fbo's and materials
  const [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial] = useMemo(() => {
    const envFbo = new WebGLRenderTarget(size.width, size.height)
    const backfaceFbo = new WebGLRenderTarget(size.width, size.height)
    const backfaceMaterial = new BackfaceMaterial()
    const refractionMaterial = new RefractionMaterial({ envMap: envFbo.texture, backfaceMap: backfaceFbo.texture, resolution: [size.width * 2, size.height * 2] })
    return [envFbo, backfaceFbo, backfaceMaterial, refractionMaterial]
  }, [size])

  // Render-loop
  const rotationAxis = new Vector3()
  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime()

    model.current.rotateX(0.006)
    model.current.rotateY(0.004)
    model.current.rotateZ(0.005 * Math.sin(clock.getElapsedTime() / 2))
    
    // Render env to fbo
    camera.layers.set(1)
    gl.setRenderTarget(envFbo)
    gl.render(scene, camera)
    // Render cube backfaces to fbo
    camera.layers.set(0)
    model.current.material = backfaceMaterial
    gl.setRenderTarget(backfaceFbo)
    gl.clearDepth()
    gl.render(scene, camera)
  
    // Render env to screen
    camera.layers.set(1)
    gl.setRenderTarget(null)
    gl.render(scene, camera)
    gl.clearDepth()
    // Render cube with refraction material to screen
    camera.layers.set(0)
    model.current.material = refractionMaterial
    gl.render(scene, camera)
  }, 1)

  const center = (self) => self.geometry.center()

  const scale = Math.max(size.width, size.height) / 2
  return (
    <mesh
      onUpdate={center}
      ref={model}
      geometry={nodes.menhir_mini.geometry}
      position={[0, 0, 100]}
      scale={scale}
    >
      <meshBasicMaterial />
    </mesh>

  )
}

export { Refractor }
