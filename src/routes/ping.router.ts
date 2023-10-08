import express from "express";
import PingController from "@controllers/ping.controller";

const routerPing = express.Router();

routerPing.get("/",async(req,res)=>{
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.status(200).json(response);
})

export default routerPing;