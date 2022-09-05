import * as THREE from 'three'
import { FontLoader } from 'FontLoader'
import { TextGeometry } from 'TextGeometry'
import { OrbitControls } from 'OrbitControls'

const Abc = [];
let txt,obj3d;
class Particle {
    constructor(scene, geometry, material, x, y, z){
        txt = new THREE.Mesh(geometry, material)
        obj3d = new THREE.Object3D()
        txt.position.set(x*1.1, y*0.9, z)
        obj3d.add(txt)
        Abc.push(txt)
        txt.rotation.x = THREE.MathUtils.degToRad(-5)
        obj3d.rotation.x = THREE.MathUtils.degToRad(-70)
        obj3d.position.set(-(60/2), 0,((60*0.7) / 2))
        scene.add(obj3d)
    }
}

main()
function main() {
    const canvas = document.querySelector('.background');

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(devicePixelRatio);
    canvas.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000)
    scene.fog = new THREE.Fog(0x000000, 0, 400)

    const fov = 45;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.01;
    const far = 500
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(-25, 64, 65);
    scene.add(camera);

    const spot = new THREE.SpotLight(0xffffff)
    spot.position.set(0, 500, 100);
    spot.angle = 0.5

    const light = new THREE.DirectionalLight({ color: 0xffffff, intencity: 1});
    scene.add(light);

    const letters = [
        'A','B','C','D','E','F','G','H','I',
        'J','K','L','M','N','O','P','Q','R',
        'S','T','U','V','W','X','Y','Z'
    ]

    const loader = new FontLoader();
    loader.load('data/fonts/Millimetre-Extrablack_Regular.json',(font)=>{
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff
        })

        for(let x = 0; x < 60; x += 6){
            for(let y = 0; y < 60; y += 6){
                    let ran = Math.floor(Math.random()*(letters.length-1))
                    for(let z = 0; z < 10; z++){
                        const geometry = new TextGeometry(letters[ran], {
                            font: font,
                            size: 5,
                            height: 0.1,
                        })

                        geometry.center();

                        new Particle(scene, geometry, material, x, y, z)
                    }
            }
        }
    })

    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let intersects;
    window.addEventListener('mousemove', e =>{
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    })

    window.addEventListener('mouseleave', () =>{
        mousePosition.x = -100000;
        mousePosition.y = -100000;
    })

    const controls = new OrbitControls(camera, renderer.domElement);

    function render(time) {
        renderer.render(scene, camera)
        controls.update()
        requestAnimationFrame(render)

        raycaster.setFromCamera(mousePosition, camera);
        intersects = raycaster.intersectObjects(scene.children);

    }
    requestAnimationFrame(render)

    window.onresize = function(){
        const canvas = document.querySelector('.background');
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix()
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }
}