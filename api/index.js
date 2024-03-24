const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer')
const uploadMiddleware = multer({dest: 'uploads/' });
const fs = require('fs')

const salt = bcrypt.genSaltSync(10);
const secret = 'asda8yfdng87yna8gohcuhfno8ay314as';

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://postwardonkey:1823@cluster0.0grxqes.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (request,response) => {
    const {username,password} = request.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password,salt)
        });
        response.json(userDoc);
    } catch(e) {
        //console.log(e) //IMPORTANT FOR DEBUGGING
        response.status(400).json(e);
    }
});

//on submit of form in login, this is called
app.post('/login', async (request,response) =>{
    const {username,password} = request.body;
    const userDoc = await User.findOne({username});
    //response.json(userDoc);
    let passCorrect = false;
    if (userDoc){ // if password exists for username
        passCorrect = bcrypt.compareSync(password, userDoc.password);}
    else {
        // Handle the case where userDoc is null, e.g., show an error message or return early
        console.error("User not found");
    }
    //response.json(passCorrect);
    if (passCorrect){
        //logged in
        jwt.sign({username, id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            // to see json, go to network and PREVIEW
            response.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
            // cookie set with token info
            // response headers contains this
        });

    } else {
        response.status(400).json('wrong credentials');
    }
});

app.get('/profile', (request,response) => {
    const {token} = request.cookies;
    // same as const token = request.cookies.token;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        response.json(info);
    });
});

app.post('/logout', (request,response) => {
    response.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (request, response) => {
    const { titleCanvasData, mainCanvasData, date } = request.body;
    console.log(titleCanvasData.length)
    console.log(mainCanvasData.length)
    //console.log(mainCanvasData)

    //const titleFilePath = '../client/src/uploads/title.txt'
    //const mainFilePath = '../client/src/uploads/main.txt'
    
    //fs.writeFileSync(titleFilePath, titleCanvasData, 'utf-8');
    //fs.writeFileSync(mainFilePath, mainCanvasData, 'utf-8');
    //compressedTitleCanvasData = ...
    //compressedMainCanvasData = ...

    // Wrap the OCR process in a 
    var ocrTitleText = ""
    var mainTitleText = ""
    const ocrPromise = new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    var ocrTitleText = ""
    var mainTitleText = ""
    //var ocrPromise = ['',''];
    const pythonProcess = spawn("python", ["-u", "../client/src/ocr_model.py"], { stdio: 'pipe'});
    
    pythonProcess.stdin.write(titleCanvasData + "MAINCANVAS:" +  mainCanvasData);
    pythonProcess.stdin.end();
    pythonProcess.stdout.on("data", (data) => {
        
        console.log(typeof data)
        console.log(data.toString());

        mystr = data.toString();
        myjson = JSON.parse(mystr);
        ocrTitleText = myjson.TitleOCR;
        ocrMainText = myjson.MainOCR;

        console.log(ocrTitleText)
        console.log(ocrMainText)
        resolve([ocrTitleText,ocrMainText]); // Resolve the Promise with the updated values
        //ocrPromise = [ocrTitleText,ocrMainText];
    });

    pythonProcess.on("error", (error) => {
        console.log(error);
        reject(error); // Reject the Promise if there's an error
    });

    pythonProcess.on("close", (code) => {
        console.log(code)
});});
    
// Wait for the OCR process to complete and get the updated ocrTitleText
const [updatedOcrTitleText, updatedOcrMainText] = await ocrPromise;
// Now you can use updated values in the Post.create() or any other logic
const {token} = request.cookies;
jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const postDoc = await Post.create({
        titleCanvasData,
        mainCanvasData,
        ocrTitleText: updatedOcrTitleText,
        ocrMainText: updatedOcrMainText,
        date,
        author: info.id,
    });
    
    response.json(postDoc)
});
});

app.get('/post', async (request, response) => {
    const search = request.query.search;
    console.log(search)

    const filters = search ? { $or: [{ ocrTitleText: { $regex: search, $options: 'i' } }, { ocrMainText: { $regex: search, $options: 'i' } } ] } : {};
    const posts = await Post.find(filters)
        .populate('author', ['username'])
        .sort({ date: -1 });
    response.json(posts);
})



async function deleteAllPosts() {
    try {
      // Delete all documents in the "posts" collection
      const result = await Post.deleteMany({});
  
      console.log(`Deleted ${result.deletedCount} documents in the 'posts' collection.`);
    } catch{}
}

app.listen(4000);