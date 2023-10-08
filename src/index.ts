import 'module-alias/register';
import express, { Application, Request, Response, NextFunction } from "express";

import morgan from "morgan";
import routerPing from "@routes/ping.router";
import authRouter from "@routes/auth.router";
import AuthorizationMiddleware from "@middleware/authorization.middleware";
import { PORT } from "./env";
import usuarioRouter from "@routes/user.router";
import cors from "cors";
import ErrorService from "@appTypes/Error";
import termTemplates from '@routes/term-template.router';
import classRouter from '@routes/class.router';

const port = PORT || 8000;
const app = express();
const auth = new AuthorizationMiddleware();

app.use(cors())
app.use(express.json());
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use("/", auth.getToken)
app.use("/ping", routerPing);
app.use("/authorization", authRouter);
app.use("/user", usuarioRouter);
app.use("/term-templates", auth.verifyToken, termTemplates);
app.use("/classes", auth.verifyToken, classRouter);

//error handler for service errors 
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ErrorService) {
        console.error("Service error!")
        res.status(error.status).json(error)
    } else {
        next(error);
    }
})

//catch all error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(500).json({ message: 'There has been an uncaught error', error: err })
})

app.listen(port, () => {
    console.log("Server is running on port", port);
})