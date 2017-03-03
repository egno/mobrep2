<template>
  <div>
    <h2>График</h2>
    <button class="btn btn-primary" @click="fetchData">Обновить</button>
    <ul>
      <li v-for="obj in data">
        {{ obj.month }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ls } from './../services/localStore'

export default {
  data () {
    return {
      uri: 'gdlivescreen',
      data: {},
      graphs: [
        {
          bar:
          [
            {column: 'Факт,млн.р'},
            {column: 'План,млн.р'}
          ]
        },
        {
          bar:
          [
            {column: 'Выполн.%'},
            {column: 'Выпол. Год, %'}
          ]
        },
        {
          bar:
          [
            {column: '%РН'}
          ],
          saturation: 'РН.млн.р'
        },
        {
          bar:
          [
            {column: 'РН.млн.р'}
          ],
          saturation: 'РН на душу нас.'
        },
        {
          bar:
          [
            {column: 'ДЗ,млн.р'}
          ],
          saturation: 'ДЗ,%проср'
        },
        {
          bar:
          [
            {column: 'Оборот ДЗ'}
          ],
          saturation: 'ДЗ,%проср'
        },
        {
          bar:
          [
            {column: '%ЭСП'}
          ]
        },
        {
          bar:
          [
            {column: 'Скл.наимен.'}
          ],
          saturation: 'На скл,млн.р'
        },
        {
          bar:
          [
            {column: 'В пути,мл.р'}
          ],
          saturation: 'В пути,дн'
        },
        {
          bar:
          [
            {column: 'Резерв,дн'}
          ],
          saturation: 'В пути,дн'
        },
        {
          bar:
          [
            {column: 'На скл,млн.р'}
          ],
          saturation: 'На скл,дн'
        },
        {
          bar:
          [
            {column: 'Фин.цикл,дн'}
          ]
        },
        {
          bar:
          [
            {column: 'Прибыль,млн.р'},
            {column: 'ТС,млн.р'}
          ]
        },
        {
          bar:
          [
            {column: 'УП(1000ч.)'}
          ],
          saturation: 'Доля филиала'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'checkLogIn',
      'tokenName'
    ])
  },
  methods: {
    ...mapActions([
      'logOut'
    ]),
    fetchData () {
      const options = {
        headers: {}
      }
      if (this.checkLogIn) {
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
          this.data = data
        }
      )
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
