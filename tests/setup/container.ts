import { container } from 'tsyringe'

import '@providers/container'

import IStorageService from '@providers/storage/interfaces/IStorageService'
import FakeStorageService from '@providers/storage/FakeStorageService'

import IMailProvider from '@src/providers/email/interfaces/IMailProvider'
import FakeMail from '@providers/email/FakeMail'

container.register<IStorageService>('ResumeStorageService', FakeStorageService)
container.register<IStorageService>('AvatarStorageService', FakeStorageService)

container.register<IMailProvider>('MailProvider', FakeMail)
