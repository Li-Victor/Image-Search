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

function insertSearchLog(db, searchText, timestamp, res, buildURLSearch) {
    db.newSearchLog([searchText, timestamp])
        .then(() => {

            fetchData(buildURLSearch, res);

        })
        .catch((err) => {
            return res.status(404).send({
                error: 'Error with DB'
            });
        });
}

module.exports = {

    search: function (req, res, next) {
        if(!req.params.text) {
            next();
        } else {

            var db = req.app.get('db');
            var timestamp = (new Date(Date.now())).toISOString();
            var searchText = req.params.text;

            var buildURLSearch = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&per_page=10&nojsoncallback=1'
                + '&api_key=' + process.env.FLICKR_API_KEY + '&text=' + searchText;

            if(req.query.offset || req.query.offset === '') {

                //req.query.offset should just be digits
                if(req.query.offset.match(/^\d+$/)) {

                    buildURLSearch = buildURLSearch + '&page=' + Number(req.query.offset);
                    insertSearchLog(db, searchText, timestamp, res, buildURLSearch);
                } else {
                    next();
                }

            } else {
                insertSearchLog(db, searchText, timestamp, res, buildURLSearch);
            }

        }
    },

    latest: function (req, res, next) {

        var db = req.app.get('db');
        db.getLatestSearch()
            .then((logs) => {

                var arr = [];

                logs.forEach(function (log) {
                    arr.push({
                        term: log.searchtext,
                        when: log.searchtimestamp
                    });

                });

                return res.status(200).send(arr);
            })
            .catch((err) => {
                return res.status(404).send({
                    error: 'Error with DB'
                });
            });

    }

}
