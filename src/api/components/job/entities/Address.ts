export default class Address {
  private country: string
  private state: string
  private zipcode: string
  private city: string
  private district: string
  private street: string
  private houseNumber: number

  constructor (country: string, state: string, zipcode: string, city: string, district: string, street: string, houseNumber: number) {
    this.validateCountry(country)
    this.validateState(state)
    this.validateZipcode(zipcode)
    this.validateCity(city)
    this.validateDistrict(district)
    this.validateStreet(street)
    this.validateHouseNumber(houseNumber)

    this.country = country
    this.state = state
    this.zipcode = zipcode
    this.city = city
    this.district = district
    this.street = street
    this.houseNumber = houseNumber
  }

  public getCountry (): string {
    return this.country
  }

  public getState (): string {
    return this.state
  }

  public getZipcode (): string {
    return this.zipcode
  }

  public getCity (): string {
    return this.city
  }

  public getDistrict (): string {
    return this.district
  }

  public getStreet (): string {
    return this.street
  }

  public getHouseNumber (): number {
    return this.houseNumber
  }

  private validateCountry (country: string): void {
    if (country.length !== 3) {
      throw new Error('Invalid country.')
    }
  }

  private validateState (state: string): void {
    if (state.length !== 2) {
      throw new Error('Invalid state.')
    }
  }

  private validateZipcode (zipcode: string): void {
    if (zipcode.length !== 8) {
      throw new Error('Invalid zipcode.')
    }
  }

  private validateCity (city: string): void {
    if (city.length < 1) {
      throw new Error('Invalid city.')
    }
  }

  private validateDistrict (district: string): void {
    if (district.length < 1) {
      throw new Error('Invalid district.')
    }
  }

  private validateStreet (street: string): void {
    if (street.length < 1) {
      throw new Error('Invalid street.')
    }
  }

  private validateHouseNumber (houseNumber: number): void {
    if (houseNumber < 0) {
      throw new Error('Invalid houseNumber.')
    }
  }
}
