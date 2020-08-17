export default class Industry {
  private industryType: Array<string>

  constructor (industryType: Array<string>) {
    this.checkIndustryType(industryType)
    this.industryType = industryType
  }

  public getIndustryType (): Array<string> {
    return this.industryType
  }

  private checkIndustryType (industryType: Array<string>): void {
    const industryTypes: Array<string> = ['Business', 'Information Technology', 'Banking', 'Education/Training', 'Telecommunication', 'Others']
    industryType.forEach(industry => {
      if (!industryTypes.includes(industry)) {
        throw new Error('Invalid industry type.')
      }
    })
  }
}
