<template>
  <div class="offer-save-payment">
    <el-form ref="form" :rules="rules" :model="formModel">
      <div style="margin-bottom: 16px">
        <el-button @click="exportData(formModel, 1)">导出为WORD</el-button>
        <el-button @click="exportData(formModel, 2)">导出为PDF</el-button>
      </div>
      <OfferSaveTitle title="报价名称">
        <el-row>
          <el-col span="12">
            <el-form-item label="报价名称" prop="offerName">
              <el-input
                :disabled="offerStore.type === 'view'"
                v-model="formModel.offerName"
                placeholder="请输入报价名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </OfferSaveTitle>
      <OfferSaveTitle title="付款方式">
        <el-row gutter="24">
          <el-col span="12">
            <el-form-item label="客户类型" prop="customerType">
              <DictSelect
                :disabled="offerStore.type === 'view'"
                v-model="formModel.customerType"
                dictType="q_customer_type"
                @change="customerChange"
              />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <div>
              <el-form-item prop="contract">
                <div style="display: flex; width: 100%">
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    v-model="formModel.contract"
                    style="width: 120px; margin-right: 5px"
                    max="100"
                    min="0"
                  />
                  % 合同签订时支付
                </div>
              </el-form-item>
            </div>
            <div v-if="formModel.customerType !== '1'">
              <el-form-item prop="site">
                <div style="display: flex; width: 100%">
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    v-model="formModel.site"
                    style="width: 120px; margin-right: 5px"
                    max="100"
                    min="0"
                  />
                  % 整套起重机发运客户现场前支付
                </div>
              </el-form-item>
            </div>
            <div>
              <el-form-item prop="play">
                <div style="display: flex; width: 100%">
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    v-model="formModel.play"
                    style="width: 120px; margin-right: 5px"
                    max="100"
                    min="0"
                  />
                  % 安装调试完毕取到起重机使用登记证
                </div>
              </el-form-item>
            </div>
            <div v-if="formModel.customerType !== '1'">
              <el-form-item prop="week">
                <div style="display: flex; width: 100%">
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    v-model="formModel.week"
                    style="width: 120px; margin-right: 5px"
                    max="100"
                    min="0"
                  />
                  % 质保期到期后一周内支付
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </OfferSaveTitle>
      <OfferSaveTitle title="交货期">
        <el-form-item label=" " prop="deliveryTimeText">
          <el-input
            :disabled="offerStore.type === 'view'"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            maxlength="500"
            show-word-limit
            v-model="formModel.deliveryTimeText"
            placeholder="请输入"
          />
        </el-form-item>
      </OfferSaveTitle>
      <OfferSaveTitle title="交货方式">
        <el-form-item label=" " prop="deliveryMethodText">
          <el-input
            :disabled="offerStore.type === 'view'"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            maxlength="500"
            show-word-limit
            v-model="formModel.deliveryMethodText"
            placeholder="请输入"
          />
        </el-form-item>
      </OfferSaveTitle>
      <OfferSaveTitle title="安装条款">
        <el-form-item label=" " prop="installClauseText">
          <el-input
            :disabled="offerStore.type === 'view'"
            :autosize="{ minRows: 2, maxRows: 10 }"
            type="textarea"
            maxlength="1000"
            show-word-limit
            v-model="formModel.installClauseText"
            placeholder="请输入"
          />
        </el-form-item>
      </OfferSaveTitle>
      <OfferSaveTitle title="质保期">
        <el-form-item label=" " prop="shelfLifeText">
          <el-input
            :disabled="offerStore.type === 'view'"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            maxlength="500"
            show-word-limit
            v-model="formModel.shelfLifeText"
            placeholder="请输入"
          />
        </el-form-item>
      </OfferSaveTitle>
      <OfferSaveTitle title="有效期">
        <el-form-item label=" " prop="validityText">
          <el-input
            :disabled="offerStore.type === 'view'"
            :autosize="{ minRows: 2, maxRows: 6 }"
            type="textarea"
            maxlength="500"
            show-word-limit
            v-model="formModel.validityText"
            placeholder="请输入"
          />
        </el-form-item>
      </OfferSaveTitle>
    </el-form>
  </div>
</template>

<script setup name="OfferSavePayment">
import OfferSaveTitle from '../components/Title'
import DictSelect from './product/DictSelect'
import { defineExpose, reactive } from 'vue'
import useOfferStore from '@/store/modules/offer'

const offerStore = useOfferStore()
const { proxy } = getCurrentInstance()

const form = ref()
const formModel = reactive({
  customerType: '1',
  contract: 50,
  site: 0, //
  play: 50,
  week: 0,
  offerName: '',
  deliveryTimeText: `起重机交货期从收到预付款至现场安装调试 45 天。载荷试验及其它国家规定的测试的时间按当地市场监管局的安排而定。`, //交货期文本
  deliveryMethodText: `送货到河南许昌安装现场。`, //交货方式文本
  installClauseText: `
    设备安装可由本地劳动力完成,并无需任何特殊的工具,在设备的设计和制造过程中始终贯穿了这一原则,报价中提及的行车安装要求安装工作在正常工作时间内不间断进行，买方应准备以下几项:
        1.所有的建筑和地面工作应完备,免费配备电源及用电
        2.确保该设备可以吊装到位
        3.提供一安全区域存放设备
  `, //安装条款文本
  shelfLifeText: `质保期为从市场监管局局验收之日算起 12 个月。保证期内对材料或制造不良所引起的缺陷负责，对使用 不当引起的损坏不负责。由于正常损耗造成的损坏不在质保范围内。`, //保质期文本
  validityText: `本报价从报价日起有效期为30天。`, //有效期文本
})

const customerChange = (value) => {
  if (value === '1') {
    formModel.contract = 50
    formModel.play = 50
  } else {
    formModel.contract = 30
    formModel.play = 20
    formModel.site = 45
    formModel.week = 5
  }
}

const rules = ref({
  offerName: [{ required: true, message: '请输入报价名称', trigger: 'blur' }],
  deliveryTimeText: [
    { required: true, message: '请输入交货期', trigger: 'blur' },
  ],
  deliveryMethodText: [
    { required: true, message: '请输入交货方式', trigger: 'blur' },
  ],
  installClauseText: [
    { required: true, message: '请输入安装条款', trigger: 'blur' },
  ],
  shelfLifeText: [{ required: true, message: '请输入保质期', trigger: 'blur' }],
  validityText: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
  contract: [{ required: true, message: '请输入', trigger: 'blur' }],
  site: [{ required: true, message: '请输入', trigger: 'blur' }],
  play: [{ required: true, message: '请输入', trigger: 'blur' }],
  week: [{ required: true, message: '请输入', trigger: 'blur' }],
  customerType: [{ required: true, message: '请选择', trigger: 'blur' }],
})

offerStore.$subscribe((_, state) => {
  const { payData } = state
  if (Object.keys(payData)) {
    for (const key in payData) {
      formModel[key] = payData[key]
    }
  }
})

const getValues = async () => {
  const { customerType, offerName, contract, play, site, week } = formModel
  const data = await form.value.validate()
  if (data) {
    if (customerType === '1') {
      if (contract + formModel.play !== 100) {
        proxy.$modal.msgError('提交失败，付款方式不等于100%')
      } else {
        return {
          customerType,
          contract,
          offerName,
          play,
        }
      }
    } else {
      if (contract + play + site + week !== 100) {
        proxy.$modal.msgError('提交失败，付款方式不等于100%')
      } else return { ...formModel }
    }
  }
}

const exportData = (data, id) => {
  console.log(111, data, id)
  if (id === '1') {
    //导出为WORD
  } else {
    //导出为PDF
  }
}

defineExpose({
  getValues,
})
</script>

<style lang="scss" scoped>
.offer-save-payment {
  .title {
    margin-bottom: 24px;
  }
}
</style>
