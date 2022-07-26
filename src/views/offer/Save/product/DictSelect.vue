<template>
  <el-select v-bind="$props">
    <el-option
      v-for="item in dataSource"
      :key="item.dictCode"
      :value="item.dictValue"
      :label="item.dictLabel"
    />
  </el-select>
</template>

<script setup name="DictSelect">
import {onMounted, ref, watch} from "vue";
import useDictionaryStore from "@/store/modules/dict"

const dictionaryStore = useDictionaryStore();

const props = defineProps({
  dictType: {
    type: String,
    default: ''
  }
})

const dataSource = ref([])

const queryData = (value) => {
  if (value) {
    dictionaryStore.getData(value).subscribe(data => {
      dataSource.value = data || []
    })
  }
}

onMounted(() => {
  queryData(props.dictType)
})

watch(() => props.dictType, (value) => {
  // console.log(value)
  queryData(value)
})

</script>

<style scoped>

</style>