import { ShaderMaterial, Vector2, GLSL3 } from "three"
import { extend } from "@react-three/fiber"

// fades between the image at prevIndex to the image at index
// fade progress controlled by effectFactor
// note: numTextures is passed as an argument rather than a define due to a limitation with loop unrolling
class TextureFader extends ShaderMaterial {
  constructor(numTextures) {
    super({
      glslVersion: GLSL3,
      uniforms: {
        effectFactor: { type: "f", value: 0 },
        prevIndex: { type: "i", value: 0 },
        index: { type: "i", value: 0 },
        direction: { type: "v2", value: new Vector2(1, 0) },
        imageTextures: { type: "tv", value: undefined },
        noiseTexture: { type: "t", value: undefined },
        displacementTexture: { type: "t", value: undefined },
        noiseIntensity: { type: "f", value: 1 },
        displacementIntensity: { type: "f", value: 1 },
        displacementOffset: { type: "v2", value: new Vector2(0, 0) },
        noiseOffset: { type: "v2", value: new Vector2(0, 0) }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
      fragmentShader: /* glsl */ `
        uniform int index;
        uniform int prevIndex;
        uniform vec2 direction;
        uniform sampler2D imageTextures[${numTextures}];
        uniform sampler2D noiseTexture;
        uniform sampler2D displacementTexture;
        uniform float effectFactor;
        uniform float noiseIntensity;
        uniform float displacementIntensity;
        uniform vec2 noiseOffset;
        uniform vec2 displacementOffset;
        varying vec2 vUv;
        out vec4 fragColor;

        void main() {
          // get uv from the vertex shaders
          vec2 uv = vUv;
          // sample noise
          vec3 noise = texture2D(noiseTexture, mod(uv + noiseOffset, 1.0)).rgb * noiseIntensity;
          // sample displacement
          vec4 displacementTexel = texture2D(displacementTexture, mod(uv + displacementOffset, 1.0));
          float displacement = ((displacementTexel.r + displacementTexel.g + displacementTexel.b) / 3.0) * displacementIntensity;
          
          // calculate noise intensity
          if (effectFactor > 0.5) {
            noise = noise * (1.0 - effectFactor);
          }
          else {
            noise = noise * effectFactor;
          }
          
          // calculate dsplacement intensity
          float prevDisplacement = displacement * (1.0 - effectFactor);
          float currentDisplacement = displacement * effectFactor;
          // claculate uv's from displacement and direction
          vec2 prevImageUV = uv - (prevDisplacement * direction);
          vec2 currentImageUV = uv + (currentDisplacement * direction);
          
          // get prev and current image based on indicies
          vec4 prevImage;
          vec4 currentImage;
          #pragma unroll_loop_start
          for (int i = 0; i < ${numTextures}; i++) {
            if (UNROLLED_LOOP_INDEX == prevIndex) {
              prevImage = texture2D(imageTextures[UNROLLED_LOOP_INDEX], prevImageUV);
            }
            if (UNROLLED_LOOP_INDEX == index) {
              currentImage = texture2D(imageTextures[UNROLLED_LOOP_INDEX], currentImageUV);
            }
          }
          #pragma unroll_loop_end
          
          // mix prev and current image based on effectFactor
          vec4 finalTexture = mix(currentImage, prevImage, effectFactor);
          // apply noise to final texture
          finalTexture = vec4(finalTexture.r - noise.r, finalTexture.g - noise.g, finalTexture.b - noise.b, 1.0);
          fragColor = finalTexture;
        }`
    })
  }

  get index() {
    return this.uniforms.index.value
  }
  set index(v) {
    this.uniforms.index.value = v
  }
  get prevIndex() {
    return this.uniforms.prevIndex.value
  }
  set prevIndex(v) {
    this.uniforms.prevIndex.value = v
  }
  get direction() {
    return this.uniforms.direction.value
  }
  set direction(v) {
    this.uniforms.direction.value = v
  }
  get imageTextures() {
    return this.uniforms.imageTextures.value
  }
  set imageTextures(v) {
    this.uniforms.imageTextures.value = v
  }
  get noiseTexture() {
    return this.uniforms.noiseTexture.value
  }
  set noiseTexture(v) {
    this.uniforms.noiseTexture.value = v
  }
  get displacementTexture() {
    return this.uniforms.displacementTexture.value
  }
  set displacementTexture(v) {
    this.uniforms.displacementTexture.value = v
  }
  get effectFactor() {
    return this.uniforms.effectFactor.value
  }
  set effectFactor(v) {
    this.uniforms.effectFactor.value = v
  }
  get noiseIntensity() {
    return this.uniforms.noiseIntensity.value
  }
  set noiseIntensity(v) {
    this.uniforms.noiseIntensity.value = v
  }
  get displacementIntensity() {
    return this.uniforms.displacementIntensity.value
  }
  set displacementIntensity(v) {
    this.uniforms.displacementIntensity.value = v
  }
  get displacementOffset() {
    return this.uniforms.displacementOffset.value
  }
  set displacementOffset(v) {
    this.uniforms.displacementOffset.value = v
  }
  get noiseOffset() {
    return this.uniforms.noiseOffset.value
  }
  set noiseOffset(v) {
    this.uniforms.noiseOffset.value = v
  }
}

extend({ TextureFader })