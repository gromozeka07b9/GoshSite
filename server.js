const path = require('path');
const express = require("express");
const app = express();
const fs = require("fs");
const fetch = require('node-fetch');
var cache = require('memory-cache');

const descriptionRu = "Объединяем фотоальбом, блог и маршрут вашего путешествия!"
const descriptionEn = "Your photoalbums, blogs and track in one!"

const pathToIndex = path.join(__dirname, "build/index.html")
app.get("/home", (req, res) => {
    console.log("home-------------------------")
    let locale = req.headers["accept-language"]
    let description = ""
    if(locale.search("ru") !== -1){
        description = descriptionRu
        console.log("ru")
    } else{
        description = descriptionEn
        console.log("en")
    }
    console.log("request locale:" + locale)
    const raw = fs.readFileSync(pathToIndex)
    const pageTitle = "GoSh!"
    let updated = raw.toString().replace("__title__", `<title>${pageTitle}</title>`)
    updated = updated.toString().replace("__description__", `<meta name="description" content="${description}" />`)
    updated = updated.toString().replace("__image__", `<meta property="og:image" content="https://igosh.pro/gallery/images/icon.png" />`)
    res.send(updated)
})

app.get("/routetimeline/*", (req, res) => {
    console.log("routetimeline-----------------")
    let routeId = req.url.replace("/routetimeline/","")
    if(routeId != null)
    {
        let cachedRoute = cache.get(routeId) 
        if(cachedRoute != null){
            console.log(`${routeId} cache hit`)
            updateResource(res, cachedRoute.name, cachedRoute.description, cachedRoute.imgFilename ? cachedRoute.imgFilename : cachedRoute.firstImageName)
        } else{
            fetch(`https://igosh.pro/api/v2/public/routes?pageSize=1&range=[0,1]&filter={"id":"${routeId}"}`)
                .then(res => res.json())
                .then((result) => {
                    if(result.length > 0){
                        console.log(`${routeId} not found cache`)
                        updateResource(res, result[0].name, result[0].description, result[0].imgFilename ? result[0].imgFilename : result[0].firstImageName)
                        cache.put(routeId, result[0], 60000)
                    }
                })
                .catch(error => {
                    updateResource(res, "GoSh!", "", "https://igosh.pro/gallery/images/icon.png")
                })
        }
    }
})

function updateResource(res, routeName, routeDescription, routeImagename) {
    const raw = fs.readFileSync(pathToIndex)
    let updated = raw.toString().replace("__title__", `<title>${routeName}</title>`)
    updated = updated.toString().replace("__description__", `<meta name="description" content="${routeDescription}" />`)
    updated = updated.toString().replace("__image__", `<meta property="og:image" content="../shared/${routeImagename}" />`)
    res.send(updated)
}

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) =>
    {
        res.sendFile(path.join(__dirname, "build/index.html"))
    }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})