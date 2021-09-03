const STARCOUNT = 2000
const BOUNDARY = 600
const FOV = 260

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
    this.x = Math.random() * (2 * BOUNDARY) - BOUNDARY
    this.y = Math.random() * (2 * BOUNDARY) - BOUNDARY
    this.z = Math.random() * (2 * BOUNDARY) - BOUNDARY
    this.windowWidth = window.innerWidth
    this.windowHeight = window.innerHeight * 1.6
    this.update(star) // apply any other defaults
  }

  /** Draw projected star onto canvas. */
  draw() {
    this.ctx.beginPath()
    const fovRatio = FOV / (FOV + this.z)
    const newX = (this.x * fovRatio + this.windowWidth) / 2
    const newY = (this.y * fovRatio + this.windowHeight) / 2
    const alpha = Math.min(Math.max(Math.abs(fovRatio), 0.1), 1)
    this.ctx.arc(newX, newY, Math.min(Math.abs(fovRatio / 2), 3), 0, 360)
    this.ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha})`
    this.ctx.fill()
  }

  /**
   * Calculate star's next trajectory in 3D-space.
   *
   * NOTE: star is simply moving linearly in 3D-space.
   */
  move() {
    // Since tan(theta) = theta for small angles
    const xzAngle = 0.01 // rad
    const yzAngle = -0.001 // rad
    let adjustedZ = this.z + FOV
    this.x = this.resetCoordinate(this.x + adjustedZ * xzAngle)
    this.y = this.resetCoordinate(this.y + adjustedZ * yzAngle)
    this.z = this.resetCoordinate(this.z + this.y * -yzAngle)
  }

  update(star: Partial<Star>) {
    Object.keys(star).forEach((key) => {
      this[key] = star[key]
    })
  }

  resetCoordinate(coord: number): number {
    if (coord < -BOUNDARY) {
      coord = BOUNDARY
    } else if (coord > BOUNDARY) {
      coord = -BOUNDARY // NEGATED radius.
    }
    return coord
  }
}

export function generateStars(
  offsetWidth: number,
  ctx: CanvasRenderingContext2D,
  color: number[] = []
): Star[] {
  let stars: Star[] = []
  let numStars = Math.min(STARCOUNT, Math.round(2 * offsetWidth))
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star(ctx, { color }))
  }
  return stars
}

export function renderStars(stars: Star[], colors: number[] = []) {
  for (let i = 0; i < stars.length; i++) {
    stars[i].move()
    if (colors.length === 3) {
      stars[i].update({ color: colors })
    }
    stars[i].draw()
  }
}
