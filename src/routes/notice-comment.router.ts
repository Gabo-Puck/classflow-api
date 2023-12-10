import express from "express";
import NoticeCommentController from "@controllers/notice-comment.controller";
import asyncHandler from "express-async-handler"

const noticeCommentRouter = express.Router();
const noticeController = new NoticeCommentController();

noticeCommentRouter.post("/create", asyncHandler(noticeController.create.bind(noticeController)));
noticeCommentRouter.post("/edit", asyncHandler(noticeController.update.bind(noticeController)));
noticeCommentRouter.get("/notice/:noticeId", asyncHandler(noticeController.getByNotice.bind(noticeController)));
noticeCommentRouter.get("/:id", asyncHandler(noticeController.get.bind(noticeController)));
noticeCommentRouter.delete("/:id", asyncHandler(noticeController.delete.bind(noticeController)));

export default noticeCommentRouter;