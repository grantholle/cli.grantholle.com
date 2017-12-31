<template>
  <div class="bigwilly">
    <img v-for="(will, pIndex) in wills" :key="`will-${pIndex}`" :style="will" src="/static/will.png" class="scale-spin will" alt="Will Smith">
    <div v-for="(circle, index) in circles" :key="index" :style="{ background: circle }" class="circle"></div>
  </div>
</template>

<script>
export default {
  name: 'BigWilly',
  data () {
    return {
      circles: [],
      wills: []
    }
  },
  mounted () {
    setInterval(() => {
      this.circles.push(this.randomColor())
    }, 1000)

    setInterval(() => {
      const width = this.randomNumber(10, 820)

      const will = {
        top: this.randomNumber(-1 * width, document.body.offsetHeight) + 'px',
        left: this.randomNumber(-1 * width, document.body.offsetWidth) + 'px',
        width: width + 'px'
      }

      this.wills.push(will)
    }, this.randomNumber(500, 3000))
  },
  methods: {
    randomNumber (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    randomColor () {
      return `rgb(${this.randomNumber(0, 255)}, ${this.randomNumber(0, 255)}, ${this.randomNumber(0, 255)})`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@keyframes scaleAndRotate {
  from {
    transform: scale(0) rotate(0)
  }
  to {
    transform: scale(1) rotate(1080deg)
  }
}

@keyframes spin {
  to { transform: rotate(360deg) }
}

@keyframes scale {
  0% {
    transform: scale(0);
    z-index: 2;
  }
  50% {
    transform: scale(2);
    z-index: 1;
  }
}

body {
  overflow: hidden;
}

.bigwilly {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

.scale-spin {
  animation: scaleAndRotate 2s ease-in;
}

.will {
  max-width: 410px;
  display: block;
  position: absolute;
  z-index: 10;
}

.circle {
  width: 100vw;
  height: 100vw;
  position: absolute;
  top: calc(50% - 50vw);
  left: calc(50% - 50vw);
  border-radius: 50%;
  animation: scale 2s linear forwards;
}

</style>
