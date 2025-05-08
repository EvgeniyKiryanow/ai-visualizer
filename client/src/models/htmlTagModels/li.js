// Model for <li> tag
import * as THREE from 'three';

export function createLiModel() {
  const geometry = new THREE.SphereGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
