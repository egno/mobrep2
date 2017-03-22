<template>
<div class="container">
  <h1 v-if="!smallScreen">Отчёты</h1>
  <h1 v-if="smallScreen">Графики</h1>
  <section class="row" v-if="reports.length > 0">
    <div class="columns">
      <ul class="list-group">
        <li v-for="report in reports" class="list-group-item">
          <router-link :to="{ name: report.path, params: { name: report.name }}">{{ report.caption }}</router-link>
        </li>
      </ul>
    </div>
  </section>
  <div class="col" v-if="noReportsFound">
    <div class="row">
      Нет доступных отчётов
    </div>
    <div class="row">
      <button type="submit" class="btn btn-primary" @click="logOut">Выйти</button>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { reports } from '@/reports'
import { ls } from '@/services/localStore'

export default {
  data () {
    return {
      uri: '',
      data: [],
      loaded: false,
      maxWidth: 500,
      smallScreen: false
    }
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'tokenName'
    ]),
    reports () {
      return reports.filter(x => this.data.reduce((r, xx) => r || (xx.name === x.uri), false))
        .map((x, i) => {
          x.path = (this.smallScreen) ? 'report' : 'table'
          return x
        }
      )
    },
    noReportsFound () {
      return (reports.length === 0) && this.loaded
    }
  },
  methods: {
    ...mapActions([
      'logOut'
    ]),
    checkWidth () {
      this.smallScreen = document.documentElement.clientWidth < this.maxWidth
    },
    fetchData () {
      const options = {
        headers: {}
      }
      if ((this.checkLogIn) && ls.get(this.tokenName) !== null) {
        options.headers.Authorization = 'Bearer ' + ls.get(this.tokenName)
      }
      this.$http.get(this.uri, options)
        .then(
          (response) => {
            return response.json()
          },
          (response) => {
            this.logOut()
          }
        )
        .then((data) => {
          this.loaded = true
          this.data = data
        }
      )
    }
  },
  mounted () {
    this.fetchData()
    this.$nextTick(function () {
      window.addEventListener('resize', this.checkWidth)
      this.checkWidth()
    })
  },
  updated () {
    this.checkWidth()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkWidth)
  }
}
</script>
