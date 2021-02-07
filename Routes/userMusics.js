import express from "express"
import firebase from "firebase"
const router = express.Router();

router.get("/", (req, res) =>{
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

export {router}
