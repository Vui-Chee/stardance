<script lang="ts">
  import { onMount } from "svelte"

  import { FRAMERATE } from "./constants"
  import type { Star } from "./star"
  import { generateStars, renderStars } from "./star"

  import ToggleTheme from "./ToggleTheme.svelte"

  // All states
  let stars: Star[] = []
  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D

  // Theme related state
  let isDark = true // control theme

  let theme = {
    primary: isDark ? "#262a36" : "#fb5508",
    secondary: isDark ? "#101218" : "#fb6621",
  }
  $: cssVarStyles = Object.entries(theme)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";")

  function toggleTheme(isDark: boolean) {
    if (isDark) {
      theme = {
        primary: "#262a36",
        secondary: "#101218",
      }
    } else {
      theme = {
        primary: "#fb5508",
        secondary: "#fb6621",
      }
    }
  }

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

  function handleMessage(event: CustomEvent) {
    toggleTheme(event.detail.isDark)
    if (event.detail.isDark) {
      localStorage.setItem("theme", "dark")
    } else {
      localStorage.setItem("theme", "light")
    }
  }

  onMount(async () => {
    let theme = localStorage.getItem("theme")
    if (theme === "dark") {
      isDark = true
    } else {
      isDark = false
    }
    toggleTheme(isDark)

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

<div id="starfield" style={cssVarStyles}>
  <ToggleTheme {isDark} on:message={handleMessage} />
  <canvas id="starfield" bind:this={canvas} />
</div>
<svelte:window on:resize={handleResize} />

<style>
  #starfield :global(.theme-switch-wrapper) {
    position: fixed;
    left: 10px;
    top: 10px;
    z-index: 10000;
  }

  canvas#starfield {
    position: fixed;
    z-index: 1000;
    height: 100%;
    width: 100%;
    background-image: -webkit-radial-gradient(
      bottom,
      var(--primary),
      var(--secondary)
    );
  }
</style>
