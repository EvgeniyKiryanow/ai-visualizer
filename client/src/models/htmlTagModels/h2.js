// Model for <h2> tag
import * as THREE from 'three';

export function createH2Model() {
  const geometry = new THREE.CylinderGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
