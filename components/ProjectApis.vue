<template>
  <div class="hm-api-panel project-apis">
    <h2 class="panel-title">模块API</h2>
    <a-list
      class="panel-content"
      itemLayout="horizontal"
      :dataSource="apiList"
    >
      <a-list-item class="panel-item" :class="activeLine[2] === index?'active':''"
        slot="renderItem" slot-scope="item, index" @click="showDetail(index)">
        <a-list-item-meta>
          <h4 slot="title">
            <a-tag :color="item.method === 'POST'?'red':'green'">{{item.method}}</a-tag>
            <span class="item-text">{{item.path}}</span>
          </h4>
          <span slot="description">{{item.summary}}</span>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  props: {
    apiList: {
      type: Array
    },
    activeLine: {
      type: Array
    }
  },
  methods: {
    showDetail(index) {
      this.$emit('showDetail',index)
    }
  }
}
</script>

<style scoped>
.project-apis{
  max-width: 355px;
  border-right: 1px solid #eee;
}
</style>