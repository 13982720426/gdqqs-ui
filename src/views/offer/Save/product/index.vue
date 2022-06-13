<template>
  <div class="offer-save-product">
    <OfferSaveTitle
        title="产品信息"
    >
      <el-form
          ref="form"
          :model="formData"
          label-position="left"
      >
        <div v-for="(workshopItem) in formModel">
          <div>
            车间名称: {{ workshopItem.name }}
          </div>
          <div class="product-item" v-for="(amountItem) in workshopItem.amount">
            <el-row :gutter="12">
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起重机类型">
                  <el-select v-model="amountItem.type" @change="onCraneChange(workshopItem.key, amountItem.type)">
                    <el-option
                        v-for="item in crane"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="操作方式">
                  <el-select v-model="amountItem.handle">
                    <el-option
                        v-for="item in handleType"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="起升重量">
                  <el-select v-model="amountItem.weightData">
                    <el-option
                        v-for="item in weightData"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :labelWidth="100" label="工作级别">
                  <el-select v-model="amountItem.level">
                    <el-option
                        v-for="item in levelData[workshopItem.key]"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="amountItem.type && amountItem.handle && amountItem.weight && amountItem.level">
              <el-button @click="selectPart">选择部件</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </OfferSaveTitle>
    <el-dialog
        v-model="dialogVisible"
        width="30%"
        title="选择部件"
    >
      <el-table
          style="width: 100%"
      >
        <el-table-column prop="offerName" label="产品"/>
        <el-table-column prop="offerCode" label="部件" width="180" />
        <el-table-column prop="createTime" label="数量" width="160" />
        <el-table-column prop="customerName" label="单位" width="180" />
        <el-table-column prop="contractPrice" label="品牌" width="180" />
        <el-table-column prop="contractPrice" label="部件编码" width="180" />
        <el-table-column prop="contractPrice" label="税率" width="180" />
        <el-table-column prop="contractPrice" label="金地球工厂价" width="180" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup name="OfferSaveProduct">
import OfferSaveTitle from '../../components/Title'
import useOfferStore from '@/store/modules/offer'
import {onMounted} from "vue";
import {getDicts} from "@/api/system/dict/data";

const offerStore = useOfferStore()

const crane = ref([])
const handleType = ref([])
const weightData = ref([])
const levelData = ref({})
const dialogVisible = ref(false)

const formModel = reactive([])

const selectPart = (key) => {
  dialogVisible.value = true
}

const onCraneChange = async (value, type) => {
  let data = []
  if (type === '1') {
    console.log(await getDict('q_single_crane_work_level'))
    data = await getDict('q_single_crane_work_level')
  } else if (type === '2') {
    console.log(await getDict('q_double_crane_work_level'))
    data = await getDict('q_double_crane_work_level')
  } else if (type === '3') {
    data = await getDict('q_susp_crane_work_level')
  }

  levelData.value[value] = data
  console.log(levelData.value)
}

const getDict = (type) => {
  return new Promise((resolve) => {
    getDicts(type).then(resp => {
      if (resp.code === 200) {
        const data = resp.data.map(item => ({
          dictCode: item.dictCode,
          dictLabel: item.dictLabel,
          dictType: item.dictType,
          status: item.status,
          dictValue: item.dictValue
        }))
        resolve(data)
      }
    })
  })
}

onMounted(() => {
  const workshopData = offerStore.getCustomerData().workshopInfo

  workshopData.forEach(item => {
    formModel.push({
      name: item.name,
      key: item.key,
      amount: new Array(item.amount).fill(1).map(b => ({
        type: undefined,
        handle: undefined,
        weight: undefined,
        level: undefined
      }))
    })
  })

  getDict('q_crane_type').then(resp => {
    crane.value = resp
  })

  getDict('q_oper_mode').then(resp => {
    handleType.value = resp
  })

  getDict('q_lift_weight').then(resp => {
    weightData.value = resp
  })
})

</script>

<style lang="scss" scoped>
.offer-save-product {

  .product-item {
    background-color: #FAFAFA;
    padding: 12px 8px;
    margin: 12px 0;
  }

  .title {
    margin-bottom: 24px;
  }
}
</style>