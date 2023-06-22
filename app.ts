import express from 'express';
import defineRoutes from './router';
import bodyParser from "body-parser";
import { defineListeners } from './services/ws';
import { initializeGame } from './services/game';

require('dotenv').config();

const app = express();
const router = express.Router();

defineRoutes(router);
defineListeners();
initializeGame();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(router);

app.listen(process.env.API_PORT, () => {
  console.log("Started");
});