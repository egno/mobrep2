<template>
<div class="container">
  <div class="row">
    <p><small>Если обнаружите ошибки, прошу <a :href="'mailto:help@katren.ru?subject=datazen. Список отчётов&body='+encodeURIComponent(`

--------------------
Браузер:
` + JSON.stringify(info, null, '  ') )">сообщить о них в техподдержку</a>
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
          <router-link :to="{ name: report.path, params: { name: report.name, company: (report.companyname || 'main') }}">
            {{ (report.companyname) ? '<' + report.companyname + '> ' : '' }} {{ report.caption }}
          </router-link>
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
import { ls } from '@/services/localStore'
import { BrowserDetect } from '@/services/os'

export default {
  data () {
    return {
      uri: 'reports',
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
      return this.data
        .map((x, i) => {
          x.name = x.code
          x.path = (this.smallScreen) ? 'report' : 'table'
          return x
        }
      )
    },
    info () {
      return BrowserDetect.info()
    },
    noReportsFound () {
      return (this.reports.length === 0)
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
