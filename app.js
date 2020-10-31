const express=require('express');
const app=express();
let bodyParser=require('body-parser')
let cors=require('cors')
let mongodb=require('mongodb');
let mongoClient=mongodb.MongoClient;
let dotenv=require('dotenv');
const { emitWarning } = require('process');
var cookieParser = require('cookie-parser')
app.use(cookieParser())
dotenv.config();
app.use(cors({
    origin:"*"
}));
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.send("Hello to get route!");
});

app.get('/getusers',async function(req,res){
    try{
        let client=await mongoClient.connect(process.env.URL);
        let db=client.db('gtquizapp');
        let allUsers=await db.collection('users').find({}).toArray();
        res.json(allUsers);
    }
    catch(err){
        console.log(err);
    }
});

app.put('/submitans',async function(req,res){
    try{
        let email=req.header('userEmail');
        console.log(email);
        let client=await mongoClient.connect(process.env.URL);
        let db=client.db('gtquizapp');
        console.log('connected to DB');
        let allUsers=await db.collection('users').findOneAndUpdate({userEmail:email},{$set:{answers:req.body}});
        if(email==null){
            res.json({
                "status":0
            });
        }
        else{
            res.json({
                "status":1
            });
        }
    }
    catch(err){
        console.log(err);
    }
});

app.post("/userlogin",async function(req,res){
    try{
        let client=await mongoClient.connect(process.env.URL);
        let db=client.db('gtquizapp');
        await db.collection('users').insertOne(req.body);
        res.json({
            "status":1
        });
    }
    catch(err){
        console.log(err);
    }
});

app.post('/adminlogin',async function(req,res){
    try{
        let client=await mongoClient.connect(process.env.URL);
        let db=client.db('gtquizapp');
        let adminUser=await db.collection('admin').findOne({email:req.body.adminEmail});
        if(adminUser.password==req.body.adminPass){
            res.json({
                "status":1
            });
        }
    }
    catch(err){
        console.log(err);
    }
});

app.listen(process.env.PORT||3000,function(){
    console.log("Listening on port 3000");
})