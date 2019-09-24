<template>
  <a-modal
    :visible="visible"
    title="新增配置"
    width="600px"
    @cancel="handleCancel"
    @ok="handleSubmit"
    :confirmLoading="confirmLoading"
    okText="保存"
    cancelText="取消"
  >
    <a-form :form="form">
      <a-form-item
        label="ip："
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input
          placeholder="请输入ip地址"
          v-decorator="[
            'hostname',
            {
              rules: [{
                required: true,
                message: '请输入ip地址',
              }],
              initialValue: '192.168.1.94'
            }
          ]" />
      </a-form-item>
      <a-form-item
        label="端口："
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input-number
          style="width:100%"
          placeholder="请输入端口"
          v-decorator="['port',{
            rules: [{
                required: true,
                message: '请输入端口',
              }],
          }]" />
      </a-form-item>
      <a-form-item
        label="路径："
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <a-input
          placeholder="请输入路径"
          v-decorator="['path', {
            rules: [{
                required: true,
                message: '请输入路径',
              }],
            initialValue: '/v2/api-docs?group=ayg'
          }]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {
      formItemLayout: { // 表单布局
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          this.$axios.post('/api/add-config', values).then(({ data }) => {
            if(data.code === 200) {
              this.$emit('submit')
              this.$emit('update:visible', false)
            } else {
              this.$message.error(data.msg)
            }
          }).finally(() => {
            this.confirmLoading = false
          })
          
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
  },
}
</script>

<style>

</style>
