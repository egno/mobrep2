<template>
  <div id="app"
  <!-- v-touch:doubletap="toggleFullScreen" -->
  >
    <div class="container">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'app',
  watch: {
    '$route': 'checkRoute',
    'checkLogIn': 'checkRoute'
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'backRoute'
    ])
  },
  methods: {
    ...mapActions([
      'setBackRoute'
    ]),
    checkRoute () {
      if (!this.checkLogIn) {
        if (this.$route.path !== this.backRoute) {
          this.setBackRoute(this.$route.path)
        }
        this.$router.push('/login')
      } else {
        if (this.backRoute) {
          this.$router.push(this.backRoute)
          this.setBackRoute(false)
        }
      }
    },
    exitFullScreen () {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    },
    eventListener (e) {
      e.stopPropagation()
      // e.preventDefault()
    },
    setFullScreen (el) {
      if (el.requestFullscreen) {
        el.requestFullscreen()
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen()
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen()
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen()
      }
    },
    toggleFullScreen () {
      if (!document.fullscreenElement && !document.msFullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        this.setFullScreen(document.documentElement)
      } else {
        this.exitFullScreen()
      }
    }
  },
  mounted () {
    this.checkRoute()
    // window.addEventListener('touchmove', this.eventListener)
    // window.addEventListener('touchstart', this.eventListener)
  },
  beforeDestroy () {
    // window.removeEventListener('touchmove', this.eventListener)
    // window.removeEventListener('touchstart', this.eventListener)
  }
}
</script>

<style>
.container {
  position: fixed;
  height: 100%;
  width: 100%;
}
</style>
