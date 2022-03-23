import { WHITELIST } from './constants'
const scraper = (): boolean => {
  WHITELIST.map(
    url => {
      console.log(url)
    }
  )
  process.stdout.write('whoooooohoooo')
  return false
}

export { scraper }
export default scraper