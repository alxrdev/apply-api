import { AppError } from '@errors/index'
import UpdateUserAvatarDTO from '@modules/users/dtos/UpdateUserAvatarDTO'
import { User } from '@modules/users/entities'
import { UserNotFoundError } from '@modules/users/errors'
import FakeUserRepository from '@modules/users/repositories/fake/FakeUserRepository'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import { UpdateUserAvatarUseCase } from '@modules/users/useCases'
import FakeStorageService from '@src/providers/storage/FakeStorageService'
import IStorageService from '@src/providers/storage/interfaces/IStorageService'

const makeDto = (fields = {}) : UpdateUserAvatarDTO => {
  const data = { id: '2', authId: '2', avatar: 'avatar.jpg', ...fields }
  return Object.assign(new UpdateUserAvatarDTO(), data)
}

let userRepository: IUserRepository
let fakeStorage: IStorageService

const makeSut = () : UpdateUserAvatarUseCase => new UpdateUserAvatarUseCase(userRepository, fakeStorage)

describe('Tests the UpdateUserAvatarUseCase class', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    userRepository = new FakeUserRepository()
    await userRepository.create(User.builder()
      .withId('1')
      .withName('user')
      .withEmail('user@email.com')
      .withAvatar('default.jpg')
      .withPassword('password')
      .build()
    )
    await userRepository.create(User.builder()
      .withId('2')
      .withName('user')
      .withEmail('user2@email.com')
      .withAvatar('user.jpg')
      .withPassword('password')
      .build()
    )

    fakeStorage = new FakeStorageService()
  })

  it('Should throw an AppError when a required field is not provided', async () => {
    const updateUserAvatarUseCase = makeSut()
    const dto = makeDto({ avatar: '' })

    await expect(updateUserAvatarUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an AppError when the user to update is not the authenticated user', async () => {
    const updateUserAvatarUseCase = makeSut()
    const dto = makeDto({ id: '3' })

    await expect(updateUserAvatarUseCase.execute(dto)).rejects.toThrowError(AppError)
  })

  it('Should throw an UserNotFoundError when not found the user', async () => {
    const updateUserAvatarUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const dto = makeDto({ id: '5', authId: '5' })

    await expect(updateUserAvatarUseCase.execute(dto)).rejects.toThrowError(UserNotFoundError)
    expect(spyFindById).toHaveBeenCalled()
  })

  it('Should delete the uploaded user avatar when an error occurs', async () => {
    const updateUserAvatarUseCase = makeSut()
    const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
    const dto = makeDto({ id: '3' })

    await expect(updateUserAvatarUseCase.execute(dto)).rejects.toThrowError(AppError)
    expect(spyStorageDelete).toHaveBeenCalled()
  })

  it('Should save the new user avatar', async () => {
    const updateUserAvatarUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const spyStorageSave = jest.spyOn(fakeStorage, 'save')
    const dto = makeDto()

    await updateUserAvatarUseCase.execute(dto)

    expect(spyFindById).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyStorageSave).toHaveBeenCalled()
  })

  it('Should delete the old user avatar', async () => {
    const updateUserAvatarUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const spyStorageSave = jest.spyOn(fakeStorage, 'save')
    const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
    const dto = makeDto()

    await updateUserAvatarUseCase.execute(dto)

    expect(spyFindById).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyStorageSave).toHaveBeenCalled()
    expect(spyStorageDelete).toHaveBeenCalled()
  })

  it('Should not delete the old user avatar when is the default avatar', async () => {
    const updateUserAvatarUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const spyStorageSave = jest.spyOn(fakeStorage, 'save')
    const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
    const dto = makeDto({ id: '1', authId: '1' })

    await updateUserAvatarUseCase.execute(dto)

    expect(spyFindById).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyStorageSave).toHaveBeenCalled()
    expect(spyStorageDelete).not.toHaveBeenCalled()
  })

  it('Should success update the user avatar', async () => {
    const updateUserAvatarUseCase = makeSut()
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const spyStorageSave = jest.spyOn(fakeStorage, 'save')
    const spyStorageDelete = jest.spyOn(fakeStorage, 'delete')
    const dto = makeDto()

    await updateUserAvatarUseCase.execute(dto)

    const user = await userRepository.findById('2')

    expect(user.avatar).not.toEqual('user.jpg')
    expect(spyFindById).toHaveBeenCalled()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyStorageSave).toHaveBeenCalled()
    expect(spyStorageDelete).toHaveBeenCalled()
  })
})
