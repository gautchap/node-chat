import express from "express";
import { Server } from "socket.io";
import http from "http";
import { router } from "./api/router.js";
import { websocket } from "./api/websocket.js";
import dotenv from "dotenv";
dotenv.config();

const { APP_PORT, NODE_ENV } = process.env;

const app = express();
const httpServer = http.Server(app);
const io = new Server(httpServer);

app.use(express.static("public"));
app.set("view engine", "pug");
app.locals.pretty = NODE_ENV !== "production" ? true : false;

router(app);
websocket(io);

httpServer.listen(APP_PORT, () => {
    console.log(`le serveur est démarré ici : http://localhost:${APP_PORT}`);
});
