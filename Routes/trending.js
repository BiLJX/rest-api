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
			
			if(value.public.songs){
				tempData = value.public.songs
			}
		})
		console.log(tempData)
		Object.values(tempData).forEach((value) => {
			popularTracks.push(value)
        })
		console.log(popularTracks)
        return popularTracks
	}
}

let data;
firebase.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
})

router.get("/", (req, res) => {
	res.send(sort.trending( PopularTracks(data)))
})

export {router}