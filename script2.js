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

let { array } = plane.geometry.attributes.position;
let cliffs = [];
let clInd = [];
let interval;

const gui = new dat.GUI();
const data = {
    plane: {
        width: 20,
        height: 20,
        widthSegments: 20,
        heightSegments: 20,
        hillWidth: 2,
        hillHeight: 6,
        spawnSpeed: 5,
        color: 0xffffff,
        x: -0.7,
        y: 0.001,
        z: 0.001,
        stop() {
            cancelAnimationFrame(interval);
        },
        start() {
            animate();
        }
    }
};

gui.add(data.plane, "width", 1, 20).step(1).onChange(generatePlane);
gui.add(data.plane, "height", 1, 20).step(1).onChange(generatePlane);
gui.add(data.plane, "widthSegments", 10, 150).step(1).onChange(generatePlane);
gui.add(data.plane, "heightSegments", 10, 150).step(1).onChange(generatePlane);
gui.add(data.plane, "hillWidth", 2, 40).step(1).onChange(generatePlane);
gui.add(data.plane, "hillHeight", 3, 12).step(1).onChange(generatePlane);
gui.add(data.plane, "spawnSpeed", 1, 40).step(1).onChange(generatePlane);

gui.addColor(data.plane, "color").onChange(color => {
    plane.material.dispose();
    plane.material = new THREE.MeshPhongMaterial( { color, side: THREE.DoubleSide, flatShading: THREE.FlatShading } );
    renderer.render( scene, camera );
});

gui.add(data.plane, "x", -Math.PI, Math.PI).onChange(() => {plane.rotation.x = data.plane.x; renderer.render( scene, camera );});
gui.add(data.plane, "y", -Math.PI, Math.PI).onChange(() => {plane.rotation.y = data.plane.y; renderer.render( scene, camera );});
gui.add(data.plane, "z", -Math.PI, Math.PI).onChange(() => {plane.rotation.z = data.plane.z; renderer.render( scene, camera );});

gui.add(data.plane, "stop");
gui.add(data.plane, "start");

function generatePlane() {
    plane.geometry.dispose();
    plane.geometry = new THREE.PlaneGeometry(data.plane.width, data.plane.height, data.plane.widthSegments, data.plane.heightSegments);
    array = plane.geometry.attributes.position.array;
    cliffs = [];
    clInd = [];
}

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

  ////////////////////
 //// GAME LOOP /////
////////////////////

function animate() {
    const width = data.plane.widthSegments * 3 + 3;
    const repVertexes = new Array(array.length / 3);
    
    tick++;
    if(tick >= data.plane.spawnSpeed) {
        let index = Math.floor((Math.random() * array.length));
        index -= index % 3;
        index += 2;
        cliffs.push( { height: 0.2, index, goingUp: true, rand: Math.random() - 0.5 } );
        clInd.push(index);
        tick = 0;
    }
    
    /*
    for(let j = 0; j < data.plane.heightSegments + 1; j++) {
        for(let i = 2; i < data.plane.widthSegments * 3 + 3; i += 3) {
            const vertex = j * (data.plane.widthSegments * 3 + 1) + i;
            
            if(clInd.includes(vertex)) {
                const cliff = clInd.indexOf(vertex);
                array[vertex] += cliffs[cliff].goingUp ? 0.2 : -0.2;
                cliffs[cliff].height = array[vertex];
                
                if(cliffs[cliff].height >= data.plane.hillHeight) cliffs[cliff].goingUp = false;
                continue;
            }
            
            array[vertex] = 0;
            
            for(let x = 0; x < cliffs.length; x++) {
                if(Math.abs(cliffs[x].index % (data.plane.widthSegments * 3) - i) <= data.plane.hillWidth * 3) {
                    array[vertex] += 3 / Math.abs(cliffs[x].index % (data.plane.widthSegments * 3) - i) * cliffs[x].height / 0.8;
                }
                else if(Math.abs(cliffs[x].index - vertex) <= data.plane.hillHeight * data.plane.widthSegments * 3) {
                    array[vertex] += 3 / Math.abs(cliffs[x].index - vertex) * cliffs[x].height / 0.8;
                }
            }
        }
    }
    */
    
    //reset all hills
    
    //for(let i = 2; i < array.length; i += 3) if(!clInd.includes(i)) array[i] = 0;
    
    //all cliffs for loop
    
    for(let cliff of cliffs) {
        
        
        
        const rand = Math.random() * .5 + .5;
        cliff.height += cliff.goingUp ? 0.2 * rand : - 0.2 * rand;       //cliff grow (not on the plane)
        array[cliff.index] = cliff.height;                               //cliff grow (on the plane)
        
        //create hills around the cliff
        
		for(let y = -data.plane.hillWidth; y <= data.plane.hillWidth; y++) {
            for(let x = -data.plane.hillWidth; x <= data.plane.hillWidth; x++) {
                if(
                    cliff.index % width + x * 3 > 0 &&                   //left wall check
                    cliff.index % width + x * 3 < width &&               //right wall check
                    cliff.index + width * y > 0 &&                       //top wall check
                    cliff.index + width * y < array.length &&            //bottom wall check
                    !(x == 0 && y == 0)                                  //not a cliff
                ) {
                    const num = (data.plane.hillWidth - Math.max(Math.abs(x), Math.abs(y)) + 1) / data.plane.hillWidth;
                    
                    if(cliff.goingUp) array[cliff.index + width * y + x * 3] += 0.2 * (Math.random() * .5 + .5) * num  //make a hill
                    else              array[cliff.index + width * y + x * 3] -= 0.2 * (Math.random() * .5 + .5) * num  //delete a hill
                }
            }
		}
        
        /*
        
        cliff.height += cliff.goingUp ? 0.2 : - 0.2;                     //cliff grow (not on the plane)
        array[cliff.index] = cliff.height;                               //cliff grow (on the plane)
        
        //create hills around the cliff
        
		for(let y = -data.plane.hillWidth; y <= data.plane.hillWidth; y++) {
            for(let x = -data.plane.hillWidth; x <= data.plane.hillWidth; x++) {
                if(
                    cliff.index % width + x * 3 > 0 &&                   //left wall check
                    cliff.index % width + x * 3 < width &&               //right wall check
                    cliff.index + width * y > 0 &&                       //top wall check
                    cliff.index + width * y < array.length               //bottom wall check
                ) {
                    if(repVertexes[(cliff.index + width * y + x * 3 - 2) / 3] == undefined) repVertexes[(cliff.index + width * y + x * 3 - 2) / 3] = 0;
                    repVertexes[(cliff.index + width * y + x * 3 - 2) / 3]++;                      //increment the amount of hill parts
                    const reps = repVertexes[(cliff.index + width * y + x * 3 - 2) / 3];
                    //let num = 0.07 * ((data.plane.hillWidth - Math.max(Math.abs(x), Math.abs(y)) + 1) ** 2);
                    const num = x == 0 && y == 0 ? 0.8 : (data.plane.hillWidth - Math.max(Math.abs(x), Math.abs(y)) + 1) / data.plane.hillWidth;
                    
                    array[cliff.index + width * y + x * 3] = (array[cliff.index + width * y + x * 3] * (reps - 1) + cliff.height * num * 0.75 + cliff.rand) / reps;   //make a hill
                }
            }
		}
        */
        if(cliff.height > data.plane.hillHeight) cliff.goingUp = false;  //cliff reached the top
        if(cliff.height <= 0.2 && !cliff.goingUp) {                      //cliff reached the bottom
            array[cliff.index] = 0;
            clInd.splice(clInd.indexOf(cliff.index), 1);
            cliffs.splice(cliffs.indexOf(cliff), 1);
        }
    }
    
    
    plane.geometry.attributes.position.needsUpdate = true;
    
	renderer.render( scene, camera );
	interval = requestAnimationFrame( animate );
}
animate();