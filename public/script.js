//Setting Up Canvas
let circleCanvas = document.getElementById("space-circles");
let lineCanvas = document.getElementById("space-line-background");
var circleCanvasContext = circleCanvas.getContext('2d');
var lineCanvasContext = lineCanvas.getContext('2d');

var window_width = window.innerWidth;
var window_height= window.innerHeight;

circleCanvas.style.background= "transparent";
lineCanvas.style.background= "#000000";


lineCanvas.width=window_width*1;
lineCanvas.height=window_height*1;
circleCanvas.width=window_width*1;
circleCanvas.height=window_height*1;

circleCanvas.lineWidth=2;

//Locating Canvas Origin
var originX = lineCanvas.width/2;
var originY = lineCanvas.height/2;

// Converting Coordinates with Pixels: 1x=150px

//All Objects
let bodies = [];
let scale=300;
const G=1;
let i=5;
let colorScheme = [
  {
    body1: "red",
    body2: "green",
    body3: "blue"
  },
  {
    body1: "#00FFC5", // Aqua Mint
    body2: "#FF3CAC", // Neon Pink
    body3: "#845EC2"  // Electric Purple
  },
  {
    body1: "#FFB86F", // Peach
    body2: "#8BE9FD", // Soft Cyan
    body3: "#BD93F9"  // Lavender
  },
  {
    body1: "#A0522D", // Sienna
    body2: "#228B22", // Forest Green
    body3: "#4682B4"  // Steel Blue
  },
  {
    body1: "#FF0000", // Pure Red
    body2: "#00FF00", // Pure Green
    body3: "#00BFFF"  // Deep Sky Blue
  },
  {
    body1: "#FFFF00", // Yellow (bright!)
    body2: "#00FFFF", // Cyan
    body3: "#FF00FF"  // Magenta
  },
  {
    body1: "#FF4500", // OrangeRed
    body2: "#7CFC00", // LawnGreen
    body3: "#1E90FF"  // Dodger Blue
  },
  {
    body1: "white", // OrangeRed
    body2: "white", // LawnGreen
    body3: "white" 
  }
];

//Defining and Drawing Our Body
class Body {
    constructor(x,y,vx,vy,m,radius,color){
        this.x = x;
        this.y = y;
        this.vx=vx;
        this.vy=vy;
        this.ax=0;
        this.ay=0;
        this.m=m;
        this.radius = radius;
        this.color = color;
        this.oldx=x;
        this.oldy=y;

    }

    drawCircle (context){
        let xpos= originX+this.x*scale;
        let ypos = originY+this.y*scale;
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.arc(xpos, ypos, this.radius, 0, Math.PI*2, false);
        context.stroke();
        context.fill();
    }

    drawSmallCircle (context){
        let xpos= originX+this.x*scale;
        let ypos = originY+this.y*scale;
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.arc(xpos, ypos, 0.6, 0, Math.PI*2, false);
        context.stroke();
        context.fill();

    }
    // drawLine (context){
    //     let xpos= originX+this.x*scale;
    //     let ypos = originY+this.y*scale;
    //     let oldxpos= originX+this.oldx*scale;
    //     let oldypos= originY+this.oldy*scale;
    //     lineCanvasContext.beginPath();
    //     lineCanvasContext.moveTo(oldxpos,oldypos);
    //     lineCanvasContext.lineTo(xpos,ypos);
    //     lineCanvasContext.strokeStyle=this.color;
    //     lineCanvas.lineWidth=5;
    //     lineCanvasContext.stroke();
    // }


   
    drawVelocityVector(context){
        let xpos= originX+this.x*scale+this.radius*0.8;
        let ypos = originY+this.y*scale+this.radius*0.80;
        context.beginPath();
        context.moveTo(xpos,ypos);
        let xpos2=xpos+this.vx*scale+this.radius;
        let ypos2=ypos+this.vy*scale+this.radius;
        context.lineTo(xpos2,ypos2);
        context.strokeStyle=this.color;
        context.stroke();
           
    }
    

}

const viewportTransform = {
      x: 0,
      y: 0,
      scale: 1
    }


//Sim Logic
function ComputeAcceleration(i, bodies){
    let ax = 0;
    let ay = 0;
    for (let j=0; j<bodies.length; j++){
        if (j==i) continue;
        let deltax=bodies[j].x-bodies[i].x;
        let deltay=bodies[j].y-bodies[i].y;
        const distSq = deltax * deltax + deltay * deltay;
        const distCubed = Math.pow(distSq, 1.5) + 1e-8; // avoid division by 0
        const force = G * bodies[j].m / distCubed;
        ax += deltax * force;
        ay += deltay * force;

    }
    bodies[i].ax=ax;
    bodies[i].ay=ay;
}


function rk2(bodies, dt) {
  
    
    for (let b of bodies){
        if ((b.x-b.oldx)*scale>=3){
            b.oldx=b.x;
            b.oldy=b.y;
    }
      
    }

    for (let i = 0; i < bodies.length; i++) {
        ComputeAcceleration(i, bodies);
    }

    let mids = [];
    for (let b of bodies) {
        mids.push(new Body(
            b.x + b.vx * dt / 2,
            b.y + b.vy * dt / 2,
            b.vx + b.ax * dt / 2,
            b.vy + b.ay * dt / 2,
            b.m,
        ));
    }


    for (let i = 0; i < mids.length; i++) {
        ComputeAcceleration(i, mids);
    }

    for (let i = 0; i < bodies.length; i++) {
        bodies[i].vx += mids[i].ax * dt;
        bodies[i].vy += mids[i].ay * dt;
        bodies[i].x += mids[i].vx * dt;
        bodies[i].y += mids[i].vy * dt;

    }
}

function rk4(bodies, dt) {
    let n = bodies.length;

    let original = bodies.map(b => ({...b}));

    // Arrays to store k1 to k4 for velocity and acceleration
    let k1v = [], k1a = [];
    let k2v = [], k2a = [];
    let k3v = [], k3a = [];
    let k4v = [], k4a = [];

    // === K1 ===
    for (let i = 0; i < n; i++) {
        ComputeAcceleration(i, bodies);
        k1v[i] = {vx: bodies[i].vx, vy: bodies[i].vy};
        k1a[i] = {ax: bodies[i].ax, ay: bodies[i].ay};
    }

    // === K2 ===
    for (let i = 0; i < n; i++) {
        bodies[i].x = original[i].x + 0.5 * dt * k1v[i].vx;
        bodies[i].y = original[i].y + 0.5 * dt * k1v[i].vy;
        bodies[i].vx = original[i].vx + 0.5 * dt * k1a[i].ax;
        bodies[i].vy = original[i].vy + 0.5 * dt * k1a[i].ay;
    }
    for (let i = 0; i < n; i++) {
        ComputeAcceleration(i, bodies);
        k2v[i] = {vx: bodies[i].vx, vy: bodies[i].vy};
        k2a[i] = {ax: bodies[i].ax, ay: bodies[i].ay};
    }

    // === K3 ===
    for (let i = 0; i < n; i++) {
        bodies[i].x = original[i].x + 0.5 * dt * k2v[i].vx;
        bodies[i].y = original[i].y + 0.5 * dt * k2v[i].vy;
        bodies[i].vx = original[i].vx + 0.5 * dt * k2a[i].ax;
        bodies[i].vy = original[i].vy + 0.5 * dt * k2a[i].ay;
    }
    for (let i = 0; i < n; i++) {
        ComputeAcceleration(i, bodies);
        k3v[i] = {vx: bodies[i].vx, vy: bodies[i].vy};
        k3a[i] = {ax: bodies[i].ax, ay: bodies[i].ay};
    }

    // === K4 ===
    for (let i = 0; i < n; i++) {
        bodies[i].x = original[i].x + dt * k3v[i].vx;
        bodies[i].y = original[i].y + dt * k3v[i].vy;
        bodies[i].vx = original[i].vx + dt * k3a[i].ax;
        bodies[i].vy = original[i].vy + dt * k3a[i].ay;
    }
    for (let i = 0; i < n; i++) {
        ComputeAcceleration(i, bodies);
        k4v[i] = {vx: bodies[i].vx, vy: bodies[i].vy};
        k4a[i] = {ax: bodies[i].ax, ay: bodies[i].ay};
    }

    // === Combine Increments ===
    for (let i = 0; i < n; i++) {
        bodies[i].x = original[i].x + dt / 6 * (
            k1v[i].vx + 2 * k2v[i].vx + 2 * k3v[i].vx + k4v[i].vx
        );
        bodies[i].y = original[i].y + dt / 6 * (
            k1v[i].vy + 2 * k2v[i].vy + 2 * k3v[i].vy + k4v[i].vy
        );
        bodies[i].vx = original[i].vx + dt / 6 * (
            k1a[i].ax + 2 * k2a[i].ax + 2 * k3a[i].ax + k4a[i].ax
        );
        bodies[i].vy = original[i].vy + dt / 6 * (
            k1a[i].ay + 2 * k2a[i].ay + 2 * k3a[i].ay + k4a[i].ay
        );
    }
}

function vv(bodies, dt) {
    for (let i = 0; i < bodies.length; i++) {
        ComputeAcceleration(i, bodies);
    }

    let oldAx = bodies.map(b => b.ax);
    let oldAy = bodies.map(b => b.ay);

    for (let i = 0; i < bodies.length; i++) {
        bodies[i].x += bodies[i].vx * dt + 0.5 * oldAx[i] * dt * dt;
        bodies[i].y += bodies[i].vy * dt + 0.5 * oldAy[i] * dt * dt;
    }

    for (let i = 0; i < bodies.length; i++) {
        ComputeAcceleration(i, bodies);
    }

    for (let i = 0; i < bodies.length; i++) {
        bodies[i].vx += 0.5 * (oldAx[i] + bodies[i].ax) * dt;
        bodies[i].vy += 0.5 * (oldAy[i] + bodies[i].ay) * dt;
    }
}

//lagrenge

bodies = [
  new Body(1, 0, 0, -0.6, 1, 5, colorScheme[i].body1),                // Body 1
  new Body(-0.5, 0.86602540378, 0.51961524227, 0.3, 1, 7, colorScheme[i].body2),  // Body 2
  new Body(-0.5, -0.86602540378, -0.51961524227, 0.3, 1, 7, colorScheme[i].body3) // Body 3
];

// fig 8
// bodies = [
//   new Body(0.97000436, -0.24308753, 0.4662036850, 0.4323657300, 1, 5, colorScheme[i].body1),
//   new Body(-0.97000436, 0.24308753, 0.4662036850, 0.4323657300, 1, 7, colorScheme[i].body2),
//   new Body(0.0, 0.0, -0.93240737, -0.86473146, 1, 7, colorScheme[i].body3)
// ];

// rotaing fig 8
// bodies = [
//   new Body(0.97000436, -0.25308753, 0.4662036850, 0.4323657300, 1, 5, colorScheme[i].body1),
//   new Body(-0.97000436, 0.24308753, 0.4662036850, 0.4323657300, 1, 7, colorScheme[i].body2),
//   new Body(0.0, 0.0, -0.93240737, -0.86473146, 1, 7, colorScheme[i].body3)
// ];

//butterfly
// bodies = [
//   new Body(-1, 0, 0.306893, 0.125507, 1, 5, colorScheme[i].body1),  // Body A
//   new Body(1, 0, 0.306893, 0.125507, 1, 7, colorScheme[i].body2),   // Body B
//   new Body(0, 0, -0.613786, -0.251014, 1, 7, colorScheme[i].body3)  // Body C
// ];

//bodies 2

// bodies = [
//   new Body(-1, 0, 0.392955, 0.097579, 1, 5, colorScheme[i].body1),   // Body A
//   new Body(1, 0, 0.392955, 0.097579, 1, 7, colorScheme[i].body2),    // Body B
//   new Body(0, 0, -0.78591, -0.195158, 1, 7, colorScheme[i].body3)    // Body C
// ];









let dt = 0.0001;
let stepsPerFrame = 300;


//Animating
let RunSim = function(){

    requestAnimationFrame(RunSim);
    circleCanvasContext.clearRect(0,0,window_width*1.5, window_height*1.5);
  
    // Run physics multiple times per frame
    for (let i = 0; i < stepsPerFrame; i++) {
         rk4(bodies, dt);
        //  for (let body of bodies){
        //     body.drawLine(lineCanvasContext);
            
        //  }
    }

    //Redraw with Updated x.
    for (let body of bodies) {
        body.drawSmallCircle(lineCanvasContext);        
        body.drawCircle(circleCanvasContext);
        // body.drawVelocityVector(circleCanvasContext);
    }


}

RunSim();


