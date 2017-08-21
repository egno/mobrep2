<template>
  <div class="">
    <div class="">
      <p><small>
  Система работает в тестовом режиме.<br>Если обнаружите ошибки, прошу <a :href="'mailto:help@katren.ru?subject=datazen. Release notes'">сообщить о них в техподдержку</a>
      </small>
      </p>

    </div>
    <div class="row">
      <div class="col">
        <button type="submit" class="btn" @click="goHome"><span class="fa fa-home fa-lg" aria-hidden="true"></span></button>
      </div>
    </div>
    <h1>Список изменений</h1>
    <div
    v-for="rel in releasenotes"
    >
      <h4>
        {{rel.date}}
      </h4>
      <ul>
        <li
        v-for="note in rel.notes"
        >
          {{note}}
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { releasenotes } from '@/releasenotes'
export default {
  computed: {
    releasenotes () {
      return releasenotes
    }
  },
  methods: {
    goHome () {
      this.$router.push('/')
    }
  }
}
</script>
