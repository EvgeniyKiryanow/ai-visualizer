// Model for <a> tag
import * as THREE from 'three';

export function createAModel() {
  const geometry = new THREE.TorusGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
