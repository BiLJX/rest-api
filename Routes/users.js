import express from "express"
import {getUser, getLiked, follow, uploadMusic} from "../controllers/users/users.js"

const router = express.Router();



router.get("/:u", getUser)
router.post("/follow", follow)
router.get("/songs/liked", getLiked)
router.post("/music/upload", uploadMusic)
export {router}