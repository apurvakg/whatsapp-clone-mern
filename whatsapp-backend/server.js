import express from 'express'
import Pusher from 'pusher'
import mongoose from 'mongoose'
import Messages from "./dbMessages.js"


const app = express()
const port = process.env.PORT || 9000


const pusher = new Pusher({
  appId: "1177678",
  key: "a7564ddc22686bd1d8a7",
  secret: "2ff385dabadbbbdece07",
  cluster: "ap2",
  useTLS: true
});

app.use(express.json())

app.use((req,res,next) =>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
})

const connection_url = 'mongodb+srv://admin:gwalior@cluster0.nzspi.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection

db.once("open",() => {
    console.log("Db connected")

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change",(change) => {
        console.log(change);

        if(change.operationType === 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received:messageDetails.received,
            });
        }
    })
})


app.get('/',(req,res) => res.status(200).send('hello world'))

app.get('/messages/sync', (req,res) => {

    Messages.find((err,data) =>
    {
        if(err) {
            res.status(500).send(err)

        }
        else{
            res.status(200).send(data)
        }
    })
})



app.post('/messages/new', (req,res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err,data) =>
    {
        if(err) {
            res.status(500).send(err)

        }
        else{
            res.status(201).send(data)
        }
    })
})



app.listen(port,() => console.log('Listening'))
