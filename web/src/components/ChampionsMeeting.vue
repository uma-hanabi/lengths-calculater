<template>
  <div id="app" v-cloak class="container mx-auto flex items-center flex-col mt-10">
  
  <main class="mt-3">
    <el-form class="elform" ref="form" label-width="auto" >
        <el-form-item class="elform" label="總PT">
          <el-input id="total_skill_pt" type="text" placeholder="Add total skill points" autofocus ref="addskill" v-model="totalSkillPoint"
            @input="totalSkillPoint=onlyNumber(totalSkillPoint)"
            class="elform"
          />
        </el-form-item>
        <el-form-item label="技能名稱">
            <el-select v-model="skillName" style="width:100%;" collapse-tags placeholder="choose skill" filterable @input="sync(skillName)">
                <el-option v-for="item in skillListShow" :value="item.name" :key="item.name" :label="item.name"/>
            </el-select>
        </el-form-item>
        <el-form-item label="技能折扣(%)">
            <el-select v-model="skillDiscount" style="width:100%;" collapse-tags placeholder="choose skill discount" filterable @input="updateSkillCost()">
                <el-option v-for="item in skillDiscountList" :value="item" :key="item"/>
            </el-select>
        </el-form-item>
        <el-form-item label="技能消耗PT">
          <span v-if="skillName != ''" class="el-form-item__content">{{ skillCost }}</span>
          <span v-else class="el-form-item__content">{{ skillCost }}</span>
        </el-form-item>
        <el-form-item label="技能身距">
          <span class="el-form-item__content">{{ skillLengths }}</span>
        </el-form-item>
    </el-form>
    <div>
      <el-button style="width:100px;height:30px;" class="button" @click="addItem">新增</el-button>
      <el-button style="width:100px;height:30px;" class="submitButton" v-on:click="calculateLengths()">計算</el-button>
    </div>

    <ul class="max-w-xs">
      <span v-if="items.length > 0" >目前技能</span>
      <li v-for="(item, index) in items" class="my-4 flex items-left justify-end" :key='index'>
        <span v-if="! item.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black" @click="enableEdit(index)">{{ item.title }},</span>
        <input v-else type="text" v-model="item.title" :ref="'skill'" @keyup.enter="disableEdit(index)"  class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white">
        <span v-if="! item.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black" @click="enableEdit(index)">{{ item.cost }},</span>
        <input v-else type="text" v-on:input="item.cost=onlyNumber(item.cost)" v-model="item.cost" :ref="'skill'" @keyup.enter="disableEdit(index)"  class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white">
        <span v-if="! item.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black" @click="enableEdit(index)">{{ item.lengths }}</span>
        <input v-else type="text" v-on:input="item.lengths=onlyNumber(item.lengths)" v-model="item.lengths" :ref="'skill'" @keyup.enter="disableEdit(index)"  class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white">
        <el-button v-if="! item.edit" class="button" @click="enableEdit(index)">編輯</el-button>
        <el-button v-else class="button" @click="disableEdit(index)">更新</el-button>
        <el-button class="button" @click="removeItem(index)">刪除</el-button>
      </li>
    </ul>

    <ul class="max-w-xs">
    <span v-if="result.length > 0" >最大馬身: {{ maxLengths }}</span>
      <li v-for="(item, index) in result" class="my-4 flex result-right justify-end" :key='index'>
        <span class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ item.title }},</span>
        <span class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ item.cost }},</span>
        <span class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black">{{ item.lengths }}</span>
      </li>
    </ul>

    <p class="error px-2 py-1 rounded" v-if="isError">☝This skill already exists.</p>
  </main>

  <div class="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3 mt-12" role="alert">
</div>

  <!-- <pre>{{ $data }}</pre> -->
</div>
</template>

<script>
export default {
  name: 'NewSkillLengths',
  data() {
    return {
      totalSkillPoint: "",
      skillName: "",
      skillCost: 0,
      skillLengths: 0,
      skillDiscount: 0,
      items: [],
      result: [],
      maxLengths: 0,
      isError: false,
      dropdownValue: "",
      skillDict: {"test1": {"name":"test1", "cost":100, "lengths": 1.2}, "test2":{"name":"test2", "cost":101, "lengths": 1.3}, "test3": {"name":"test3", "cost":102, "lengths": 1.4}},
      skillListAll: [{"name":"test1", "cost":100, "lengths": 1.2}, {"name":"test2", "cost":101, "lengths": 1.3}, {"name":"test3", "cost":102, "lengths": 1.4}],
      skillListShow: [{"name":"test1", "cost":100, "lengths": 1.2}, {"name":"test2", "cost":101, "lengths": 1.3}, {"name":"test3", "cost":102, "lengths": 1.4}],
      skillDiscountList: [0, 10, 20, 30, 35, 40]
    };
  },
  methods: {
    addItem: function() {
      var skillName = this.skillName
      var skillCost = this.skillCost
      var skillLengths = this.skillLengths
      if (skillName == "" || skillCost == "" ||skillLengths == "") {
        return false;
      }
      if (this.itemExist(skillName) === true) {
        this.isError = true;
        return false;
      }
      this.items.push({
        title: skillName,
        cost: this.skillCost,
        lengths: this.skillLengths,
        edit: false
      });

      this.skillName = ""
      this.skillCost = ""
      this.skillLengths = ""
      this.isError = false;
      this.setSkillCount()
    },
    removeItem: function(index) {
      this.items.splice(index, 1);
      this.$refs.addskill.focus();
    },
    enableEdit: function(index) {
      this.items[index].edit = true;
      this.$nextTick(() => {
        let input = this.$refs.skill[0];
        input.focus();
      });
    },
    disableEdit: function(index) {
      this.items[index].edit = false;
    },
    itemExist: function(value) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].title === value) {
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
      var memo = [];
      var items = this.items
      var capacity = this.totalSkillPoint
      if (capacity == "") {
        return false;
      }
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
      return value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
    },
    setSkillCount: function() {
      this.$emit("getSkillCount", this.items.length);
    },
    dropdownSearch: function() {
        let _this = this;
        _this.skillNameMeta = [];
        _this.skillListShow = _this.skillListAll.filter(_this.filterSearch);
    },
    filterSearch: function(item) {
        console.log(this.dropdownValue);
        return item.includes(this.dropdownValue);
    },
    sync: function(skillName) {
        this.skillCost = this.skillDict[skillName]["cost"]
        this.skillLengths = this.skillDict[skillName]["lengths"]
        this.skillDiscount = 0
    },
    updateSkillCost: function() {
        this.skillCost = this.skillCost - this.skillCost*this.skillDiscount/100
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
