
import admin from 'firebase-admin';
import express from "express"
import cors from "cors"
import "./firebase.js"
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
import {router as notifications} from "./Routes/notification.js"
import {router as viewsUpdate} from "./Routes/views.js"
import {router as follow} from "./Routes/follow.js"
import {router as RecommendFollowing} from "./Routes/RecommendFollowing.js"
import * as socketio from 'socket.io';
import path from "path"
import cookieParser from "cookie-parser"
import csrf from 'csurf';
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(cors())
app.use(bodyParser.urlencoded({extended : true, limit: "100mb"}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(express.static(path.join('build')))
app.use(cookieParser())
app.use(csrf({cookie: true}))

app.use("*", (req, res, next)=>{
	res.cookie("XSRF-TOKEN", req.csrfToken());
	next();
})

const db = admin.database()
//routes

const server = app.listen(process.env.PORT || 4000, () => {

	console.log("listening at port 4000...")
})

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







app.post("/api/login", (req, res)=>{
	const idToken = req.body.data.toString()
	const expiresIn = 60*60*24*14*1000
	admin.auth()
	.createSessionCookie(idToken, { expiresIn }) 
	.then(
		(sessionCookie)=>{
			const options = {maxAge: expiresIn, httpOnly: true};
			res.cookie("session", sessionCookie, options)
			res.end(JSON.stringify({status: "success"}))
		},
		(error)=>{
			console.log(error)
			res.status(401).send("UNAUTHORIZED REQUEST!")
		}
	)
})

app.get("/signout", (req, res)=>{

	//res.send({"signedout": true})
	res.clearCookie("session")
	res.end("success")
})




app.get("/isLoggedIn", (req, res)=>{
	const token = req.cookies.session||"";
	admin.auth().verifySessionCookie(token)
	.then(()=>res.send({"signedout": false}))
	.catch((err)=>{
		res.send({"signedout": true})
	})
})

// app.use((req, res, next)=>{
// 	const token = req.cookies.session||"";
// 	admin.auth().verifySessionCookie(token)
// 	.then(()=>next())
// 	.catch((err)=>{
// 		// res.send({"signedout": true})
// 	})
// })

app.use("*", (req, res, next)=>{
	const token = req.cookies.session||"";
	admin.auth().verifySessionCookie(token, true)
	.then((decodedToken)=>{
		app.uid = decodedToken.uid
		next()
	})
	.catch((err)=>console.log(err))
})

app.get("/api/userId", (req, res)=>{
	res.send({"uid": app.uid})
})


app.use("/api/music/views", viewsUpdate)
app.use("/api/music/upload", upload)
app.use("/api/home/trending", trendingRoute)
app.use("/api/home/result", resultRoute)
app.use("/api/home/popular", popularRoute)
app.use("/api/home/recomended", recomendRoute)
app.use("/api/u/musics", userMusicsRoute)
app.use("/api/music/like", likeRoute)
app.use("/api/home/liked", userLikes)
app.use("/api/listen", listen)
app.use("/api/u/notification", notifications)
app.use("/api/u/follow", follow)

app.use("/api/home/following", RecommendFollowing)



app.get("/api/u/data", async (req, res)=>{
	const uid = req.query.uid
	let data;
	admin.database().ref("users/" + uid ).on("value", (snapshot) => {
		data = snapshot.val()
	})
	if(data?.public?.followers?.[req.app.uid]){
		data.isFollowing = true
	}
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
	db.ref("users/"+app.uid+"/public/profile").update(data).then(()=>{
		res.send({"status": "ok"})
	})
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




