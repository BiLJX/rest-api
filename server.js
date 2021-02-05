import firebase from "firebase"
import "@firebase/storage"
import express from "express"
import cors from "cors"
import fire from "./firebase.js"
import dayFunc from "./Modules/dayFunc.js"
import Sort from "./Modules/Sort.js"
import Recomend from "./Algo/recomend.js"
import bodyParser from "body-parser"
import fileupload from "express-fileupload"
import { router as trendingRoute } from './Routes/trending.js';
import {router as resultRoute} from "./Routes/result.js"

const app = express();
const sort = new Sort;
console.log(firebase.auth().currentUser)
app.use(fileupload())
app.use(cors())
app.use(bodyParser.urlencoded({extended : true, limit: "100mb"}));


app.use(bodyParser.json({limit: '100mb'}));
const db = firebase.database()

let recomend;
let popularTracks = []
let data = 0

app.use("/api/home/trending", trendingRoute)
app.use("/api/home/result", resultRoute)
	
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

firebase.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
	PopularTracks(data)
})

// app.get("/api/home/trending", (req, res) => {
// 	res.send(sort.trending(popularTracks))
// })



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

app.get("/api/u/musics", (req, res) =>{
	const uid = req.query.uid
	let musics = []
	firebase.database().ref("users/" + uid + "/public/songs/").on("value", snapshot =>{
		if(snapshot.val()){
			Object.values(snapshot.val()).forEach((value)=>{
				musics.push(value)
			})
		}
	})
	res.send(musics)
})

app.get("/api/u/data", (req, res)=>{
	const uid = req.query.uid
	let data;
	firebase.database().ref("users/" + uid ).on("value", (snapshot) => {
		data = snapshot.val()
	})
	res.send(data)
})


app.post("/api/profile/checkname", (req, res) =>
{
	const name = req.body.name
})


app.post("/api/profile/update", (req, res)=>
{
	const body = req.body.update
	const image = body.temp.image
	const data = req.body.update.data
	console.log(body)
	db.ref("users/"+body.temp.userId+"/public/profile").update(data)
})




app.listen(4000, () => console.log("listening at port 4000..."))


