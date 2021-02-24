
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
import {router as userLikes} from "./Routes/userLikes.js"
import {router as listen} from "./Routes/listen.js"
import {router as upload} from "./Routes/upload.js"
import * as socketio from 'socket.io';
import path from "path"
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(fileupload())
app.use(cors())
app.use(bodyParser.urlencoded({extended : true, limit: "100mb"}));
app.use(express.static(path.join('build')))
app.use(bodyParser.json({limit: '100mb'}));


const db = admin.database()

let recomend;
let data = 0




//routes

const server = app.listen(process.env.PORT || 4000, () => console.log("listening at port 4000..."))
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

app.use("/api/music/upload", upload)
app.use("/api/home/trending", trendingRoute)
app.use("/api/home/result", resultRoute)
app.use("/api/home/popular", popularRoute)
app.use("/api/home/recomended", recomendRoute)
app.use("/api/u/musics", userMusicsRoute)
app.use("/api/music/like", likeRoute)
app.use("/api/home/liked", userLikes)
app.use("/api/listen", listen)


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
	db.ref("users/"+body.temp.userId+"/public/profile").update(data)
})





app.post("/api/login", (req, res)=>{
	const idToken = req.body.idToken.toString()
	const expiresIn = 60*60*24*5*1000
	
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

app.get('/*', (req, res)=>{
	res.sendFile(path.join(__dirname,'build', 'index.html'))
})

// app.get("/", (req, res)=>{
// 	const sessionCookie = req.cookies.session || ""
// 	console.log("sessionCookie")
// 	admin
// 	.auth()
// 	.verifySessionCookie(sessionCookie, true)
// 	.then(()=>{
// 		res.sendFile(path.join(__dirname,'build', 'index.html'))
// 	}).catch(err=>{
// 		res.redirect("/login")
// 	})
// })




