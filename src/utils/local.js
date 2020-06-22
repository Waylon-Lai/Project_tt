// 封装操作localStorage的方法

// 存储数据到 localStorage 中的方法
function setLocal (key, value) {
  // 获取到的是对象，要转成json格式的字符串
  window.localStorage.setItem(key, JSON.stringify(value))
}
// 从 localStorage 中获取数据的方法
function getLocal (key) {
  // 获取到的是json格式的字符串，要转成对象
  return JSON.parse(window.localStorage.getItem(key))
}
// 从 localStorage 中删除数据的方法
function removeLocal (key) {
  window.localStorage.removeItem(key)
}
// 按需导出
export {
  setLocal,
  getLocal,
  removeLocal
}
