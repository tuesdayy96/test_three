import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls'

let scene,
    camera,
    renderer,
    mouseDown,
    world,
    night = false;

let sheep,cloud,sky;

let width,height;

function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
    camera.lookAt(scene.position);
    camera.position.set(0, 0.7, 8);

    renderer = new THREE.WebGLRenderer({ alpha:true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width,height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, renderer.domElement);

    lights();
    addSheep();
    addCloud();
    addSky();

    world = document.querySelector('.world');
    world.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onResize);
}

function lights(){
    const light = new THREE.HemisphereLight(0xffffff, 0x818181, 0.9);
    scene.add(light);

    const drLight = new THREE.DirectionalLight(0xffd798, 0.8);
    drLight.position.set(9.5, 8, 8.5);
    drLight.castShadow = true;
    scene.add(drLight);

    const drLight2 = new THREE.DirectionalLight(0xc9ceff, 0.5);
    drLight2.position.set(-16, 5, 8);
    drLight2.castShadow = true;
    scene.add(drLight2);
}

function addSheep(){
    sheep = new Sheep();
    scene.add(sheep.group);
}

function addCloud(){
    cloud = new Cloud();
    scene.add(cloud.group);
}

function addSky(){
    sky = new Sky();
    sky.showNight(night);
    scene.add(sky.group);
}

function onMouseDown(e) {
    e.preventDefault();
    mouseDown = true;
}
function onMouseUp(e) {
    e.preventDefault();
    mouseDown = false;
}

function onResize(){
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function rad(deg) {
    return deg * (Math.PI/180);
}

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {

    sheep.jumpOnclick();
    if(sheep.group.position.y > 0.4) cloud.upDown();

    sky.skyMovement();
    renderer.render(scene, camera);
}

class Sheep {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.y = 0.4;

        this.woolMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            flatShading: true
        });
        this.skinMaterial = new THREE.MeshStandardMaterial({
            color: 0xeda07d,
            roughness: 1,
            flatShading: true
        });
        this.deepMaterial = new THREE.MeshStandardMaterial({
            color: 0x4b4553,
            roughness: 1,
            flatShading: true
        });

        this.vertical = 0;
        this.drawBody();
        this.drawHead();
        this.drawLegs();

        this.group.traverse(obj=>{
            obj.castShadow = true;
            obj.receiveShadow = true;
        })
    }
    drawBody() {
        const bodyGeometry = new THREE.IcosahedronGeometry(1.7, 0);
        const body = new THREE.Mesh(bodyGeometry, this.woolMaterial);
        this.group.add(body);
    }
    drawHead() {
        const head = new THREE.Group();
        head.position.set(0, 0.65, 1.6);
        head.rotation.x = rad(-20);
        this.group.add(head);

        const headGeometry = new THREE.BoxGeometry(0.7, 0.6, 0.7);
        const hair = new THREE.Mesh(headGeometry, this.skinMaterial);
        hair.position.y = -0.15;
        head.add(hair);

        const faceGeometry = new THREE.CylinderGeometry(0.5, 0.15, 0.4, 4, 1);
        const face = new THREE.Mesh(faceGeometry, this.skinMaterial);
        face.position.y = -0.65;
        face.rotation.y = rad(45);
        head.add(face);
        
        const woolGeometry = new THREE.BoxGeometry(0.84, 0.46, 0.9);
        const wool = new THREE.Mesh(woolGeometry, this.woolMaterial);
        wool.position.set(0, 0.12, 0.07);
        wool.rotation.x = rad(20);
        head.add(wool);

        const eyeGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.06, 6);
        const righteye = new THREE.Mesh(eyeGeometry, this.deepMaterial);
        righteye.position.set(0.35, -0.48, 0.33);
        righteye.rotation.set(rad(130.8),0,rad(-45));
        head.add(righteye);

        const lefteye = righteye.clone();
        lefteye.position.x = -righteye.position.x;
        lefteye.rotation.z = -righteye.rotation.z;
        head.add(lefteye);

        const earGeometry = new THREE.BoxGeometry(0.12, 0.5, 0.3);
        earGeometry.translate(0, -0.25, 0);
        this.rightear = new THREE.Mesh(earGeometry, this.skinMaterial);
        this.rightear.position.set(0.35, -0.12, -0.07);
        this.rightear.rotation.set(rad(20),0, rad(50));
        head.add(this.rightear);

        this.leftear = this.rightear.clone();
        this.leftear.position.x = -this.rightear.position.x;
        this.leftear.rotation.z = -this.rightear.rotation.z;
        head.add(this.leftear);
    }
    drawLegs() {
        const legGeometry = new THREE.CylinderGeometry(0.3, 0.15, 1, 4);
        legGeometry.translate(0, -0.5, 0);
        this.frontRightLeg = new THREE.Mesh(legGeometry, this.deepMaterial);
        this.frontRightLeg.position.set(0.7, -0.8, 0.5);
        this.frontRightLeg.rotation.x = rad(12);
        this.group.add(this.frontRightLeg);

        this.frontLeftLeg = this.frontRightLeg.clone();
        this.frontLeftLeg.position.x = -this.frontRightLeg.position.x;
        this.frontLeftLeg.rotation.z = -this.frontRightLeg.rotation.z;
        this.group.add(this.frontLeftLeg);

        this.backRightLeg = this.frontRightLeg.clone();
        this.backRightLeg.position.z = -this.frontRightLeg.position.z;
        this.backRightLeg.rotation.x = -this.frontRightLeg.rotation.x;
        this.group.add(this.backRightLeg);

        this.backLeftLeg = this.frontLeftLeg.clone();
        this.backLeftLeg.position.z = -this.frontLeftLeg.position.z;
        this.backLeftLeg.rotation.x = -this.frontLeftLeg.rotation.x;
        this.group.add(this.backLeftLeg);
    }
    jump(spd){
        this.vertical += spd;
        this,this.group.position.y = Math.sin(this.vertical) + 1;
        
        const legMovement = Math.sin(this.vertical) * Math.PI / 6 + 0.3;
        this.frontRightLeg.rotation.z = legMovement;
        this.frontLeftLeg.rotation.z = -legMovement;
        this.backRightLeg.rotation.z = legMovement;
        this.backLeftLeg.rotation.z = -legMovement;

        const earMovement = Math.sin(this.vertical) * Math.PI / 3 + 1.5;

        this.rightear.rotation.z = earMovement;
        this.leftear.rotation.z = -earMovement;
    }
    jumpOnclick() {
        if(mouseDown){
            this.jump(0.05);
        } else {
            if(this.group.position.y <= 0.4) return;
            this.jump(0.08);
        }
    }
}

class Cloud {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.y = -2;
        this.group.scale.set(1,1,1);

        this.material = new THREE.MeshStandardMaterial({
            color: 0xadbef0,
            roughness: 1,
            flatShading: true
        })

        this.vertical = 0;
        
        this.drawCloud();

        this.group.traverse(obj=>{
            obj.castShadow = true;
            obj.receiveShadow = true;
        })
    }
    drawCloud() {
        const cloudGeometry = new THREE.IcosahedronGeometry(1, 0);
        this.topCloud = new THREE.Mesh(cloudGeometry, this.material);
        this.group.add(this.topCloud);

        this.leftCloud = this.topCloud.clone();
        this.leftCloud.position.set(-1.2, -0.3, 0);
        this.leftCloud.scale.set(0.8, 0.8, 0.8);
        this.group.add(this.leftCloud);

        this.rightCloud = this.leftCloud.clone();
        this.rightCloud.position.x = -this.leftCloud.position.x
        this.group.add(this.rightCloud);

        this.frontCloud = this.leftCloud.clone();
        this.frontCloud.position.set(0, -0.4, 0.9);
        this.frontCloud.scale.set(0.8, 0.8, 0.8);
        this.group.add(this.frontCloud);

        this.backCloud = this.frontCloud.clone();
        this.backCloud.position.z = -this.frontCloud.position.z
        this.group.add(this.backCloud);
    }
    upDown() {
        this.vertical +=0.1

        this.topCloud.position.y = -Math.cos(this.vertical) * 0.12;
        this.leftCloud.position.y = -Math.cos(this.vertical) * 0.1;
        this.rightCloud.position.y = -Math.cos(this.vertical) * 0.1;
        this.frontCloud.position.y = -Math.cos(this.vertical) * 0.1;
        this.backCloud.position.y = -Math.cos(this.vertical) * 0.1;
    }
}

class Sky {
    constructor() {
        this.group = new THREE.Group();

        this.daySky = new THREE.Group();
        this.nightSky = new THREE.Group();

        this.group.add(this.daySky);
        this.group.add(this.nightSky);

        this.colors = {
            day: [0xffffff,0xf9d6df,0xc1eded,0xc6bef7],
            night: [0x5DC7B5, 0xF8007E, 0xFFC363, 0xCDAAFD, 0xDDD7FE]
        };

        this.drawSky('day');
        this.drawSky('night');
        this.drawNight();
    }
    drawSky(phase){
        for (let i = 0; i < 30; i++) {
            const geometry = new THREE.IcosahedronGeometry(0.4, 0);
            const material = new THREE.MeshStandardMaterial({
                color: this.colors[phase][Math.floor(Math.random()*this.colors[phase].length)],
                roughness: 1,
                flatShading: true
            });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.set((Math.random()-0.5)*30, (Math.random()-0.5)*30, (Math.random()-0.5)*30);
            if(phase === 'day'){
                this.daySky.add(mesh);
            } else {
                this.nightSky.add(mesh);
            }
        }
    }
    drawNight() {
        const geometry = new THREE.SphereGeometry(0.1, 5, 5);
        const material = new THREE.MeshStandardMaterial({
            color: 0xf54dae,
            roughness: 1,
            flatShading: true
        });

        for( let i = 0; i < 3; i++) {
            const point = new THREE.PointLight(0xf55679, 2, 35);
            const mesh = new THREE.Mesh(geometry, material);
            point.add(mesh);

            point.position.set((Math.random() - 2) * 6, (Math.random() - 2) * 6, (Math.random() - 2) * 6);
            point.updateMatrix();
            point.matrixAutoUpdate = false;

            this.nightSky.add(point);
        }
    }
    showNight(phase) {
        if(phase) {
            this.daySky.position.set(100, 100, 100);
            this.nightSky.position.set(0, 0, 0);
        } else {
            this.daySky.position.set(0, 0, 0);
            this.nightSky.position.set(100, 100, 100);
        }
    }
    skyMovement() {
        this.group.rotation.x += 0.001;
        this.group.rotation.y += 0.003;
    }
}

const toggleBtn = document.querySelector('.toggle');
toggleBtn.addEventListener('click',nightDayToggle);

function nightDayToggle() {
    night = !night;
    toggleBtn.classList.toggle('toggle-night');
    world.classList.toggle('world-night');
    sky.showNight(night);
}

init();
animate();