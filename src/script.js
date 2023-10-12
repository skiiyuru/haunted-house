import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "lil-gui"
import { FontLoader } from "three/addons/loaders/FontLoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Fog
const fog = new THREE.Fog("#262837", 1, 15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAoTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorMetalTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")
const wallColorTexture = textureLoader.load("/textures/bricks/color.jpg")
const wallAoTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
)
const wallNormalTexture = textureLoader.load("/textures/bricks/normal.jpg")
const wallRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
)
const grassColorTexture = textureLoader.load("textures/grass/color.jpg")
const grassAoTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
)
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg")
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
)

const stoneColorTexture = textureLoader.load("textures/stone/color.jpg")
const stoneAoTexture = textureLoader.load(
  "/textures/stone/ambientOcclusion.jpg"
)
const stoneNormalTexture = textureLoader.load("/textures/stone/normal.jpg")
const stoneRoughnessTexture = textureLoader.load(
  "/textures/stone/roughness.jpg"
)

// const textColorTexture = textureLoader.load("textures/text/color.jpg")
// const textAoTexture = textureLoader.load("/textures/text/ambientOcclusion.jpg")
// const textNormalTexture = textureLoader.load("/textures/text/normal.jpg")

const bushColorTexture = textureLoader.load("textures/bush/color.jpg")
const bushAoTexture = textureLoader.load("/textures/bush/ambientOcclusion.jpg")
const bushNormalTexture = textureLoader.load("/textures/bush/normal.jpg")
const bushRoughnessTexture = textureLoader.load("/textures/bush/roughness.jpg")

const grassTextures = [
  grassColorTexture,
  grassAoTexture,
  grassNormalTexture,
  grassRoughnessTexture,
]
grassTextures.map((t) => {
  t.repeat.set(8, 8)
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
})

/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallAoTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture,
  })
)
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
house.add(walls)
walls.position.y = 2.5 / 2

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
)
house.add(roof)
roof.position.y = 2.5 + 0.5
roof.rotation.y = Math.PI / 4

// Chimney
const chimney = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 1.5, 0.5),
  new THREE.MeshStandardMaterial({ color: "#ac8e82" })
)
house.add(chimney)
chimney.position.y = 2.5 + 1 + 0.4
chimney.position.set(0, 2.5 + 0.5, -1.5)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAoTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalTexture,
    roughnessMap: doorRoughnessTexture,
  })
)
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
house.add(door)
// door.rotation.x = Math.PI
door.position.z = 4 / 2 + 0.01
door.position.y = 1

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  map: bushColorTexture,
  aoMap: bushAoTexture,
  normalMap: bushNormalTexture,
  roughnessMap: bushRoughnessTexture,
})

const bushData = [
  {
    scale: [0.5, 0.5, 0.5],
    position: [0.8, 0.2, 2.2],
  },
  {
    scale: [0.25, 0.25, 0.25],
    position: [1.4, 0.1, 2.1],
  },
  {
    scale: [0.4, 0.4, 0.4],
    position: [-0.8, 0.1, 2.2],
  },
  {
    scale: [0.15, 0.15, 0.15],
    position: [-1, 0.05, 2.6],
  },
]

bushData.map((data) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial)
  bush.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(bush.geometry.attributes.uv.array, 2)
  )
  bush.scale.set(...data.scale)
  bush.position.set(...data.position)
  bush.castShadow = true
  house.add(bush)
})

// Text
const fontLoader = new FontLoader()
fontLoader.load("/fonts/creepster-regular.json", (font) => {
  const textGeometry = new TextGeometry("Ghosts of Kiiyuru", {
    font,
    size: 0.3,
    height: 0.1,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  })
  textGeometry.center()
  const text = new THREE.Mesh(
    textGeometry,
    new THREE.MeshStandardMaterial({
      // map: stoneColorTexture,
      // aoMap: stoneAoTexture,
      // normalMap: stoneNormalTexture,
      // roughnessMap: stoneRoughnessTexture,
    })
  )
  text.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(text.geometry.attributes.uv.array, 2)
  )
  house.add(text)
  text.position.set(0, 2.25, 2)
  text.castShadow = true
})

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  map: stoneColorTexture,
  aoMap: stoneAoTexture,
  normalMap: stoneNormalTexture,
  roughnessMap: stoneRoughnessTexture,
})

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2
  const radius = 3.5 + Math.random() * 5
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  grave.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(grave.geometry.attributes.uv.array, 2)
  )
  grave.position.set(x, 0.3, z)
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4
  grave.castShadow = true
  graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAoTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
)
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/* 
GHOSTS
*/
const ghost1 = new THREE.PointLight("#22B097", 2, 3) //22B097
scene.add(ghost1)
const ghost2 = new THREE.PointLight("#C67288", 2, 3) // C67288
scene.add(ghost2)
const ghost3 = new THREE.PointLight("#F1F1D1", 2, 3) // F1F1D1
scene.add(ghost3)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12)
moonLight.position.set(4, 5, -2)
gui.add(moonLight, "intensity").min(0).max(1).step(0.001)
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001)
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001)
scene.add(moonLight)

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

const doorLightHelper = new THREE.PointLightHelper(doorLight)
// scene.add(doorLightHelper)
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 4
camera.position.y = 3
camera.position.z = 6
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#262837")

/* 
SHADOWS
*/
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
walls.receiveShadow = true
floor.receiveShadow = true

// Optimizations
const pointLights = [ghost1, ghost2, ghost3, doorLight]
pointLights.map((l) => {
  l.shadow.mapSize.width = 256
  l.shadow.mapSize.height = 256
  l.shadow.camera.far = 7
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // animate ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(elapsedTime * 3)

  const ghost2Angle = -elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

  const ghost3Angle = -elapsedTime * 0.18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
  ghost3.position.y = Math.sin(elapsedTime * 5) + Math.sin(elapsedTime * 2)

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
