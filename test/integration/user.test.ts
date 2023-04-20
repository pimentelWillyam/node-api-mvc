// imports
import App from '../../src/api/App'
import MariadbTest from '../../src/data/MariadbTest'
import LogRouter from '../../src/api/router/LogRouter'
import LogController from '../../src/api/controller/LogController'
import LogRepository from '../../src/api/repository/LogRepository'
import LogValidator from '../../src/api/validator/LogValidator'
import LogEntity from '../../src/api/entity/LogEntity'
import UserRouter from '../../src/api/router/UserRouter'
import UserController from '../../src/api/controller/UserController'
import UserRepository from '../../src/api/repository/UserRepository'
import UserValidator from '../../src/api/validator/UserValidator'
import UserEntity from '../../src/api/entity/UserEntity'

import * as request from 'supertest'

const mariadbTest = new MariadbTest([LogEntity, UserEntity])
const logRepository = new LogRepository(mariadbTest.dataSource, LogEntity)
const logValidator = new LogValidator()
const logController = new LogController(logRepository, logValidator)
const logRouter = new LogRouter(logController)
const userRepository = new UserRepository(mariadbTest.dataSource, UserEntity)
const userValidator = new UserValidator()
const userController = new UserController(userRepository, userValidator)
const userRouter = new UserRouter(userController)
const app = new App(logRouter, userRouter)

test('Log integration test', async () => {
  app.start()
  await mariadbTest.start()
  let res = await request(app.express).get('/api/user')
  expect(res.status).toEqual(200)
  expect(res.body).toEqual([])
  res = await request(app.express).post('/api/user').send({
    login: 'login',
    password: 'password',
    permission: 'master'
  })
  const insertedUser = res.body
  expect(res.status).toEqual(200)
  expect(insertedUser.id).toBeDefined()
  expect(insertedUser.message).toEqual('test message')
  expect(insertedUser.date).toBeDefined()
  res = await request(app.express).get('/api/log/', insertedUser.id)
  expect(res.body).toBeDefined()
  res = await request(app.express).get('/api/user', insertedUser.id)
  expect(res.body).toBeDefined()
  res = await request(app.express).get('/api/user')
  expect(res).toEqual([])
  await mariadbTest.stop()
})
