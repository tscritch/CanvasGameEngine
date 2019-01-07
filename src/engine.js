window.onload = function () {
  const canvas = document.getElementById("screen"),
    context = canvas.getContext("2d"),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

  const centerX = width / 2;
  const centerY = height / 2;

  class Vector3 {
    constructor(x, y, z, w) {
      this.x = x
      this.y = y
      this.z = z
      this.w = w
    }
  }

  class Triangle {
    constructor(vectors) {
      this.p = vectors
    }
  }

  class Mesh {
    constructor(triangles) {
      this.triangles = triangles
    }
  }

  var meshCube = [
    // SOUTH
    [[0, 0, 0], [0, 1, 0], [1, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [1, 0, 0]],
    // EAST
    [[1, 0, 0], [1, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1], [1, 0, 1]],
    // NORTH
    [[1, 0, 1], [1, 1, 1], [0, 1, 1]],
    [[1, 0, 1], [0, 1, 1], [0, 0, 1]],
    // WEST
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 1], [0, 1, 0], [0, 0, 0]],
    // TOP
    [[0, 1, 0], [0, 1, 1], [1, 1, 1]],
    [[0, 1, 0], [1, 1, 1], [1, 1, 0]],
    // BOTTOM
    [[1, 0, 1], [0, 0, 1], [0, 0, 0]],
    [[1, 0, 1], [0, 0, 0], [1, 0, 0]],
  ]

  // Projection matrix
  const fNear = 0.1
  const fFar = 1000.0
  const fFov = 90.0
  const fAspectRatio = height / width
  const fFovRad = 1 / Math.tan((fFov * 0.5) / 180 * Math.PI)

  const matProjection = [
    [fAspectRatio * fFovRad, 0, 0, 0],
    [0, fFovRad, 0, 0],
    [0, 0, fFar / (fFar - fNear), 1],
    [0, 0, (-fFar * fNear) / (fFar - fNear), 0],
  ]
  window.requestAnimationFrame(update)

  var s = Date.now()
  var fTheta = 0
  function update(t) {
    let deltaTime = t - s
    s = t
    context.clearRect(0, 0, width, height)
    context.fillStyle = "black"
    context.fillRect(0, 0, width, height)
    context.fillStyle = "white"
    context.fillText("delta: " + deltaTime, 10, 10)

    fTheta += 0.01

    const matRotZ = [
      [Math.cos(fTheta), Math.sin(fTheta), 0, 0],
      [-Math.sin(fTheta), Math.cos(fTheta), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]

    const matRotX = [
      [1, Math.sin(fTheta / 2), 0, 0],
      [0, Math.cos(fTheta / 2), Math.sin(fTheta / 2), 0, 0],
      [0, -Math.sin(fTheta / 2), Math.cos(fTheta / 2), 0],
      [0, 0, 0, 1]
    ]

    for (var tri of meshCube) {
      let triProjected = []
      let triRotatedZ = []
      let triRotatedX = []

      triRotatedZ.push(MultipyMatrixVector(tri[0], matRotZ))
      triRotatedZ.push(MultipyMatrixVector(tri[1], matRotZ))
      triRotatedZ.push(MultipyMatrixVector(tri[2], matRotZ))

      triRotatedX.push(MultipyMatrixVector(triRotatedZ[0], matRotX))
      triRotatedX.push(MultipyMatrixVector(triRotatedZ[1], matRotX))
      triRotatedX.push(MultipyMatrixVector(triRotatedZ[2], matRotX))

      let triTranslated = [[...triRotatedX[0]], [...triRotatedX[1]], [...triRotatedX[2]]]

      triTranslated[0][2] += 5
      triTranslated[1][2] += 5
      triTranslated[2][2] += 5

      triProjected.push(MultipyMatrixVector(triTranslated[0], matProjection))
      triProjected.push(MultipyMatrixVector(triTranslated[1], matProjection))
      triProjected.push(MultipyMatrixVector(triTranslated[2], matProjection))

      // Scale into view
      triProjected[0][0] += 1
      triProjected[0][1] += 1
      triProjected[1][0] += 1
      triProjected[1][1] += 1
      triProjected[2][0] += 1
      triProjected[2][1] += 1

      triProjected[0][0] *= 0.5 * width
      triProjected[0][1] *= 0.5 * height
      triProjected[1][0] *= 0.5 * width
      triProjected[1][1] *= 0.5 * height
      triProjected[2][0] *= 0.5 * width
      triProjected[2][1] *= 0.5 * height

      drawTriangle(triProjected[0][0], triProjected[0][1], triProjected[1][0], triProjected[1][1], triProjected[2][0], triProjected[2][1])
    }

    window.requestAnimationFrame(update)
  }

  function MultipyMatrixVector(v, m) {
    const t = [0, 0, 0]

    t[0] = v[0] * m[0][0] + v[1] * m[1][0] + v[2] * m[2][0] + m[3][0]
    t[1] = v[0] * m[0][1] + v[1] * m[1][1] + v[2] * m[2][1] + m[3][1]
    t[2] = v[0] * m[0][2] + v[1] * m[1][2] + v[2] * m[2][2] + m[3][2]
    const w = v[0] * m[0][3] + v[1] * m[1][3] + v[2] * m[2][3] + m[3][3]

    if (w !== 0) {
      t[0] /= w
      t[1] /= w
      t[2] /= w
    }
    return t.slice(0)
  }

  function drawLine(x1, y1, x2, y2, c = "white") {
    context.beginPath();
    context.strokeStyle = c;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function drawTriangle(x1, y1, x2, y2, x3, y3, c = "white") {
    drawLine(x1, y1, x2, y2, c)
    drawLine(x2, y2, x3, y3, c)
    drawLine(x3, y3, x1, y1, c)
  }

}