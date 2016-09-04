const R2 = Math.sqrt(2);
const R3 = Math.sqrt(3);
const R6I = Math.sqrt(1/6);

class Vertex {
  constructor(x, y, z){
    this.coordinates = [x, y, z]
    this.edges = new Set();
    this.faces = new Set();
  }
  addEdge(edge){
    if(!this.edges.has(edge)){
      if(this.edges.size >= 3) throw "Attempted to add more than three edges to a vertex";
      this.edges.add(edge);
    }
  }
  addFace(face){
    if(!this.faces.has(face)){
      if(this.faces.size >= 3) throw "Attempted to add more than three faces to a vertex";
      this.faces.add(face);
    }
  }
  getEdgeWith(that){
    for(let edge of this.edges){
      if(edge.hasVertex(that)) return edge;
    }
  }
}

class Edge {
  constructor(a, b){
    this.vertices = new Set([a, b]);
    this.faces = new Set();
    a.addEdge(this);
    b.addEdge(this);
  }
  addFace(face){
    if(!this.faces.has(face)){
      if(this.faces.size >= 2) throw "Attempted to add more than two faces to a vertex";
      this.faces.add(face);
    }
  }
  hasVertex(vertex){
    return this.vertices.has(vertex);
  }
  getOtherFace(face){
    for(let f of this.faces){
      if(f != face) return f;
    }
  }
}

class Face {
  constructor(vertices, normal){
    this.vertices = vertices;
    this.edges = [];
    this.normal = normal;
    for(let vertex of vertices){
      vertex.addFace(this);
    }
    for(let i=0;i<4;i++){
      let edge = vertices[i].getEdgeWith(vertices[(i+1) % 4]);
      this.edges.push(edge);
      edge.addFace(this);
    }
  }
  getGlobal(x, y){
    let left = this.edges[0].getOtherFace(this).normal;
    let down = this.edges[1].getOtherFace(this).normal;
    let rotatedRight = rotate(this.vertices[0].coordinates, down, x * Math.PI / 2);
    return rotate(rotatedRight, left, y * Math.PI/2);
  }
}

function rotate(point, axis, angle){
  let cs = Math.cos(angle);
  let sn = Math.sin(angle);
  let dot = point[0] * axis[0] + point[1] * axis[1] + point[2] * axis[2];
  let cross = [
    axis[1] * point[2] - axis[2] * point[1],
    axis[2] * point[0] - axis[0] * point[2],
    axis[0] * point[1] - axis[1] * point[0]
  ];
  return [0, 1, 2].map(i => cs * (point[i] - dot*axis[i]) + sn*cross[i] + dot*axis[i]);
}

let A = new Vertex(0, 1, 0);
let B = new Vertex(0, 1/3, 2*R2/3);
let C = new Vertex(R2/R3, 1/3, -R2/3);
let D = new Vertex(-R2/R3, 1/3, -R2/3);
let E = new Vertex(0, -1/3, -2*R2/3);
let F = new Vertex(-R2/R3, -1/3, R2/3);
let G = new Vertex(R2/R3, -1/3, R2/3);
let H = new Vertex(0, -1, 0);

new Edge(A, B);
new Edge(A, C);
new Edge(A, D);
new Edge(B, F);
new Edge(F, D);
new Edge(D, E);
new Edge(E, C);
new Edge(C, G);
new Edge(G, B);
new Edge(E, H);
new Edge(F, H);
new Edge(G, H);

let BACG = new Face([B, A, C, G], [1/R2, 1/R3, R6I]);
let CADE = new Face([C, A, D, E], [0, 1/R3, -R2/R3]);
let DABF = new Face([D, A, B, F], [-1/R2, 1/R3, R6I]);
let DFHE = new Face([D, F, H, E], [-1/R2, -1/R3, -R6I]);
let BGHF = new Face([B, G, H, F], [0, -1/R3, R2/R3]);
let CEHG = new Face([C, E, H, G], [1/R2, -1/R3, -R6I]);
