import express from "express"
import findData from "../Modules/search.js"
import admin from "firebase-admin"
import { createRequire } from "module";
import {putInfo} from "../Modules/putInfo.js"
const firebase = admin
const require = createRequire(import.meta.url);


const router = express.Router();

let data;
firebase.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
})

router.get("/", (req, res) => {
	const search = req.query.search.toLocaleLowerCase();
	const result = findData(data, search)
	res.send(putInfo(result))
})

export {router}