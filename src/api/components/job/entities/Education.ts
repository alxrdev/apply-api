import InvalidArgumentError from '../../../../errors/InvalidArgumentError'

export default class Education {
  private educationLevel: string

  constructor (educationLevel: string) {
    this.checkEducationLevel(educationLevel)
    this.educationLevel = educationLevel
  }

  public getEducationLevel (): string {
    return this.educationLevel
  }

  private checkEducationLevel (educationLevel: string): void {
    const educationLevels: Array<string> = ['Bachelors', 'Masters', 'Phd']
    if (!educationLevels.includes(educationLevel)) {
      throw new InvalidArgumentError('The education level should be: \'Bachelors\', \'Masters\' or \'Phd\'.', false, 400)
    }
  }
}
