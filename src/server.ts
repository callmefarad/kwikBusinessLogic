// import 'tsconfig-paths/register'; 
import App from '@/app';
import AuthRoute from '@/routes/auth.route';
import StoreRoute from '@/routes/store.route';


const app = new App([new AuthRoute(), new StoreRoute() ])
app.listen();

async function shutdownServer(signal: string) {
  try {
    console.log(`Received ${signal}. Shutting down servver...`);
    // await app.closeDatabaseConnection();
    console.log('Server stopped gracefully.');
    process.exit(0);
  } catch (error) {
    console.log('Error during server shutdown:', error);
    process.exit(1);
  }
}

async function handleUncaughtError(error: Error) {
  console.log('Server shutting down due to uncaught exception:', error);
//   await app.closeDatabaseConnection();
  process.exit(1);
}

async function handleUnhandledRejection(reason: string, promise: Promise<any>) {
  console.log('Unhandled promise rejection:', reason);
  console.log('Promise:', promise);
//   await app.closeDatabaseConnection();
  process.exit(1);
}

/* ------------------------ Handle uncaught rejection ----------------------- */
process.on('uncaughtException', handleUncaughtError);

/* ------------------- Handle unhandled promise rejections ------------------- */
process.on('unhandledRejection', handleUnhandledRejection);

/* ----------------------------- Handle SIGINT ----------------------------- */
process.on('SIGINT', () => shutdownServer('SIGINT'));

/* ------------------- Handle SIGTERM (termination signal) ------------------ */
process.on('SIGTERM', () => shutdownServer('SIGTERM'));
