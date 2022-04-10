import WPAPI from 'wpapi'

import type { 
  ProductCategory, 
  SearchData, 
  SearchImageSizes, 
  SearchImages, 
  SearchResult, 
  WPImage, 
  WPImages, 
  WPProduct 
} from './types'

const wp = new WPAPI({
  endpoint: process.env.WP_URL,
  username: process.env.WP_USER,
  password: process.env.WP_PASS
})

wp.deals = wp.registerRoute('wc/v3', '/products/(?P<id>\\d+)', {
  params: [
    'sku',
    'id'
  ]
})

wp.productCategories = wp.registerRoute('wc/v3/products', '/categories', {
  params: [
    'per_page',
    'page'
  ]
})

// eslint-disable-next-line unused-imports/no-unused-vars
const getCategories = async (classifications: string): Promise<{id: number}[]> => {
  const categories: ProductCategory[] = await wp.productCategories().per_page('100').page(1)
  let currentSet: ProductCategory[] | undefined = categories
  let page = 1
  while(currentSet?.length > 0) {
    try {
      // await recover()
      currentSet = await wp.productCategories().per_page('100').page(page)
      if(currentSet) {
        currentSet.forEach(cat => {
          categories.push(cat)
        })
        page++
      }
    } catch(e) {
      console.warn(e.message)
    }
  }

  const categoryId = categories.find(({name}) => name === classifications)?.id
  const categoryIds = [
    {id:  15}
  ]

  if(categoryId) {
    categoryIds[0].id = categoryId
  } else {
    const category = await wp.productCategories().create({
      name: classifications
    })
    categoryIds[0].id = category.id
  }
  
  return categoryIds
}

// we also need to upload images or set image urls and fix prices and dimensions

const findProductId = async (sku: string): Promise<number> => {
  //await recover()
  const record = await wp.deals().sku(sku)
  return record[0].id
}

const getImages = (Images: SearchImages): WPImages => {
  const images: WPImage[] | undefined = [
  ]

  if(Images) {
    Object.values(Images).forEach(imageType => {
      Object.values(imageType).forEach(
        imageSizes => {
          if(imageSizes.URL) {
            images.push({ src: imageSizes.URL } as WPImage)
          } else {          
            Object.values(imageSizes as SearchImageSizes).forEach(image => {
              images.push({ src: image.URL } as WPImage)
            })
          }
        })
    }) 
  }

  return images
}

const setData = async ({
  ItemInfo, 
  Offers, 
  DetailPageURL,
  ASIN,
  Images,
}: SearchResult): Promise<WPProduct> => {
  const categories = await getCategories(ItemInfo.Classifications.ProductGroup.DisplayValue)
  const price = Offers.Listings[0].Price.Amount  +  Math.floor((Math.random() * 10) + 1)
  const productData: WPProduct = {
    name: ItemInfo.Title.DisplayValue,
    description: ItemInfo.Features.DisplayValues.join('\r\n\r\n'),
    short_description: ItemInfo.Features.DisplayValues.join('\r\n\r\n'),
    type: 'external',
    //todo find cheapest price and highest price to determin the sale price
    price: Offers.Listings[0].Price.Amount.toString(),
    regular_price: price.toString(),
    sale_price:Offers.Listings[0].Price.Amount.toString(),
    dimensions: {
      length: ItemInfo.ProductInfo?.ItemDimensions?.Length?.toString(),
      width: ItemInfo.ProductInfo?.ItemDimensions?.Width?.toString(),
      height: ItemInfo.ProductInfo?.ItemDimensions?.Height?.toString()
    },
    categories,
    sku: ASIN,
    external_url: DetailPageURL,
    images:  getImages(Images)
  }

  return productData
}

const recover = async (timeout = 1000): Promise<void> => {
  return await (new Promise((resolve) => {
    setTimeout(resolve, timeout)
  }))
}

export default async (_data: SearchData): Promise<void> => {
  let i: number
  const {Items: items} = _data.SearchResult
  for (i = 0; i <  items.length; i++) {
    process.stdout.write(`🏃 running: ${items[i].ASIN} \r\n`)
    await recover()
    try {
      const data = await setData(items[i])
      const id = await findProductId(items[i].ASIN).catch(() => undefined)
      if(id) await wp.deals().id(id).update(data)
      else {
        await wp.deals().create({
          ...data,
          status: process.env.WP_STATUS
        })
      }
      console.log('done!', i)
    } catch (e) {
      console.error(e.message, i)
    }
  }
    
 
}