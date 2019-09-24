<template>
  <div class="hm-api-panel project-tags">
    <h2 class="panel-title">业务模块</h2>
    <a-list
      class="panel-content"
      itemLayout="horizontal"
      :dataSource="tagList"
    >
      <a-list-item class="panel-item" :class="activeLine[1] === index?'active':''" slot="renderItem" slot-scope="item, index" @click="showApis(index)">
        <a-list-item-meta>
          <span class="item-text" slot="title">{{item}}</span>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  props: {
    tagList: {
      type: Array
    },
    activeLine: {
      type: Array
    }
  },
  methods: {
    showApis(index) {
      this.$emit('showApis', index)
    }
  }
}
</script>

<style scoped>
.project-tags{
  max-width: 320px;
  border-right: 1px solid #eee;
}
.active{
  color: #52c41a;
}
</style>