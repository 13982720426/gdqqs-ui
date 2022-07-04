<template>
  <el-form ref="saveFormRef" :model="form" :rules="rules" label-width="180px">
    <el-row v-if="type === 'install'">
      <el-col :span="8">
        <el-form-item label="部件类型" prop="partType">
          <el-select
            v-model="form.partType"
            placeholder="请选择"
            clearable
            style="width: 60%"
            @change="handlePartType"
            :disabled="true"
          >
            <el-option
              v-for="dict in q_install_parttype"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <template v-if="form.partType == 1">
        <el-col :span="8">
          <el-form-item label="固定方式" prop="fixedMode">
            <el-select
              v-model="form.fixedMode"
              placeholder="请选择"
              clearable
              style="width: 60%"
            >
              <el-option
                v-for="dict in q_fixed_mode"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轨道型号" prop="trackModel">
            <el-select
              v-model="form.trackModel"
              placeholder="请选择"
              clearable
              style="width: 60%"
            >
              <el-option
                v-for="dict in q_track_model"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单根轨道长度(米)" prop="sgltrackLength">
            <el-input
              v-model="form.sgltrackLength"
              placeholder="请输入单根轨道长度（米）"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单根轨道重量(公斤/米)" prop="sgltrackWeight">
            <el-input
              v-model="form.sgltrackWeight"
              placeholder="请输入单根轨道重量（公斤/米）"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轨道单价(元/公斤)" prop="trackUnprice">
            <el-input
              v-model="form.trackUnprice"
              placeholder="请输入轨道单价(元/公斤)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轨道压板单价(元)" prop="tppUnprice">
            <el-input
              v-model="form.tppUnprice"
              placeholder="请输入轨道压板单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联结板单价(元)" prop="cpUnprice">
            <el-input
              v-model="form.cpUnprice"
              placeholder="请输入联结板单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轨道吊装台班单价(元)" prop="thsUnprice">
            <el-input
              v-model="form.thsUnprice"
              placeholder="请输入轨道吊装台班单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轨道安装单价(元)" prop="trackInstallPrice">
            <el-input
              v-model="form.trackInstallPrice"
              placeholder="请输入轨道安装单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
      </template>
      <template v-else-if="form.partType == 2">
        <el-col :span="8">
          <el-form-item label="滑线级数" prop="splLevel">
            <el-select
              v-model="form.splLevel"
              placeholder="请选择"
              clearable
              style="width: 60%"
            >
              <el-option
                v-for="dict in q_spl_level"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="最大电流" prop="electricMax">
            <template v-if="form.splLevel == 1">
              <el-select
                v-model="form.electricMax"
                placeholder="请选择"
                clearable
                style="width: 60%"
              >
                <el-option
                  v-for="dict in q_electric_max"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else-if="form.splLevel == 2">
              <el-select
                v-model="form.electricMax"
                placeholder="请选择"
                clearable
                style="width: 60%"
              >
                <el-option
                  v-for="dict in qq_electric_max"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </template>
            <template v-else>
              <el-select
                placeholder="请选择"
                clearable
                style="width: 60%"
              ></el-select>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="滑线名称" prop="splPartName">
            <el-input
              v-model="form.splPartName"
              placeholder="请输入滑线名称"
              style="width: 60%"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="滑触线单价(元)" prop="trolleyUnprice">
            <el-input
              v-model="form.trolleyUnprice"
              placeholder="请输入滑触线单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="集电器" prop="collector">
            <el-input
              v-model="form.collector"
              placeholder="请输入集电器"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="安装费单价(元)" prop="installUnprice">
            <el-input
              v-model="form.installUnprice"
              placeholder="请输入安装费单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="指示灯单价(元)" prop="idlightUnprice">
            <el-input
              v-model="form.idlightUnprice"
              placeholder="请输入指示灯单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上升电缆单价(元)" prop="rcableUnprice">
            <el-input
              v-model="form.rcableUnprice"
              placeholder="请输入上升电缆单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
      </template>
      <template v-else-if="form.partType == 3">
        <el-col :span="8">
          <el-form-item label="重量(t)" prop="weight">
            <el-input
              v-model="form.weight"
              placeholder="请输入重量(t)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单价(元)" prop="unprice">
            <el-input
              v-model="form.unprice"
              placeholder="请输入单价(元)"
              style="width: 60%"
              type="number"
              oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="轨道型号" prop="trackModel">
            <el-select
              v-model="form.trackModel"
              placeholder="请选择"
              clearable
              style="width: 60%"
            >
              <el-option
                v-for="dict in q_track_model"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </template>
      <template v-else-if="form.partType == 4">
        <el-col :span="8">
          <el-form-item label="型号" prop="model">
            <el-input
              v-model="form.model"
              placeholder="请输入型号"
              style="width: 60%"
              maxlength="16"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌" prop="brand">
            <el-input
              v-model="form.brand"
              placeholder="请输入品牌"
              style="width: 60%"
              maxlength="16"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row v-else>
      <el-col :span="8">
        <el-form-item label="部件类型" prop="partType">
          <el-select
            v-model="form.partType"
            placeholder="请选择"
            clearable
            style="width: 60%"
            @change="handlePartType"
            :disabled="disabled"
          >
            <el-option
              v-for="dict in q_part_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="起重机类型" prop="craneType">
          <el-select
            v-model="form.craneType"
            placeholder="请选择"
            clearable
            style="width: 60%"
            @change="handleCraneType"
            :disabled="disabled"
          >
            <el-option
              v-for="dict in q_crane_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="起升重量(t)" prop="liftWeight">
          <el-select
            v-model="form.liftWeight"
            placeholder="请选择"
            clearable
            style="width: 60%"
            :disabled="disabled"
          >
            <el-option
              v-for="item in liftWeight"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="操作方式" prop="craneOperation">
          <el-select
            v-model="form.craneOperation"
            placeholder="请选择"
            clearable
            style="width: 60%"
            :disabled="disabled"
          >
            <el-option
              v-for="dict in q_oper_mode"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="遥控器" prop="control">
          <el-select
            v-model="form.control"
            placeholder="请选择"
            clearable
            style="width: 60%"
            :disabled="disabled"
          >
            <el-option
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="起重机型号" prop="craneModel">
          <template v-if="form.craneType == 1">
            <el-select
              v-model="form.craneModel"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_single_crane_model"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 2">
            <el-select
              v-model="form.craneModel"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_double_crane_model"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 3">
            <el-select
              v-model="form.craneModel"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_susp_crane_model"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            ></el-select>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="跨度" prop="span">
          <template v-if="form.craneType == 1">
            <el-select
              v-model="form.span"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_single_crane_span"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 2">
            <el-select
              v-model="form.span"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_double_crane_span"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 3">
            <el-select
              v-model="form.span"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_susp_crane_span"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            ></el-select>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="起升高度" prop="liftHeight">
          <template v-if="form.craneType == 1">
            <el-select
              v-model="form.liftHeight"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_single_crane_lift_height"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 2">
            <el-select
              v-model="form.liftHeight"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_double_crane_lift_height"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 3">
            <el-select
              v-model="form.liftHeight"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_susp_crane_lift_height"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            ></el-select>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="工作级别" prop="workLevel">
          <template v-if="form.craneType == 1">
            <el-select
              v-model="form.workLevel"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_single_crane_work_level"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 2">
            <el-select
              v-model="form.workLevel"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_double_crane_work_level"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else-if="form.craneType == 3">
            <el-select
              v-model="form.workLevel"
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            >
              <el-option
                v-for="dict in q_susp_crane_work_level"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-select
              placeholder="请选择"
              clearable
              style="width: 60%"
              :disabled="disabled"
            ></el-select>
          </template>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="数量" prop="quantity">
          <el-input
            v-model="form.quantity"
            placeholder="请输入"
            style="width: 60%"
            :disabled="disabled"
            type="number"
            oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="部件编码" prop="partCode">
          <el-input
            v-model="form.partCode"
            placeholder="请输入"
            style="width: 60%"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="品牌" prop="brand">
          <el-input
            v-model="form.brand"
            placeholder="请输入"
            style="width: 60%"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单位" prop="unit">
          <el-select
            v-model="form.unit"
            placeholder="请选择"
            clearable
            style="width: 60%"
          >
            <el-option
              v-for="dict in q_unit"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="单价(元)" prop="unitPrice">
          <el-input
            v-model="form.unitPrice"
            placeholder="请输入"
            style="width: 60%"
            type="number"
            oninput="if(value<0){value='0'} if(value.length>16)value=value.slice(0,16)"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup name="PartSave">
const { proxy } = getCurrentInstance()

const liftWeight = [
  {
    value: '2',
    label: '2',
  },
]

const props = defineProps({
  // 表格数据
  form: {
    type: Array,
    default: () => {},
  },
  // 校验
  rules: {
    type: Array,
    default: () => {},
  },
  // 部件类型
  type: {
    type: String,
    default: 'install',
  },
  disabled: {
    type: Boolean,
    default: 'install',
  },
})

const {
  q_part_type,
  q_fixed_mode,
  q_track_model,
  q_install_parttype,
  q_spl_level,
  q_crane_type,
  q_oper_mode,
  sys_yes_no,
  q_single_crane_model,
  q_double_crane_model,
  q_susp_crane_model,
  q_single_crane_span,
  q_double_crane_span,
  q_susp_crane_span,
  q_single_crane_lift_height,
  q_double_crane_lift_height,
  q_susp_crane_lift_height,
  q_single_crane_work_level,
  q_double_crane_work_level,
  q_susp_crane_work_level,
  q_unit,
  q_electric_max,
  qq_electric_max,
} = proxy.useDict(
  'q_part_type',
  'q_fixed_mode',
  'q_track_model',
  'q_install_parttype',
  'q_spl_level',
  'q_crane_type',
  'q_oper_mode',
  'sys_yes_no',
  'q_single_crane_model',
  'q_double_crane_model',
  'q_susp_crane_model',
  'q_single_crane_span',
  'q_double_crane_span',
  'q_susp_crane_span',
  'q_single_crane_lift_height',
  'q_double_crane_lift_height',
  'q_susp_crane_lift_height',
  'q_single_crane_work_level',
  'q_double_crane_work_level',
  'q_susp_crane_work_level',
  'q_unit',
  'q_electric_max',
  'qq_electric_max',
)

function handlePartType() {
  props.form = {}
}
</script>
