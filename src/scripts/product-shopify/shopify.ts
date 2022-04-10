import Shopify, {ApiVersion, DataType} from '@shopify/shopify-api'
import type { SearchData } from './types'
const { 
  SHOPIFY_API_KEY, 
  SHOPIFY_API_SECRET_KEY, 
  SHOPIFY_SCOPES, 
  SHOPIFY_HOST, 
  SHOPIFY_SHOP,
  
} = process.env

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET_KEY,
  SCOPES: [
    SHOPIFY_SCOPES
  ],
  HOST_NAME: SHOPIFY_HOST.replace(/https:\/\//, ''),
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.April22 
})

const createProduct = async (data: SearchData): Promise<void>  => {
  if(!data) {
    const client = new Shopify.Clients.Rest(SHOPIFY_SHOP, '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')
    const product = {
      metafields: [
        {
          key: 'external_url',
          value: 'https://rvdevil.com',
          type: 'single_line_text_field',
          namespace: 'global'
        }
      ],
      title : 'Test title',
      body_html : '<strong>testing</strong>',
      vendor : 'tester',
      product_type : 'Tested',
      tags : [
        'test'
      ],
    }
    try {
      const retVal = await client.post({data: {product}, path: 'products', type: DataType.JSON})
      console.log(JSON.stringify(retVal.body))
    } catch (e) {
      console.error(e)
    }
  }
  return
}

export default async (data?: SearchData):Promise<void> => {
  console.log(data ? 'got data 🥓' : 'no data 😢')
  return createProduct(data)
}