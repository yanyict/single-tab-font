'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"//110.88.128.142:8099"',
  TOPOLOGY_URL: '"http://localhost:8080/topology/"'
})
