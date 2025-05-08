// utils/render/renderArrow.ts
import * as THREE from 'three'
import { createArrowWithEffect } from '../../arrowd/createArrow'
import { GEOMETRY } from '../../constants/settings'

export function renderArrow(scene: THREE.Scene, from: THREE.Vector3, to: THREE.Vector3, color = GEOMETRY.arrow.colorHtml) {
  const arrow = createArrowWithEffect(from, to, color)
  scene.add(arrow)
}
