import 'dotenv/config' // required for env
import ProductAdvertisingAPIv1 from 'paapi5-nodejs-sdk'
import type { SearchData } from './types'
const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance
const MAX_PAGES = 10 // API LIMITATION: cant ask for more than 10 pages AND 10 results per page
const START_PAGE = 1
// Specify your credentials here. These are used to create and sign the request.
defaultClient.accessKey = process.env.AMAZON_ACCESS_KEY
defaultClient.secretKey =  process.env.AMAZON_SECRET_KEY
 
/**
 * Specify Host and Region to which you want to send the request to.
 * For more details refer:
 * https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
 */
defaultClient.host = 'webservices.amazon.com'
defaultClient.region = 'us-east-1'
 
const api = new ProductAdvertisingAPIv1.DefaultApi()
 
/**
 * The following is a sample request for SearchItems operation.
 * For more information on Product Advertising API 5.0 Operations,
 * refer: https://webservices.amazon.com/paapi5/documentation/operations.html
 */
const searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest()
 
/** Enter your partner tag (store/tracking id) and partner type */
searchItemsRequest['PartnerTag'] = process.env.AMAZON_PARTNER_TAG
searchItemsRequest['PartnerType'] = 'Associates'
  
// Specify search keywords
searchItemsRequest['Keywords'] = process.env.AMAZON_KEYWORDS

/**
  * Specify the category in which search request is to be made.
  * For more details, refer:
  * https://webservices.amazon.com/paapi5/documentation/use-cases/organization-of-items-on-amazon/search-index.html
  */
searchItemsRequest['SearchIndex'] = process.env.AMAZON_SEARCH_INDEX
  
// Specify the number of items to be returned in search result
searchItemsRequest['ItemCount'] = MAX_PAGES
searchItemsRequest['ItemPage'] = START_PAGE

/**
  * Choose resources you want from SearchItemsResource enum
  * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
  */
searchItemsRequest['Resources'] = [
  'Images.Primary.Large',
  'Images.Variants.Large',
  'ItemInfo.Title',
  'ItemInfo.Features',
  'ItemInfo.ManufactureInfo',
  'ItemInfo.ProductInfo',
  'ItemInfo.TechnicalInfo',
  'ItemInfo.Classifications',
  'Offers.Listings.Price'
]

export default async (): Promise<SearchData> => {
  let currentPage = START_PAGE
  let allData: SearchData | undefined

  while(currentPage < MAX_PAGES + 1) {
    const dataSet: {error?: Error, data?: SearchData} = await (new Promise((resolve, reject) => {
      searchItemsRequest['ItemPage'] = currentPage
      currentPage += 1
      api.searchItems(searchItemsRequest, (error: Error, data: SearchData):void => {
        setTimeout(() => {
          if(error) return reject({error})
          else return resolve({data})
        }, 1000) //api throttle
      })
    }))
    // eslint-disable-next-line prefer-const
    allData = allData || dataSet.data
    dataSet?.data?.SearchResult?.Items?.forEach((item) => {
      allData?.SearchResult.Items.push(item)
    })
  }
  return Promise.resolve(allData)
}