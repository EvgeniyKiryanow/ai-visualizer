// Model for <p> tag
import * as THREE from 'three';

export function createPModel() {
  const geometry = new THREE.CylinderGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
