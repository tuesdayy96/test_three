import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {OrbitControls} from 'OrbitControls';


main();
function main(){
    const canvas = document.querySelector('.bg');
    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(canvas.clientWidth,canvas.clientHeight);
    canvas.appendChild(renderer.domElement);

    const fov = 75;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const near = 0.01;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov,width/height,near,far);
    camera.position.set(0,0,2);


    const scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshPhongMaterial({color: 0xf0ff48});
    const cube = new THREE.Mesh(geometry,material);
    scene.add(cube);

    const light = new THREE.DirectionalLight({color:0xffffff,intensity:1});
    light.position.set(-1,2,4);
    scene.add(light);

    function render(time){
        time = 0.01;

        camera.aspect = width/height;
        camera.updateProjectionMatrix();
        cube.rotation.x += time;
        cube.rotation.y += time;
        renderer.render(scene,camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    window.onresize = function(){
        const canvas = document.querySelector('.bg');
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setSize(width,height);
    }
}