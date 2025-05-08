// src/utils/interactions/hoverEffect.ts
import * as THREE from 'three'

interface HoverEffectOptions {
  renderer: THREE.WebGLRenderer
  camera: THREE.Camera
  scene: THREE.Scene
  cssToHtmlMap: Map<THREE.Mesh, THREE.Mesh[]>
  htmlToCssMap: Map<THREE.Mesh, THREE.Mesh>
}

export function setupHoverEffect({
  renderer,
  camera,
  scene,
  cssToHtmlMap,
  htmlToCssMap
}: HoverEffectOptions) {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let previousHighlighted: THREE.Mesh[] = []

  const resetHighlights = () => {
    for (const mesh of previousHighlighted) {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissive.set(0x000000)
        mesh.material.emissiveIntensity = 0
      }
    }
    previousHighlighted = []
  }

  const applyHighlight = (meshes: THREE.Mesh[]) => {
    for (const mesh of meshes) {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.emissive.set(0xffff00)
        mesh.material.emissiveIntensity = 1
        previousHighlighted.push(mesh)
      }
    }
  }

  const handleMouseMove = (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    resetHighlights()

    const found = intersects.find(i => i.object instanceof THREE.Mesh)
    if (found && found.object instanceof THREE.Mesh) {
      const hovered = found.object as THREE.Mesh

      if (cssToHtmlMap.has(hovered)) {
        // Навели на CSS — підсвічуємо всі пов’язані HTML-блоки
        const htmlMeshes = cssToHtmlMap.get(hovered)!
        applyHighlight(htmlMeshes)
      } else if (htmlToCssMap.has(hovered)) {
        // Навели на HTML — підсвічуємо відповідну CSS-панель
        const cssPanel = htmlToCssMap.get(hovered)!
        applyHighlight([cssPanel])
      }
    }
  }

  renderer.domElement.addEventListener('mousemove', handleMouseMove)
}
