import express from "express";
import admin from 'firebase-admin';
import {getAll} from "../Modules/find.js"
const router = express.Router();

const db = admin.database()
router.get("/", (req, res)=>
{
	const uid = req.app.uid
	const notifications = []
	db.ref("users/"+uid+"/private/new/notifications").on("value", snapshot=>{
		if(snapshot.val()){
            const data =snapshot.val()
			Object.values(data).forEach(value=>{
                value.user = getAll(value.likedBy)
                notifications.push(value)
            })
		}
	})
	res.send(notifications)
})

export {router}