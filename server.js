import firebase from "firebase"
import express from "express"
import cors from "cors"
import fire from "./firebase.js"
import dayFunc from "./Modules/dayFunc.js"
import Sort from "./Modules/Sort.js"
import Recomend from "./Algo/recomend.js"

const app = express();
const sort = new Sort;
let recomend;
app.use(cors())
let trendingTracks = []
let popularTracks = []
let data = 0




function Trending(data) {
	let dateObj = new Date();
	let month = dateObj.getUTCMonth() + 1; //months from 1-12
	let day = dateObj.getUTCDate();
	let year = dateObj.getUTCFullYear();
	let todayDate = dayFunc(day, month, year)
	if (data) {
		let tempData;
		trendingTracks = []
		Object.values(data).forEach((value) => {
			if(value.public.songs){
				tempData = value.public.songs
			}
		})
		Object.values(tempData).forEach((value) => {
			if(value.date){
				let views = value.stats.views
				let totalDate = value.date.totalDate
				let diff = todayDate - totalDate;
				if (diff == 0) {
					return
				} else {
				let rateOfChange = views / diff
				if (rateOfChange >= 10) {
					trendingTracks.push(value)
				}
			}
			}
		})
	}
}


function PopularTracks(data) {
	if (data) {
		let tempData;
		popularTracks = []
		Object.values(data).forEach((value) => {
			tempData = value.public.songs
		})
		Object.values(tempData).forEach((value) => {
			popularTracks.push(value)
		})
	}
}

function findData(data, s) {
	let tempData;
	let TempDataArr = []
	Object.values(data).forEach(value => {
		tempData = value.public.songs
	})
	Object.values(tempData).forEach(value => {
		TempDataArr.push(value)
	})
	const found = TempDataArr.filter(element => {
		let title = element.info.title.toLocaleLowerCase().includes(s)
		let artist = element.info.artist.toLocaleLowerCase().includes(s)
		let genre = element.info.genre.toLocaleLowerCase().includes(s)
		let conditions =  title || artist || genre
		return conditions
	})
	return found
}


firebase.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
	Trending(data)
	PopularTracks(data)
	
	
})

app.get("/api/home/trending", (req, res) => {
	res.send(sort.popular(trendingTracks))
})

app.get("/api/home/result", (req, res) => {
	const search = req.query.search.toLocaleLowerCase();
	const result = findData(data, search)
	res.send(result)
})

app.get("/api/home/popular", (req, res) => {
	res.send(sort.popular(popularTracks))
})

app.get("/api/home/recomended", (req, res) => {
	const uid = req.query.uid
	firebase.database().ref("users").on("value", snapshot =>{
		recomend = new Recomend(data, uid)
	})
	res.send([...new Set(recomend.recomendations())])
	//res.send(recomend.byGenre())
})


app.get("/", (req, res) => {
	
})

app.listen(4000, () => console.log("listening at port 4000..."))


