import express from "express"
import {getPopular, getRecommended, getRecommendedByfollowing, getTrending} from "../controllers/home/home.js"
const router = express.Router();

router.get("/popular", getPopular)
router.get("/trending", getTrending)
router.get("/recomended", getRecommended)
router.get("/following", getRecommendedByfollowing)

export {router}