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

  // Reactive theme related state
  let isDark = true
  $: theme = {
    primary: isDark ? "#262a36" : "#ff9b05",
    secondary: isDark ? "#101218" : "#ff9900",
    starcolor: isDark ? [167, 180, 224] : [0, 0, 0],
  }
  $: cssVarStyles = Object.entries(theme)
    .map(([key, value]) => `--${key}:${value}`)
    .join(";")

  // handle window resize
  function handleResize() {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    // Clear everything within old canvas size.
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    stars.length = 0 // Clears all references.
    stars = generateStars(canvas.offsetWidth, ctx, theme.starcolor)
    renderStars(stars)
  }

  function handleMessage(event: CustomEvent) {
    if (event.detail.isDark) {
      isDark = true
      localStorage.setItem("theme", "dark")
    } else {
      isDark = false
      localStorage.setItem("theme", "light")
    }
    theme = {
      primary: isDark ? "#262a36" : "#ffc266",
      secondary: isDark ? "#101218" : "#ff9900",
      starcolor: isDark ? [167, 180, 224] : [0, 0, 0],
    }
    stars.forEach((star) =>
      star.update({
        color: theme.starcolor,
      })
    )
  }

  onMount(async () => {
    // Setup theme on mount
    if (localStorage.getItem("theme") === "dark") {
      isDark = true
    } else {
      isDark = false
    }
    theme = {
      primary: isDark ? "#262a36" : "#ffc266",
      secondary: isDark ? "#101218" : "#ff9900",
      starcolor: isDark ? [167, 180, 224] : [0, 0, 0],
    }

    ctx = canvas.getContext("2d")

    // update canvas width/height to full screen
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    stars = generateStars(canvas.offsetWidth, ctx)
    stars.forEach((star) =>
      star.update({
        color: theme.starcolor,
      })
    )
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
