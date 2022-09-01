import * as THREE from 'three'
import { FontLoader } from 'FontLoader'
import { TextGeometry } from 'TextGeometry'
import { OrbitControls } from 'OrbitControls'

main()

let txt
function main() {
    const canvas = document.querySelector('.background');

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(devicePixelRatio);
    canvas.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000)

    const fov = 45;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.01;
    const far = 500
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 0,100);
    scene.add(camera);

    const light = new THREE.DirectionalLight({ color: 0xffffff, intencity: 1});
    camera.add(light);

    const loader = new FontLoader();
    loader.load('data/helvetiker_bold.typeface.json',(font)=>{
        const geometry = new TextGeometry('ABCD',{
            font: font,
            size: 10,
            height: 0.1
        })

        geometry.center();
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000
        })

        txt = new THREE.Mesh(geometry, material);
        scene.add(txt);

    })

    const controls = new OrbitControls(camera, renderer.domElement);

    function render(time) {
        renderer.render(scene, camera)
        requestAnimationFrame(render)
        controls.update()
    }
    requestAnimationFrame(render)

    window.onresize = function(){
        const canvas = document.querySelector('.background');
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix()
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }
}