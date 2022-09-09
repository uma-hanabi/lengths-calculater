<template>
  <div id="app">
    <SkillLengths/>
  </div>
</template>

<script>
import SkillLengths from './components/SkillLengths.vue'

export default {
  name: 'App',
  components: {
    SkillLengths
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
