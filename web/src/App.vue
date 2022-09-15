<template>
  <div id="app">
    <TopBlock :skillCount="skillCounts"/>
    <PageTab @getSkillCount="getSkillCountFromChild"/>
  </div>
</template>

<script>
import PageTab from './components/PageTab.vue'
import TopBlock from './components/TopBlock.vue'

export default {
  name: 'App',
  components: {
    PageTab,
    TopBlock
  },
  data() {
    return {
      skillCounts: 0
    }
  },
  methods: {
    getSkillCountFromChild: function(val) {
      this.skillCounts = val;
    }
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
