import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {OrbitControls} from 'OrbitControls';

let camera;
main();
function main(){
    const canvas = document.querySelector('.bg');
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    canvas.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const fov = 45;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov,width/height,near,far);
    camera.position.set(0,0,10);
    scene.add(camera)

    const loader = new GLTFLoader();
    loader.load('../data/forest.gltf',(gltf)=>{
        const model = gltf.scene;
        scene.add(model);

        zoomAuto(model, camera);
    })

    const light = new THREE.DirectionalLight({color:0xffffff,intensity:1});
    light.position.set(-1,2,4);
    camera.add(light);

    function render(time){
        renderer.render(scene,camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function zoomAuto(gltf, camera) {
        const box = new THREE.Box3().setFromObject(gltf);
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        const centerBox = box.getCenter(new THREE.Vector3());
        const halfSizeModel = sizeBox * 0.5;
        const halffov = THREE.MathUtils.degToRad(camera.fov * 0.5);
        const distance = halfSizeModel / Math.tan(halffov);
    
        const direction = (new THREE.Vector3()).subVectors(camera.position, centerBox).multiply(new THREE.Vector3(15,-0.5,10)).normalize();
    
        const position = direction.multiplyScalar(distance).add(centerBox);
        camera.position.copy(position);
        camera.near = sizeBox / 100;
        camera.far = sizeBox * 100;
        camera.updateProjectionMatrix();
        camera.lookAt(centerBox.x, centerBox.y, centerBox.z)
    }

    window.onresize = function(){
        const canvas = document.querySelector('.bg');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
    }

    const control = new OrbitControls(camera,renderer.domElement);
}