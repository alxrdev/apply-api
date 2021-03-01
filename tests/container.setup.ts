import { container } from 'tsyringe'

import '@services/container'
import IUserRepository from '@modules/users/repositories/IUserRepository'
import FakeUserRepository from '@src/modules/users/repositories/fake/FakeUserRepository'
import IJobRepository from '@src/modules/jobs/repositories/IJobRepository'
import FakeJobRepository from '@src/modules/jobs/repositories/fake/FakeJobRepository'

container.register<IUserRepository>('UserRepository', FakeUserRepository)
container.register<IJobRepository>('JobRepository', FakeJobRepository)
