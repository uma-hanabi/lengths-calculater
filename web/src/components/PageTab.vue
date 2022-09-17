<template>
    <div class="tabs">
        <el-tabs v-model="activeTab" type="card" @tab-click="toggleTab">
            <el-tab-pane label="星座杯計算" name="championshipSkillLengths">
                <ChampionsMeeting v-if="activeTab == 'championshipSkillLengths'" @getSkillCount="getSkillCountFromChild"/>
            </el-tab-pane>
            <el-tab-pane label="自定義計算" name="customizeSkillLengths">
                <SkillLengths v-if="activeTab == 'customizeSkillLengths'" @getSkillCount="getSkillCountFromChild"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
// 引入子组件
import SkillLengths from './SkillLengths.vue';
import ChampionsMeeting from './ChampionsMeeting.vue';
export default {
    name: 'PageTab',
    data () {
        return {
            activeTab: 'championshipSkillLengths'
        };
    },
    components: { 
        SkillLengths,
        ChampionsMeeting
    },
    mounted(){
        let name = sessionStorage.getItem('currentTab') 
        if(name){
            this.activeName = name
        }
    },
    beforeRouteLeave(to, from, next){
        sessionStorage.removeItem('currentTab')
        next()
    },
    methods: {
        toggleTab: function(tab) {
            sessionStorage.setItem('currentTab', tab.name)
            this.activeTab = tab.name;
            this.resetSkillCount();
        },
        getSkillCountFromChild: function(val) {
            this.$emit("getSkillCount", val);
        },
        resetSkillCount: function() {
            this.$emit("getSkillCount", 0);
        }
    }
}
</script>