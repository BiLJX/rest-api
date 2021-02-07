import express from "express"
import firebase from "firebase"
import Recomend from "../Algo/recomend.js"

const router = express.Router();
router.get("/", (req, res) => {
    const uid = req.query.uid
    let recomend;
	firebase.database().ref("users").on("value", snapshot =>{
		recomend = new Recomend(snapshot.val(), uid)
	})
	res.send([...new Set(recomend.recomendations())])
})
export {router}