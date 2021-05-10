const path = require('path');
const express = require("express");
const app = express();
const fs = require("fs");
const fetch = require('node-fetch');
var cache = require('memory-cache');

const descriptionRu = "Объединяем фотоальбом, блог и маршрут вашего путешествия!"
const descriptionEn = "Your photoalbums, blogs and track in one!"
const pageTitle = "GoSh!"
const pathToIndex = path.join(__dirname, "build/index.html")

app.get("/home", (req, res) => {
    console.log("home-------------------------")
    let description = getDescriptionForLocale(req);
    res.send(getUpdatedIndexForLocale(description))
})

app.get("/", (req, res) => {
    console.log("/-------------------------")
    let description = getDescriptionForLocale(req);
    res.send(getUpdatedIndexForLocale(description))
})

app.get("/routetimeline/*", (req, res) => {
    console.log("routetimeline-----------------")
    let routeId = req.params[0];
    if(routeId != null)
    {
        console.log(routeId);
        let cachedRoute = cache.get(routeId) 
        if(cachedRoute != null){
            console.log(`${routeId} cache hit`)
            updateRouteTimelineResource(res, cachedRoute.name, cachedRoute.description, cachedRoute.imgFilename ? cachedRoute.imgFilename : cachedRoute.firstImageName)
        } else{
            fetch(`https://igosh.pro/api/v2/public/routes?pageSize=1&range=[0,1]&filter={"id":"${routeId}"}`)
                .then(res => res.json())
                .then((result) => {
                    let routeName = "";
                    let routeDescription = "";
                    let routeImage = "";
                    if(result.length > 0){
                        console.log(`${routeId} not found cache`)
                        routeName = result[0].name;
                        routeDescription = result[0].description;
                        routeImage = result[0].imgFilename ? result[0].imgFilename : result[0].firstImageName;
                        cache.put(routeId, result[0], 60000)
                    } else{
                        console.log("not found for:" + routeId);
                    }
                    updateRouteTimelineResource(res, routeName, routeDescription, routeImage)
                })
                .catch(error => {
                    console.log(error);
                    updateRouteTimelineResource(res, pageTitle, "", "https://igosh.pro/gallery/images/icon.png")
                })
        }
    }
})

function getDescriptionForLocale(req) {
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
    return description;
}

function getUpdatedIndexForLocale(description){
    let raw = fs.readFileSync(pathToIndex)
    let updated = raw.toString().replace("__title__", `<title>${pageTitle}</title>`)
    updated = updated.toString().replace("__description__", `<meta name="description" content="${description}" />`)
    updated = updated.toString().replace("__image__", `<meta property="og:image" content="https://igosh.pro/gallery/images/icon.png" />`)
    return updated;
}

function updateRouteTimelineResource(res, routeName, routeDescription, routeImagename) {
    console.log(pathToIndex);
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