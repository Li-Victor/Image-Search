var secret = require('../secret');
var fetch = require('node-fetch');

function fetchData(URLSearch, res) {
    fetch(URLSearch).then(function (data) {
        return data.json();
    }).then(function (json) {

        var arr = [];

        json.photos.photo.forEach(function (photoInfo) {
            arr.push({
                imageURL: `https://farm${photoInfo.farm}.staticflickr.com/${photoInfo.server}/${photoInfo.id}_${photoInfo.secret}.jpg`,
                alt_text: photoInfo.title,
                pageURL: `https://www.flickr.com/photos/${photoInfo.owner}/${photoInfo.id}/`
            })
        });

        return res.status(200).send(arr);
    })
}

function insertSearchLog(db, searchText, timestamp, res) {
    db.newSearchLog([searchText, timestamp])
        .then(() => {
            return res.status(200).send('this works');
        })
        .catch((err) => {
            return res.status(404).send({
                error: err
            });
        });
}

module.exports = {

    search: function (req, res, next) {
        if(!req.query.text) {
            next();
        } else {

            var db = req.app.get('db');
            var timestamp = (new Date(Date.now())).toISOString();
            var searchText = req.query.text;

            if(req.query.offset || req.query.offset === '') {

                //req.query.offset should just be digits
                if(req.query.offset.match(/^\d+$/)) {

                    insertSearchLog(db, searchText, timestamp, res);
                } else {
                    next();
                }

            } else {
                insertSearchLog(db, searchText, timestamp, res);
            }



            // var buildURLSearch = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&per_page=10&nojsoncallback=1'
            //     + '&api_key=' + secret.flickrAPIKey + '&text=' + searchText;
            //
            // if(req.query.offset || req.query.offset === '') {
            //     if(req.query.offset.match(/^\d+$/)) {
            //         buildURLSearch = buildURLSearch + '&page=' + Number(req.query.offset);
            //         fetchData(buildURLSearch, res);
            //     } else {
            //         next();
            //     }
            // } else {
            //     fetchData(buildURLSearch, res);
            // }

        }
    }

}
