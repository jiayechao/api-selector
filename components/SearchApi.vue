<template>
  <div v-if="show" class="search-api">
    <a-list
      class="panel-content"
      itemLayout="horizontal"
      :dataSource="filterApis"
    >
      <a-list-item class="panel-item" slot="renderItem" slot-scope="item, index" @click="showFilterDetail(index)">
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
  name: 'search-api',
  props: {
    filterApis: {
      type: Array
    },
    show: {
      type: Boolean
    }
  },
  created() {
    // 点击外部隐藏
    document.body.addEventListener('click',(e) => {
      if(!this.$el.contains(e.target) && !e.target.className.includes('search-input')) {
        this.$emit('update:show',false)
      }
    }, false)
  },
  methods: {
    // 点击显示
    showFilterDetail(index) {
      this.$emit('update:show',false)
      this.$emit('showFilterDetail',index)
    }
  }
}
</script>

<style scoped>
.search-api{
  position: absolute;
  top: 60px;
  left: 20px;
  width: 400px;
  max-height: 500px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 0 5px 0 #666;
  overflow: auto;
  z-index: 1;
}
</style>