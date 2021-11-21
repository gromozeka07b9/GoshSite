const path = require('path');
const express = require("express");
const app = express();
const fs = require("fs");
const fetch = require('node-fetch');
var cache = require('memory-cache');
const {func} = require("prop-types");

const pageTitleRu = "Создавайте маршруты с GoSh!, делитесь впечатлениями, публикуйте блоги о путешествиях по всему миру!"
const pageTitleEn = "With GoSh! you make routes, share impressions, follow blogs about travel on whole world!"
const keywordsRu = "маршруты, впечатления, блог, путешествия, фотографии, советы, делиться, узнать, как"
const keywordsEn = "routes, impressions, blog, travel, image, tricks, share, know, how to"
const descriptionRu = "Социальная сеть для путешественников. Альбомы путешествий - фотографии, рассказы, советы, треки от тех, кто бывает в интересных местах. Расскажите друзьям о своем отпуске!"
const descriptionEn = "Social network for travellers. Travel albums - images, stories, tricks and tracks from interested places. Tell your story friends from your vacation!"
const rootH1TitleRu = "Приветствую вас в GoSh! Здесь вы можете посмотреть альбомы путешествий, маршруты, фотографии и советы. И конечно, можете поделиться своими впечатлениями от отпуска! Проект некоммерческий."
const rootH1TitleEn = "Welcome to GoSh! Here we can see travel albums, routes, images, tips and tricks. Of course, you may share your travel expressions!"

const pathToIndex = path.join(__dirname, "build/index.html")


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
    res.send(getUpdatedFeedForLocale(req, title, description, keywords, routes))
})

app.get("/", async (req, res) => {
    console.log("/-------------------------")
    let title = getTitleForLocale(req);
    let description = getDescriptionForLocale(req);
    let keywords = getKeywordsForLocale(req);
    let routes = await getRoutesForLocale(req);
    res.send(getUpdatedFeedForLocale(req, title, description, keywords, routes))
})

app.get("/route/*", async (req, res) => {
    console.log("route-----------------")
    let routeId = req.params[0];
    let updatedResource = "";
    if (routeId != null) {
        console.log(routeId);
        let cachedRoute = cache.get(routeId)
        if (cachedRoute != null) {
            console.log(`${routeId} cache hit`)
            updatedResource = getUpdatedRouteResource(req, cachedRoute.name, cachedRoute.description, cachedRoute.imgFilename ? cachedRoute.imgFilename : cachedRoute.firstImageName, cachedRoute.routePoints)
        } else {
            await fetch(`https://igosh.pro/api/v2/public/routes?pageSize=1&range=[0,1]&filter={"id":"${routeId}"}`)
                .then(res => res.json())
                .then(async (result) => {
                    let routeName = "";
                    let routeDescription = "";
                    let routeImage = "";
                    let routePoints = "";
                    if (result.length > 0) {
                        console.log(`${routeId} not found cache`)
                        routeName = result[0].name;
                        routeDescription = result[0].description;
                        routeImage = result[0].imgFilename ? result[0].imgFilename : result[0].firstImageName;
                        routePoints = await getHtmlRoutePointsDescriptions(routeId);
                        result[0].routePoints = routePoints;
                        cache.put(routeId, result[0], 60000)
                    } else {
                        console.log("not found for:" + routeId);
                    }
                    updatedResource = getUpdatedRouteResource(req, routeName, routeDescription, routeImage, routePoints)
                })
                .catch(error => {
                    console.log(error);
                    updatedResource = getUpdatedRouteResource(req, "", "", "https://igosh.pro/gallery/images/icon.png", "")
                })
        }
    }
    res.send(updatedResource);
})

async function getHtmlRoutePointsDescriptions(routeId) {
    let htmlRoutePoints = "";
    let routePointsObj = [];
    
    await fetch(`https://igosh.pro/api/v2/public/RoutePoints?pageSize=100&range=[0,9]&filter={"routeId":"${routeId}"}`)
        .then(res => res.json())
        .then((result) => {
            if (result.length > 0) {
                routePointsObj.push("<ul>")
                result.forEach(function (item, i){
                    routePointsObj.push(`<li><a href='https://igosh.pro/route/${item.routeId}'>${item.name}. ${item.description}</a></li>`)
                });
                routePointsObj.push("</ul>")
                htmlRoutePoints = routePointsObj.join("");
            } else {
                console.log("not found for:" + routeId);
            }
        })
        .catch(error => {
            console.log(error);
        })
    return htmlRoutePoints;
}

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
                //console.log(routes);
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

/*function getUpdatedIndexForLocale(pageTitle, description){
    let raw = fs.readFileSync(pathToIndex)
    let updated = raw.toString().replace("__title__", `<title>${pageTitle}</title>`)
    updated = updated.toString().replace("__description__", `<meta name="description" content="${description}" />`)
    updated = updated.toString().replace("__image__", `<meta property="og:image" content="https://igosh.pro/gallery/images/icon.png" />`)
    return updated;
}*/

function getUpdatedFeedForLocale(req, pageTitle, description, keywords, routes){
    let locale = getLocale(req)
    let raw = fs.readFileSync(pathToIndex)//ToDo:должен быть только index.html
    let updated = raw.toString().replace("__title__", `<title>${pageTitle}</title>`)
    updated = updated.replace("__description__", `<meta name="description" content="${description}" />`)
    updated = updated.replace("__keywords__", `<meta name="keywords" content="${keywords}" />`)
    updated = updated.replace("__h1title__", locale === "ru" ? rootH1TitleRu : rootH1TitleEn);

    updated = updated.replace("__liRoutes__", routes)
    updated = updated.replace("__image__", `<meta property="og:image" content="https://igosh.pro/gallery/images/icon.png" />`)
    //console.log(updated);
    return updated;
}

function getUpdatedRouteResource(req, routeName, routeDescription, routeImagename, htmlRoutePoints) {
    const raw = fs.readFileSync(pathToIndex)//ToDo:должен быть только index.html
    let updated = raw.toString().replace("__title__", `<title>${routeName}</title>`)
    updated = updated.toString().replace("__description__", `<meta name="description" content="${routeDescription}" />`)
    updated = updated.toString().replace("__image__", `<meta property="og:image" content="../shared/${routeImagename}" />`)
    updated = updated.toString().replace("__h1title__", `${routeName}. ${routeDescription}`)
    updated = updated.toString().replace("__liRoutePoints__", htmlRoutePoints)
    //console.log(updated);
    return updated;
}

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

app.use(express.static(path.join(__dirname, "build")));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("dirname:" + __dirname);
    console.log(`Server started on port ${port}`);
    makeSitemap();
})