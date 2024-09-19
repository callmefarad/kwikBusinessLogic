import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,NODE_ENV } from '@config';

export const dbConnect = {
  url:
    NODE_ENV === 'production'
      ? `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.uq6gi.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
      : `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, // For development
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};