import { putInfo } from "../../Modules/putInfo.js"
import Sort from "../../Modules/Sort.js"
import admin from "firebase-admin"
import Recomend from "../../Algo/recomend.js"
import { Interaction } from "../../Algo/interaction.js"

const sort = new Sort


export const getPopular = async (req, res) => {
    const db = req.app.db
	const data = await db.collection("tracks").find({}).toArray()
    res.send(putInfo(sort.popular(data), req.app.uid, db))
}

export const getTrending = async (req, res) => {
    const db = req.app.db
	const data = await db.collection("tracks").find({}).toArray()
	res.send(putInfo(sort.trending(data), req.app.uid, db))
}

export const getRecommended = async (req, res) => {
    const db = req.app.db
    const uid = req.app.uid
    let recomend;
	admin.database().ref("users").on("value", snapshot =>{
		recomend = new Recomend(snapshot.val(), uid)
	})
	const data = [...new Set(recomend.recomendations())]
	res.send(putInfo(data, req.app.uid, db))
}

export const getRecommendedByfollowing = async (req, res) => {
    const db = req.app.db
    admin.database().ref("users").once("value").then(data=>{
		const interaction = new Interaction(data.val(), req.app.uid)
        const newData = [...new Set(interaction.main())]
		res.send(putInfo(newData, req.app.uid, db))
	})
}