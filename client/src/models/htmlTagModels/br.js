// Model for <br> tag
import * as THREE from 'three';

export function createBrModel() {
  const geometry = new THREE.LineGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
