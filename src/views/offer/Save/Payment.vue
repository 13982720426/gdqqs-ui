<template>
  <div class="offer-save-payment">
    <div>
      <el-button>导出为WORD</el-button>
      <el-button>导出为PDF</el-button>
    </div>
    <OfferSaveTitle title="付款方式">
       <el-form>
         <el-form-item label="客户类型">
           <el-select>

           </el-select>
         </el-form-item>
       </el-form>
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
      本报价从报价日起有效期为<el-input style="width: 60px;margin: 0 6px;"/>天
    </OfferSaveTitle>
  </div>
</template>

<script setup name="OfferSavePayment">
import OfferSaveTitle from '../components/Title'

</script>

<style lang="scss" scoped>
.offer-save-payment {
  .title {
    margin-bottom: 24px;
  }
}
</style>