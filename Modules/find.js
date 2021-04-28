import admin from "firebase-admin"


function getUserName(uid)
{
    const db = admin.database().ref("users/"+uid+"/public/profile/info")
    let userName;
    db.on("value", snapshot=>userName = snapshot.val().name)
    return userName;
}

function getPfp(uid)
{
    const db = admin.database().ref("users/"+uid+"/public/profile/")
    let pfp;
    db.on("value", snapshot => pfp = snapshot.val().pfp)
    return pfp
}

function getAllM(uid, database)
{
    const db = database
    let all;
    db.collection("users").findOne({uid: uid}, (err, result)=>all = result.public.profile)
    return all
}

function getAll(uid)
{
    const db = admin.database().ref("users/"+uid+"/public/profile/")
    let all;
    db.on("value", snapshot=>{all=snapshot.val();})
    return all
}

export {getUserName, getPfp, getAll, getAllM}