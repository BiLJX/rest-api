import express from "express"
import admin from "firebase-admin"


const router = express.Router();
router.get("/", (req, res) =>{
	const uid = req.query.uid
	let musics = []
	admin.database().ref("users/" + uid + "/public/songs/").on("value", snapshot =>{
		if(snapshot.val()){
			Object.values(snapshot.val()).forEach((value)=>{
				musics.push(value)
			})
		}
	})
	res.send(musics)
})

export {router}
