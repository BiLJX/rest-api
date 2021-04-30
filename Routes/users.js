import express from "express"
import {getUser, getLiked, follow} from "../controllers/users/users.js"

const router = express.Router();



router.get("/:u", getUser)
router.post("/follow", follow)
router.get("/songs/liked", getLiked)
export {router}