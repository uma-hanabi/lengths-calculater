<template>
  <div id="app" v-cloak class="container mx-auto flex items-center flex-col mt-10">
    <header class="text-center">
        <h1 class="text-5xl font-black">最大身距計算</h1>
        <p class="text-xl font-semibold mb-8">目前總共 {{ skillCount }} 個技能</p>
    </header>
    </div>
</template>

<script>
export default {
  name: 'TopBlock',
  props: ["skillCount"],
  data() {
    return {
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  display: inline-block;
  list-style-type: none;
  padding: 2px 3px;
}
li {
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>
