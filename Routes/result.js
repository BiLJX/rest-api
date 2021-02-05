import express from "express"
import firebase from "firebase"
import findData from "../Modules/search.js"


const router = express.Router();

let data;
firebase.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
})

router.get("/", (req, res) => {
	const search = req.query.search.toLocaleLowerCase();
	const result = findData(data, search)
	res.send(result)
})

export {router}