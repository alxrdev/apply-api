import dotenv from 'dotenv'
import nodeGeocoder, { GenericOptions } from 'node-geocoder'

dotenv.config()

const options: GenericOptions = {
  provider: 'mapquest',
  apiKey: process.env.GEOCODER_API_KEY ?? ''
}

const geoCoder = nodeGeocoder(options)

export default geoCoder
