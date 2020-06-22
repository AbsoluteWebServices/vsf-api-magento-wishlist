import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
const Magento2Client = require('magento2-rest-client').Magento2Client

module.exports = ({ config, db }) => {
  let magentoWishlistApi = Router()

  magentoWishlistApi.get('/', (req, res) => {
    const token = req.query.token
    if (!token) {
      apiStatus(res, 'User token required', 500)
      return
    }

    const client = Magento2Client(config.magento2.api)
    client.addMethods('wishlist', restClient => {
      let module = {}

      module.load = () => {
        return restClient.get('/wishlist', token)
      }
      return module
    })

    client.wishlist.load().then(result => {
      apiStatus(res, result, 200)
    }).catch(err => {
      apiStatus(res, err, 500)
    })
  })

  magentoWishlistApi.put('/:sku', (req, res) => {
    const token = req.query.token
    if (!token) {
      apiStatus(res, 'User token required', 500)
      return
    }

    const sku = req.params.sku

    if (!sku) {
      apiStatus(res, 'Product SKU required', 500)
      return
    }

    const client = Magento2Client(config.magento2.api)
    client.addMethods('wishlist', restClient => {
      let module = {}

      module.add = (sku) => {
        return restClient.put('/wishlist/' + sku, null, token)
      }
      return module
    })

    client.wishlist.add(sku).then(result => {
      apiStatus(res, result, 200)
    }).catch(err => {
      apiStatus(res, err, 500)
    })
  })

  magentoWishlistApi.delete('/', (req, res) => {
    const token = req.query.token
    if (!token) {
      apiStatus(res, 'User token required', 500)
      return
    }

    const items = req.body.items

    if (!items || items.length < 1) {
      apiStatus(res, 'Product IDs required', 500)
      return
    }

    const client = Magento2Client(config.magento2.api)
    client.addMethods('wishlist', restClient => {
      let module = {}

      module.remove = (id) => {
        return restClient.delete('/wishlist/' + id, token)
      }
      return module
    })

    const deleteItems = []
    for (let i = 0; i < items.length; i++) {
      const id = items[i]
      deleteItems.push(client.wishlist.remove(id))
    }

    Promise.all(deleteItems).then(result => {
      apiStatus(res, result, 200)
    }).catch(err => {
      apiStatus(res, err, 500)
    })
  })

  magentoWishlistApi.delete('/:id', (req, res) => {
    const token = req.query.token
    if (!token) {
      apiStatus(res, 'User token required', 500)
      return
    }

    const id = req.params.id

    if (!id) {
      apiStatus(res, 'Product ID required', 500)
      return
    }

    const client = Magento2Client(config.magento2.api)
    client.addMethods('wishlist', restClient => {
      let module = {}

      module.remove = (id) => {
        return restClient.delete('/wishlist/' + id, token)
      }
      return module
    })

    client.wishlist.remove(id).then(result => {
      apiStatus(res, result, 200)
    }).catch(err => {
      apiStatus(res, err, 500)
    })
  })

  return magentoWishlistApi
}
