import { STARCOUNT, RADIUS, FOV, ANGLE, VERT, CRUISE } from "./constants"

export class Star {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  z: number
  windowWidth: number
  windowHeight: number
  color: number[] = [167, 180, 224]

  constructor(ctx: CanvasRenderingContext2D, star: Partial<Star> = {}) {
    this.ctx = ctx
    this.x = Math.random() * (2 * RADIUS) - RADIUS
    this.y = Math.random() * (2 * RADIUS) - RADIUS
    this.z = Math.random() * (2 * RADIUS) - RADIUS
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight * 1.6
    if (star.hasOwnProperty("color")) {
      this.color = star.color
    }
  }

  draw() {
    this.ctx.beginPath()
    let fovRatio = FOV / 2 / (FOV + this.z)
    let newX = this.x * fovRatio + this.windowWidth / 2
    let newY = this.y * fovRatio + this.windowHeight / 2
    let alpha = Math.min(Math.max(Math.abs(fovRatio), 0.1), 1)
    this.ctx.arc(newX, newY, Math.min(Math.abs(fovRatio), 3), 0, 360)
    this.ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha})`
    this.ctx.fill()
  }

  update(star: Partial<Star>) {
    Object.keys(star).forEach((key) => {
      this[key] = star[key]
    })
  }

  resetCoordinate(coord: number): number {
    if (coord < -RADIUS) {
      coord = RADIUS
    } else if (coord > RADIUS) {
      coord = -RADIUS // NEGATED radius.
    }
    return coord
  }

  move() {
    let cosineAngle = Math.cos(ANGLE)
    let sineAngle = Math.sin(ANGLE)
    let cosineVert = Math.cos(VERT)
    let sineVert = Math.sin(VERT)

    let oldX = this.x
    let oldY = this.y
    var newZ = this.z + FOV
    var newX = oldX * cosineAngle + newZ * sineAngle
    var newY = oldY * cosineVert + newZ * sineVert
    var n = oldY * -sineVert + newZ * cosineVert - CRUISE

    this.x = this.resetCoordinate(newX)
    this.y = this.resetCoordinate(newY)
    this.z = this.resetCoordinate(n) - FOV
  }
}

export function generateStars(
  offsetWidth: number,
  ctx: CanvasRenderingContext2D,
  color: number[]
): Star[] {
  let stars: Star[] = []
  let numStars = Math.min(STARCOUNT, Math.round(2 * offsetWidth))
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star(ctx, { color }))
  }
  return stars
}

export function renderStars(stars: Star[]) {
  for (var i = 0; i < stars.length; i++) {
    stars[i].move()
    stars[i].draw()
  }
}
