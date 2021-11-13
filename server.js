const path = require('path');
const express = require("express");
const app = express();
const fs = require("fs");
const fetch = require('node-fetch');
var cache = require('memory-cache');
const {func} = require("prop-types");

const pageTitleRu = "Создавайте маршруты, делитесь впечатлениями, блоги о путешествиях по всему миру!"
const pageTitleEn = "Make your routes, share impressions, follow blogs about travel on whole world!"
const keywordsRu = "маршруты, впечатления, блог, путешествия, фотографии, советы, делиться, узнать, как"
const keywordsEn = "routes, impressions, blog, travel, image, tricks, share, know, how to"
const descriptionRu = "Социальная сеть для путешественников. Альбомы путешествий - фотографии, рассказы, советы, треки от тех, кто бывает в интересных местах. Расскажите друзьям о своем отпуске!"
const descriptionEn = "Social network for travellers. Travel albums - images, stories, tricks and tracks from interested places. Tell your story friends from your vacation!"
const pathToIndex = path.join(__dirname, "build/index.html")
const pathToFeed = path.join(__dirname, "build/feed.html")

app.get("/sitemap.xml", (req, res) => {
    console.log("sitemap-------------------------")
    fs.readFile('sitemap.xml', 'utf8', function (err, data) {
        if(err) return console.log(err);
        res.send(data);
    });
})

app.get("/feed", async (req, res) => {
    console.log("feed-------------------------")
    let title = getTitleForLocale(req);
    let description = getDescriptionForLocale(req);
    let keywords = getKeywordsForLocale(req);
    let routes = await getRoutesForLocale(req);
    res.send(getUpdatedFeedForLocale(title, description, keywords, routes))
})

app.get("/", (req, res) => {
    console.log("/-------------------------")
    let title = getTitleForLocale(req);
    let description = getDescriptionForLocale(req);
    res.send(getUpdatedIndexForLocale(title, description))
})

app.get("/route/*", (req, res) => {
    console.log("route-----------------")
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

function getDescriptionForLocale(req) {
    let locale = getLocale(req)
    let description = descriptionEn
    if(locale === "ru"){
        description = descriptionRu
    }
    return description;
}

function getKeywordsForLocale(req) {
    let locale = getLocale(req)
    let keywords = keywordsEn
    if(locale === "ru"){
        keywords = keywordsRu
    }
    return keywords;
}

async function getRoutesForLocale(req) {
    //let locale = getLocale(req) //пока все маршруты на Русском
    let routes = "";
    let routesObj = [];
    await fetch(`https://igosh.pro/api/v2/public/routes?pageSize=1000&range=[0,999]`)
        .then(res => res.json())
        .then((result) => {
            if(result.length > 0){
                routesObj.push("<ul>")
                result.forEach(function (item, i){
                    routesObj.push(`<li><a href='https://igosh.pro/route/${item.id}'>${item.name}. ${item.description}</a></li>`)
                });
                routesObj.push("</ul>")
                routes = routesObj.join("");
                console.log(routes);
            } else{
                console.log("routes not found");
            }
        })
        .catch(error => {
            console.log(error);
        })
    return routes;
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

function getUpdatedFeedForLocale(pageTitle, description, keywords, routes){
    let raw = fs.readFileSync(pathToFeed)
    let updated = raw.toString().replace("__title__", `<title>${pageTitle}</title>`)
    updated = updated.toString().replace("__description__", `<meta name="description" content="${description}" />`)
    updated = updated.toString().replace("__keywords__", `<meta name="keywords" content="${keywords}" />`)
    updated = updated.toString().replace("__h1title__", pageTitle)
    updated = updated.toString().replace("__liRoutes__", routes)
    updated = updated.toString().replace("__image__", `<meta property="og:image" content="https://igosh.pro/gallery/images/icon.png" />`)
    return updated;
}

function updateRouteTimelineResource(res, routeName, routeDescription, routeImagename) {
    console.log(pathToIndex);
    const raw = fs.readFileSync(pathToIndex)
    let updated = raw.toString().replace("__title__", `<title>${routeName}</title>`)
    updated = updated.toString().replace("__description__", `<meta name="description" content="${routeDescription}" />`)
    updated = updated.toString().replace("__image__", `<meta property="og:image" content="../shared/${routeImagename}" />`)
    console.log(updated);
    res.send(updated)
}

app.use(express.static(path.join(__dirname, "build")));

const port = process.env.PORT || 3000;

function makeSitemap() {
    let sitemapXml = [];
    fetch(`https://igosh.pro/api/v2/public/routes?pageSize=1000&range=[0,999]`)
        .then(res => res.json())
        .then((result) => {
            let routeName = "";
            if(result.length > 0){
                sitemapXml.push("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">")
                let curDate = new Date().toISOString();
                result.forEach(function (item, i){
                    sitemapXml.push(`<url><loc>https://igosh.pro/route/${item.id}</loc><lastmod>${curDate}</lastmod><priority>1.0</priority></url>`)
                });
                sitemapXml.push("</urlset>")
                fs.truncate('sitemap.xml', 0, function (err) {
                    if (err) return console.log(err);
                });
                fs.appendFile('sitemap.xml', sitemapXml.join(""), function (err){
                    if (err) return console.log(err);
                })
                console.log(sitemapXml.join(""));
            } else{
                console.log("routes not found");
            }
        })
        .catch(error => {
            console.log(error);
        })
}

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    makeSitemap();
})