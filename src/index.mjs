import express from 'express'
import url from 'url'
import path from 'path'
import logger from 'morgan'
import sassMiddleware from 'node-sass-middleware'
import browserify from 'browserify-middleware'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import compression from 'compression'
import router from './router'
import sites from './consts/sites'

var app = express()

app.locals.sites = sites

const workingDir = path.parse(url.parse(import.meta.url).pathname).dir
const publicDir = path.join(workingDir, 'public')
const viewsDir = path.join(workingDir, 'views')

app
  .set('view engine', 'pug')
  .set('views', viewsDir)
  .use(helmet())
  .use(compression())
  .use(logger('combined'))
  .use(cookieParser())
  .use(sassMiddleware({
    src: publicDir,
    dest: publicDir,
    indentedSyntax: true,
    includePaths: [path.join(workingDir), 'node_modules']
  }))
  .use(browserify(publicDir))
  .use(express.static(publicDir))
  .use('/', router)

export default app
