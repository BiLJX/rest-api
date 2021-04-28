export const getLiked = async (req, res) => {
    const db = req.app.db;
    const likedSongs = db.collection("users").find({uid: req.app.uid}).toArray()
    res.send(likedSongs)
}