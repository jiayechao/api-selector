<template>
  <div class="container">
    <a-layout>
      <a-layout-header>
        <header-nav :project-list="projectList" :active-line="activeLine"
          :filter-apis="filterApis"
          @changeProject="changeProject" @searchApi="searchApi"
          @showFilterDetail="showFilterDetail" @submit="reloadPage"
          ></header-nav>
      </a-layout-header>
      <a-layout-content>
        <!-- 项目 -->
        <project-info :project-list="projectList" :active-line="activeLine" @showTags="getTagList"></project-info>
        <!-- tags -->
        <project-tags v-if="tagList.length" :tag-list="tagList" :active-line="activeLine" @showApis="getApiList"></project-tags>
        <!-- apis -->
        <project-apis v-if="apiList.length" :api-list="apiList" :active-line="activeLine" @showDetail="getApiDetail"></project-apis>
        <!-- api-detail -->
        <api-detail v-if="apiDetail.method" :api-detail="apiDetail" :definitions="definitions"></api-detail>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import HeaderNav from '~/components/HeaderNav.vue'
import ProjectInfo from '~/components/ProjectInfo.vue'
import ProjectTags from '~/components/ProjectTags.vue'
import ProjectApis from '~/components/ProjectApis.vue'
import ApiDetail from '~/components/ApiDetail.vue'

export default {
  created() {
    this.getALLProjectList()
  },
  data() {
    return {
      projectData: [],
      activeLine: [null, null, null], // 高亮
      tagList: [], //  业务模块
      apiList: [], // api列表
      apiDetail: {}, // api详情
      changeIndex: '', // 要查询的api项目
      filterApis: [],// 查询到的Api
    }
  },
  computed: {
    // 项目列表
    projectList() {
      let arr = []
      this.projectData.forEach(item => {
        arr.push(item.info)
      })
      return arr
    },
    definitions() {
      // 只有选了项目才有这个值
      return typeof this.activeLine[0] === 'number'?this.projectData[this.activeLine[0]].definitions:{}
    }
  },
  components: {
    HeaderNav,
    ProjectInfo,
    ProjectTags,
    ProjectApis,
    ApiDetail,
  },
  methods: {
    // 获取所有项目api
    getALLProjectList() {
      this.$axios.get('/api/all-api').then(({ data }) => {
        if(data.code === 200) {
          this.projectData = data.data
          // 有些地址请求出错
          if(data.msg !== 'ok') {
            this.$message.error(`${data.msg}请求出错，请自行处理或删除`)
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 初始化所选的列表，模块，api
    init(module, init) {
      this[module] = init
    },
    // 获取标签
    getTagList(index) {
      // 初始化tags，apis，apidetail
      this.activeLine = [index, null, null]
      this.init('apiList', [])
      this.init('apiDetail', {})
      this.tagList = this.projectData[index].tags
    },
    // 获取api列表
    getApiList(index) {
      // 初始化apis，apidetail
      if(this.activeLine[1] === index) {
        return
      }
      this.$set(this.activeLine, 1, index)
      this.$set(this.activeLine, 2, null)
      this.init('apiDetail', {})
      const result = this.projectData[this.activeLine[0]].apis.filter(item => {
        return item.tags.includes(this.tagList[index])
      })
      this.apiList = result
    },
    // 获取api详情
    getApiDetail(index) {
      this.$set(this.activeLine, 2, index)
      this.apiDetail = this.apiList[index]
    },
    // 修改选择项目
    changeProject(val) {
      this.changeIndex = val
      // this.$set(this.activeLine, 0, val)
    },
    // 查询api
    searchApi(val) {
      if(val === '') {
        this.filterApis = []
        return
      }
      console.log(val)
      const searchApis = this.projectData[this.changeIndex].apis.filter(item => item.path.includes(val))
      this.filterApis = searchApis
    },
    // 展示查询
    showFilterDetail(index) {
      // 展示搜索时只需要展示详情即可
      this.activeLine = [this.changeIndex, null, null]
      this.tagList = []
      this.apiList = []
      this.apiDetail = this.filterApis[index]
    },
    // 刷新页面
    reloadPage() {
      this.getALLProjectList()
    }
  }
}
</script>

<style>
.ant-layout-header{
  background: #1890ff;
}
.ant-layout-content{
  display: flex;
  background: #fff;
  height: calc(100vh - 64px);
  padding: 20px 0px;
}
.ant-layout-content .hm-api-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.panel-title{
  padding-left: 20px;
}
.panel-content {
  padding-left: 20px;
  padding-right: 20px;
  flex: 1;
  overflow: auto;
}
.panel-item{
  cursor: pointer;
}
.panel-item.active{
  margin: 0 -20px;
  padding: 12px 20px;
  box-shadow: 10px 0px 0px -5px #1890ff inset;
  background: #e6f7ff;
}
.panel-item:hover .item-text,.panel-item.active .item-text{
  color:#1890ff;
}
</style>
