import InvalidArgumentError from '../../../errors/InvalidArgumentError'

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
      throw new InvalidArgumentError('Invalid parameter.', false, 400, {
        property: 'minEducation',
        value: educationLevel,
        constraints: {
          contains: `minEducation must contain a choice between: ${educationLevel}.`
        }
      })
    }
  }
}
