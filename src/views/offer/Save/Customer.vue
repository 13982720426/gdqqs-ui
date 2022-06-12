<!-- 客户信息 -->
<template>
  <div class="offer-save-customer">
    <el-form
        :model="formData"
        label-position="left"
    >
      <OfferSaveTitle title="客户信息">

        <el-form-item label="客户名称" required>
          <el-select>

          </el-select>
          <el-button>
            新增
          </el-button>
        </el-form-item>
        <el-form-item v-if="!!dataSource.length">
          <List :dataSource="dataSource" @change="onListChange"/>
        </el-form-item>

      </OfferSaveTitle>
      <OfferSaveTitle title="车间信息">
        <div v-for="(item, index) in workList" class="work-list-item">
          <el-form-item label="车间名称" required>
            <el-input style="width: 210px;"></el-input>
            <el-button v-if="index === 0" @click="addWork()">添加车间信息</el-button>
            <el-button v-if="index !== 0" @click="removeWork(item.key)">删除</el-button>
          </el-form-item>
          <div class="work-list-item-form">
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="轨道型号" required>
                  <el-input style="width: 210px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="车间长度(m)" required>
                  <el-input style="width: 210px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="车间跨度(m)" required>
                  <el-input style="width: 210px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起升高度(m)" required>
                  <el-input style="width: 210px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起重机数量" required>
                  <el-input style="width: 210px;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </OfferSaveTitle>
    </el-form>
  </div>
</template>

<script setup name="CustomerInformation">
import OfferSaveTitle from '../components/Title'
import List from './CustomerList'
import {ref, reactive} from 'vue';


const dataSource = ref([])

const formData = reactive({
  customer: '',
  customerItem: {},
  workshop: []
})

const rules = reactive({
  customer: [
    {required: true, message: '请选择客户', trigger: 'blur'}
  ]
})

const DEFAULT_WORK_ITEM = {
  key: '1',
  railModel: '',
  workshopLength: undefined,
  workshopSpan: undefined,
}

let workList = ref([])
workList.value.push(DEFAULT_WORK_ITEM)

const onListChange = ({id, node}) => {
  console.log(id)
}

const addWork = () => {
  workList.value.push({
    ...DEFAULT_WORK_ITEM,
    key: new Date().valueOf()
  })
}

const removeWork = (key) => {
  workList.value = workList.value.filter(item => item.key !== key)
}


</script>

<style lang="scss" scoped>
.offer-save-customer {
  .title {
    margin-bottom: 24px;
  }

  .work-list-item {

    .work-list-item-form {
      background-color: #FAFAFA;
      padding: 12px 8px;
      margin: 12px 0;
    }
  }

}
</style>