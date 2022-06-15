<template>
  <div class="offer-save-payment">
    <el-form
        ref="form"
        :model="formModel"
    >
    <div>
      <el-button>导出为WORD</el-button>
      <el-button>导出为PDF</el-button>
    </div>
    <OfferSaveTitle title="付款方式">

         <el-row gutter="24">
           <el-col span="12">
             <el-form-item label="客户类型">
               <DictSelect v-model="formModel.customerType" dictType="q_customer_type" @change="customerChange"/>
             </el-form-item>
           </el-col>
           <el-col span="12">
             <div>
               <el-form-item>
                 <div style="display: flex; width: 100%;">
                   <el-input v-model="formModel.contract" style="width: 120px;margin-right: 12px;"/> 合同签订时支付
                 </div>
               </el-form-item>
             </div>
             <div v-if="formModel.customerType !== '1'">
               <el-form-item>
                 <div style="display: flex; width: 100%;">
                    <el-input v-model="formModel.site" style="width: 120px;margin-right: 12px;"/> 整套起重机发运客户现场前支付
                 </div>
               </el-form-item>
             </div>
             <div>
               <el-form-item>
                 <div style="display: flex; width: 100%;">
                    <el-input v-model="formModel.play" style="width: 120px;margin-right: 12px;"/> 安装调试完毕取到起重机使用登记证
                 </div>
               </el-form-item>
             </div>
             <div v-if="formModel.customerType !== '1'">
               <el-form-item>
                 <div style="display: flex; width: 100%;">
                    <el-input v-model="formModel.week" style="width: 120px;margin-right: 12px;"/> 质保期到期后一周内支付
                 </div>
               </el-form-item>
             </div>
           </el-col>
         </el-row>

    </OfferSaveTitle>
    <OfferSaveTitle title="交货期">
      起重机交货期从收到预付款至现场安装调试 45 天。载荷试验及其它国家规定的测试的时间按当地市 场监管局的安排而定。
    </OfferSaveTitle>
    <OfferSaveTitle title="交货方式">
      送货到河南许昌安装现场
    </OfferSaveTitle>
    <OfferSaveTitle title="安装条款">
      <div>
        设备安装可由本地劳动力完成,并无需任何特殊的工具,在设备的设计和制造过程中始终贯穿了这一原 则，报价中提及的行车安装要求安装工作在正常工作时间内不间断进行，买方应准备以下几项:
        <ul>
          <li>所有的建筑和地面工作应完备,免费配备电源及用电</li>
          <li>确保该设备可以吊装到位</li>
          <li>提供一安全区域存放设备</li>
        </ul>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="质保期">
      质保期为从市场监管局局验收之日算起 12 个月。保证期内对材料或制造不良所引起的缺陷负责，对使用 不当引起的损坏不负责。由于正常损耗造成的损坏不在质保范围内。
    </OfferSaveTitle>
    <OfferSaveTitle title="有效期">
      本报价从报价日起有效期为
      <div style="display: inline-block">
        <el-form-item>
          <el-input v-model="formModel.validityPeriod" style="width: 60px;margin: 0 6px;"/>
        </el-form-item>
      </div>
      天
    </OfferSaveTitle>
    </el-form>
  </div>
</template>

<script setup name="OfferSavePayment">
import OfferSaveTitle from '../components/Title'
import DictSelect from './product/DictSelect'
import {defineExpose, reactive} from "vue";

const form = ref()
const formModel = reactive({
  customerType: '1',
  contract: '50%',
  site: '0%', //
  play: '50%',
  week: '0%',
  validityPeriod: 30
})

const customerChange = (value) => {
  if (value === '1') {
    formModel.contract = '50%'
    formModel.play = '50%'
  } else {
    formModel.contract = '30%'
    formModel.play = '20%'
    formModel.site = '45%'
    formModel.week = '5%'
  }
}

const getValues = async () => {
  const data = await form.value.validate()
  console.log(data)
  if (data) {
    if (formModel.customerType === '1') {
      return {
        customerType: formModel.customerType,
        contract: formModel.contract,
        play: formModel.play
      }
    } else {
      return {...formModel}
    }
  }
}

defineExpose({
  getValues
})

</script>

<style lang="scss" scoped>
.offer-save-payment {
  .title {
    margin-bottom: 24px;
  }
}
</style>