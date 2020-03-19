import * as THREE from 'three';
// import {
//     GLTFLoader
// } from 'three/examples/jsm/loaders/GLTFLoader';
// import './lib/gltfloader';
// import './lib/draco';
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";

const OrbitControls = require('three-orbit-controls')(THREE);

class Main {
    constructor() {
        this.dom = {
            container: document.querySelector('#container')
        };

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#92adc1');

        this.clock = new THREE.Clock();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.createCamera();
        this.createControls();
        this.createLights();
        this.addObjects();
        this.createRenderer();
        this.initEvents();
        this.play();
    }

    createCamera() {
        this.containerSize = {
            width: this.dom.container.clientWidth,
            height: this.dom.container.clientHeight
        }
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.containerSize.width / this.containerSize.height,
            1,
            1000
        );
        this.camera.position.set(0, 0, 300);
    }

    createControls() {
        this.controls = new OrbitControls(this.camera, this.dom.container);
    }

    createLights() {
        // this.ambientlight = new THREE.AmbientLight(0xffffff, 1.0);
        this.ambientlight = new THREE.HemisphereLight(0xddeeff, 0x202020, 5);

        this.mainLight = new THREE.DirectionalLight(0xffffff, 5);
        this.mainLight.position.set(10, 10, 10);

        this.scene.add(this.ambientlight, this.mainLight);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(this.containerSize.width, this.containerSize.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.dom.container.appendChild(this.renderer.domElement);
    }

    initEvents() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    onWindowResize() {
        this.containerSize = {
            width: this.dom.container.clientWidth,
            height: this.dom.container.clientHeight
        };
        this.camera.aspect = this.containerSize.width / this.containerSize.height;
        // нужно вызывать каждый раз когда изменяются параметры камеры
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.containerSize.width, this.containerSize.height);
    }

    onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    addObjects() {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                // включаем поддержку производных в шейдерах
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: {
                    type: "f",
                    value: 1.0
                },
                pixels: {
                    type: "v2",
                    value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2)
                },
                mousePos: {
                    type: "v3",
                    value: new THREE.Vector3(0, 0, 0)
                },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                }
            },
            vertexShader: vertex,
            fragmentShader: fragment
        });

        this.planeGeometry = new THREE.PlaneBufferGeometry(600, 600, 200);
        // this.plane = new THREE.Mesh(this.planeGeometry, new THREE.MeshBasicMaterial({
        //     color: 0x00ff00,
        //     visible: true
        // }));
        this.plane = new THREE.Mesh(this.planeGeometry, this.material);
        this.scene.add(this.plane);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    update() {
        const delta = this.clock.getDelta();

        this.material.uniforms.time.value += 0.05;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects([this.plane]);


        if (intersects.length > 0) {
            this.material.uniforms.mousePos.value = intersects[0].point;
        }
    }

    play() {
        this.renderer.setAnimationLoop(() => {
            this.update();
            this.render();
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }
}

const main = new Main();
