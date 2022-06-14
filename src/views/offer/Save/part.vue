<template>
  <div class="offer-save-part">
    <OfferSaveTitle title="轨道数据">
      <div v-for="item in workshopData">
        <div>
          车间名称: {{item.name}}
        </div>
        <div>
          <el-table>
            <el-table-column prop="index" label="序号" width="100" />
            <el-table-column prop="index" label="固定方式" width="100" />
            <el-table-column prop="index" label="型号" width="100" />
            <el-table-column prop="index" label="单价(元/公斤)" width="120" />
            <el-table-column prop="index" label="单根轨道长度(米)" width="140" />
            <el-table-column prop="index" label="重量(公斤/米)" width="120" />
            <el-table-column prop="index" label="实际长度(米)" width="100" />
            <el-table-column prop="index" label="轨道压板数量" width="120" />
            <el-table-column prop="index" label="联结板数量" width="100" />
            <el-table-column prop="index" label="吊装台班数量" width="120" />
            <el-table-column prop="index" label="大车止挡数量" width="120" />
            <el-table-column prop="index" label="轨道费用" width="100" />
            <el-table-column prop="index" label="压板费用" width="100" />
            <el-table-column prop="index" label="联结板费用" width="100" />
            <el-table-column prop="index" label="安装费" width="100" />
            <el-table-column prop="index" label="吊装费" width="100" />
            <el-table-column prop="index" label="补税款" width="100" />
            <el-table-column prop="index" label="大车止挡费用" width="120" />
            <el-table-column prop="index" label="成本合计" width="100" fixed="right"/>
          </el-table>
          <el-button>新增</el-button>
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="滑线数据">
      <div v-for="item in workshopData">
        <div>
          车间名称： {{item.name}}
        </div>
        <div>
          <el-table>
            <el-table-column prop="index" label="序号" width="100" />
            <el-table-column prop="index" label="固定方式" width="100" />
            <el-table-column prop="index" label="型号" width="100" />
            <el-table-column prop="index" label="单价(元/公斤)" width="120" />
            <el-table-column prop="index" label="单根轨道长度(米)" width="140" />
            <el-table-column prop="index" label="重量(公斤/米)" width="120" />
            <el-table-column prop="index" label="实际长度(米)" width="100" />
            <el-table-column prop="index" label="轨道压板数量" width="120" />
            <el-table-column prop="index" label="联结板数量" width="100" />
            <el-table-column prop="index" label="吊装台班数量" width="120" />
            <el-table-column prop="index" label="大车止挡数量" width="120" />
            <el-table-column prop="index" label="轨道费用" width="100" />
            <el-table-column prop="index" label="压板费用" width="100" />
            <el-table-column prop="index" label="联结板费用" width="100" />
            <el-table-column prop="index" label="安装费" width="100" />
            <el-table-column prop="index" label="吊装费" width="100" />
            <el-table-column prop="index" label="补税款" width="100" />
            <el-table-column prop="index" label="大车止挡费用" width="120" />
            <el-table-column prop="index" label="成本合计" width="100" fixed="right"/>
          </el-table>
          <el-button>新增</el-button>
        </div>
        <div>
          xxx车间成本合计： xxxx
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="起重机运输">
      <div>
        <div>
          <el-table>
            <el-table-column prop="index" label="车间名称" width="100" />
            <el-table-column prop="index" label="序号" width="100" />
            <el-table-column prop="index" label="起重机型号" />
            <el-table-column prop="index" label="起升重量(t)" />
            <el-table-column prop="index" label="运费" />
            <el-table-column prop="index" label="补税款" />
            <el-table-column prop="index" label="费用合计" />
          </el-table>
        </div>
        <div>
          xxx车间成本合计： xxxx
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="起重机安装及吊装费">
      <div>
        <div>
          <el-table>
            <el-table-column prop="index" label="车间名称" width="100" />
            <el-table-column prop="index" label="序号" width="100" />
            <el-table-column prop="index" label="起重机型号" width="100" />
            <el-table-column prop="index" label="起升重量(t)" width="120" />
            <el-table-column prop="index" label="起重机安装" />
            <el-table-column prop="index" label="起重机吊装" />
            <el-table-column prop="index" label="补税款" />
            <el-table-column prop="index" label="费用合计" />
          </el-table>
        </div>
        <div>
          xxx车间成本合计： xxxx
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="起重机市场监管局特检费">
      <div>
        <div>
          <el-table>
            <el-table-column prop="index" label="车间名称" width="200" />
            <el-table-column prop="index" label="序号" width="100" />
            <el-table-column prop="index" label="起重机型号" />
            <el-table-column prop="index" label="起升重量(t)" />
            <el-table-column prop="index" label="起重机验收" />
            <el-table-column prop="index" label="补税款" />
            <el-table-column prop="index" label="费用合计" />
          </el-table>
        </div>
        <div>
          xxx车间成本合计： xxxx
        </div>
      </div>
    </OfferSaveTitle>
    <div class="title">
      <el-table>
        <el-table-column prop="index" label="序号" width="100" />
        <el-table-column prop="index" label="说明" />
        <el-table-column prop="index" label="数量(台)" />
        <el-table-column prop="index" label="总成本合计" />
        <el-table-column prop="index" label="预计利润" />
        <el-table-column prop="index" label="销售总价" />
        <el-table-column prop="index" label="利润额" />
      </el-table>
    </div>
  </div>
</template>

<script setup name="OfferPart">
import OfferSaveTitle from '../components/Title'
import {onMounted} from "vue";
import useOfferStore from '@/store/modules/offer'

const offerStore = useOfferStore()
const workshopData = ref([])

onMounted(() => {
  workshopData.value = offerStore.getCustomerData().workshopInfo

})
</script>

<style lang="scss" scoped>
.offer-save-part {
  .title {
    margin-bottom: 24px;
  }
}

</style>