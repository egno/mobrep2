<template>
  <div class="col">
    <div class="row">
      <p><small>
        Система работает в тестовом режиме.<br>Если обнаружите ошибки, прошу отнестить с пониманием и сообщить о них <a href="mailto:shelemetyev2katren.ru">Александру Шелеметьеву</a>
      </small>
      </p>

    </div>
    <div class="row">
      <h1>
          Вход
      </h1>
    </div>
    <div class="row">
      <div v-if="!checkLogIn">
        <form>
          <div class="form-group">
            <label for="email">Учётная запись</label>
            <input v-model.lazy="form.email" name="username" type="email"
            class="form-control" id="email" placeholder="email"
             @keyup.enter="gotoPassword"/>
            <small id="emailHelp" class="form-text text-muted">Введите email, связанный с рабочей учётной записью</small>
          </div>
          <div class="form-group">
            <label for="password">Пароль</label>
            <input v-model.lazy="form.pass" name="password" type="password"
            class="form-control" id="password" ref="password" placeholder="Пароль"
            @keyup.enter="tryLogIn"/>
          </div>
          <div>
            <p>
              {{ message }}
            </p>
            <p v-if="help">
              Обратитесь в техподдержку <a href="mailto:help@katren.ru">help@katren.ru</a> с заявкой на включение вас в группу пользователей СмартГланс (Nsk-Resource-SmartGlanceUser)
            </p>
          </div>
          <button type="submit" class="btn btn-primary" :disabled='waitStatus' @click="tryLogIn" @keyup.enter="tryLogIn">Войти</button>
        </form>
      </div>
      <div v-if="checkLogIn">
        <button type="submit" class="btn" @click="goHome"><span class="fa fa-home fa-lg" aria-hidden="true"></span></button>
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
    ]),
    help () {
      return this.message === 'Доступ запрещён'
    }
  },
  watch: {
    'token': 'checkToken'
  },
  methods: {
    ...mapActions([
      'logIn',
      'logOut'
    ]),
    goHome () {
      this.$router.push('/')
    },
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
            this.message = 'Получаю ответ от сервера...'
            if (response.json()) {
              this.message = response
              return response.json()
            } else {
              this.message = 'Ответ не удалось распознать'
            }
          },
          (response) => {
            this.message = 'Ошибка авторизации'
            this.logOut()
            this.waitStatus = false
          }
        )
        .then((data) => {
          this.message = 'Ответ получен'
          if ((data) && (data.token)) {
            this.message = 'Доступ разрешён'
            this.token = data.token
          } else {
            this.message = 'Доступ запрещён'
            this.logOut()
            this.waitStatus = false
          }
        },
        (data) => {
          this.message = 'Не удалось запросить права доступа'
        }
      )
    }
  }
}
</script>
