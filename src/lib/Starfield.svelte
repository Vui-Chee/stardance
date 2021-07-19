<script lang="ts">
  import { onMount } from "svelte"
  import { FRAMERATE } from "./constants"
  import type { Star } from "./star"
  import { generateStars, renderStars } from "./star"

  // All states
  let stars: Star[] = []
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  // handle window resize
  function handleResize() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    // Clear everything within old canvas size.
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    stars.length = 0 // Clears all references.
    stars = generateStars(canvas.offsetWidth, ctx)
    renderStars(stars)
  }

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

<canvas id="starfield" bind:this={canvas} />
<svelte:window on:resize={handleResize} />

<style>
  canvas#starfield {
    position: fixed;
    z-index: 1000;
    height: 100%;
    width: 100%;
    background-image: -webkit-radial-gradient(bottom, #262a36, #101218);
  }
</style>
