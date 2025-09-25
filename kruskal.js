
let size = 1;

let coords = {};
let coordToId = {};
let conect = {};
let parent = {};
let currentId = 0; 

const triggerCoord = [size - 1, size - 1, size - 1, size -1]; //eix
const directions = ['+X', '+Y', '+Z', '+W', '-X', '-Y', '-Z', '-W'];

function populate(size) { //se for mudar o n de eixos
	let id = 0;
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			for (let z = 0; z < size; z++) {
				for (let w = 0; w < size; w++) {
					coords[id] = [x, y, z, w];
					conect[id] = [0, 0, 0, 0, 0, 0, 0, 0];
					coordToId[`${x},${y},${z},${w}`] = id;
					id++;
				}
			}
		}
	}
}

function make_set(n) {
	for (let i = 0; i < n; i++) parent[i] = i;
}

function find(i) {
	if (parent[i] !== i) parent[i] = find(parent[i]);
	return parent[i];
}

function union(i, j) {
	let root_i = find(i);
	let root_j = find(j);
	if (root_i !== root_j) parent[root_j] = root_i;
}

function count_connected_sets() {
	let roots = {};
	for (let key in parent) {
		const root = find(parseInt(key));
		roots[root] = true;
	}
	return Object.keys(roots).length;
}

function is_within_bound(first, direct) {
	let axis = direct % 4;
	let plus = direct < 4;

	let cloned = coords[first].slice();
	cloned[axis] += plus ? 1 : -1;

	if (cloned[axis] >= size || cloned[axis] < 0) return [false, -1];

	let key = cloned.join(",");
	let id = coordToId[key];
	return [id !== undefined, id ?? -1];
}

function connect_coords(id1, id2) { // se for mudar o n de eixos
	let coord1 = coords[id1];
	let coord2 = coords[id2];

	for (let i = 0; i < 4; i++) {
		let diff = coord2[i] - coord1[i];
		if (diff === 1) {
			conect[id1][i] = 1;
			conect[id2][i + 4] = 1;
		} else if (diff === -1) {
			conect[id1][i + 4] = 1;
			conect[id2][i] = 1;
		}
	}
}

function kruskal() {
	make_set(Object.keys(coords).length);
	while (count_connected_sets() > 1) {
		let randnode = Math.floor(Math.random() * Object.keys(coords).length);
		let randdirection = Math.floor(Math.random() * 8); //se for mudar o n de eixos
		let [valid, neighbor] = is_within_bound(randnode, randdirection);

		if (valid && neighbor !== -1) {
			let root1 = find(randnode);
			let root2 = find(neighbor);
			if (root1 !== root2) {
				union(root1, root2);
				connect_coords(randnode, neighbor);
			}
		}
	}
}
 //eixos

function renderRoom() {
	const container = document.getElementById("current-room");
	container.innerHTML = "";

	let [x, y, z, w] = coords[currentId]; //eixos

	if (x === triggerCoord[0] && y === triggerCoord[1] && z === triggerCoord[2] && w == triggerCoord[3]) { //ex
	alert(`🎉 You've reached the goal!`);
	}

	let header = document.createElement("h2");
	header.textContent = `${x}, ${y}, ${z},${w}`; //ex
	container.appendChild(header);

	let ul = document.createElement("ul");

	conect[currentId].forEach((conn, dir) => {
		if (conn === 1) {
			let neighborCoord = coords[currentId].slice();
			let axis = dir % 4;
			let plus  = dir < 4;

			
			neighborCoord[axis] += plus ? 1: -1;
			let neighborId = coordToId[neighborCoord.join(",")];

			if (neighborId !== undefined) {
				let li = document.createElement("li");
				let link = document.createElement("a");
				link.href = "#";
				link.textContent = `Go ${directions[dir]}`;
				link.addEventListener("click", (e) => {
					e.preventDefault();
					currentId = neighborId;
					renderRoom(); 
				});
				li.appendChild(link);
				ul.appendChild(li);
			}
		}
	});

	container.appendChild(ul);
}

populate(size);
kruskal();

renderRoom();
