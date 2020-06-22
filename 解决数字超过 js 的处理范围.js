var obj = '{"id": 900719925474099211}'
// 用js原生方法解析出来的数据 由于超出了js处理数字的范围，会造成精度的丢失
// console.log(JSON.parse(obj)) // 900719925474099200

// 如果要解决以上问题：可以使用第三方插件 [json-bigint](https://github.com/sidorares/json-bigint)
var JSONbig = require('json-bigint')
var res = JSONbig.parse(obj)
console.log(res) // { id: BigNumber { s: 1, e: 17, c: [ 9007, 19925474099211 ] } }
console.log(res.id) // BigNumber { s: 1, e: 17, c: [ 9007, 19925474099211 ] }
console.log(res.id.toString()) // '900719925474099211'
