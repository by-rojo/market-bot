import { WHITELIST } from './constants'
import 'dotenv/config' // required for env
import scrape from  './scrape'

scrape(WHITELIST).finally(() => {
  process.exit()
})
// nice to be explicit