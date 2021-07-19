<script lang="ts">
  import { onMount } from "svelte"
  import { FRAMERATE } from "./constants"
  import type { Star } from "./star"
  import { generateStars, renderStars } from "./star"

  // All states
  let stars: Star[] = []
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  onMount(async () => {
    ctx = canvas.getContext("2d")

    // update canvas width/height to full screen
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    stars = generateStars(canvas.offsetWidth, ctx)
    renderStars(stars)

    // Render a new stars per frame
    let frame: number
    function step() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      renderStars(stars)

      setTimeout(function () {
        frame = requestAnimationFrame(step)
      }, FRAMERATE)
    }

    requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
  })
</script>

<div id="starfield-ui">
  <canvas id="starfield" bind:this={canvas} />
</div>

<style>
  #starfield-ui {
    position: relative;
    width: 100%;
    height: 100%;
  }

  canvas#starfield {
    position: fixed;
    z-index: 1000;
    height: 100%;
    width: 100%;
    background-image: -webkit-radial-gradient(bottom, #262a36, #101218);
  }
</style>
