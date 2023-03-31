// importando core da rota
import * as express from 'express'
import { type Router, type Request, type Response } from 'express'

// importando service da rota
import type ILogController from '../interface/ILogController'
import type ILogRouter from '../interface/ILogRouter'

// criando rotas

class LogRouter implements ILogRouter {
  constructor (readonly logController: ILogController, readonly routes: Router) {
    this.logController = logController
    this.routes = express.Router()
    this.routes.post('/logs', (req: Request, res: Response) => {
      logController.create(req, res)
    })
    this.routes.get('/logs', (req: Request, res: Response) => {
      logController.getAll(req, res)
    })
    this.routes.get('/logs/:id', (req: Request, res: Response) => {
      logController.get(req, res)
    })
    this.routes.patch('/logs/:id', (req: Request, res: Response) => {
      logController.update(req, res)
    })
    this.routes.delete('/logs/:id', (req: Request, res: Response) => {
      logController.delete(req, res)
    })
  }
}

export default LogRouter