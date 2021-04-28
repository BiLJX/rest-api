import MongoDb from "mongodb"
const MongoClient = MongoDb.MongoClient

// async function run(){
//     const uri = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     });
//     await client.connect()
//     const db = client.db("Moosax")
//     db.createCollection("liked", {
//         validator: {
//             $jsonSchema: {
//                 bsonType: "object",
//                 required: ["uid", "tracks"],
//                 properties:{
//                     uid: {
//                         bsonType: "string"
//                     }, 
//                     tracks: {
//                         bsonType: "array",
//                     }
//                 }
               
//             }
//         }
//     })
// }

async function run(){
    const uri = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
    await client.connect()
    const db = client.db("Moosax")
    await db.collection("users").find({}).forEach(user=>{
        db.collection("tracker").insertOne({
            uid: user.uid,
            byLiked: {
                genre: {},
                tags: {},
            },
            byPlays: {
                genre:{},
                tags: {}
            }
        })
    })
    console.log("finished")
}

run().finally(()=>console.log("over"))