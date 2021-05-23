const path = require('path');
const express = require("express");
const app = express();
const fs = require("fs");
const fetch = require('node-fetch');
var cache = require('memory-cache');

const pageTitleRu = "igosh.pro - Ваши впечатления от путешествий!"
const pageTitleEn = "igosh.pro - Your impressions from traveling!"
const descriptionRu = "Альбомы путешествий - фотографии, рассказы, советы, треки от тех, кто бывает в интересных местах. Расскажите друзьям о своем отпуске!"
const descriptionEn = "Travel albums - images, stories, tricks and tracks from interested places. Tell your story friends from your vacation!"
const pathToIndex = path.join(__dirname, "build/index.html")

app.get("/home", (req, res) => {
    console.log("home-------------------------")
    let title = getTitleForLocale(req);
    let description = getDescriptionForLocale(req);
    res.send(getUpdatedIndexForLocale(title, description))
})

app.get("/", (req, res) => {
    console.log("/-------------------------")
    let title = getTitleForLocale(req);
    let description = getDescriptionForLocale(req);
    res.send(getUpdatedIndexForLocale(title, description))
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
                    updateRouteTimelineResource(res, pageTitleEn, "", "https://igosh.pro/gallery/images/icon.png")
                })
        }
    }
})

/*function getDescriptionForLocale(req) {
    let locale = req.headers["accept-language"]
    let description = descriptionEn
    if(locale != null){
        console.log("locale request:" + locale)
        if(locale.search("ru") !== -1){
            description = descriptionRu
            console.log("locale:ru")
        }
    } else{
        console.log("locale: default")
    }
    return description;
}*/

function getDescriptionForLocale(req) {
    let locale = getLocale(req)
    let description = descriptionEn
    if(locale === "ru"){
        description = descriptionRu
    }
    return description;
}

function getTitleForLocale(req) {
    let locale = getLocale(req)
    let title = pageTitleEn
    if(locale === "ru"){
        title = pageTitleRu
    }
    return title;
}

function getLocale(req){
    let locale = req.headers["accept-language"]
    let resultLocale = "en";
    if(locale != null){
        console.log("locale request:" + locale)
        if(locale.search("ru") !== -1){
            resultLocale = "ru"
        }
        console.log("locale:" + resultLocale)
    } else{
        console.log("locale: default")
    }
    return resultLocale;
}

function getUpdatedIndexForLocale(pageTitle, description){
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