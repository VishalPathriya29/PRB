import express from 'express';
import initRoutes from './app';
import initDb from './db';

const port = process.env.PORT || 3000;
const app = express();

initRoutes(app);
initDb;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

export default app;