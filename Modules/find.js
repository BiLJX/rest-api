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

async function getAll(uid, database)
{
    const db = database
    const all = await db.collection("users").findOne({uid: uid})
    return all.public.profile
}


export {getUserName, getPfp, getAll}