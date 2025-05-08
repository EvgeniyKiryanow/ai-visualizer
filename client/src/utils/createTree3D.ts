import * as THREE from 'three';

export function createTree3D(tree: any, scene: THREE.Scene, xPos: number = 0, yPos: number = 1) {  // Початкове значення yPos = 1
  tree.forEach((node: any, index: number) => {
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;
    const tag = node.tag;

    // Задаємо різні кольори для різних тегів
    let color: number;
    if (tag === 'div') color = 0x00ff00;  // Зелені куби для <div>
    else if (tag === 'p') color = 0x0000ff;  // Сині куби для <p>
    else if (tag === 'strong') color = 0xff0000;  // Червоні для <strong>
    else color = 0xaaaaaa; // Сірі для всіх інших

    // Замість кубів використовуємо геометрію з різними формами
    if (tag === 'p') {
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);  // Прямокутні для <p>
    } else {
      geometry = new THREE.BoxGeometry(1, 1, 1);  // Куби для інших тегів
    }

    material = new THREE.MeshBasicMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);

    // Встановлюємо початкову позицію дерева вище сітки (yPos + index)
    mesh.position.set(xPos + index * 2, yPos, 0);
    scene.add(mesh);

    // Якщо є діти, додаємо лінії між елементами та рекурсивно будуємо дерево
    if (node.children.length) {
      node.children.forEach((child: any) => {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(xPos + index * 2, yPos, 0),
          new THREE.Vector3(xPos + index * 2 + 2, yPos + 2, 0)  // Лінія йде вгору
        ]);
        
        // Збільшимо товщину лінії та додамо анімацію кольору
        const lineMaterial = new THREE.LineBasicMaterial({
          color: 0xffffff,  // Початковий колір (білий)
          linewidth: 4,  // Збільшена товщина лінії
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);

        // Рекурсивно додаємо дочірні елементи
        createTree3D(node.children, scene, xPos + index * 2 + 2, yPos + 2);  // Відстань по Y для дітей

        // Анімація кольору лінії (синій)
        animateLineColor(lineMaterial);
      });
    }
  });
}

// Функція для анімації кольору лінії
function animateLineColor(lineMaterial: THREE.LineBasicMaterial) {
  let time = 0;
  function updateColor() {
    time += 0.01;
    // Генерація синього кольору (від світлого до темного)
    lineMaterial.color.setHSL(Math.sin(time) * 0.5 + 0.5, 1, 0.5);
    requestAnimationFrame(updateColor);
  }

  updateColor();
}
