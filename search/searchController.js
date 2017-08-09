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

module.exports = {

    search: function (req, res, next) {
        if(!req.query.text) {
            next();
        } else {
            var searchText = req.query.text;
            var buildURLSearch = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&per_page=10&nojsoncallback=1'
                + '&api_key=' + secret.flickrAPIKey + '&text=' + searchText;

            if(req.query.offset || req.query.offset === '') {
                if(req.query.offset.match(/^\d+$/)) {
                    buildURLSearch = buildURLSearch + '&page=' + Number(req.query.offset);
                    fetchData(buildURLSearch, res);
                } else {
                    next();
                }
            } else {
                fetchData(buildURLSearch, res);
            }

        }
    }

}
