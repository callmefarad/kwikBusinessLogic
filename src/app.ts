

import { PORT, NODE_ENV } from '@config';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { set, connect } from 'mongoose';
import { dbConnect } from '@databases';
import errorMiddleware from '@middlewares/error.middleware';
import { Routes } from '@interfaces/routes.interface';
import cookieParser from 'cookie-parser';
class App
{
  public app: Application;
  public port: number | string;
    public env: string; 
    
    constructor (routes: Routes[])
    {
        this.app = express()
        this.port = PORT || 7000
        this.env = NODE_ENV || 'development';

         //this function automatic run
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.connectToDatabase();
        this.initializeErrorHandling();

    }
    public listen()
    {
        this.app.listen(this.port, () =>
        {
          console.log("🚀 App listening onn the port " + this.port)  
        })
    }

    private async connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    try {
      const conn = await connect(dbConnect.url);
      console.log('Database connecteD successfully!');
      console.log(`MongoDBcf connected: ${conn.connection.host}`);
    } catch (error) {
      console.log('Error connecting to the database:op', error);
    }
  }

    private initializeMiddlewares() {
    this.app.use(morgan('combined'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(cookieParser());
  }


  //   private initializeRoutes() {
  //   this.app.get('/api', (req: Request, res: Response) => {
  //     res.json({ message: 'App is running!' });  // Simple JSON response
  //   });
  // }


  /**
   * Initializes the routes for the application.
   *
   * @param {Routes[]} routes - An array of Route objects.
   */
  private initializeRoutes(routes: Routes[]) {
    // Iterate over each route and register it with the application.
    routes.forEach(route => {
      this.app.use('/api', route.router);
    });
  }

  private initializeErrorHandling() {
    // this.app.use(errorHandler);
    this.app.use(errorMiddleware);
  }
        
}

export default App