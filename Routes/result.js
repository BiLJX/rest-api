import express from "express"
import findData from "../Modules/search.js"
import admin from "firebase-admin"
import { createRequire } from "module";
import {putInfo} from "../Modules/putInfo.js"
const firebase = admin
const require = createRequire(import.meta.url);


const router = express.Router();

let data;
firebase.database().ref("users").on("value", snapshot => {
	data = snapshot.val();
})

router.get("/", async (req, res) => {
	const search = req.query.search;
	const db = req.app.db;
	const tracks = db.collection("tracks")
	const result = await tracks.aggregate(
        [
            {
              '$search': {
                'index': 'search', 
                'text': {
                  'query': search, 
                  'path': 'info.title', 
                  'fuzzy': {
                    'maxEdits': 2, 
                    'prefixLength': 3
                  }
                }
              }
            }
          ]
    ).toArray()
	res.send(putInfo(result))
})

export {router}