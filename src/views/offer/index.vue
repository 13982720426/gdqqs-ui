<template>
  <div class="app-container offer-warp">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            v-hasPermi="['offer:add']"
            @click="jumpAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            v-hasPermi="['offer:import']"
        >导入
        </el-button>
      </el-col>
    </el-row>
    <el-tabs
      v-model="activeName"
      @tab-change="tabsChange"
    >
      <el-tab-pane label="所有报价单" name="All">
        <BaseTable type="All" />
      </el-tab-pane>
      <el-tab-pane label="已报价" name="Quoted">
        <BaseTable type="Quoted" />
      </el-tab-pane>
      <el-tab-pane label="已完成" name="Finish">
        <BaseTable type="Finish" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="offer">
import BaseTable from './BaseTable'
import {ref} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter();
const activeName = ref('All')

const tabsChange = (key) => {
  activeName.value = key
}

const jumpAdd = () => {
  router.push('/offer/save');
}

</script>

<style scoped>

</style>