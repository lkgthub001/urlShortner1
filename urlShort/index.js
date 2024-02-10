const express = require('express');
const path = require("path")
const cookieParser = require('cookie-parser');

const {connectToMongoDB} = require('./connect');
const URL = require('./models/url')
const {handleGetRedirectURL} = require('./controllers/url');

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const {restrictToLoggedinUserOnly, checkAuth} = require('./middlewares/auth')
const app = express();
const PORT = 8001;
const MONGODB_URI = "mongodb://127.0.0.1:27017/short-url"
// const MONGODB_URI =process.env.DB_URI;

connectToMongoDB(MONGODB_URI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error occured", err);
})

app.use(express.json());
//for form data
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
//for using ejs
app.set("view engine","ejs");
app.set("views", path.resolve('./views'));

app.use('/url',restrictToLoggedinUserOnly, urlRoute);
app.use('/',checkAuth, staticRoute);
app.use('/user', userRoute);
app.get('/reurl/:shortid',handleGetRedirectURL)






app.listen(PORT, ()=>{
    console.log(`Server started at PORT ${PORT}`);
})



// const express = require('express');
// const urlRoute = require('./routes/url');
// const {connectToMongoDB} = require('./connect');
// const URL = require('./models/url');
// const shortid = require('shortid');

// const app = express();
// const PORT = 8001;

// connectToMongoDB('mongodb://127.0.0.1:27017/short-url').then(()=>{
//     console.log("Connected to MongoDB");
// }).catch((err)=>{
//     console.log("Error occured", err);
// })

// app.use(express.json());


// app.use('/url', urlRoute);
// app.get('/:shortid',async (req, res)=>{
//     const shortID = req.params.shortid;
//     const r = await URL.findOneAndUpdate({
//         shortID,
//     }, {
//         $push: {
//             visitHistory : {
//                 timestamp: Date.now(),
//             },
//         }
//     })
    
//     const entry = await URL.findOne({shortId : shortID})
//     console.log(entry);
//     res.redirect(entry.redirectURL);
    
// })
// app.listen(PORT, ()=>{
//     console.log(`Server started at PORT ${PORT}`);
// })