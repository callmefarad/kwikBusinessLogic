

import { PORT, NODE_ENV } from '@config';
import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { set, connect } from 'mongoose';
import { dbConnect } from '@databases';

class App
{
  public app: Application;
  public port: number | string;
    public env: string; 
    
    constructor ()
    {
        this.app = express()
        this.port = PORT || 7000
        this.env = NODE_ENV || 'development';

         //this function automatic run
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.connectToDatabase();

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
    // this.app.use(cookieParser());
  }


    private initializeRoutes() {
    this.app.get('/api', (req: Request, res: Response) => {
      res.json({ message: 'App is running!' });  // Simple JSON response
    });
  }
        
}

export default App