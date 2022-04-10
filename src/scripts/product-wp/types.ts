type SearchImage = {
    URL: string,
    Height: number,
    Width: number
}

export type SearchImageSizes = {
    Medium?: SearchImage
    Large?: SearchImage
}

export type WPImage = {
    src?: string
}

export type WPImages = WPImage[] | []
export type SearchImages = {
    Primary?: SearchImageSizes
    Variants?: SearchImageSizes[]
}

type SearchItemInfo = {
    DisplayValue: string,
    Label: string,
    Locale: string
}

type SearchItemDimensions = {
    DisplayValue: number,
    Label: string,
    Locale: string
    Unit: string
}

type SearchClassifications = {
    ProductGroup: SearchItemInfo
}

type SearchFeatures = {
    DisplayValues: string[]
    Label: string
    Locale: string
}

type SearchManufactureInfo = {
    ItemPartNumber: SearchItemInfo
}

type ProductInfoType = {
    IsAdultProduct:  {
        DisplayValue: boolean,
        Label: string,
        Locale: string
      },
      ItemDimensions: {
            Height: SearchItemDimensions
            Length: SearchItemDimensions
            Width: SearchItemDimensions
      }
}

type SearchItemInfoTypes = {
    Title: SearchItemInfo
    Classifications: SearchClassifications
    Features: SearchFeatures
    ManufactureInfo: SearchManufactureInfo
    ProductInfo: ProductInfoType
}

type SearchPrice = {
    Amount: number,
    Currency: string,
    DisplayAmount: string
}

type SearchOffer = {
    Id: string,
    Price: SearchPrice
    ViolatesMAP: boolean
}

type SearchOfferTypes = {
    Listings: SearchOffer[]
}

export type SearchResult = {
    ASIN: string,
    DetailPageURL: string,
    Images: SearchImages,
    ItemInfo: SearchItemInfoTypes
    Offers: SearchOfferTypes
}

type SearchResults = {
    TotalResultCount: number,
    SearchURL: string,
    Items: SearchResult[]
}

export type SearchData = {
    SearchResult: SearchResults
}

export type ProductCategory = {
    id: number,
    name?: string,
    slug?: string,
    parent?: number,
    description?: string,
    image?: unknown,
    menu_order?: number,
    count?: number,
}

export type WPProduct = {
    name?: string,
    description?: string,
    short_description?: string,
    type?: 'external',
    price?: string,
    regular_price?: string,
    sale_price?: string,
    dimensions?: {
        length?: string,
        width?: string,
        height?: string
    },
    categories?: ProductCategory[],
    sku: string,
    external_url: string,
    images: WPImage[]
}