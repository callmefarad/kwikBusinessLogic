import { NextFunction, Request, Response } from 'express';

import { MainAppError } from '@/utils/errorDefinition';

const errorMiddleware = (error: MainAppError, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';
    const name: string = error.name || 'Error';

    console.log(`[${req.method}] ${req.path} >> StatusCode say:: ${status}, Message:: ${message}`);
    res.status(status).json({ name, message, status, isSuccess: error.isSuccess });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
