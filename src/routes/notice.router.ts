import express from "express";
import NoticeController from "@controllers/notice.controller";
import asyncHandler from "express-async-handler"

const noticeRouter = express.Router();
const noticeController = new NoticeController();

noticeRouter.post("/create", asyncHandler(noticeController.create.bind(noticeController)));
noticeRouter.post("/edit", asyncHandler(noticeController.update.bind(noticeController)));
noticeRouter.get("/class", asyncHandler(noticeController.getByClass.bind(noticeController)));
noticeRouter.get("/:id", asyncHandler(noticeController.get.bind(noticeController)));
noticeRouter.get("/", asyncHandler(noticeController.getByClass.bind(noticeController)));
noticeRouter.delete("/:id", asyncHandler(noticeController.delete.bind(noticeController)));

export default noticeRouter;