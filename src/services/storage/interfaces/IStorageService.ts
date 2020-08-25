export default interface IStorageService {
  save (fileName: string): Promise<void>
  delete (fileName: string): Promise<void>
}
