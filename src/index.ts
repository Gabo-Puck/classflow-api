import express, { Application } from "express";
import morgan from "morgan";
import routerPing from "./routes/ping";
import authRouter from "./routes/auth";
import AuthorizationMiddleware from "./middleware/authorization";
import { PORT } from "./env";
import usuarioRouter from "./routes/usuario";
const port = PORT || 8000;
const app = express();
const auth = new AuthorizationMiddleware();
// app.get("/ping", async (_req, res) => {
//     res.send({
//         message: "Hello World!"
//     })
// })
app.use(express.json());
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use("/", auth.getToken)
app.use("/ping", routerPing);
app.use("/authorization", authRouter);
app.use("/usuario", usuarioRouter);
app.listen(port, () => {
    console.log("Server is running on port", port);
})