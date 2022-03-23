import { RSS_FEEDS } from './constants'

//todo default scraper should pull from rss feed by default
type defaultScraperOptions = {
  url?: string
}

const rssScaperRunner = async (options: defaultScraperOptions): Promise<boolean> => {
  if(!RSS_FEEDS.includes(options.url)) return true
  return false
}

const scraper = async (whiteList: string[]): Promise<boolean> => {
  let success = true
  let currentIndex = 0
  try {
    while(currentIndex < whiteList.length && success)
    {
      currentIndex++
      success = await rssScaperRunner({url: whiteList[currentIndex - 1]})
      if(!success) {
        throw Error('not successful')
      }
    }
  } catch(e) {
    console.error('💩:', e.message, whiteList.splice(0, currentIndex)) 
    success = false
    return scraper(whiteList.splice(0, currentIndex + 1))
  }
  process.stdout.write('💰💰💰💰💰💰💰✅')
  return success
}
export { scraper }
export default scraper