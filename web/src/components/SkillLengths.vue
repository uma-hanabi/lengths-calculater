<template>
  <div id="app" v-cloak class="container mx-auto flex items-center flex-col mt-10">
  <header class="text-center">
    <h1 class="text-5xl font-black">最大身距計算</h1>
    <p class="text-xl font-semibold mb-8">目前總共 {{ items.length }} 個技能</p>
  </header>

  <main class="mt-3">
    <label for="total_skill_pt">擁有PT: </label>
    <input id="total_skill_pt" type="text" placeholder="Add total skill points" autofocus ref="addskill" v-model="totalSkillPoint"
      v-on:input="totalSkillPoint=onlyNumber(totalSkillPoint)"
      class="bg-gray-200 focus:bg-white border-black border-solid border-2 px-2 py-1 w-full mb-4 hover:bg-white"
    />
    <form @submit.prevent="addItem">
      <label for="skill_name">技能名稱: </label>
      <input id="skill_name" type="text" placeholder="Add skill name" autofocus ref="addskill" v-model="skillName"
        class="bg-gray-200 focus:bg-white border-black border-solid border-2 px-2 py-1 w-full mb-4 hover:bg-white"
      />
      <label for="skill_cost">技能PT: </label>
      <input id="skill_cost" type="text" placeholder="Add skill cost" autofocus ref="addskill" v-model="skillCost"
        v-on:input="skillCost=onlyNumber(skillCost)"
        class="bg-gray-200 focus:bg-white border-black border-solid border-2 px-2 py-1 w-full mb-4 hover:bg-white"
      />
      <label for="skill_lengths">馬身身距: </label>
      <input id="skill_lengths" type="text" placeholder="Add skill lengths" autofocus ref="addskill" v-model="skillLengths"
        v-on:input="skillLengths=onlyNumber(skillLengths)"
        class="bg-gray-200 focus:bg-white border-black border-solid border-2 px-2 py-1 w-full mb-4 hover:bg-white"
      />

      <button class="button">新增</button>
    </form>
    <div class="t">
    <button class="submitButton" v-on:click="calculateLengths()">計算</button>
    </div>

    <ul class="max-w-xs">
      <span v-if="items.length > 0" >目前技能</span>
      <li v-for="(item, index) in items" class="my-4 flex items-left justify-end" :key='index'>
        <span v-if="! item.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black" @click="enableEdit(index)">{{ item.title }},</span>
        <input v-else type="text" v-model="item.title" :ref="'skill'" @keyup.enter="disableEdit(index)" @blur="disableEdit(index)" class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white">
        <span v-if="! item.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black" @click="enableEdit(index)">{{ item.cost }},</span>
        <input v-else type="text" v-model="item.cost" :ref="'skill'" @keyup.enter="disableEdit(index)" @blur="disableEdit(index)" class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white">
        <span v-if="! item.edit" class="px-2 py-1 mr-2 w-40 border-transparent border-solid border-2 hover:border-black" @click="enableEdit(index)">{{ item.lengths }}</span>
        <input v-else type="text" v-model="item.lengths" :ref="'skill'" @keyup.enter="disableEdit(index)" @blur="disableEdit(index)" class="px-2 py-1 mr-2 w-40 border-black border-transparent focus:border-black border-solid border-2 focus:bg-white">
        <button class="button" @click="enableEdit(index)">編輯</button>
        <button class="button" @click="removeItem(index)">刪除</button>
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
  name: 'SkillLengths',
  props: {
    msg: String
  },
  data() {
    return {
      totalSkillPoint: "",
      skillName: "",
      skillCost: "",
      skillLengths: "",
      items: [],
      result: [],
      maxLengths: 0,
      isError: false
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
    background-color: #fff;
    border-radius: 5px;
    color: black;
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
