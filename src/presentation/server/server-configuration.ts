import { Application, Router } from "express";
import express from 'express';
import fileUpload from "express-fileupload";
import cors from 'cors'
import path from "path";

interface ServerConfigurationOptions {
  router: Router,
  publicPath?: string
}

export class ServerConfiguration {

  private readonly _app: Application

  constructor({ router, publicPath = 'public' }: ServerConfigurationOptions) {
    this._app = express()

    this._app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: '/tmp/'
    }))

    this._app.use( cors() )
    this._app.use( express.json() )
    this._app.use( express.urlencoded({ extended: true }))
    this._app.use( express.static( publicPath ) )    
    this._app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));  
    this._app.use( router )
  }

  public get application(): Application {
    return this._app
  }

}