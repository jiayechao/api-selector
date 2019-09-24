<template>
  <div class="hm-api-panel api-detail">
    <h2 class="panel-title">API详情</h2>
    <div class="panel-content">
      <h3># 基本信息</h3>
      <a-table size="small" :columns="infoColumns" :dataSource="[apiDetail]" bordered :pagination="false"></a-table>
      <h3># 请求参数 <a-button type="primary" size="small" @click="copyRequestCode">复制</a-button></h3>
      <div class="code">
        <code>{{requestCode}}</code>
      </div>
      <h3># 状态码</h3>
      <a-table size="small" :columns="statusColumns" :dataSource="statusCode" bordered :pagination="false"></a-table>
      <h3># 响应参数 <a-button type="primary" size="small" @click="copyResponseCode">复制</a-button></h3>
      <div class="code">
        <code>{{responseCode}}</code>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    apiDetail: {
      type: Object
    },
    definitions: {
      type: Object
    }
  },
  data() {
    return {
      // 基本信息
      infoColumns: [
        {
          title: 'path',
          dataIndex: 'path',
        },
        {
          title: 'method',
          dataIndex: 'method',
        },
      ],
      // 状态码
      statusColumns: [
        {
          title: "satusCode",
          dataIndex: 'satusCode'
        },
        {
          title: "description",
          dataIndex: 'description'
        }
      ],
      // 递归的变量
      tmpNum: 0,
    }
  },
  computed: {
    requestCode() {
      return this.generateCode(this.apiDetail.method, 'req')
      // return ''
    },
    statusCode() {
      const keys = Object.keys(this.apiDetail.responses)
      const arr = []
      keys.forEach(item => {
        arr.push({
          satusCode: item,
          description: this.apiDetail.responses[item].description
        })
      })
      return arr
    },
    responseCode() {
      return this.generateCode(this.apiDetail.method, 'res')
    }
  },
  methods: {
    // 组装参数
    /**
     * method: POST, GET
     * http: req res
     */
    generateCode(method, http) {
      // get请求的参数
      if(http === 'req') {
        let obj = []
        if(!this.apiDetail.parameters) {
          return '没有参数'
        }
        // 组装参数和注释
        this.apiDetail.parameters.forEach(item => {
          obj.push(`"${item.name}": "${item.type}", ${item.description ? '// ' : ''}${item.description || ''}${item.required ? ',必填' : ''}`)
        })       
        obj = 
`{
  ${obj.join(`\n  `)}
}`
        return obj
      }
      // 先拿到schma，这里要分情况
      const schema = this.getSchmaFromHttp(http)
      if(schema === '') {
          return '没有参数'
      }
      if(!schema.schema) {
        return schema
      }
      // 然后递归生成代码
      const result = this.recusionSchma(schema.schema)
      return result

    },
    // 根据请求拿到最初的schma
    getSchmaFromHttp(http) {
      // 先拿到schma
      let schema
      if(http === 'req') {
        // get请求的参数是对象
        schema = this.apiDetail.parameters[0].schema.$ref.split('/')
      } else {
        const resSchema = this.apiDetail.responses['200'].schema
        // 没有参数
        if(!resSchema) {
          return ''
        }
        // 参数是数组
        if(resSchema.type === "array") {
          this[`tmpArrTag${this.tmpNum}`] = true
          // 基本类型数组
          if(!resSchema.items.$ref) {
            // 返回的是 data: [] 这样的形式
            return [resSchema.items.type]
          } else {
            // 对象数组
            schema = resSchema.items.$ref.split('/')
          }
          // 参数是对象
        } else if(resSchema.$ref) {
          this[`tmpArrTag${this.tmpNum}`] = false
          schema = resSchema.$ref.split('/')
          // 参数是字符串等基本类型
        } else {
          this[`tmpArrTag${this.tmpNum}`] = false
          return resSchema.type
        }
      }
      return schema = {schema: schema[schema.length - 1]}
    },
    // 递归array的数据对象
    recusionSchma(schema, obj = []) {
      if(!schema) {
        return '没有参数'
      }
      // schma详情
      const schemaDetail = this.definitions[schema]
      const propKeys = Object.keys(schemaDetail.properties)
      propKeys.map(prop => {
        if(schemaDetail.properties[prop].type === 'array') {
          if(schemaDetail.properties[prop].items.$ref) {
            // 将当前变量存起来
            this.tmpNum++
            this[`tmpObj${this.tmpNum}`] = obj
            this[`prop${this.tmpNum}`] = prop
            this[`tmpArr${this.tmpNum}`] = []
            this[`tmpArrTag${this.tmpNum}`] = true
            let childSchema = schemaDetail.properties[prop].items.$ref.split('/')
            childSchema = childSchema[childSchema.length - 1]
            return this.recusionSchma(childSchema, this[`tmpArr${this.tmpNum}`])
          } else {
            obj.push(`"${prop}": [${schemaDetail.properties[prop].items.type}], ${this.generateNotes(schemaDetail,prop)}`)
          }
        } else if(schemaDetail.properties[prop].$ref) {
          // 将当前变量存起来
            this.tmpNum++
            this[`tmpObj${this.tmpNum}`] = obj
            this[`prop${this.tmpNum}`] = prop
            this[`tmpArr${this.tmpNum}`] = []
            let childSchema = schemaDetail.properties[prop].$ref.split('/')
            childSchema = childSchema[childSchema.length - 1]
            this.recusionSchma(childSchema, this[`tmpArr${this.tmpNum}`])
        } else {
          // console.log(obj)
          obj.push(`"${prop}": "${schemaDetail.properties[prop].type}", ${this.generateNotes(schemaDetail,prop)}`)
        }
      })
      // console.log(obj)
      // 等循环递归完后，逐层还原回去
      // console.log(this.tmpNum)
      // 这里的缩进有点小小小的问题，后面有机会再改，没机会也无所谓
      console.log(`${this.tmpNum} is ${this[`tmpArrTag${this.tmpNum}`]}`)
      obj = 
`${this[`tmpArrTag${this.tmpNum}`]?'[':''}{
${this.tmpNum?' '.repeat(this.tmpNum*2):' '}${obj.join(`\n${this.tmpNum?' '.repeat(this.tmpNum*2):' '}`)}
${this.tmpNum?' '.repeat(this.tmpNum*2):' '}}${this[`tmpArrTag${this.tmpNum}`]?']':''}`
      if(this.tmpNum) {
        // ${this.generateNotes(schemaDetail,this[`prop${this.tmpNum}`])}
        // console.log('${this[`prop${this.tmpNum}`]}',`${this[`prop${this.tmpNum}`]}`)
        this[`tmpObj${this.tmpNum}`].push(`"${this[`prop${this.tmpNum}`]}": ${obj},`)
        this.tmpNum--
      }
      return obj
    },
    // 注释生成
    generateNotes(schemaDetail,prop) {
      const notes = `${schemaDetail.properties[prop].description ? '// ' : ''}${schemaDetail.properties[prop].description || ''}${schemaDetail.required && schemaDetail.required.includes(prop) ? ',必填' : ''}`
      return notes
    },
    // 复制请求
    copyRequestCode() {
      const self = this
      this.$copyText(this.requestCode).then( (e) => {
        self.$message.success('复制成功')
      }, (e) => {
        self.$message.error('复制失败，请手动复制')
        console.log(e)
      })
    },
    // 复制响应
    copyResponseCode() {
      const self = this
      this.$copyText(this.responseCode).then( (e) => {
        self.$message.success('复制成功')
      }, (e) => {
        self.$message.error('复制失败，请手动复制')
        console.log(e)
      })
    },
  }
}
</script>

<style scoped>
.api-detail{
  border-right: 1px solid #eee;
}
h3 {
  margin: 20px 0;
}
.code{
  background: #333;
  color: #fff;
  padding: 10px 30px;
  border-radius: 6px;
  white-space: pre-wrap;
}
</style>