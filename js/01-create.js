import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls'

main()
function main(){
    const container = document.querySelector('.container')
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(devicePixelRatio);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000)

    const fov = 45;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.01;
    const far = 500
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(15,20,5);
    scene.add(camera);

    const controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.DirectionalLight({ color: 0xffffff, intencity: 1 });
    light.position.set(-1,2,4)
    scene.add(light);

    const plGeo = new THREE.PlaneGeometry(20,20);
    const plMate = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
    const plane = new THREE.Mesh(plGeo, plMate);
    scene.add(plane);
    plane.rotateX(-Math.PI / 2);
    plane.visible = false;
    plane.name = 'plane'

    const mountPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(1,1), 
        new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide
        }));
    scene.add(mountPlane);
    mountPlane.rotateX(-Math.PI / 2);
    mountPlane.position.set(0.5,0,0.5)

    const mouseP = new THREE.Vector2();
    const rayCaster = new THREE.Raycaster();

    let intersects;
    window.addEventListener('mousemove', e=>{
        mouseP.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseP.y = -(e.clientY / window.innerHeight) * 2 + 1;
        rayCaster.setFromCamera(mouseP, camera);
        intersects = rayCaster.intersectObjects(scene.children);
        intersects.forEach(intersect=>{
            if(intersect.object.name === 'plane'){
                const mountPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
                mountPlane.position.set(mountPos.x, 0, mountPos.z);

                const overlapCheck = Meshs.find((obj)=>{
                    return (obj.position.x === mountPlane.position.x) && (obj.position.z === mountPlane.position.z)
                })

                if(!overlapCheck){
                    mountPlane.material.color.setHex(0xffffff);
                } else {
                    mountPlane.material.color.setHex(0xff0000);
                }
            }
        });

    });

    const createMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.5,4,2),
        new THREE.MeshBasicMaterial({
            color: '#ff0000',
            wireframe: true
        })
        )
    
    const Meshs = [];
    
    window.addEventListener('mousedown', ()=>{
        const overlapCheck = Meshs.find((obj)=>{
            return (obj.position.x === mountPlane.position.x) && (obj.position.z === mountPlane.position.z)
        })

        if(!overlapCheck){
            intersects.forEach(intersect=>{
                if(intersect.object.name === 'plane'){
                    const createClone = createMesh.clone();
                    createClone.position.copy(mountPlane.position);
                    scene.add(createClone);
                    Meshs.push(createClone);
                }
            });
        } else if(scene.children.length > 5){
            const lastMesh = scene.children.length-1;
            scene.remove(scene.children[lastMesh])
            Meshs.pop()
        }
    })

    const grid = new THREE.GridHelper(20,20);
    scene.add(grid);

    function render(time) {
        renderer.render(scene, camera)
        requestAnimationFrame(render)
        Meshs.forEach(obj=>{
            obj.rotation.x = time / 1000;
            obj.rotation.z = time / 1000;
            obj.position.y = 1 * Math.abs(Math.sin(time / 1000));
        })
        controls.update()
    }
    requestAnimationFrame(render)

    window.onresize = function(){
        const container = document.querySelector('.container');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix()
        renderer.setSize(container.clientWidth, container.clientHeight)
    }
}