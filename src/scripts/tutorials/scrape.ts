import axios from 'axios'

const scrape = async (url: string): Promise<unknown> => {
  return await axios.get(url)
}

const scraper = async (whiteList: string[]): Promise<boolean> => {
  let success = true
  let currentIndex = 0
  try {
    while(currentIndex < whiteList.length && success)
    {
      console.log(await scrape(whiteList[currentIndex]))
      currentIndex++
      if(!success) {
        throw Error('not successful')
      }
    }
  } catch(e) {
    console.error('💩:', e.message, whiteList.splice(0, currentIndex)) 
    success = false
    return scraper(whiteList.splice(0, currentIndex))
  }
  process.stdout.write('💰💰💰💰💰💰💰✅')
  return success
}
export { scraper }
export default scraper