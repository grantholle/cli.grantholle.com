<template>
  <div class="cli" @keydown="handleInput" @click="handleClick">
    <input type="text" v-model="userInput" @blur="blur" autofocus spellcheck="false">

    <div v-if="!clearScreen">
      <div :class="{ rainbow: rebooted }">&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___</div>
      <div :class="{ rainbow: rebooted }">/\&nbsp;\&nbsp;&nbsp;__/\&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/\_&nbsp;\</div>
      <div :class="{ rainbow: rebooted }">\&nbsp;\&nbsp;\/\&nbsp;\&nbsp;\&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__\//\&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___&nbsp;&nbsp;&nbsp;&nbsp;___&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___&nbsp;___&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__</div>
      <div :class="{ rainbow: rebooted }">&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;&nbsp;/'__`\\&nbsp;\&nbsp;\&nbsp;&nbsp;&nbsp;/'___\&nbsp;/&nbsp;__`\&nbsp;/'&nbsp;__`&nbsp;__`\&nbsp;&nbsp;/'__`\</div>
      <div :class="{ rainbow: rebooted }">&nbsp;&nbsp;\&nbsp;\&nbsp;\_/&nbsp;\_\&nbsp;\/\&nbsp;&nbsp;__/&nbsp;\_\&nbsp;\_/\&nbsp;\__//\&nbsp;\L\&nbsp;\/\&nbsp;\/\&nbsp;\/\&nbsp;\/\&nbsp;&nbsp;__/</div>
      <div :class="{ rainbow: rebooted }">&nbsp;&nbsp;&nbsp;\&nbsp;`\___x___/\&nbsp;\____\/\____\&nbsp;\____\&nbsp;\____/\&nbsp;\_\&nbsp;\_\&nbsp;\_\&nbsp;\____\</div>
      <div :class="{ rainbow: rebooted }">&nbsp;&nbsp;&nbsp;&nbsp;'\/__//__/&nbsp;&nbsp;\/____/\/____/\/____/\/___/&nbsp;&nbsp;\/_/\/_/\/_/\/____/</div>
      <div>&nbsp;</div>
      <div>Welcome&nbsp;to&nbsp;GrantOS&nbsp;1.0.0&nbsp;LTS&nbsp;({{ userAgent }})</div>
      <div>&nbsp;</div>
      <div>&nbsp;*&nbsp;Github:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" :href="links.gh">{{ links.gh }}</a></div>
      <div>&nbsp;*&nbsp;Twitter:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" :href="links.twitter">{{ links.twitter }}</a></div>
      <div>&nbsp;*&nbsp;npm:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" :href="links.npm">{{ links.npm }}</a></div>
      <div>&nbsp;*&nbsp;Stackoverflow:&nbsp;&nbsp;&nbsp;&nbsp;<a target="_blank" :href="links.so">{{ links.so }}</a></div>
      <div>&nbsp;</div>
      <div>0&nbsp;packages&nbsp;can&nbsp;be&nbsp;updated.</div>
      <div>0&nbsp;updates&nbsp;are&nbsp;security&nbsp;updates.</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div v-if="!rebooted">***&nbsp;System&nbsp;restart&nbsp;required&nbsp;***</div>
    </div>

    <div v-for="(line, index) in lineFeed" :key="index">
      <span v-if="line.hasPrompt" class="user-prompt">{{ userPrompt }}</span>
      <span v-html="line.text" class="output-text"></span>
    </div>

    <div v-if="allowInput" class="user-input">
      <span class="user-prompt" :class="{ 'add-buffer': !userInput }">{{ userPrompt }}</span>
      <span>{{ userInput }}</span>
      <span class="cursor" :class="{ blink: !typing }" :style="{ left: `${cursorOffset}px` }">&nbsp;</span>
    </div>

    <div v-if="preLineFeed.length > 0">
      {{ preLineFeed }}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import sanitize from 'sanitize-html'
import Vue from 'vue'

export default {
  name: 'Cli',
  created () {
    this.getIp()
  },
  ready () {
    this.$el.children[0].focus()
  },
  data () {
    return {
      ip: '',
      links: {
        so: 'https://stackoverflow.com/users/1696102/grant',
        npm: 'https://www.npmjs.com/~grantholle',
        gh: 'https://github.com/grantholle',
        twitter: 'https://twitter.com/grantholle_'
      },
      userInput: '',
      userPrompt: 'guest@grantholle.com:$',
      lineFeed: [],
      preLineFeed: '',
      typing: false,
      cursorOffset: -8,
      userAgent: window.navigator.userAgent,
      allowInput: false,
      rebooted: false,
      clearScreen: false,
      commands: [
        'help',
        'reboot',
        'hello',
        'about',
        'skills'
      ],
      commandHistoryIndex: 1,
      commandHistory: [
        'help'
      ]
    }
  },
  methods: {
    async getIp () {
      const { data } = await axios.get(`https://api.ipify.org?format=json`)
      // const data = { ip: '192.168.1.1' }

      this.lineFeed.push({
        text: `Current Login: ${moment().format('ddd MMM DD HH:mm:ss YYYY')} from ${data.ip}`
      })

      setTimeout(() => this.allowInput = true, 750)
    },
    handleInput (event) {
      // console.log(event.key)
      if (!this.typing) {
        this.typing = true
      }

      switch (event.key) {
        case 'Tab':
          event.preventDefault()

          const command = this.commands.filter(c => c.match(new RegExp(`^${this.userInput}`, 'i')))

          if (command.length === 1) {
            this.userInput = command + ' '
          } else if (command.length > 1) {
            this.preLineFeed = command.join('&nbsp;&nbsp;')
          }

          this.resume()
          break
        case 'Enter':
          this.preLineFeed = ''

          this.lineFeed.push({
            hasPrompt: true,
            text: this.userInput
          })

          this.scroll()
          this.runCommand()
          break
        case ' ':
          this.cursorOffset += 8
          this.resume()
          break
        case 'Shift':
        case 'Backspace':
        case 'Control':
        case 'Alt':
        case 'Meta':
          this.resume()
          break
        case 'ArrowLeft':
          if (this.cursorOffset > this.userInput.length * -8 - 8) {
            this.cursorOffset += -8
          }

          this.resume()
          break
        case 'ArrowRight':
          if (this.cursorOffset < -8) {
            this.cursorOffset += 8
          }

          this.resume()
          break
        case 'ArrowUp':
          const index = this.commandHistoryIndex > 0 ? --this.commandHistoryIndex : 0

          this.userInput = this.commandHistory[index]
          this.resume()
          break
        case 'ArrowDown':
          this.userInput = this.commandHistoryIndex < this.commandHistory.length ? this.commandHistory[++this.commandHistoryIndex] : ''
          this.resume()
          break
        default:
          this.resume()
          this.handleClick()
          this.cursorOffset = this.cursorOffset < -8 ? this.cursorOffset : -8
          break
      }
    },
    runCommand () {
      const clean = sanitize(this.userInput, {
        allowedTags: [],
        allowedAttributes: []
      }).trim()

      const parts = clean.split(' ')
      const command = parts[0] === 'sudo' ? parts[1] : parts[0]
      this.commandHistory.push(clean)
      this.commandHistoryIndex = this.commandHistory.length
      this.userInput = ''

      // Register GA event
      window.ga('send', 'event', 'Commands', 'run', command)

      if (this.commands.indexOf(command) === -1 && typeof this[command] !== 'function') {
        this.lineFeed.push({
          text: `${command}: command not found`
        })
        this.cursorOffset = -8
        this.resume()
        return this.scroll()
      }

      this[command](parts)
    },
    scroll () {
      Vue.nextTick(() => window.scrollTo(0, document.body.scrollHeight))
    },
    handleClick (event) {
      this.$el.children[0].focus()
    },
    blur (event) {
      event.target.focus()
    },
    resume () {
      setTimeout(() => this.typing = false, 150)
    },

    // All the command functions
    help (args) {
      this.lineFeed.push({
        text: 'Available commands:'
      }, {
        text: this.commands.sort().join(', ')
      })

      this.resume()
    },
    hello (args) {
      this.lineFeed.push({
        text: `你好！`
      })

      this.resume()
    },
    reboot (args) {
      this.allowInput = false

      this.lineFeed.push({
        text: `Rebooting... now!`
      })

      // Nest a bunch of timeouts to simulate loading
      setTimeout(() => {
        this.lineFeed = []
        this.clearScreen = true
        this.rebooted = true

        setTimeout(() => {
          this.clearScreen = false

          this.getIp()
          setTimeout(() => {
            this.allowInput = true
            this.resume()
          }, 750)
        }, 2000)
      }, 2000)
    },
    about (args) {
      this.lineFeed.push({
        text: `<br>
          Grant was born in Iowa, raised in Missouri, and is currently living in China.
          He loves all things web and is currently an application developer for an
          international school in Tianjin. He spends his free time doing something
          like what you're looking at now, contributing to some open source projects and
          hanging out with his family.
        <br><br>`
      })

      this.resume()
    },
    secret (args) {
      this.lineFeed.push({ text: 'ssshhhhhh!' })
    },
    skills (args) {
      const lineTotal = Math.floor(document.body.clientWidth / 8) - 4
      const skills = [
        { label: 'HTML', value: .95 },
        { label: 'CSS', value: .92 },
        { label: 'JavaScript + Node.js', value: .88 },
        { label: 'Python', value: .30 },
        { label: 'Ruby', value: .25 },
        { label: 'PHP', value: .85 },
        { label: 'C#', value: .55 },
        { label: 'Java', value: .35 },
        { label: 'Swift', value: .05 },
      ]

      skills.forEach(s => {
        const total = Math.floor(s.value * lineTotal)
        const spaces = lineTotal - total

        this.lineFeed.push({
          text: s.label
        }, {
          text: `[${'#'.repeat(total)}${'&nbsp;'.repeat(spaces)}]<br><br>`
        })

        this.scroll()
      })

      this.resume()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$white: #f9f9f9;
$black: #002833;

@keyframes blink {
  from, to {
    background: white;
  }
  50% {
    background: transparent;
  }
}

@keyframes rainbow {
  0% { color: #F3801F; }
  1% { color: #EF871A; }
  2% { color: #EC8F16; }
  3% { color: #E79712; }
  4% { color: #E29F0E; }
  5% { color: #DDA60B; }
  6% { color: #D8AE08; }
  7% { color: #D2B505; }
  8% { color: #CCBC03; }
  9% { color: #C5C302; }
  10% { color: #BFCA01; }
  11% { color: #B8D001; }
  12% { color: #B0D601; }
  13% { color: #A9DB01; }
  14% { color: #A1E102; }
  15% { color: #9AE604; }
  16% { color: #92EA06; }
  17% { color: #8AEE08; }
  18% { color: #82F20B; }
  19% { color: #7AF50E; }
  20% { color: #72F812; }
  21% { color: #6BFA16; }
  22% { color: #63FC1B; }
  23% { color: #5BFD20; }
  24% { color: #54FE25; }
  25% { color: #4CFE2B; }
  26% { color: #45FE31; }
  27% { color: #3EFE37; }
  28% { color: #38FD3E; }
  29% { color: #31FB45; }
  30% { color: #2BF94C; }
  31% { color: #26F653; }
  32% { color: #20F35B; }
  33% { color: #1BF063; }
  34% { color: #16EC6A; }
  35% { color: #12E872; }
  36% { color: #0EE37A; }
  37% { color: #0BDE82; }
  38% { color: #08D98A; }
  39% { color: #06D392; }
  40% { color: #04CD99; }
  41% { color: #02C6A1; }
  42% { color: #01C0A9; }
  43% { color: #01B9B0; }
  44% { color: #01B1B7; }
  45% { color: #01AABE; }
  46% { color: #02A3C5; }
  47% { color: #039BCB; }
  48% { color: #0593D2; }
  49% { color: #088BD7; }
  50% { color: #0A83DD; }
  51% { color: #0E7CE2; }
  52% { color: #1174E7; }
  53% { color: #166CEB; }
  54% { color: #1A64EF; }
  55% { color: #1F5CF3; }
  56% { color: #2455F6; }
  57% { color: #2A4EF9; }
  58% { color: #3046FB; }
  59% { color: #363FFC; }
  60% { color: #3D39FE; }
  61% { color: #4432FE; }
  62% { color: #4B2CFE; }
  63% { color: #5226FE; }
  64% { color: #5A21FD; }
  65% { color: #611CFC; }
  66% { color: #6917FA; }
  67% { color: #7113F8; }
  68% { color: #790FF6; }
  69% { color: #810CF2; }
  70% { color: #8909EF; }
  71% { color: #9006EB; }
  72% { color: #9804E6; }
  73% { color: #A002E2; }
  74% { color: #A701DC; }
  75% { color: #AF01D7; }
  76% { color: #B601D1; }
  77% { color: #BD01CB; }
  78% { color: #C402C4; }
  79% { color: #CA03BE; }
  80% { color: #D105B7; }
  81% { color: #D707AF; }
  82% { color: #DC0AA8; }
  83% { color: #E10DA0; }
  84% { color: #E61199; }
  85% { color: #EB1591; }
  86% { color: #EF1989; }
  87% { color: #F21E81; }
  88% { color: #F52479; }
  89% { color: #F82971; }
  90% { color: #FA2F6A; }
  91% { color: #FC3562; }
  92% { color: #FD3C5A; }
  93% { color: #FE4353; }
  94% { color: #FE4A4B; }
  95% { color: #FE5144; }
  96% { color: #FE593D; }
  97% { color: #FC6037; }
  98% { color: #FB6830; }
  99% { color: #F9702A; }
  100% { color: #F67825; }
}

body {
  background: $black;
  color: $white;
  padding: 8px 10px;
}

.cli {
  width: 100%;
  font-family: 'Inconsolata', monospace;
  position: relative;

  .output-text {
    a {
      text-decoration: underline;
    }
  }

  div {
    line-height: 1.3em;
  }

  input {
    position: absolute;
    bottom: 0;
    color: transparent;
    background: transparent;
    border: none;
    outline: none;
    user-select: none;
    width: 1px;
  }

  a {
    color: $white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.cursor {
  background: $white;
  display: inline-block;
  position: relative;
  // left: -8px;
  // width: 8px;

  &.blink {
    animation: 1s blink step-end infinite;
  }
}

.rainbow {
  animation: 1s ease-in 1s infinite rainbow;
}

.user-prompt {
  color: #93a1a1
}

.add-buffer {
  display: inline-block;
  margin-right: 6px;
}
</style>
