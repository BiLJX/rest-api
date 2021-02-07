import express from "express"
import Sort from "../Modules/Sort.js"
import firebase from "firebase"

const router = express.Router();
const sort = new Sort;

function PopularTracks(data) {
    let popularTracks = []
	if (data) {
		let tempData;
		popularTracks = []
		Object.values(data).forEach((value) => {
			tempData = value.public.songs
		})
		Object.values(tempData).forEach((value) => {
			popularTracks.push(value)
        })
        return popularTracks
	}
}

let data;
firebase.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
})

router.get("/", (req, res) => {
	res.send(sort.popular(PopularTracks(data)))
})


export {router}