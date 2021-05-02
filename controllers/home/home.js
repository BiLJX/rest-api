import { putInfo } from "../../Modules/putInfo.js"
import Sort from "../../Modules/Sort.js"
import admin from "firebase-admin"
import Recomend from "../../Algo/recomend.js"
import { Interaction } from "../../Algo/followRec.js"

const sort = new Sort


export const getPopular = async (req, res) => {
	try{
		if(!req.app.uid){
			res.status(401).json({msg: "err"})
		}
		const db = req.app.db
		const data = await db.collection("tracks").find({}).toArray()
		res.send(putInfo(sort.popular(data), req.app.uid, db))
	}catch{
		res.send("error")
	}
    
}

export const getTrending = async (req, res) => {
	try{
		const db = req.app.db
		const data = await db.collection("tracks").find({}).toArray()
		res.send(putInfo(sort.trending(data), req.app.uid, db))
	}catch{
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
    const db = req.app.db
    const uid = req.app.uid
	const reco = new Recomend(uid, db)
	const tracks = await reco.getRecommendation()
	const data_withInfo = putInfo(tracks, uid, db)
	const rawData = data_withInfo.filter(data=>!data.hasLiked)
	const data = uniq_fast(rawData)
	res.send(data)
}

export const getRecommendedByfollowing = async (req, res) => {
	const uid = req.app.uid
    const db = req.app.db
	const interaction = new Interaction(req.app.uid, db)
	const tracks = await interaction.getTracks()
	const rawData = putInfo(tracks, uid, db)
	const data = rawData.filter(data=>!data.hasLiked)
	res.send(uniq_fast(data))
}