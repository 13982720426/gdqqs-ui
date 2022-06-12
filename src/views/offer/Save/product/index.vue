<template>
  <div class="offer-save-product">
    <OfferSaveTitle
        title="产品信息"
    >
      <el-form
          label-position="left"
      >
        <el-form-item label="车间名称" required>
          <el-select>

          </el-select>
        </el-form-item>
        <div class="product-item">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="起重机类型" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="操作方式" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="起升重量" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="工作级别" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="product-item">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="起重机类型" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="操作方式" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="起升重量" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :labelWidth="100" label="工作级别" required>
                <el-select></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-descriptions :column="4">
                <el-descriptions-item label="型号">xxxxx</el-descriptions-item>
                <el-descriptions-item label="额定功率(KW)">kooriookami</el-descriptions-item>
                <el-descriptions-item label="起升速度">kooriookami</el-descriptions-item>
                <el-descriptions-item label="小车运行速度">kooriookami</el-descriptions-item>
                <el-descriptions-item label="大车运行速度">kooriookami</el-descriptions-item>
              </el-descriptions>
            </el-col>
            <el-col :span="24">
              <el-button>选择部件</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </OfferSaveTitle>
  </div>
</template>

<script setup name="OfferSaveProduct">
import OfferSaveTitle from '../../components/Title'
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