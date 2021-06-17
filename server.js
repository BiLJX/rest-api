
import admin from 'firebase-admin';
import express from "express"
import cors from "cors"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import "./firebase.js"
import bodyParser from "body-parser"
import {router as resultRoute} from "./Routes/result.js"
import {router as listen} from "./Routes/listen.js"
import {router as notifications} from "./Routes/notification.js"
import {router as tracks} from "./Routes/tracks.js"
import {router as home} from "./Routes/home.js"
import {router as user} from "./Routes/users.js"
import {router as playlist} from "./Routes/playlist.js"
import MongoDb from "mongodb"
import * as socketio from 'socket.io';
import path from "path"
import cookieParser from "cookie-parser"
import csrf from 'csurf';
const MongoClient = MongoDb.MongoClient;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
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

app.get("/api/csrftoken", (req, res)=>{
	res.send({token: req.csrfToken()})
})




const uri = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.post("/api/account/create", async (req, res)=>{
	const data = req.body
	try {
		const database = client.db('Moosax');
		const users = database.collection('users');
		await users.insertOne(data)
	}finally {
		// Ensures that the client will close when you finish/error
		res.send({"status": "ok"})
	}
})

app.post("/api/login", (req, res)=>{
	const idToken = req.body.data.toString()
	console.log(idToken)
	const device = req.query.device
	const expiresIn = 60*60*24*14*1000
	admin.auth()
	.createSessionCookie(idToken, { expiresIn }) 
	.then(
		(sessionCookie)=>{
			const options = {maxAge: expiresIn, httpOnly: true};
			if(device === "m"){
				res.send({session: sessionCookie})
			}else{
				res.cookie("session", sessionCookie, options)
				res.end(JSON.stringify({status: "success"}))
			}
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
	const token = req.cookies.session||req.headers.session;
	
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
	const token = req.cookies.session||req.headers.session||false;
	if(token){
		admin.auth().verifySessionCookie(token, true)
		.then((decodedToken)=>{
			app.uid = decodedToken.uid
			next()
		}).catch((err)=>{res.send("error"); console.log(err)})
	}else{
		res.redirect("/")
		res.status(402).end()
	}
})

app.get("/api/userId", (req, res)=>{
	try{
		app.uid?res.send({"uid": app.uid}):res.status(401).json({message: "Un Authenticated"})
	}catch(err){
		console.log(err)
	}
	
})





app.use("/api/music", tracks)
app.use("/api/home/result", resultRoute)
app.use("/api/home", home)
app.use("/api/u", user)
app.use("/api/listen", listen)
app.use("/api/u/notification", notifications)
app.use("/api/playlist", playlist)




app.get("/api/u/data", async (req, res)=>{
	const uid = req.query.uid
	const db = client.db("Moosax")
	const user = db.collection("users")
	const query = {
		uid: uid
	}
	const data = await user.findOne(query)
	if(data?.public?.followers?.[req.app.uid]){
		data.isFollowing = true
	}
	res.send(data)
})

app.post("/api/profile/checkname", (req, res) =>
{
	const name = req.body.name
})


app.post("/api/profile/update", async (req, res)=>
{
	const data = req.body.update
	await client.connect()
	const db = client.db("Moosax")
	const users = db.collection("users")
	const query = {
		uid: app.uid
	}
	await users.findOneAndUpdate(query, {$set: data}, {upsert: true})
	// admin.database().ref("users/"+app.uid+"/public/profile").update(data).then(()=>{
	// 	res.send({"status": "ok"})
	// })
	res.send({"status": "ok"})
})


client.connect().then(()=>{
	app.listen(process.env.PORT || 4000, () => {
		app.db = client.db("Moosax")
		console.log("listening at port 4000...")
	})
})

app.get('/*', (req, res)=>{
	res.sendFile(path.join(__dirname,'build', 'index.html'))
})









