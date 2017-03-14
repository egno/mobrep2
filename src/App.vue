<template>
  <div id="app">
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
    }
  },
  mounted () {
    this.checkRoute()
  }
}
</script>

<style>
.container {
  position: fixed;
  height: 100%;
  width: 100%;
  max-width: 40em;
}
</style>
