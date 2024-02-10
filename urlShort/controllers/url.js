const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortUrl(req, res){
    try {
        const body = req.body;
        if (!body.url)
            return res.status(400).json({ error: "Url is required" });
    
        const shortID = shortid();
        await URL.create({
            shortId: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy : req.user._id,
        });
        const allURL = await URL.find({createdBy : req.user._id})
        // return res.render('home',{
        //     id: shortID,
        //     urls: allURL,
        // });
        return res.redirect("/");
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
    
}

async function handleGetAnalytics(req, res){
    try {
        const shortid = req.params.shortId;
        const entry = await URL.findOne({ shortId: shortid });
        
        if (!entry) {
            return res.status(404).send("URL not found");
        }
    
        return res.json({
            "length": entry.visitHistory.length,
            "analytics": entry.visitHistory,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
    
}

async function handleGetRedirectURL(req, res){
    try {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        const customDateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
        const shortId = req.params.shortid;
        const entry = await URL.findOneAndUpdate({
            shortId,
        }, {
            $push: {
                visitHistory: {
                    timestamp: customDateTimeString,
                },
            },
        });
    
        if (!entry)
            return res.status(404).send("URL not found");
    
        return res.redirect(entry.redirectURL);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server Error");
    }
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
    handleGetRedirectURL,
}