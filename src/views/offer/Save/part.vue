<!-- 项目报价 -->
<template>
  <div class="offer-save-part">
    <OfferSaveTitle title="轨道数据">
      <div>
        <div :key="item.key" v-for="item in workshopData">
          <div style="margin-bottom: 16px">车间名称：{{ item.name }}</div>
          <div>
            <el-table :data="QuoteData.track[item.key]">
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="fixed" label="固定方式" width="140">
                <template #default="scope">
                  <DictSelect
                    :disabled="offerStore.type === 'view'"
                    v-model="scope.row.fixed"
                    dictType="q_fixed_mode"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="model" label="型号" width="140">
                <template #default="scope">
                  <DictSelect
                    :disabled="offerStore.type === 'view'"
                    v-model="scope.row.model"
                    dictType="q_track_model"
                    @change="
                      (value) => {
                        queryTrackByModel(value, scope.row, item.key)
                      }
                    "
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="trackUnprice"
                label="单价(元/公斤)"
                width="120"
              />
              <el-table-column
                prop="sgltrackLength"
                label="单根轨道长度(米)"
                width="140"
              />
              <el-table-column
                prop="sgltrackWeight"
                label="重量(公斤/米)"
                width="120"
              />
              <el-table-column
                prop="actualLength"
                label="实际长度(米)"
                width="100"
              />
              <el-table-column
                prop="platens"
                label="轨道压板数量"
                width="120"
              />
              <el-table-column
                prop="tiePlates"
                label="联结板数量"
                width="100"
              />
              <el-table-column
                prop="hoistingTables"
                label="吊装台班数量"
                width="130"
              >
                <template #default="scope">
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    v-model="scope.row.hoistingTables"
                    :min="1"
                    :max="999999"
                    controls-position="right"
                    style="width: 100px"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="cartStops"
                label="大车止档数量"
                width="130"
              >
                <template #default="scope">
                  <el-input-number
                    :disabled="offerStore.type === 'view'"
                    v-model="scope.row.cartStops"
                    :min="1"
                    :max="999999"
                    controls-position="right"
                    style="width: 100px"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="cost" label="轨道费用" width="100" />
              <el-table-column
                prop="platensConst"
                label="压板费用"
                width="100"
              />
              <el-table-column
                prop="tiePlatesConst"
                label="联结板费用"
                width="100"
              />
              <el-table-column
                prop="installationFee"
                label="安装费"
                width="100"
              >
                <template #default="{ row }">
                  {{ installFee(row) }}
                </template>
              </el-table-column>
              <el-table-column prop="liftingFee" label="吊装费" width="100">
                <template #default="{ row }">
                  {{ liftingFee(row) }}
                </template>
              </el-table-column>
              <el-table-column prop="taxPayment" label="补税款" width="100">
                <template #default="{ row }">
                  {{ taxPayment(row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="unprice"
                label="大车止档费用"
                width="120"
              >
                <template #default="{ row }">
                  {{ cartStopsConst(row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="index"
                label="成本合计"
                width="100"
                fixed="right"
              >
                <template #default="{ row }">
                  {{ countPrice(row) }}
                </template>
              </el-table-column>
              <el-table-column width="100" label="操作" fixed="right">
                <template #default="scope">
                  <el-button
                    :disabled="offerStore.type === 'view'"
                    @click="onTrackDelete(item.key, scope.row.key)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div
              v-if="offerStore.type !== 'view'"
              class="add-btn"
              @click="onTrackAdd(item)"
            >
              新增
            </div>
          </div>
        </div>
        <div style="margin-bottom: 16px">
          <el-descriptions size="small" :column="4">
            <el-descriptions-item
              :key="workshopItem.key"
              v-for="workshopItem in workshopData"
              :label="`车间${workshopItem.name} 成本合计`"
            >
              <span class="number">
                {{ workshopFree(QuoteData.track[workshopItem.key]) }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions size="small" :column="4">
            <el-descriptions-item label="总成本合计">
              <span class="number">{{ trackData.total }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="预计利润率">
              <el-input-number
                :disabled="offerStore.type === 'view'"
                size="small"
                v-model="trackData.profitMargin"
              />
              %
            </el-descriptions-item>
            <el-descriptions-item label="销售总价">
              <span class="number">{{ salesItemCalculate(trackData) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="利润额">
              <span class="number">{{ totalItemCalculate(trackData) }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="滑线数据">
      <div>
        <div :key="item.key" v-for="(item, index) in workshopData">
          <div
            :style="{
              marginBottom: '16px',
              marginTop: index > 0 ? '16px' : 0,
            }"
          >
            <span style="padding-right: 24px">车间名称：{{ item.name }}</span>
            <span>
              滑线:
              <el-select
                :disabled="offerStore.type === 'view'"
                v-model="item.splPartId"
                @change="
                  (value) => {
                    slipLineChange(value, item)
                  }
                "
                placeholder="请选择滑线"
              >
                <!-- <el-option
                  :key="slipItem.splPartId"
                  v-for="slipItem in slipLineOptions"
                  :label="slipItem.splPartName"
                  :value="slipItem.splPartId"
                /> -->
              <el-option
                v-for="item in slipLineOptions"
                :key="item.splPartId"
                :label="item.splPartName"
                :value="item.splPartId"
              >
              <span style="float: left">{{ item.splPartName }}</span>
                <span
                  style="
                  margin-left: 10px;
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
                >{{item.splLevel == 1 ? '单极' : '多级'}}
                </span>
              </el-option>
              </el-select>
            </span>
          </div>
          <div>
            <el-table :data="QuoteData.slipLine[item.key]">
              <el-table-column type="index" label="序号" width="80" />
              <el-table-column prop="level" label="滑线级数" width="100" >    
                <template #default="{ row }">
                {{row.level == 1 ? '单极' : '多级'}}
                </template>
              </el-table-column>
              <el-table-column
                prop="electricMax"
                label="最大电流"
                width="100"
              />
              <el-table-column prop="length" label="滑线数量(米)" width="120" />
              <el-table-column
                prop="collectorCount"
                label="集电器数量"
                width="140"
              />
              <el-table-column
                prop="installLength"
                label="滑线安装数量"
                width="120"
              />
              <el-table-column prop="idlight" label="指示灯数量" width="100">
                <template #default="{ row }">
                  <el-select
                    :disabled="offerStore.type === 'view'"
                    v-model="row.idlight"
                  >
                    <el-option label="1" :value="1" />
                    <el-option label="2" :value="2" />
                    <el-option label="3" :value="3" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="rcable"
                label="上升电缆数量(米)"
                width="140"
              />
              <el-table-column prop="index" label="滑线数量费用" width="120">
                <template #default="{ row }">
                  {{ trolleyFee(row) }}
                </template>
              </el-table-column>
              <el-table-column prop="index" label="集电器费用" width="120">
                <template #default="{ row }">
                  {{ collectorFee(row) }}
                </template>
              </el-table-column>
              <el-table-column prop="installUnprice" label="安装费" width="120">
                <template #default="{ row }">
                  {{ slipInstallFee(row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="idlightUnprice"
                label="指示灯费用"
                width="100"
              >
                <template #default="{ row }">
                  {{ lightFee(row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="rcableUnprice"
                label="上升电缆费用"
                width="120"
              >
                <template #default="{ row }">
                  {{ rcableFee(row) }}
                </template>
              </el-table-column>
              <el-table-column prop="index" label="补税款" width="100">
                <template #default="{ row }">
                  {{ slipTaxFee(row) }}
                </template>
              </el-table-column>
              <el-table-column
                prop="count"
                label="费用合计"
                width="100"
                fixed="right"
              >
                <template #default="{ row }">
                  {{ slipCount(row) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin-top: 16px">
          <el-descriptions size="small" :column="4">
            <el-descriptions-item
              :key="workshopItem.key"
              v-for="workshopItem in workshopData"
              :label="`车间${workshopItem.name} 成本合计`"
            >
              {{ workshopFree(QuoteData.slipLine[workshopItem.key]) }}
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions size="small" :column="4">
            <el-descriptions-item label="总成本合计">
              <span class="number">{{ slipLineData.total }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="预计利润率">
              <el-input-number
                :disabled="offerStore.type === 'view'"
                size="small"
                v-model="slipLineData.profitMargin"
              />
              %
            </el-descriptions-item>
            <el-descriptions-item label="销售总价">
              <span class="number">{{ salesItemCalculate(slipLineData) }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="利润额">
              <span class="number">{{ totalItemCalculate(slipLineData) }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="起重机运输">
      <div>
        <div>
          <el-table :data="craneDataSource">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="workshopName" label="车间名称" width="100" />
            <el-table-column prop="model" label="起重机型号" />
            <el-table-column prop="weight" label="起升重量(t)" />
            <el-table-column prop="freight" label="起重机安装">
              <template #default="{ row }">
                <el-input-number
                  :disabled="offerStore.type === 'view'"
                  v-model="row.freight"
                  :min="1"
                  :max="999999"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column prop="taxPayment" label="补税款">
              <template #default="{ row }">
                {{ numberToFixed(row.freight * (tax - 1)) }}
              </template>
            </el-table-column>
            <el-table-column prop="index" label="费用合计" fixed="right">
              <template #default="{ row }">
                {{ craneDataTotal(row, tax) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 16px">
          <el-descriptions size="small" :column="4">
            <el-descriptions-item label="总成本合计">
              <span class="number">{{ transportTotalData.total }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="预计利润率">
              <el-input-number
                :disabled="offerStore.type === 'view'"
                size="small"
                v-model="transportTotalData.profitMargin"
              />
              %
            </el-descriptions-item>
            <el-descriptions-item label="销售总价">
              <span class="number">
                {{ salesItemCalculate(transportTotalData) }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="利润额">
              <span class="number">
                {{ totalItemCalculate(transportTotalData) }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="起重机安装及吊装费">
      <div>
        <div>
          <el-table :data="installDataSource">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="workshopName" label="车间名称" width="100" />
            <el-table-column prop="model" label="起重机型号" />
            <el-table-column prop="weight" label="起升重量(t)" />
            <el-table-column prop="install" label="起重机安装">
              <template #default="{ row }">
                <el-input-number
                  :disabled="offerStore.type === 'view'"
                  v-model="row.install"
                  :min="1"
                  :max="999999"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column prop="hoisting" label="起重机吊装">
              <template #default="{ row }">
                <el-input-number
                  :disabled="offerStore.type === 'view'"
                  v-model="row.hoisting"
                  :min="1"
                  :max="999999"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column prop="taxPayment" label="补税款">
              <template #default="{ row }">
                {{ numberToFixed((row.install + row.hoisting) * (tax - 1)) }}
              </template>
            </el-table-column>
            >
            <el-table-column prop="index" label="费用合计" fixed="right">
              <template #default="{ row }">
                {{ installTotal(row, tax) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 16px">
          <el-descriptions size="small" :column="4">
            <el-descriptions-item label="总成本合计">
              <span class="number">{{ installTotalData.total }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="预计利润率">
              <el-input-number
                :disabled="offerStore.type === 'view'"
                size="small"
                v-model="installTotalData.profitMargin"
              />
              %
            </el-descriptions-item>
            <el-descriptions-item label="销售总价">
              <span class="number">
                {{ salesItemCalculate(installTotalData) }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="利润额">
              <span class="number">
                {{ totalItemCalculate(installTotalData) }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </OfferSaveTitle>
    <OfferSaveTitle title="起重机市场监管局特检费">
      <div>
        <div>
          <el-table :data="marketDataSource">
            <el-table-column type="index" label="序号" width="60" />

            <el-table-column prop="workshopName" label="车间名称" width="100" />
            <el-table-column prop="model" label="起重机型号" />
            <el-table-column prop="weight" label="起升重量(t)" />
            <el-table-column prop="acceptance" label="起重机验收" />
            <el-table-column prop="taxPayment" label="补税款">
              <template #default="{ row }">
                {{ numberToFixed(row.acceptance * (tax - 1)) }}
              </template>
            </el-table-column>
            <el-table-column prop="index" label="费用合计" fixed="right">
              <template #default="{ row }">
                {{ marketDataTotal(row, tax) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 16px">
          <el-descriptions size="small" :column="4">
            <el-descriptions-item label="招待费总数">
              <el-input-number
                :disabled="offerStore.type === 'view'"
                v-model="marketTotalData.hospitality"
                :min="1"
                :max="999999"
                controls-position="right"
                size="small"
                style="width: 100px"
              />
            </el-descriptions-item>
            <el-descriptions-item label="招待费补税款">
              <span class="number">{{ numberToFixed(marketTotalData.hospitality * (tax - 1)) }}</span>
            </el-descriptions-item>
          </el-descriptions>
          <el-descriptions size="small" :column="4">
            <el-descriptions-item label="总成本合计">
              <span class="number">{{ marketTotalData.total }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="预计利润率">
              <el-input-number
                :disabled="offerStore.type === 'view'"
                size="small"
                v-model="marketTotalData.profitMargin"
              />
              %
            </el-descriptions-item>
            <el-descriptions-item label="销售总价">
              <span class="number">
                {{ salesItemCalculate(marketTotalData) }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="利润额">
              <span class="number">
                {{ totalItemCalculate(marketTotalData) }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </OfferSaveTitle>
    <div class="title">
      <el-table
        :data="countDataSource"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column type="index" label="序号" width="100" />
        <el-table-column prop="name" label="说明" />
        <el-table-column prop="count" label="数量(台)" />
        <el-table-column prop="total" label="总成本合计" />
        <el-table-column prop="profitMargin" label="预计利润率(10%)" />
        <el-table-column prop="sales" label="销售总价"></el-table-column>
        <el-table-column prop="profit" label="利润额"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup name="OfferPart">
import { computed, defineExpose, onMounted, watch } from 'vue'
import OfferSaveTitle from '../components/Title'
import DictSelect from './product/DictSelect'
import useOfferStore from '@/store/modules/offer'
import { listTrackpart } from '@/api/business/trackpart'
import { listCrastopmodelpart } from '@/api/business/crastopmodelpart'
import { listSplpart } from '@/api/business/splpart'
import { getDicts } from '@/api/system/dict/data'
import { cloneDeep, omit } from 'lodash-es'


const offerStore = useOfferStore()
const { proxy } = getCurrentInstance()


const default_track_data = {
  fixed: undefined,
  model: undefined,
  trackUnprice: 0,
  sgltrackLength: 0,
  sgltrackWeight: 0,
  actualLength: 0, // 轨道长度: 车间长度*2
  platens: 0, // 压板数量：车间长度*2/0.75*2
  tiePlates: 0, // 联结板数量：(车间长度/单根轨道长度 - 1)*2
  hoistingTables: 1, // 吊装台班数量
  cartStops: 4, // 大车止档数量
  cost: 0, // 轨道费用：轨道长度*轨道重量*单价
  platensConst: 0, // 压板费用：轨道压板数量*压板单价(18)
  tiePlatesConst: 0, // 联结板费用：轨道联结板数量*联结板单价（145）
  installationFee: 0, // 安装费
  liftingFee: 0,
  taxPayment: 0,
  cartStopsConst: 0,
  tppUnprice: 0, // 轨道压板单价
  cpUnprice: 0, // 联结板单价
  thsUnprice: 0, // 轨道吊装台班单价
}

const slipLineOptions = ref([])
const tax = ref(0)
const craneDataSource = ref([]) // 起重机运输
const installDataSource = ref([]) // 起重机安装及吊装费
const marketDataSource = ref([]) // 起重机市场监管局特检费
const workshopData = ref([]) // 车间信息

// 轨道费用统计
const trackData = ref({
  total: 0,
  profitMargin: 10,
  name: '轨道', // 说明
  count: 0, // 数量
  sales: 0,
  profit: 0,
})

// 滑线费用统计
const slipLineData = ref({
  total: 0,
  profitMargin: 10,
  name: '滑线', // 说明
  count: 0, // 数量
  sales: 0,
  profit: 0,
  splId: [],
})

// 起重机运输费用统计
const transportTotalData = ref({
  total: 0,
  profitMargin: 10,
  name: '起重机运输费', // 说明
  count: 0, // 数量
  sales: 0,
  profit: 0,
})

// 起重机安装费用统计
const installTotalData = ref({
  total: 0,
  profitMargin: 10,
  name: '起重机安装及吊装费', // 说明
  count: 0, // 数量
  sales: 0,
  profit: 0,
})

// 起重机市场监管费用统计
const marketTotalData = ref({
  total: 0,
  hospitality: 2500,
  profitMargin: 10,
  name: '起重机市场监管局特检费', // 说明
  count: 0, // 数量
  sales: 0,
  profit: 0,
})

const countDataSource = ref([]) // 总合计

const QuoteData = reactive({
  track: {
    total: 0,
    profitMargin: 10,
    name: '轨道', // 说明
    count: 0, // 数量
    sales: 0,
    profit: 0,
    dataSource: [],
  }, // 轨道table数据
  slipLine: {}, // 滑线table数据
})

const getKey = () => {
  return new Date().valueOf()
}

const toNumberByKey = (object, keys) => {
  for (const key in object) {
    if (keys.includes(key)) {
      object[key] = Number(object[key])
    }
  }
  return object
}

/**
 * 保留小数
 * @param {number} number
 * @param {number} length 保留几位小数
 *
 */
const numberToFixed = (number, length = 2) => {
  return number ? Number(number.toFixed(length)) : 0
}

/**
 * 轨道数据新增
 * @param {Object} workshop 车间数据
 */
const onTrackAdd = (workshop) => {
  const workshopKey = workshop.key
  const key = `track${getKey()}`
  const wsLength = workshop.workshopLength

  const actualLength = wsLength * 2
  const platens = numberToFixed(((wsLength * 2) / 0.75) * 2)

  const newTrackItem = {
    ...default_track_data,
    key,
    actualLength,
    platens,
    wsLength,
  }
  if (QuoteData.track[workshopKey]) {
    QuoteData.track[workshopKey].push(newTrackItem)
  } else {
    QuoteData.track[workshopKey] = [newTrackItem]
  }
}

/**
 * 轨道数据删除
 * @param key
 */
const onTrackDelete = (workshopId, key) => {
  const index = QuoteData.track[workshopId].findIndex(
    (item) => item.key === key,
  )
  if (index > -1) {
    QuoteData.track[workshopId].splice(index, 1)
  }
}

const findProduct = (key) => {
  const productItems = cloneDeep(offerStore.getProductData())
  let productItem = {}
  productItems.forEach((item) => {
    if (key === item.key) {
      productItem = item
    }
  })
  return productItem
}

/**
 * 根据轨道型号查询轨道数据
 * @param model
 * @param index
 * @returns {Promise<void>}
 */
const queryTrackByModel = async (model, row, key) => {
  const resp = await listTrackpart({
    trackModel: model,
  })
  if (resp.code === 200 && resp.rows.length) {
    // 获取大车止档数据
    const carResp = await listCrastopmodelpart({ trackModel: model })


    if (carResp.code === 200 && carResp.rows.length) {
      const carData = toNumberByKey(carResp.rows[0], ['unprice', 'weight'])
            console.log(1,carData,carResp);

      const firstData = toNumberByKey(resp.rows[0], [
        'cpUnprice',
        'tppUnprice',
        'thsUnprice',
        'trackUnprice',
        'sgltrackLength',
        'sgltrackWeight',
      ])
      const index = QuoteData.track[key].findIndex(
        (item) => item.key === row.key,
      )

      const platens = numberToFixed(((row.wsLength * 2) / 0.75) * 2)
      const tiePlates = numberToFixed(
        (row.wsLength / firstData.sgltrackLength - 1) * 2,
      )

      QuoteData.track[key].splice(index, 1, {
        ...row,
        cpUnprice: firstData.cpUnprice,
        tppUnprice: firstData.tppUnprice,
        thsUnprice: firstData.thsUnprice,
        trackUnprice: firstData.trackUnprice,
        sgltrackLength: firstData.sgltrackLength,
        sgltrackWeight: firstData.sgltrackWeight,
        cost: numberToFixed(
          firstData.sgltrackLength *
          firstData.sgltrackWeight *
          firstData.trackUnprice,
        ),
        platensConst: platens * firstData.tppUnprice,
        tiePlatesConst: tiePlates * firstData.cpUnprice,
        unprice: carData.unprice,
        carWeight: carData.weight,
        tiePlates,
        platens,
      })
    }
  }
}

/**
 * 轨道安装费
 * @param row
 */
const installFee = (row) => {
  return row.wsLength ? numberToFixed(row.wsLength * 2) : 0
}

const liftingFee = (row) => {
  return row.hoistingTables
    ? numberToFixed(row.hoistingTables * row.thsUnprice)
    : 0
}

const taxPayment = (row) => {
  return row.hoistingTables
    ? numberToFixed(
        (row.hoistingTables + row.hoistingTables * row.thsUnprice) * 0.13,
      )
    : 0
}

const cartStopsConst = (row) => {
  return row.unprice
    ? numberToFixed(row.unprice * row.carWeight * row.cartStops)
    : 0
}

const countPrice = (row) => {
  const count = numberToFixed(
    row.cost +
      row.platensConst +
      row.tiePlatesConst +
      installFee(row) +
      liftingFee(row) +
      taxPayment(row) +
      cartStopsConst(row),
  )
  row.count = count
  return count
}

/***
 * 滑线数量费用
 */
const trolleyFee = (row) => {
  return numberToFixed(row.trolleyUnprice * row.installLength)
}

const collectorFee = (row) => {
  return numberToFixed(row.collectorCount * row.collector)
}

const slipInstallFee = (row) => {
  return numberToFixed(row.installUnprice * row.installLength)
}

const lightFee = (row) => {
  return numberToFixed(row.idlight * row.idlightUnprice)
}

const rcableFee = (row) => {
  return numberToFixed(row.rcable * row.rcableUnprice)
}

const slipTaxFee = (row) => {
  return numberToFixed(row.installUnprice * row.installLength * (tax.value - 1))
}

const slipCount = (row) => {
  const count =
    collectorFee(row) +
    slipInstallFee(row) +
    lightFee(row) +
    rcableFee(row) +
    slipTaxFee(row)
  row.count = count
  return count
}


/**
 * 滑线选择
 * @param {string} 当前车间的滑线tableId
 * @param {string} 当前滑线数据
 */
const slipLineChange = (id, item) => {
  const slipItem = slipLineOptions.value.find((sItem) => sItem.splPartId === id)
  // 计算当前车间总电流
  const productItem = findProduct(item.key)
  const totalPower = productItem.amount.reduce(
    (prev, next) => prev + Number(next.productData.ratedPower),
    0,
  )
  const totalCurrent = totalPower / 380 * 1.1 * 1000
  if(totalCurrent > 400){
    proxy.$modal.msgError('车间总电流大于400A')
    QuoteData.slipLine[item.key] = []
    return 
  }else{
    if(totalCurrent <= 120 && slipItem.splLevel==='1'){
      proxy.$modal.msgError('车间总电流小于120A，不能选单极')
      QuoteData.slipLine[item.key] = []
    }else if(totalCurrent > 120 && slipItem.splLevel==='2'){
      proxy.$modal.msgError('车间总电流大于120A，不能选多极')
      QuoteData.slipLine[item.key] = []
    }else{
      const newSlip = {
        electricMax: slipItem.electricMax,
        trolleyUnprice: Number(slipItem.trolleyUnprice),
        length: item.workshopLength,
        collector: Number(slipItem.collector),
        level: Number(slipItem.splLevel),
        // collectorCount: productItem.amount.length * 4, // 集电器数量起重机数量*4
        installLength: item.workshopLength,
        installUnprice: Number(slipItem.installUnprice),
        idlightUnprice: Number(slipItem.idlightUnprice),
        idlight: item.workshopLength > 150 ? 2 : 1,
        rcable: item.liftingHeight + 2,
        rcableUnprice: Number(slipItem.rcableUnprice),
        count: 0,
      }
      // 单极滑线1台起重机配4个，多级滑线1台起重机配2个	
      if (slipItem.splLeve==='1') {
        newSlip.collectorCount =  productItem.amount.length * 4
      }else{
        newSlip.collectorCount =  productItem.amount.length * 2
      }
      QuoteData.slipLine[item.key] = [newSlip]      
    }
  }
}


const salesItemCalculate = (item) => {
  const sales = numberToFixed(item.total * (1 + item.profitMargin / 100))
  item.sales = sales
  return sales
}

const totalItemCalculate = (item) => {
  const profit = numberToFixed(
    item.total * (1 + item.profitMargin / 100) - item.total,
  )
  item.profit = profit
  return profit
}

const queryListSplpart = async () => {
  const resp = await listSplpart({ pageSize: 999 })
  if (resp.code === 200) {
    slipLineOptions.value = resp.rows
  }
}

const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  const map = {
    3: 'total',
    5: 'sales',
    6: 'profit',
  }
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    } else if (index > 2 && index !== 4) {
      const _total = data.reduce((prev, curr) => {
        return prev + curr[map[index]]
      }, 0)
      sums[index] = numberToFixed(_total)
    } else {
      sums[index] = ''
    }
  })

  return sums
}

/***
 * 单个车间成本合计
 */
const workshopFree = (workshopDataSource) => {
  const sum = workshopDataSource
    ? workshopDataSource.reduce((prev, next) => {
        return prev + next.count
      }, 0)
    : 0
  return sum.toFixed(2)
}

const getTax = async () => {
  const resp = await getDicts('q_tax_rate')
  if (resp.code === 200 && resp.data.length) {
    tax.value = Number(resp.data[0].dictValue)
  }
  // await initCraneTable()
}

const craneDataTotal = (row, _tax) => {
  const total = numberToFixed(row.freight * _tax)
  row.total = total
  return total
}

const marketDataTotal = (row, _tax) => {
  const total = numberToFixed(row.acceptance * _tax)
  row.total = total
  return total
}

const installTotal = (row, _tax) => {
  const total = numberToFixed((row.install + row.hoisting) * _tax)
  row.total = total
  return total
}

//轨道数据处理
const trackCloneData = (value) => {
  let obj = omit(value,'count','dataSource','name','profit','profitMargin','sales','total')
  const newObj={
    list:[], //干净的数组
    newlist:[] //带key的数组
  }
  for (let key in obj) {
    newObj.list.push(obj[key])
    newObj.newlist.push({
      key:key,
      trackList:obj[key]
    })
  }
  return newObj
}

//轨道总成本合计
const trackTotal = (list) => {
  const newList = []
  list.forEach((item) => {
    item.forEach((item2) => {
      newList.push(item2)
    })
  })
  const total = newList.reduce((pre, next) => {
    if (!next.count && next.count !== 0) {
      next.count = 2.13
    }
    return pre + next.count
  }, 0)
  trackData.value.total = numberToFixed(total)
  trackData.value.count = newList.length
  countDataSource.value[0] = trackData.value
}

watch(
  () => QuoteData.track,
  (value) => {
    const { list } = trackCloneData(value)
    trackTotal(list)
  },
  { deep: true },
)

watch(
  () => QuoteData.slipLine,
  (value) => {
    const total = Object.values(value).reduce((prev, next) => {
      const itemCount = Array.isArray(next)
        ? next.reduce((a, b) => a + b.count, 0)
        : 0
      return prev + itemCount
    }, 0)
    const length = Object.values(value).reduce((prev, next) => {
      const itemCount = Array.isArray(next)
        ? next.reduce((a, b) => a + b.length, 0)
        : 0

      return prev + itemCount
    }, 0)
    slipLineData.value.total = numberToFixed(total)
    slipLineData.value.count = numberToFixed(length)
    countDataSource.value[1] = slipLineData.value
    slipLineData.value.splId = workshopData.value
  },
  { deep: true },
)

watch(
  () => craneDataSource.value,
  (value) => {
    const total = value.reduce((prev, next) => {
      return prev + next.total
    }, 0)
    transportTotalData.value.total = numberToFixed(total)
    countDataSource.value[2] = transportTotalData.value
  },
  { deep: true },
)

watch(
  () => installDataSource.value,
  (value) => {
    const total = value.reduce((prev, next) => {
      return prev + next.total
    }, 0)
    installTotalData.value.total = numberToFixed(total)
    countDataSource.value[3] = installTotalData.value
  },
  { deep: true },
)

watch(
  [
    () => marketDataSource.value,
    () => marketTotalData.value.hospitality,
  ],
  (value) => {
    const total = value[0].reduce((prev, next) => {
      return prev + next.total
    }, 0)
    const Alltotal = total + value[1] * tax.value
    marketTotalData.value.total = numberToFixed(Alltotal)
    countDataSource.value[4] = marketTotalData.value
  },
  { deep: true },
)

offerStore.$subscribe((mutation, state) => {
  queryListSplpart()
  const { customer, product, partData } = state
  if (customer.workshopInfo && product.length) {
    workshopData.value = []
    const workshopInfo = JSON.parse(customer.workshopInfo)
    workshopInfo.forEach((workshopItem) => {
      // 回显车间数据
      workshopData.value.push({
        ...workshopItem,
        total: 0, // 总成本合计
        profitMargin: 1.1, // 预计利润率
        totalPrice: 0, // 销售总价
        profitAmount: 0, // 利润额
        splPartId:'',
      })
    })
    if (Object.keys(partData).length) {
      // 回显
      QuoteData.track = partData.track
      QuoteData.slipLine = partData.slipLine
      craneDataSource.value = partData.craneDataSource // 起重机运输
      installDataSource.value = partData.installDataSource // 安装
      marketDataSource.value = partData.marketDataSource // 市场
      trackData.value = partData.trackData // 轨道统计
      slipLineData.value = partData.slipLineData // 滑线统计
      transportTotalData.value = partData.transportTotalData // 起重机运输统计
      installTotalData.value = partData.installTotalData // 安装统计
      marketTotalData.value = partData.marketTotalData // 市场统计
      workshopData.value=partData.slipLineData.splId // 滑线下拉数据
    } else {
      let marketTotal = 0 // 市场成本合计
      let amountCount = 0 // 起重机数量

      const _craneDataSource = [] // 起重机运输
      const _installDataSource = [] // 起重机运输
      const _marketDataSource = [] // 起重机运输

      product.forEach((pItem) => {
        // 读取起重机数量，生成列表
        const workshopName = pItem.name
        amountCount += pItem.amount.length
        pItem.amount.forEach((amountItem) => {
          const newObject = {
            workshopName,
            model: pItem.name,
            weight: amountItem.weight,
          }
          let AcceptanceFee = 0
          if (amountItem.weight > 3) {
            AcceptanceFee = 1000
          }
          marketTotal += numberToFixed(AcceptanceFee * tax.value)
          _craneDataSource.push({
            ...cloneDeep(newObject),
            freight: 2500,
            taxPayment: 0,
            total: 0,
          })
          _installDataSource.push({
            ...cloneDeep(newObject),
            install: 1000,
            hoisting: 1500,
            taxPayment: 0,
            total: 0,
          })
          _marketDataSource.push({
            ...cloneDeep(newObject),
            acceptance: AcceptanceFee,
            taxPayment: 0,
          })
        })
      })

      marketTotalData.value.total = marketTotal
      craneDataSource.value = _craneDataSource
      installDataSource.value = _installDataSource
      marketDataSource.value = _marketDataSource

      transportTotalData.value.count = amountCount
      installTotalData.value.count = amountCount
      marketTotalData.value.count = amountCount
    }
  }
})

onMounted(() => {
  getTax()
  queryListSplpart()
})

const getValues = async () => {

  //轨道数据存入dataSource
  const { newlist } = trackCloneData(QuoteData.track)
  if(newlist.length != 0){
    // 轨道数据判断
    QuoteData.track.dataSource = newlist
    let noTrack = Object.values(newlist).map(item=>item.trackList.length).includes(0) //是否轨道无数据
    if(!noTrack){
      //轨道有数据，部分未填写
      Object.values(newlist).map(item=>item.trackList).filter(item=>item.length != 0).forEach( item => {
          item.forEach( item2 => {
            if(!item2.fixed || !item2.model){
              noTrack = true
            }
          })
        }
      )  
    }

    // 滑线数据判断
    let noSlipLine = true
    if(Object.keys(QuoteData.slipLine).length != 0){
      noSlipLine = Object.values(QuoteData.slipLine).map(item=>item.length).includes(0) //是否滑线未选择
    }

    if(noSlipLine){
      proxy.$modal.msgWarning('请完善滑线数据')
    }else if(noTrack){
      proxy.$modal.msgWarning('请完善轨道数据')
    }else{
      return {
        track: QuoteData.track, // 轨道
        slipLine: QuoteData.slipLine, // 滑线
        craneDataSource: craneDataSource.value, // 起重机运输
        installDataSource: installDataSource.value, // 安装
        marketDataSource: marketDataSource.value, // 市场
        trackData: trackData.value, // 轨道统计
        slipLineData: slipLineData.value, // 滑线统计
        transportTotalData: transportTotalData.value, // 起重机运输统计
        installTotalData: installTotalData.value, // 安装统计
        marketTotalData: marketTotalData.value, // 市场统计
      }      
    }
  }else{
    proxy.$modal.msgWarning('请完善轨道和滑线数据')
  }
}

defineExpose({
  getValues,
})
</script>

<style lang="scss" scoped>
$color: #ff5800;

.offer-save-part {
  .title {
    margin-bottom: 24px;
  }

  .add-btn {
    width: 100%;
    margin: 16px 0;
    border: 1px dashed $color;
    padding: 6px 0;
    text-align: center;
    border-radius: 2px;
    color: $color;
    cursor: pointer;
  }

  .number {
    color: $color;
  }
}
</style>
