import firebase from "firebase"


function likeCheck(liker_uid, u_uid, title)
{
    let condition
    firebase.database().ref("users/"+u_uid+"/public/"+"songs/"+title+"/widgetInfo/likes/"+liker_uid).on("child_added", (snapshot)=>{
        condition = snapshot.val().liked//stores the value in it
    })
    return condition
}

export default likeCheck