<template>
  <div class="container">
    <div class="row">
      <h1>
          Вход
      </h1>
    </div>
    <div class="row">
      <div v-if="!checkLogIn">
        <div class="form-group">
          <label for="email">Учётная запись</label>
          <input v-model.lazy="form.email" type="email" class="form-control" id="email" placeholder="email" @keyup.enter="gotoPassword"/>
          <small id="emailHelp" class="form-text text-muted">Введите email, связанный с рабочей учётной записью</small>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input v-model.lazy="form.pass" type="password" class="form-control" id="password" ref="password" placeholder="Пароль" @keyup.enter="tryLogIn"/>
        </div>
        <div>
          <p>
            {{ message }}
          </p>
        </div>
        <button type="submit" class="btn btn-primary" :disabled='waitStatus' @click="tryLogIn" @keyup.enter="tryLogIn">Войти</button>
      </div>
      <div v-if="checkLogIn">
        <button type="submit" class="btn btn-primary" @click="logOut">Выйти</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      uri: 'rpc/login',
      token: '',
      message: '',
      waitStatus: false,
      form: {
        email: '',
        pass: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'checkLogIn'
    ])
  },
  watch: {
    'token': 'checkToken'
  },
  methods: {
    ...mapActions([
      'logIn',
      'logOut'
    ]),
    gotoPassword () {
      this.$refs.password.focus()
      this.$refs.password.select()
    },
    tryLogIn () {
      this.waitStatus = true
      this.message = 'Подождите, проверяю права доступа...'
      this.getTocken()
    },
    checkToken () {
      if (this.token) {
        this.logIn(this.token)
        this.waitStatus = false
        this.message = ''
      }
    },
    getTocken () {
      this.$http.post(this.uri, this.form)
        .then(
          (response) => {
            return response.json()
          },
          (response) => {
            this.message = 'Ошибка авторизации'
            this.logOut()
            this.waitStatus = false
          }
        )
        .then((data) => {
          if ((data) && (data.token)) {
            this.token = data.token
          } else {
            this.message = 'Доступ запрещён'
            this.logOut()
            this.waitStatus = false
          }
        }
      )
    }
  }
}
</script>
