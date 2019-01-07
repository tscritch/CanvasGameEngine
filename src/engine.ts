export default class GameEngine {
  context: any
  ScreenWidth: number = 0
  ScreenHeight: number = 0
  centerX: number = 0
  centerY: number = 0
  fNear: number = 0
  fFar: number = 0
  fFov: number = 0
  fAspectRatio: number = 0
  fFovRad: number = 0


  constructor() {

  }

  start() {

  }

  update(t: number) {

  }

  drawLine(x1: number, y1: number, x2: number, y2: number, c: string = "white") {
    this.context.beginPath();
    this.context.strokeStyle = c;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, c: string = "white") {
    this.drawLine(x1, y1, x2, y2, c)
    this.drawLine(x2, y2, x3, y3, c)
    this.drawLine(x3, y3, x1, y1, c)
  }
}

export interface Vector {
  x: number,
  y: number,
  z: number,
  w?: number
}

export interface Triangle {
  v: Vector[]
}

export interface Mesh {
  triangles: Triangle[]
}

export interface Matrix {
  0: number[]
  1: number[]
  2: number[]
  3: number[]
}


// export function drawLine(x1: number, y1: number, x2: number, y2: number, c: string = "white") {
//   context.beginPath();
//   context.strokeStyle = c;
//   context.moveTo(x1, y1);
//   context.lineTo(x2, y2);
//   context.stroke();
// }

// export function drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, c: string = "white") {
//   drawLine(x1, y1, x2, y2, c)
//   drawLine(x2, y2, x3, y3, c)
//   drawLine(x3, y3, x1, y1, c)
// }