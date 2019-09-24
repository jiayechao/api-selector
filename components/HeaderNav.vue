<template>
  <div class="header-nav">
    <a-button style="marginRight: 20px" shape="circle" icon="bars" @click="showConfigListDialog"></a-button>
    <a-select
      showSearch
      placeholder="请选择项目"
      optionFilterProp="children"
      style="width: 200px"
      @change="handleChange"
      :filterOption="filterOption"
    >
      <a-select-option v-for="(item,index) in projectList" :key="item.title" :value="index">{{item.title}}</a-select-option>
    </a-select>
    <div style="position: relative">
      <a-input
        class="search-input"
        placeholder="搜索api"
        @change="onSearch"
        @focus="showSearch"
      />
      <search-api v-bind="$attrs" v-on="$listeners" :show.sync="showSearchApis"></search-api>
    </div>
    <a-button class="config-route" @click="configDialogShow = true">添加配置</a-button>
    <!-- 添加配置 -->
    <config-dialog :visible.sync="configDialogShow"
      v-bind="$attrs" v-on="$listeners"></config-dialog>
      <!-- 配置列表 -->
    <config-list-dialog :visible.sync="configListDialogShow" :config-list="configList"
      v-bind="$attrs" v-on="$listeners"></config-list-dialog>
  </div>
</template>

<script>
import SearchApi from '~/components/SearchApi.vue'
import ConfigDialog from '~/components/ConfigDialog.vue'
import ConfigListDialog from '~/components/ConfigListDialog.vue'

export default {
  inheritAttrs: false,
  props: {
    projectList: {
      type: Array
    },
    activeLine: {
      type: Array
    }
  },
  data() {
    return {
      showSearchApis: false, // 是否显示搜索结果
      selectedProject: '', // 选中的项目
      configDialogShow: false, // 配置弹窗
      configListDialogShow: false, // 配置列表 
      configList: [], // 配置列表
    }
  },
  components: {
    SearchApi,
    ConfigDialog,
    ConfigListDialog,
  },
  methods: {
    // 获取所有配置
    getAllConfigList() {
      return this.$axios.get('/api/all-config').then(({ data }) => {
        if(data.code === 200) {
          this.configList = data.data
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 输入时搜索
    onSearch (e) {
      // 先判断是否选了项目，如果没有弹出让他选项目
      if(!this.selectedProject && this.selectedProject !== 0) {
        this.$message.warning('请先选择项目')
        return
      }
      this.$emit('searchApi', e.target.value)
    },
    // 选择框
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 选中项目时
    handleChange(val) {
      this.selectedProject = val
      this.$emit('changeProject', val)
    },
    showSearch(e) {
      // 先判断是否选了项目，如果没有弹出让他选项目
      if(!this.selectedProject && this.selectedProject !== 0) {
        this.$message.warning('请先选择项目')
        return
      }
      // 鼠标在输入框时显示搜索面板
      this.showSearchApis= true
    },
    // 展示所有的配置
    showConfigListDialog() {
      this.getAllConfigList().then(() => {
        this.configListDialogShow = true
      })
    }
  }
}
</script>

<style scoped>
.header-nav{
  display: flex;
  align-items: center;
  height: 100%;
}
.search-input {
  width: 200px;
  margin:0 20px;
}
</style>