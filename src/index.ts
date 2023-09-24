import express, { Application } from "express";
const PORT = process.env.port || 8000;
const app = express();

app.get("/ping", async (_req, res) => {
    res.send({
        message: "Hello World!"
    })
})

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})