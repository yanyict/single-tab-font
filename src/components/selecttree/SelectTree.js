import seleTree from './SelectTree.vue'
const selectTree = {
  install: function (Vue) {
    Vue.component('selectTree', seleTree)
  //   Vue.component('selectTree', function (resolve, reject) {
  //     setTimeout(function () {
  //       require(['./SelectTree.vue'], resolve)
  //     })
  //   })  // seleTree
  }
}
export default selectTree
