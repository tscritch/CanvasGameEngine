import GameEngine, { Vector, Triangle, Mesh, Matrix } from './engine'

function MultipyMatrixVector(v: Vector, m: Matrix) {
  const t: Vector = { x: 0, y: 0, z: 0 }

  t.x = v.x * m[0][0] + v.y * m[1][0] + v.z * m[2][0] + m[3][0]
  t.y = v.x * m[0][1] + v.y * m[1][1] + v.z * m[2][1] + m[3][1]
  t.z = v.x * m[0][2] + v.y * m[1][2] + v.z * m[2][2] + m[3][2]
  const w = v.x * m[0][3] + v.y * m[1][3] + v.z * m[2][3] + m[3][3]

  if (w !== 0) {
    t.x /= w
    t.y /= w
    t.z /= w
  }
  return t
}

class clientGame extends GameEngine {
  meshCube: Mesh = { triangles: [] }
  projectionMatrix: Matrix = { 0: [], 1: [], 2: [], 3: [] }
  s: number = 0
  fTheta: number = 0

  start() {
    const canvas: any = document.getElementById("screen")
    this.context = canvas.getContext("2d")
    this.ScreenWidth = canvas.width = window.innerWidth
    this.ScreenHeight = canvas.height = window.innerHeight
    this.centerX = this.ScreenWidth / 2
    this.centerY = this.ScreenHeight / 2

    this.meshCube = {
      triangles: [
        // SOUTH
        { v: [{ x: 0, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 }] },
        { v: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 1, y: 0, z: 0 }] },
        // EAST
        { v: [{ x: 1, y: 0, z: 0 }, { x: 1, y: 1, z: 0 }, { x: 1, y: 1, z: 1 }] },
        { v: [{ x: 1, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 1, y: 0, z: 1 }] },
        // NORTH
        { v: [{ x: 1, y: 0, z: 1 }, { x: 1, y: 1, z: 1 }, { x: 0, y: 1, z: 1 }] },
        { v: [{ x: 1, y: 0, z: 1 }, { x: 0, y: 1, z: 1 }, { x: 0, y: 0, z: 1 }] },
        // WEST
        { v: [{ x: 0, y: 0, z: 1 }, { x: 0, y: 1, z: 1 }, { x: 0, y: 1, z: 0 }] },
        { v: [{ x: 0, y: 0, z: 1 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }] },
        // TOP
        { v: [{ x: 0, y: 1, z: 0 }, { x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }] },
        { v: [{ x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 0 }] },
        // BOTTOM
        { v: [{ x: 1, y: 0, z: 1 }, { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 0 }] },
        { v: [{ x: 1, y: 0, z: 1 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }] },
      ]
    }

    // Projection matrix
    this.fNear = 10
    this.fFar = 5000.0
    this.fFov = 90.0
    this.fAspectRatio = this.ScreenHeight / this.ScreenWidth
    this.fFovRad = 1 / Math.tan((this.fFov * 0.5) / 180 * Math.PI)

    this.projectionMatrix = {
      0: [this.fAspectRatio * this.fFovRad, 0, 0, 0],
      1: [0, this.fFovRad, 0, 0],
      2: [0, 0, this.fFar / (this.fFar - this.fNear), 1],
      3: [0, 0, (-this.fFar * this.fNear) / (this.fFar - this.fNear), 0]
    }

    this.s = Date.now()
    window.requestAnimationFrame(this.update)
  }

  update(t: number) {
    let deltaTime = t - this.s
    let fps = 1000 / deltaTime
    this.s = t
    this.context.clearRect(0, 0, this.ScreenWidth, this.ScreenHeight)
    this.context.fillStyle = "black"
    this.context.fillRect(0, 0, this.ScreenWidth, this.ScreenHeight)
    this.context.fillStyle = "white"
    this.context.fillText("fps: " + fps, 10, 10)

    this.fTheta += 0.01

    const matRotZ: Matrix = {
      0: [Math.cos(this.fTheta), Math.sin(this.fTheta), 0, 0],
      1: [-Math.sin(this.fTheta), Math.cos(this.fTheta), 0, 0],
      2: [0, 0, 1, 0],
      3: [0, 0, 0, 1]
    }

    const matRotX: Matrix = {
      0: [1, Math.sin(this.fTheta / 2), 0, 0],
      1: [0, Math.cos(this.fTheta / 2), Math.sin(this.fTheta / 2), 0, 0],
      2: [0, -Math.sin(this.fTheta / 2), Math.cos(this.fTheta / 2), 0],
      3: [0, 0, 0, 1]
    }

    for (const tri of this.meshCube.triangles) {
      let triProjected: Triangle = { v: [] }
      let triRotatedZ: Triangle = { v: [] }
      let triRotatedX: Triangle = { v: [] }

      triRotatedZ.v.push(MultipyMatrixVector(tri.v[0], matRotZ))
      triRotatedZ.v.push(MultipyMatrixVector(tri.v[1], matRotZ))
      triRotatedZ.v.push(MultipyMatrixVector(tri.v[2], matRotZ))

      triRotatedX.v.push(MultipyMatrixVector(triRotatedZ.v[0], matRotX))
      triRotatedX.v.push(MultipyMatrixVector(triRotatedZ.v[1], matRotX))
      triRotatedX.v.push(MultipyMatrixVector(triRotatedZ.v[2], matRotX))

      let triTranslated: Triangle = { v: [{ ...triRotatedX.v[0] }, { ...triRotatedX.v[1] }, { ...triRotatedX.v[2] }] }

      triTranslated.v[0].z += 5
      triTranslated.v[1].z += 5
      triTranslated.v[2].z += 5

      triProjected.v.push(MultipyMatrixVector(triTranslated.v[0], this.projectionMatrix))
      triProjected.v.push(MultipyMatrixVector(triTranslated.v[1], this.projectionMatrix))
      triProjected.v.push(MultipyMatrixVector(triTranslated.v[2], this.projectionMatrix))

      // Scale into view
      triProjected.v[0].x += 1
      triProjected.v[0].y += 1
      triProjected.v[1].x += 1
      triProjected.v[1].y += 1
      triProjected.v[2].x += 1
      triProjected.v[2].y += 1

      triProjected.v[0].x *= 0.5 * this.ScreenWidth
      triProjected.v[0].y *= 0.5 * this.ScreenHeight
      triProjected.v[1].x *= 0.5 * this.ScreenWidth
      triProjected.v[1].y *= 0.5 * this.ScreenHeight
      triProjected.v[2].x *= 0.5 * this.ScreenWidth
      triProjected.v[2].y *= 0.5 * this.ScreenHeight

      this.drawTriangle(triProjected.v[0].x, triProjected.v[0].y, triProjected.v[1].x, triProjected.v[1].y, triProjected.v[2].x, triProjected.v[2].y)
    }

    window.requestAnimationFrame(this.update)
  }
}

window.onload = function () {
  const gameEngine: GameEngine = new GameEngine()

  gameEngine.start()

}