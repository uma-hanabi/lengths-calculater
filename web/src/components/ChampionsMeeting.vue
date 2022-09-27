<template>
  <div id="app" v-cloak class="container mx-auto flex items-center flex-col mt-10">
  <b-alert v-model="showDismissibleAlert" variant="danger" style="float">
    {{ alertMessage }}
  </b-alert>
  <main class="mt-3">
    <el-form class="elform" ref="form" label-width="auto" >
        <el-form-item :required="true">
          <span slot="label">
            杯賽
            <el-tooltip style="display: inline-block;;" class="item" content="選擇杯賽" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
          <el-select v-model="currentChampionship" style="width:100%;" collapse-tags placeholder="choose champtionship meeting" filterable @input="syncSkillList(currentChampionship)">
              <el-option v-for="item in champtionshipList" :value="item.key" :key="item.key" :label="item.zhtw"/>
          </el-select>
        </el-form-item>

        <el-form-item :required="true">
          <span slot="label">
            腳質
            <el-tooltip style="display: inline-block;;" class="item" content="請選擇腳質" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
          <el-button :type="btnGroupState1 === true?'danger':'primary'" :checked="picked" round size="mini" @click="syncRunStyle('front_runner', 1)">
            領頭
          </el-button>
          <el-button :type="btnGroupState2 === true?'danger':'primary'" :checked="picked" round size="mini" @click="syncRunStyle('middle_of_pack_f', 2)">
            前列
          </el-button>
          <el-button :type="btnGroupState3 === true?'danger':'primary'" :checked="picked" round size="mini" @click="syncRunStyle('middle_of_pack_b', 3)">
            居中
          </el-button>
          <el-button :type="btnGroupState4 === true?'danger':'primary'" :checked="picked" round size="mini" @click="syncRunStyle('back_finisher', 4)">
            後追
          </el-button>
        </el-form-item>

        <el-form-item :required="false">
          <span slot="label">
            選項
            <el-tooltip style="display: inline-block;;" class="item" content="根據自身需求勾選即可" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
          <el-checkbox style="display: inline-block" v-model="talentGiftedChecked" @change="syncTalentGiftedCheckBox(talentGiftedChecked)">
            天賦異稟
            <el-tooltip style="display: inline-block;;" class="item" content="所有技能pt 9 折" placement="bottom-end">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-checkbox>
          <el-checkbox style="display: inline-block" v-model="exceptedValueChecked" @change="syncExceptedValueCheckBox(exceptedValueChecked)">
            考慮有效率
            <el-tooltip style="display: inline-block;" class="item" content="計算技能發動後的實際有效率期望值" placement="bottom-end">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-checkbox>
          <el-checkbox style="display: inline-block" v-model="wisdomChecked" @change="syncWisdomCheckBox(wisdomChecked)">
            考慮智力
            <el-tooltip style="display: inline-block;" class="item" content="考慮智力會影響技能發動率，若勾選考慮智力，需要額外輸入當前智力" placement="bottom-end">
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-checkbox>
        </el-form-item>

        <el-form-item v-if="wisdomChecked === true" :required="true">
          <span slot="label">
            智力
            <el-tooltip style="display: inline-block;;" class="item" content="請輸入智力" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
          <el-input id="wisdom" type="text" placeholder="1~2000" autofocus ref="addskill" v-model="wisdomValue"
            @input="wisdomValue=syncWisdom(wisdomValue)"
          />
        </el-form-item>

        <el-form-item :required="true">
          <span slot="label">
            持有PT
            <el-tooltip style="display: inline-block;;" class="item" content="建議先將必點的技能如金回點掉再輸入" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
          <el-input id="total_skill_pt" type="text" placeholder="輸入目前剩餘的技能點數" autofocus ref="addskill" v-model="totalSkillPoint"
            @input="totalSkillPoint=onlyNumber(totalSkillPoint)"
          />
        </el-form-item>

        <el-form-item :required="true">
          <span slot="label">
            技能名稱
            <el-tooltip style="display: inline-block;;" class="item" content="下拉後可打字搜尋" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
            <el-select v-model="skillName" style="width:100%;" collapse-tags placeholder="選擇技能" filterable @input="syncSkillInfo(skillName)">
                <el-option v-for="item in skillListShow" :value="item.name" :key="item.name" :label="item.name"/>
            </el-select>
        </el-form-item>

        <el-form-item :style="skillHasPreSkill==true?'display: inline-block;width:50%':'width:100%'" :required="false">
          <span slot="label">
            技能折扣(%)
            <el-tooltip style="display: inline-block;;" class="item" content="若為金技，需要額外選擇前置白技折扣" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
            <el-select v-model="skillDiscount" style="width:100%;" collapse-tags placeholder="選擇技能折扣" @input="updateSkillCost()">
                <el-option v-for="item in skillDiscountList" :value="item" :key="item"/>
            </el-select>
        </el-form-item>
        <el-form-item style="display: inline-block;width:50%;" v-if="skillHasPreSkill==true" label="前置折扣(%)">
            <el-select v-model="preSkillDiscount" style="width:100%;" collapse-tags placeholder="選擇前置白技能折扣" @input="updateSkillCost()">
                <el-option v-for="item in skillDiscountList" :value="item" :key="item"/>
            </el-select>
        </el-form-item>

        <el-form-item :required="false">
          <span slot="label">
            技能消耗PT
            <el-tooltip style="display: inline-block;;" class="item" content="顯示當前技能的消耗pt" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
          <span v-if="skillName != ''" style="display: inline-block;width:30%;" class="el-form-item__content">{{ skillCostShow }}</span>
          <span v-else style="display: inline-block;width:30%;" class="el-form-item__content">{{ skillCostShow }}</span>
        </el-form-item>

        <el-form-item :required="false">
          <span slot="label">
            技能身距
            <el-tooltip style="display: inline-block;;" class="item" content="顯示當前技能造成的身距" placement="bottom-end">
              <i class="el-icon-arrow-right"/>
            </el-tooltip>
          </span>
          <span style="display: inline-block;width:30%;" class="el-form-item__content">{{ skillLengths }}</span>
        </el-form-item>

    </el-form>

    <div>
      <el-button style="width:100px;height:30px;" class="button" @click="addItem">新增</el-button>
      <el-button style="width:100px;height:30px;" class="submitButton" v-on:click="calculateLengths()">計算</el-button>
    </div>

    <br/>
    <hr/>

    <div>
      <label style="width:10%" class="el-input">目前技能</label>
      <el-button class="button" style="display: inline-block;" @click="removeItem('all')">重置</el-button>
    </div>

    <div>
      <el-table :data="items" style="display: inline-block;width:100%;" class="table_bsm" label="123">
        <el-table-column prop="name" label="技能名稱">
          <template slot-scope="scope">
            <span v-if="! scope.row.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ scope.row.name }}</span>
            <input v-else type="text" v-model="scope.row.name" :ref="'skill'"  class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white"/>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="技能PT" style="width:5%">
          <template slot-scope="scope">
            <span v-if="! scope.row.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ scope.row.cost }}</span>
            <input v-else type="text" v-model="scope.row.cost" :ref="'skill'"  class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white"/>
          </template>
        </el-table-column>
        <el-table-column prop="lengths" label="技能身距" style="width:5%">
          <template slot-scope="scope">
            <span v-if="! scope.row.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ scope.row.lengths }}</span>
            <input v-else type="text" v-model="scope.row.lengths" :ref="'skill'"  class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" style="width:10%">
          <template slot-scope="scope">
            <el-button v-if="! scope.row.edit" class="button" @click="enableEdit(scope.$index)">編輯</el-button>
            <el-button v-else class="button" @click="disableEdit(scope.$index)">更新</el-button>
            <el-button class="button" @click="removeItem(scope.$index)">刪除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <br/>
    <hr v-if="items.length > 0"/>

    <label v-if="result.length > 0" class="el-input">最大馬身技能({{ maxLengths }})</label>
    <div>
      <el-table v-if="result.length > 0" :data="result" style="display: inline-block;width:100%;" class="table_bsm">
        <el-table-column prop="name" label="技能名稱">
          <template slot-scope="scope">
            <span class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="技能PT" style="width:5%">
          <template slot-scope="scope">
            <span class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ scope.row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lengths" label="技能身距" style="width:5%">
          <template slot-scope="scope">
            <span class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ scope.row.lengths }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </main>

  <div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 mt-12" role="alert">
</div>

  <!-- <pre>{{ $data }}</pre> -->
</div>
</template>

<script>
import skills from './data/championshipToSkillMap2022.json'
import championshipZhTwMap from './data/championshipZhTW.json'
export default {
  name: 'NewSkillLengths',
  data() {
    return {
      talentGiftedChecked: false,
      exceptedValueChecked: false,
      wisdomChecked: false,
      wisdomValue: "",
      skillHasPreSkill: false,
      alertMessage: "",
      showDismissibleAlert: false,
      picked: true,
      runStyle: "",
      currentChampionship: "Gemini",
      totalSkillPoint: "",
      skillName: "",
      upperSkillName: "",
      skillCost: 0,
      preSkillCost: 0,
      skillCostShow: 0,
      skillLengths: 0,
      skillCostBias: 1,
      skillExceptedValue: 1,
      skillDiscount: 0,
      preSkillDiscount: 0,
      items: [],
      result: [],
      maxLengths: 0,
      skillDict: {},
      skillsOrigin: skills,
      skillListShow: [],
      champtionshipList: championshipZhTwMap,
      skillDiscountList: [0, 10, 20, 30, 35, 40],
      btnGroupState1: false,
      btnGroupState2: false,
      btnGroupState3: false,
      btnGroupState4: false
    };
  },
  mounted() {
    this.syncSkillList(this.currentChampionship)
  },
  methods: {
    syncNumber: function(num) {
      let that = this
      if (num != "") {
        that.hideAlert()
      }
    },
    syncTalentGiftedCheckBox: function(value) {
      this.talentGiftedChecked = value
      if (this.skillName != "") {
        this.syncSkillInfo(this.skillName)
      }
    },
    syncExceptedValueCheckBox: function(value) {
      this.exceptedValueChecked = value
      if (this.skillName != "") {
        this.syncSkillInfo(this.skillName)
      }
    },
    syncWisdomCheckBox: function(value) {
      this.wisdomChecked = value
      if (this.skillName != "") {
        this.syncSkillInfo(this.skillName)
      }
    },
    showAlert: function(msg) {
      this.alertMessage = msg
      this.showDismissibleAlert = true
    },
    hideAlert: function() {
      this.alertMessage = ""
      this.showDismissibleAlert = false
    },
    addItem: function() {
      let that = this
      var skillName = this.skillName
      var skillCost = this.skillCostShow
      var skillLengths = this.skillLengths
      let calculatedItemList = this.items
      if (skillName == "" || skillCost == "" ||skillLengths == "") {
        return false;
      }
      if (this.itemExist(skillName) === true) {
        this.showAlert("無法新增重複技能")
        return false;
      }
      if (this.itemExist(this.upperSkillName) === true) {
        this.showAlert("已存在上位技能: " + this.upperSkillName)
        return false;
      }

      this.skillDict[skillName].forEach( function(skills) {
        // //console.log(skills)
        try {
          Object.entries(skills).map(skillInfo => {
          //console.log(skillInfo)
          skillInfo.forEach( function(item, index) {
            if (index != 0) {
              var mainSkillCost = that.calculateCost(item.cost, that.skillDiscount)
              var preSkillCost = that.calculateCost(item.preSkillCost, that.preSkillDiscount)
              calculatedItemList.push({
                name: skillInfo[0],
                cost: Math.round((mainSkillCost + preSkillCost) * that.skillCostBias),
                lengths: parseFloat(item.lengths * that.skillExceptedValue).toFixed(3),
                edit: false
              });
            }
          })
        })
        } catch (error) {
          //console.log(error)
        }
      });
      this.items = calculatedItemList
      this.hideAlert()
      this.resetSkillInfo()
      this.setSkillCount()
    },
    removeItem: function(index) {
      if (index == "all") {
        this.items = []
        return
      }
      this.items.splice(index, 1);
      this.$refs.addskill.focus();
      this.setSkillCount()
    },
    enableEdit: function(index) {
      this.items[index].edit = true;
      // this.$nextTick(() => {
      //   let input = this.$refs.skill[0];
      //   input.focus();
      // });
    },
    disableEdit: function(index) {
      this.items[index].edit = false;
    },
    itemExist: function(value) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].name === value) {
          return true;
        }
      }

      return false;
    },
    getLast: function(memo) {
      var lastRow = memo[memo.length - 1];
      return lastRow[lastRow.length - 1];
    },
    getSolution: function(memo,row,cap) {
        const NO_SOLUTION = {maxValue:0, subset:[]};
        // the column number starts from zero.
        var col = cap - 1;
        var lastItem = this.items[row];
        // The remaining capacity for the sub-problem to solve.
        var remaining = cap - lastItem.cost;

        // Refer to the last solution for this capacity,
        // which is in the cell of the previous row with the same column
        var lastSolution = row > 0 ? memo[row - 1][col] || NO_SOLUTION : NO_SOLUTION;
        // Refer to the last solution for the remaining capacity,
        // which is in the cell of the previous row with the corresponding column
        var lastSubSolution = row > 0 ? memo[row - 1][remaining - 1] || NO_SOLUTION : NO_SOLUTION;

        // If any one of the items weights greater than the 'cap', return the last solution
        if(remaining < 0){
          return lastSolution;
        }

        // Compare the current best solution for the sub-problem with a specific capacity
        // to a new solution trial with the lastItem(new item) added
        var lastValue = parseFloat(lastSolution.maxValue);
        var lastSubValue = parseFloat(lastSubSolution.maxValue);

        var newValue = lastSubValue + parseFloat(lastItem.lengths);
        if(newValue >= lastValue){
          // copy the subset of the last sub-problem solution
          var _lastSubSet = lastSubSolution.subset.slice();
          _lastSubSet.push(lastItem);
          return {maxValue: newValue, subset:_lastSubSet};
        }else{
          return lastSolution;
        }
    },
    calculateLengths: function() {
      let that = this
      var memo = [];
      var items = this.items
      var capacity = this.totalSkillPoint
      if (capacity == "") {
        that.showAlert("請輸入持有PT")
        return false;
      }
      if (items.length == 0) {
        that.showAlert("請至少新增 1 個技能")
        return false;
      }
      this.hideAlert()
      // Filling the sub-problem solutions grid.
      for (var i = 0; i < items.length; i++) {
        // Variable 'cap' is the capacity for sub-problems. In this example, 'cap' ranges from 1 to 6.
        var row = [];
        for (var cap = 1; cap <= capacity; cap++) {
          row.push(this.getSolution(memo,i,cap));
        }
        memo.push(row);
      }

      // The right-bottom-corner cell of the grid contains the final solution for the whole problem.
      var result = this.getLast(memo)
      this.result = result['subset']
      this.maxLengths = result['maxValue'];
    },
    onlyNumber: function(value) {
      var num = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
      this.syncNumber(num)
      return num
    },
    syncWisdom: function(value) {
      var num = this.onlyNumber(value)
      if (this.skillName != "" && num != "") {
        this.syncSkillInfo(this.skillName)
      }
      return num
    },
    setSkillCount: function() {
      this.$emit("getSkillCount", this.items.length);
    },
    syncSkillInfo: function(skillName) {
        var mainSkillCost = 0
        var preSkillCost = 0
        var lengths = 0
        var ptBias = 1
        var lengthsBias = 1
        var wisdomBias = 1
        var isTalentGifted = this.talentGiftedChecked
        var isCalculateExceptedValue = this.exceptedValueChecked
        var isCalculateWisdomBiad = this.wisdomChecked
        let that = this
        if (that.runStyle == "" ) {
          that.showAlert("請先選擇腳質")
          return
        }
        if (isCalculateWisdomBiad == true && that.wisdomValue == "") {
          that.showAlert("請先輸入智力")
          return
        }
        if (isTalentGifted === true) {
          ptBias *= 0.9
        }
        this.skillDict[skillName].forEach( function(skills) {
          try {
            Object.entries(skills).map(items => {
            items.forEach( function(item, index) {
              //console.log(item)
              if (index != 0) {
                //console.log(item)
                mainSkillCost = mainSkillCost + item.cost
                if (isCalculateExceptedValue === true) {
                  lengthsBias = item.skillExceptedValue
                }
                if (isCalculateWisdomBiad === true && item.isPassiveSkill !== true) {
                  wisdomBias = parseFloat(1 - 9e1 / that.wisdomValue).toFixed(3)
                }
                if (item.preSkill === true) {
                  that.skillHasPreSkill = true
                  preSkillCost = preSkillCost + item.preSkillCost
                } else {
                  that.skillHasPreSkill = false
                }
                that.upperSkillName = item.upperSkillName
                lengths = lengths + item.lengths
              }
            })
          })
          } catch (error) {
            //console.log(error)
          }
        });
        this.skillExceptedValue = lengthsBias
        this.skillCost = mainSkillCost * ptBias
        this.preSkillCost = preSkillCost * ptBias
        this.skillCostShow = (mainSkillCost + preSkillCost) * ptBias
        this.skillCostBias = ptBias
        this.skillLengths = parseFloat(lengths * lengthsBias * wisdomBias).toFixed(3)
        this.skillDiscount = 0
    },
    resetSkillInfo: function() {
        this.skillName = ""
        this.skillCost = 0
        this.skillCostShow = 0
        this.skillLengths = 0
        this.skillDiscount = 0
        this.skillHasPreSkill = false
    },
    syncSkillList: function(champtionship) {
        let tmpSkillMap = {}
        let runStyle = this.runStyle
        let skillListAll = JSON.parse( JSON.stringify(skills[champtionship]) );
        skillListAll.forEach( function (item)  {
          let tmpSkills = []
          //console.log(item)
          item.info.forEach ( function (skill) {
            //console.log(skill)
            let tmpSkill = {}
            let lengths = skill.lengths[runStyle];
            let name = item.name + skill.name
            if (lengths > 0) {
                tmpSkill[name] = {
                "cost": skill.cost,
                "lengths": skill.lengths[runStyle],
                "skillExceptedValue": skill.exceptedValue,
                "preSkill": skill.preSkill,
                "preSkillName": skill.preSkillName,
                "preSkillCost": skill.preSkillCost,
                "upperSkill": skill.upperSkill,
                "upperSkillName": skill.upperSkillName,
                "isPassiveSkill": skill.isPassiveSkill
              }
              //console.log(tmpSkill)
              tmpSkills.push(tmpSkill)
            }
          });
          //console.log(tmpSkills)
          tmpSkillMap[item.name] = tmpSkills
        });
        //console.log(tmpSkillMap)
        this.skillDict = tmpSkillMap
        this.skillListShow = skillListAll.filter( function(item) {
          let add = true
          try {
            item.info.forEach( function(ss) {
              //console.log(ss.lengths[runStyle])
              if (ss.lengths[runStyle] == 0) {
                add = false
              }
            })
          } catch (error) {
            //console.log(error)
          }
          if (add === true) {
            //console.log(item.name + " will be add")
            return {
              ...item
            }
          }
        })
        //console.log(this.skillListShow)
    },
    syncRunStyle: function(value, currentBtn) {
      this.hideAlert()
      this.runStyle = value;
      this.resetSkillInfo()
      this.syncSkillList(this.currentChampionship)
      switch(currentBtn){
        case 1:
          this.btnGroupState1 = true
          this.btnGroupState2 = false
          this.btnGroupState3 = false
          this.btnGroupState4 = false
          break
        case 2:
          this.btnGroupState1 = false
          this.btnGroupState2 = true
          this.btnGroupState3 = false
          this.btnGroupState4 = false
          break
        case 3:
          this.btnGroupState1 = false
          this.btnGroupState2 = false
          this.btnGroupState3 = true
          this.btnGroupState4 = false
          break
        case 4:
          this.btnGroupState1 = false
          this.btnGroupState2 = false
          this.btnGroupState3 = false
          this.btnGroupState4 = true
          break
      }
    },
    updateSkillCost: function() {
      var mainSkillCost = this.calculateCost(this.skillCost, this.skillDiscount)
      var preSkillCost = this.calculateCost(this.preSkillCost, this.preSkillDiscount)
      //console.log(mainSkillCost)
      //console.log(preSkillCost)
      this.skillCostShow = mainSkillCost + preSkillCost
        
    },
    calculateCost: function(cost, discount) {
      return Math.round(cost - cost*discount/100)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
    background-color: #fff;
    border-radius: 5px;
    padding: 3px 4px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
}
.button:hover {
    background-color: #008CBA; /* Green */
    color: white;
}
.submitButton {
    display: center;
    align-items: center;
    background-color: #008CBA;
    border-radius: 5px;
    color: white;
    padding: 2px 3px;
    text-align: center;
    text-decoration: none;
    }
.submitButton:hover {
    background-color: #f44336; /* Green */
    color: white;
}
.elform {
    display: left;
    align-items: left;
    border-radius: 5px;
    padding: 2px 3px;
    text-align: left;
}
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
