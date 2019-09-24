<template>
  <a-modal
    :visible="visible"
    title="配置列表"
    width="600px"
    :footer="null"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
  >
    <a-table :columns="tableColumns" :dataSource="configList"
      :rowKey="record => (record.hostname + record.port)">
      <span slot="action" slot-scope="text,record">
        <a href="javascript:;" @click="removeConfig(record)">删除</a>
      </span>
    </a-table>
  </a-modal>
</template>

<script>
export default {
  props: ['visible', 'configList'],
  created() {
    
  },
  data() {
    return {
      confirmLoading: false,
      tableColumns: [
        {
          title: 'IP',
          dataIndex: 'hostname',
        },
        {
          title: '端口',
          dataIndex: 'port',
        },
        {
          title: '路径',
          dataIndex: 'path',
        },
        {
          title: '操作',
          dataIndex: 'action',
          slots: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100,
        },
      ]
    }
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 删除配置
    removeConfig(config) {
      const self = this
      this.$confirm({
        title: '确认删除配置吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          self.$axios.post('/api/remove-config', config).then(({ data }) => {
            if(data.code === 200) {
              self.$emit('submit')
              this.$emit('update:visible', false)
            } else {
              self.$message.error(data.msg)
            }
          })
        },
      })
      
    }
  },
}
</script>

<style>

</style>
