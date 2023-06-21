import express from 'express';
import defineRoutes from './router';
import bodyParser from "body-parser";
import { defineListeners } from './services/ws';

const app = express();
const router = express.Router();
defineRoutes(router);
defineListeners();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(router);

app.listen(9999, () => {
  console.log("Started");
});