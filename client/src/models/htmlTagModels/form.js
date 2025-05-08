// Model for <form> tag
import * as THREE from 'three';

export function createFormModel() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
