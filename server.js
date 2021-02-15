
import admin from 'firebase-admin';
import express from "express"
import cors from "cors"
import "./firebase.js"
import { createRequire } from "module";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser"
import fileupload from "express-fileupload"
import { router as trendingRoute } from './Routes/trending.js';
import {router as resultRoute} from "./Routes/result.js"
import {router as popularRoute} from "./Routes/popular.js"
import {router as recomendRoute} from "./Routes/recomend.js"
import {router as userMusicsRoute} from "./Routes/userMusics.js"
import {router as likeRoute} from "./Routes/like.js"
import * as socketio from 'socket.io';
import path from "path"

const app = express();





const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(admin.auth().currentUser)


app.use(fileupload())
app.use(cors())
app.use(bodyParser.urlencoded({extended : true, limit: "100mb"}));
// app.use(express.static(path.join('build')))
app.use(bodyParser.json({limit: '100mb'}));
const db = admin.database()

let recomend;
let data = 0



// app.get('/*', (req, res)=>{
// 	res.sendFile(path.join(__dirname,'build', 'index.html'))
// })

//routes
const server = app.listen(4000, () => console.log("listening at port 4000..."))
const io = new socketio.Server(server)
let id;
io.on('connection', socket=>{
	id = socket.handshake.query.id
	if(id != "null"){
		socket.join(id)
		io.to(id).emit("message", {
			"name": id
		})
	}
})









app.io = io
app.use("/api/home/trending", trendingRoute)
app.use("/api/home/result", resultRoute)
app.use("/api/home/popular", popularRoute)
app.use("/api/home/recomended", recomendRoute)
app.use("/api/u/musics", userMusicsRoute)
app.use("/api/music/like", likeRoute)


app.get("/api/u/data", (req, res)=>{
	const uid = req.query.uid
	let data;
	admin.database().ref("users/" + uid ).on("value", (snapshot) => {
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








app.get("/api/u/notification", (req, res)=>
{
	const uid = req.query.uid
	let notifications = []
	db.ref("users/"+uid+"/private/new/notifications").on("value", snapshot=>{
		if(snapshot.val()){
			Object.values(snapshot.val()).forEach(value=>notifications.push(value))
		}
	})
	res.send(notifications)
})

