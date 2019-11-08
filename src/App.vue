<template>
  <div id="app">
    <Toolbar :isLoggedIn="isLoggedIn"></Toolbar>
    <vue-headful title="Analytics v2" description="Analytics v2" ></vue-headful>
    <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
    <router-view/>
    <Footer text="Copyright 2019 - Motion-S S.A. All rights reserved." />
  </div>
</template>

<script>
import Footer from '@/components/TheFooter.vue'
import Toolbar from '@/components/TheHeader.vue'

import { authService } from '@/_services';
import { Role } from '@/_helpers';

export default {
  name: 'app',
  components: {
    Footer,
    Toolbar
  },
  computed: {
    alert () {
      return this.$store.state.alert
    },
    isAdmin () {
      return this.currentUser && this.currentUser.role === Role.Admin;
    },
    isLoggedIn() {
      return this.currentUser !== null;
    }
  },
  data () {
    return {
      currentUser: null
    };
  },
  created () {
    authService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  },
  watch:{
    $route (to, from){
      // clear alert on location change
      this.$store.dispatch('alert/clear');
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Dosis&display=swap');

  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: 'Dosis', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  html, body {
    height: 100%;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }

  .infoLegend {padding: 6px 8px;font: 14px/16px Arial, Helvetica, sans-serif;background: white;background: rgba(255,255,255,0.8);box-shadow: 0 0 15px rgba(0,0,0,0.2);border-radius: 5px;}
  .infoLegend h4 { margin: 0 0 5px; color: #777; }
  .legendLegend {text-align: left;line-height: 18px;color: #555;}
  .legendLegend i { width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7; }
</style>
