<template>
<div class="container">
  <h1>Отчёты</h1>
  <section class="row" v-if="reports.length > 0">
    <div class="columns">
      <ul class="list-group">
        <li v-for="report in reports" class="list-group-item">
          <router-link :to="{ name: report.path, params: { name: report.name }}">{{ report.caption }}</router-link>
        </li>
      </ul>
    </div>
  </section>
</div>
</template>

<script>
import { reports } from '@/reports'

export default {
  computed: {
    reports () {
      return reports
    }
  }
}
</script>
