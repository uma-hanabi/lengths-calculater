<template>
  <div id="app" v-cloak class="container mx-auto flex items-center flex-col mt-10">
    <header>
        <h1 class="text-5xl font-black text-center" style="display: inline-block;">最大身距計算</h1>
        <el-tooltip style="display: inline-block;" class="text-1xl item" placement="right-start">
          <i class="el-icon-info" @click="test"/>
          <div slot="content" style="width:200px">{{ info }}</div>
        </el-tooltip>
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
      info: "\
      基於ほぺ桑製作並由羅姆大整理的身距表計算工具，\
      使用前建議先去羅姆頻道上課\
      若兩者有一者未更新，此工具也會無法提供星座杯計算，\
      有任何建議或bug回報可直接發pr或私訊discord:火花#0418，遊戲id:496247738\
      "
    };
  },
  methods: {
    test: function() {
      console.log("test")
    }
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
