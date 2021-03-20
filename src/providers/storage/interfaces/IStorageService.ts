export default interface IStorageService {
  save (fileName: string, newName?: string): Promise<void>
  delete (fileName: string, isTemp: boolean): Promise<void>
}
