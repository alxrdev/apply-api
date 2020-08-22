export default interface FindJobsByGeolocationFiltersDTO {
  zipcode?: string
  distance?: number
  title?: string
  description?: string
  company?: string
  industry?: Array<string>
  jobType?: string
  minEducation?: string
  industryRegex?: Array<RegExp>
  page?: number
  limit?: number
}
