import { putInfo } from "../../Modules/putInfo.js"
import Sort from "../../Modules/Sort.js"
import admin from "firebase-admin"
import Recomend from "../../Algo/recomend.js"
import { Interaction } from "../../Algo/followRec.js"

const sort = new Sort


export const getPopular = async (req, res) => {
	const start = req.query["start"]
	const end = req.query["end"]
	try{
		const db = req.app.db
		const data = sort.popular(await db.collection("tracks").find({}).toArray()) 
		res.send(await putInfo(data.slice(start, end), req.app.uid, db))
	}catch(err){
		console.log(err)
		res.send("error")
	}
    
}

export const getTrending = async (req, res) => {
	const start = req.query["start"]
	const end = req.query["end"]
	try{
		const db = req.app.db
		const data = sort.trending(await db.collection("tracks").find({}).toArray()) 
		res.send(await putInfo(data.slice(start, end), req.app.uid, db))
	}catch(err){
		console.log(err)
		res.send("error")
	}
    
}


function uniq_fast(a) {
	var seen = {};
	var out = [];
	var len = a.length;
	var j = 0;
	for(var i = 0; i < len; i++) {
		 var item = a[i];
		 if(seen[item.sid] !== 1) {
			   seen[item.sid] = 1;
			   out[j++] = item;
		 }
	}
	return out;
}

export const getRecommended = async (req, res) => {
	const start = req.query["start"]
	const end = req.query["end"]
    const db = req.app.db
    const uid = req.app.uid
	const reco = new Recomend(uid, db)
	const tracks = await reco.getRecommendation()
	const data_withInfo = await putInfo(tracks, uid, db)
	const rawData = data_withInfo.filter(data=>!data.hasLiked)
	const data = uniq_fast(rawData)
	res.send(data.slice(start, end))
}

export const getRecommendedByfollowing = async (req, res) => {
	const uid = req.app.uid
    const db = req.app.db
	const interaction = new Interaction(req.app.uid, db)
	const tracks = await interaction.getTracks()
	const rawData = await putInfo(tracks, uid, db)
	const data = rawData.filter(data=>!data.hasLiked)
	res.send(uniq_fast(data))
}