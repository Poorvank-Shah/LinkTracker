require('dotenv').config();
const express = require('express')
const app = express()

const shortUrl = require('./models/shortUrl')
const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended : false}));

app.get('/', async (req,res)=>{
    const shortUrls = await shortUrl.find();
    res.render('index',{shortUrls : shortUrls})
})

app.post('/:shortUrls', async (req,res)=>{
    await shortUrl.create({full : req.body.fullUrl})
    res.redirect('/')
})

// app.get('/#', async (req,res)=>{
// })
app.get('/:sUrl',async (req,res)=>{
    const sUrl = await shortUrl.findOne({short : req.params.sUrl})

    if(sUrl == null)  return res.sendStatus(404);

    sUrl.clicks = sUrl.clicks + 1;
    sUrl.save()

    res.redirect(sUrl.full)
})

app.listen(process.env.PORT || 5000);