<template>
  <div class="hm-api-panel project-list">
    <h2 class="panel-title">项目列表</h2>
    <a-list
      class="panel-content"
      itemLayout="horizontal"
      :dataSource="projectList"
    >
      <a-list-item class="panel-item" :class="activeLine[0] === index?'active':''" slot="renderItem" slot-scope="item, index" @click="showTags(index)">
        <a-list-item-meta>
          <h4 class="item-text" slot="title">{{item.title}}</h4>
          <p class="item-text" slot="description">{{item.description}}/{{item.version}}</p>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  props: {
    projectList: {
      type: Array
    },
    activeLine: {
      type: Array
    }
  },
  methods: {
    showTags(index) {
      this.$emit('showTags', index)
    }
  }
}
</script>

<style scoped>
.project-list{
  max-width: 200px;
  border-right: 1px solid #eee;
}
</style>