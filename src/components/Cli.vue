<template>
  <div class="cli" @keydown="handleInput" @click="handleClick">
    <input type="text" v-model="userInput" @blur="blur" autofocus spellcheck="false">

    <div>&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___</div>
    <div>/\&nbsp;\&nbsp;&nbsp;__/\&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/\_&nbsp;\</div>
    <div>\&nbsp;\&nbsp;\/\&nbsp;\&nbsp;\&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__\//\&nbsp;\&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___&nbsp;&nbsp;&nbsp;&nbsp;___&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;___&nbsp;___&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;__</div>
    <div>&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;\&nbsp;&nbsp;/'__`\\&nbsp;\&nbsp;\&nbsp;&nbsp;&nbsp;/'___\&nbsp;/&nbsp;__`\&nbsp;/'&nbsp;__`&nbsp;__`\&nbsp;&nbsp;/'__`\</div>
    <div>&nbsp;&nbsp;\&nbsp;\&nbsp;\_/&nbsp;\_\&nbsp;\/\&nbsp;&nbsp;__/&nbsp;\_\&nbsp;\_/\&nbsp;\__//\&nbsp;\L\&nbsp;\/\&nbsp;\/\&nbsp;\/\&nbsp;\/\&nbsp;&nbsp;__/</div>
    <div>&nbsp;&nbsp;&nbsp;\&nbsp;`\___x___/\&nbsp;\____\/\____\&nbsp;\____\&nbsp;\____/\&nbsp;\_\&nbsp;\_\&nbsp;\_\&nbsp;\____\</div>
    <div>&nbsp;&nbsp;&nbsp;&nbsp;'\/__//__/&nbsp;&nbsp;\/____/\/____/\/____/\/___/&nbsp;&nbsp;\/_/\/_/\/_/\/____/</div>
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
    <div>***&nbsp;System&nbsp;restart&nbsp;required&nbsp;***</div>
    <div v-for="(line, index) in lineFeed" :key="index">
      <span v-if="line.hasPrompt" class="user-prompt">{{ userPrompt }}</span>
      {{ line.text }}
    </div>

    <div v-if="allowInput" class="user-input">
      <span class="user-prompt" :class="{ 'add-buffer': !userInput }">{{ userPrompt }}</span>
      <span>{{ userInput }}</span>
      <span class="cursor" :class="{ blink: !typing }" :style="{ left: `${cursorOffset}px` }">&nbsp;</span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

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
      userPrompt: 'root@grantholle.com:$',
      lineFeed: [],
      typing: false,
      cursorOffset: -8,
      userAgent: window.navigator.userAgent,
      allowInput: false,
      commands: [
        'reboot'
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

      this.lineFeed.push({
        text: `Current Login: ${moment().format('ddd MMM DD HH:mm:ss YYYY')} from ${data.ip}`
      })

      setTimeout(() => this.allowInput = true, 750)
    },
    handleInput (event) {
      console.log(event.key)
      if (!this.typing) {
        this.typing = true
      }

      switch (event.key) {
        case 'Tab':
          event.preventDefault()

          const command = this.commands.find(c => c.match(new RegExp(`^${this.userInput}`, 'i')))

          if (command) {
            this.userInput = command + ' '
          }

          this.resume()
          break
        case 'Enter':
          this.lineFeed.push({
            hasPrompt: true,
            text: this.userInput
          })

          this.userInput = ''
          window.scrollTo(0, document.body.scrollHeight)
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
          this.cursorOffset = this.cursorOffset < -8 ? this.cursorOffset : -8
          break
      }
    },
    handleClick (event) {
      this.$el.children[0].focus()
    },
    blur (event) {
      event.target.focus()
    },
    resume () {
      setTimeout(() => this.typing = false, 150)
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

body {
  background: $black;
  color: $white;
  padding: 8px 10px;
}

.cli {
  width: 100%;
  font-family: 'Inconsolata', monospace;
  position: relative;

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

.user-prompt {
  color: #93a1a1
}

.add-buffer {
  display: inline-block;
  margin-right: 6px;
}
</style>
