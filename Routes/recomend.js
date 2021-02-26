import express from "express"
import admin from "firebase-admin"
import Recomend from "../Algo/recomend.js"
import {putInfo} from "../Modules/putInfo.js"

const router = express.Router();
router.get("/", (req, res) => {
    const uid = req.query.uid
    let recomend;
	admin.database().ref("users").on("value", snapshot =>{
		recomend = new Recomend(snapshot.val(), uid)
	})
	const data = [...new Set(recomend.recomendations())]
	res.send(putInfo(data))
})
export {router}