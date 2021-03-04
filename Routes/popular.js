import express from "express"
import Sort from "../Modules/Sort.js"
import admin from "firebase-admin"
import { createRequire } from "module";
import {putInfo} from "../Modules/putInfo.js"
const require = createRequire(import.meta.url);
const serviceAccount = require("../serviceAccountKey.json");


const router = express.Router();
const sort = new Sort;

function PopularTracks(data) {
    let popularTracks = []
	if (data) {
		let tempData;
		popularTracks = []
		Object.values(data).forEach((value) => {
			if(value.public.songs){
				tempData = value.public.songs
			}
		})
		
		Object.values(tempData).forEach((value) => {
			popularTracks.push(value)
        })
	
        return popularTracks
	}
}


let data;
admin.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
})

router.get("/", (req, res) => {
	res.send(putInfo(sort.popular(PopularTracks(data)), req.app.uid))
})


export {router}