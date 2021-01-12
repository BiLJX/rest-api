import firebase from "firebase"
const db = firebase.database()


function Similarity(uID){
    db.ref("users"+uID + "private/" )
}