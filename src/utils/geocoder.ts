import nodeGeocoder, { GenericOptions } from 'node-geocoder'

const options: GenericOptions = {
  provider: 'mapquest',
  apiKey: process.env.GEOCODER_API_KEY ?? ''
}

const geoCoder = nodeGeocoder(options)

export default geoCoder
