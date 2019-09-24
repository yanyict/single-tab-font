import Permit from './Permit.vue'
const PermitData = {
  install: function (Vue) {
    Vue.component('permit', Permit)
  //   Vue.component('selectTree', function (resolve, reject) {
  //     setTimeout(function () {
  //       require(['./SelectTree.vue'], resolve)
  //     })
  //   })  // seleTree
  }
}
export default PermitData
