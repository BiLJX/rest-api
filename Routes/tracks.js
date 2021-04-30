import express from "express";
import {plays, like} from "../controllers/tracks/tracks.js"

const router = express.Router();


router.post("/like/send", like)
router.post("/views/update", plays)

export {router}

