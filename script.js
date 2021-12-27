const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( devicePixelRatio );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.PlaneGeometry(20, 20, 20, 20);
const material = new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide, flatShading: THREE.FlatShading } );
const plane = new THREE.Mesh( geometry, material );
scene.add( plane );

const light = new THREE.DirectionalLight( 0xffffff );
light.position.set(0, 0, 1);
scene.add(light);

camera.position.z = 17;
plane.rotation.x -= 0.7;

const { array } = plane.geometry.attributes.position;
const cliffs = [];
const clInd = [];

/*for(var i = 0; i < 15; i++) {
	let index = Math.floor((Math.random() * 400 * 3));
	index -= index % 3;
	index += 2;
	let rand = Math.floor(Math.random() * 5) + 5;
	
	cliffs.push(index);
	array[cliffs[cliffs.length - 1]] += rand;
	
	for(let j = rand; j > 1; j--) {
		for(let x = 0; x < 3; x++) {
			if(index - 21*3 + x*3 >= 0) array[index - 21*3 + x*3] = j - 1 - (Math.random() - 0.5);
			if(index - 1*3 + x*3 <= 400*3 && index - 1*3 + x*3 >= 0 && x!=1) array[index - 1*3 + x*3] = j - 1 - (Math.random() - 0.5);
			if(index + 19*3 + x*3 <= 400*3) array[index + 19*3 + x*3] = j - 1 - (Math.random() - 0.5);
		}
	}
}*/

let tick = 0;

function animate() {
    tick++;
    if(tick >= 5) {
        let index = Math.floor((Math.random() * 441 * 3));
        index -= index % 3;
        index += 2;
        cliffs.push( { height: 1, index, goingUp: true, rand: Math.random() - 0.5 } );
        clInd.push(index);
        tick = 0;
    }
    
    for(let cliff of cliffs) {
        cliff.height += cliff.goingUp ? 0.2 : - 0.2;
        array[cliff.index] = cliff.height;
		for(let x = 0; x < 5; x++) {
			if(cliff.index - 42*3 + x*3 >= 0 && !clInd.includes(cliff.index - 42*3 + x*3)) array[cliff.index - 42*3 + x*3] = cliff.height / 4 - cliff.rand * 0.8;
            
			if(cliff.index - 22*3 + x*3 >= 0 && !clInd.includes(cliff.index - 22*3 + x*3)) array[cliff.index - 22*3 + x*3] = cliff.height / (x == 0 || x == 4 ? 4 : 3) - cliff.rand;
			if(cliff.index - 2*3 + x*3 <= 400*3 && cliff.index - 2*3 + x*3 >= 0 && !clInd.includes(cliff.index - 2*3 + x*3) && x!=1) array[cliff.index - 1*3 + x*3] = cliff.height / (x == 0 || x == 4 ? 4 : 3) - cliff.rand * 0.7;
			if(cliff.index + 18*3 + x*3 <= 400*3 && !clInd.includes(cliff.index + 18*3 + x*3)) array[cliff.index + 18*3 + x*3] = cliff.height / (x == 0 || x == 4 ? 4 : 3) - cliff.rand * 1.3;
            
			if(cliff.index + 38*3 + x*3 <= 400*3 && !clInd.includes(cliff.index + 38*3 + x*3)) array[cliff.index + 38*3 + x*3] = cliff.height / 4 - cliff.rand;
		}
        
        if(cliff.height > 8) cliff.goingUp = false;
        if(cliff.height <= 0.2) {
            for(let x = 0; x < 5; x++) {
                if(cliff.index - 42*3 + x*3 >= 0 && !clInd.includes(cliff.index - 42*3 + x*3)) array[cliff.index - 42*3 + x*3] = 0;

                if(cliff.index - 22*3 + x*3 >= 0 && !clInd.includes(cliff.index - 22*3 + x*3)) array[cliff.index - 22*3 + x*3] = 0;
                if(cliff.index - 2*3 + x*3 <= 400*3 && cliff.index - 2*3 + x*3 >= 0 && !clInd.includes(cliff.index - 2*3 + x*3)) array[cliff.index - 1*3 + x*3] = 0;
                if(cliff.index + 18*3 + x*3 <= 400*3 && !clInd.includes(cliff.index + 18*3 + x*3)) array[cliff.index + 18*3 + x*3] = 0;

                if(cliff.index + 38*3 + x*3 <= 400*3 && !clInd.includes(cliff.index + 38*3 + x*3)) array[cliff.index + 38*3 + x*3] = 0;
            }
            clInd.splice(clInd.indexOf(cliff.index), 1);
            cliffs.splice(cliffs.indexOf(cliff), 1);
        }
    }
    
    plane.geometry.attributes.position.needsUpdate = true;
    
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}
animate();