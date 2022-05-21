<template>
  <div class="password-section" v-if="!loggedIn">
    <div class="password-label">
      Password
    </div>
    <input type="password" class="password-input" v-model="password" placeholder="abc123" @keyup.enter="checkPassword"/>
    <div class="password-error" v-if="passwordError">
      {{passwordError}}
    </div>
    <div>
      <button class="password-submit" @click="checkPassword">
          Submit
      </button>
    </div>
  </div>
  <Links v-else/>
  <router-view />
</template>

<script>
import Links from './Links.vue'

export default {
  name: 'Home',
  components: {
    Links
  },
  data() {
    return {
      loggedIn: false,
      password: '',
      passwordError: '',
    }
  },
  methods: {
    async checkPassword() {
      const url = 'https://link.bg-cloud.workers.dev/api/auth/' + this.password
      fetch(url)
      .then(res => res.json())
      .then(passwordIsCorrect => {
        if (passwordIsCorrect)
          this.loggedIn = true
        else
          this.passwordError = 'Incorrect password'
      })
    }
  }
}
</script>

<style>
.password-input{
    margin: 10px;
}
</style>
