
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080817);
scene.fog = new THREE.Fog(0x080817, 10, 35);

// CAMERA
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 2, 9);

// RENDERER
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

document.getElementById('canvas-container')
    .appendChild(renderer.domElement);

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const pointLight = new THREE.PointLight(
    0xff9ee8, 100, 30
);

pointLight.position.set(0, 5, 5);
scene.add(pointLight);

// CAKE GROUP
const cake = new THREE.Group();

cake.position.y = -1.3;

scene.add(cake);

// CAKE BASE
const cakeGeometry = new THREE.CylinderGeometry(
    2, 2, 1, 64
);

const cakeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffa6ce,
    roughness: 0.35
});

const cakeBase = new THREE.Mesh(
    cakeGeometry,
    cakeMaterial
);

cakeBase.position.y = -1;
cakeBase.castShadow = true;
cake.add(cakeBase);

// CAKE TOP
const topGeometry = new THREE.CylinderGeometry(
    2, 2, 0.15, 64
);

const topMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe5f1
});

const cakeTop = new THREE.Mesh(
    topGeometry,
    topMaterial
);

cakeTop.position.y = -0.42;
cake.add(cakeTop);

// CREAM DECORATION
for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;

    const cream = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({
            color: 0xffffff
        })
    );

    cream.position.set(
        Math.cos(angle) * 1.7,
        -0.3,
        Math.sin(angle) * 1.7
    );

    cake.add(cream);
}

// CANDLE
const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.8, 24),
    new THREE.MeshStandardMaterial({
        color: 0x9c70e8
    })
);

candle.position.y = 0.05;
cake.add(candle);

// FLAME
const flame = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 16, 16),
    new THREE.MeshBasicMaterial({
        color: 0xffa500
    })
);

flame.scale.set(0.8, 1.5, 0.8);
flame.position.y = 0.55;
cake.add(flame);

// BALLOONS
const balloons = [];

const balloonColors = [
    0xff69b4,
    0x9d7bff,
    0xffd166,
    0x7de3ff
];

for (let i = 0; i < 8; i++) {
    const balloon = new THREE.Group();

    const color = balloonColors[i % balloonColors.length];

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 32, 32),
        new THREE.MeshStandardMaterial({
            color,
            roughness: 0.25,
            metalness: 0.1
        })
    );

    sphere.scale.set(0.85, 1.15, 0.85);
    balloon.add(sphere);

    const string = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 1.5),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

    string.position.y = -1.2;
    balloon.add(string);

    balloon.position.set(
        (Math.random() - 0.5) * 12,
        Math.random() * 6,
        -2 - Math.random() * 3
    );

    scene.add(balloon);

    balloons.push({
        object: balloon,
        speed: 0.5 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2
    });
}

// STARS
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];

for (let i = 0; i < 1000; i++) {
    starPositions.push(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 25,
        -5 - Math.random() * 20
    );
}

starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPositions, 3)
);

const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.045
    })
);

scene.add(stars);

// MOUSE INTERACTION
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// ANIMATION
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    cake.rotation.y = Math.sin(time * 0.4) * 0.15;

    flame.scale.y = 1.5 + Math.sin(time * 12) * 0.15;

    flame.material.color.setHSL(
        0.09 + Math.sin(time * 10) * 0.02,
        1,
        0.55
    );

    balloons.forEach((balloon) => {
        balloon.object.position.y +=
            Math.sin(time * balloon.speed + balloon.offset) * 0.003;

        balloon.object.rotation.z =
            Math.sin(time + balloon.offset) * 0.15;
    });

    stars.rotation.y = time * 0.005;

    camera.position.x +=
        (mouseX * 0.5 - camera.position.x) * 0.02;

    camera.position.y +=
        (2 - mouseY * 0.3 - camera.position.y) * 0.02;

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});

// SURPRISE BUTTON
const surprise = document.getElementById('surprise');

document.getElementById('surpriseBtn').addEventListener(
    'click',
    () => {
        surprise.classList.remove('hidden');
        createConfetti();
    }
);

document.getElementById('closeBtn').addEventListener(
    'click',
    () => {
        surprise.classList.add('hidden');
    }
);

// CONFETTI
function createConfetti() {
    for (let i = 0; i < 150; i++) {
        const geometry = new THREE.SphereGeometry(0.04, 8, 8);

        const material = new THREE.MeshBasicMaterial({
            color: balloonColors[
                Math.floor(Math.random() * balloonColors.length)
            ]
        });

        const particle = new THREE.Mesh(geometry, material);

        particle.position.set(
            (Math.random() - 0.5) * 10,
            Math.random() * 5,
            2
        );

        scene.add(particle);

        const velocity = {
            x: (Math.random() - 0.5) * 0.08,
            y: Math.random() * 0.08,
            z: 0
        };

        const fall = () => {
            particle.position.x += velocity.x;
            particle.position.y += velocity.y;

            velocity.y -= 0.002;

            if (particle.position.y > -5) {
                requestAnimationFrame(fall);
            } else {
                scene.remove(particle);
                geometry.dispose();
                material.dispose();
            }
        };

        fall();
    }
}