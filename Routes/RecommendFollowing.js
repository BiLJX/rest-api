import express from "express"
import admin from "firebase-admin"
import {Interaction} from "../Algo/interaction.js"
import {putInfo} from "../Modules/putInfo.js"

const router = express.Router();
const db = admin.database()
router.get("/", async (req, res) => {
    db.ref("users").once("value").then(data=>{
		const interaction = new Interaction(data.val(), req.app.uid)
        const newData = [...new Set(interaction.main())]
		res.send(putInfo(newData, req.app.uid))
	})
})
export {router}