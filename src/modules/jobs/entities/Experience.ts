import InvalidArgumentError from '../../../errors/InvalidArgumentError'

export default class Experience {
  private experience: string

  constructor (experience: string) {
    this.checkExperience(experience)
    this.experience = experience
  }

  public getExperience (): string {
    return this.experience
  }

  private checkExperience (experience: string): void {
    const experiences: Array<string> = ['No Experience', '1 Year - 2 Years', '2 Years - 5 Years', '5 Years+']
    if (!experiences.includes(experience)) {
      throw new InvalidArgumentError('Invalid parameter.', false, 400, {
        property: 'experience',
        value: experience,
        constraints: {
          contains: `experience must contain a choice between: ${experiences}.`
        }
      })
    }
  }
}