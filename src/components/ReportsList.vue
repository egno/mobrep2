<template>
<div class="container">
  <div class="row">
    <p><small>
Система работает в тестовом режиме.<br>Если обнаружите ошибки, прошу <a :href="'mailto:help@katren.ru?subject=datazen. Список отчётов&body='+encodeURIComponent(`

--------------------
Браузер:
` + JSON.stringify(info, null, '  ') + `
Данные:
`+JSON.stringify(data, null, '  '))">сообщить о них в техподдержку</a>
    </small>
    </p>
  </div>
  <div class="row">
    <router-link :to="{ name: 'ReleaseNotes'}"><button type="submit" class="btn"><span class="fa fa-info fa-lg" aria-hidden="true"></span></button></router-link>
  </div>
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
  <div class="col" v-if="(reports.length === 0) && loaded">
    <div class="row">
      Нет доступных отчётов. <a :href="'mailto:help@katren.ru?subject=datazen. Нет доступных отчетов&body=DATA:%20'+encodeURIComponent(JSON.stringify(data, null, ' '))">Обратитесь в службу поддержки</a>
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
import { BrowserDetect } from '@/services/os'

export default {
  data () {
    return {
      uri: '',
      data: [],
      loaded: false,
      maxWidth: 100,
      smallScreen: false
    }
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'tokenName',
      'appTitle'
    ]),
    reports () {
      return reports.filter(x => this.data.reduce((r, xx) => r || (xx.name === x.uri), false))
        .map((x, i) => {
          x.path = (this.smallScreen) ? 'report' : 'table'
          return x
        }
      )
    },
    info () {
      return BrowserDetect.info()
    },
    noReportsFound () {
      return (reports.length === 0)
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
        this.$http.get(this.uri, options)
        .then(
          (response) => {
            return response.json()
          },
          (response) => {
            this.logOut()
          }
        )
        .then(
          (data) => {
            this.data = data
            this.loaded = true
          }
        )
      }
    }
  },
  mounted () {
    window.document.title = this.appTitle
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
