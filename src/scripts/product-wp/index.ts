import getProducts from './amazon'
import wp from './wp'

setTimeout(() => {
  getProducts().then(data => {
    return wp(data)
  }).catch(e => console.error(e))
}, 10000)
