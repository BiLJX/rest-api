import firebase from "firebase"
import "@firebase/storage"
import express from "express"
import cors from "cors"
import fire from "./firebase.js"
import Recomend from "./Algo/recomend.js"
import bodyParser from "body-parser"
import fileupload from "express-fileupload"
import { router as trendingRoute } from './Routes/trending.js';
import {router as resultRoute} from "./Routes/result.js"
import {router as popularRoute} from "./Routes/popular.js"
import {router as recomendRoute} from "./Routes/recomend.js"
import {router as userMusicsRoute} from "./Routes/userMusics.js"
import {router as likeRoute} from "./Routes/like.js"
import path from "path"
const app = express();

console.log(firebase.auth().currentUser)
app.use(fileupload())
app.use(cors())
app.use(bodyParser.urlencoded({extended : true, limit: "100mb"}));
app.use('/*', express.static(path.join('build')))
app.use(bodyParser.json({limit: '100mb'}));
const db = firebase.database()

let recomend;
let data = 0


//routes
app.use("/api/home/trending", trendingRoute)
app.use("/api/home/result", resultRoute)
app.use("/api/home/popular", popularRoute)
app.use("/api/home/recomended", recomendRoute)
app.use("/api/u/musics", userMusicsRoute)
app.use("/api/music/like", likeRoute)
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
	const data = req.body.update.data
	console.log(body)
	db.ref("users/"+body.temp.userId+"/public/profile").update(data)
})

app.listen(process.env.PORT||4000, () => console.log("listening at port 4000..."))


