# Image-Search

Users can get the image URLs, alt text and page urls for a set of images relating to a given search string.

Users can paginate through the responses by adding ?offset=2 parameter to the URL.

Users can get a list of the most recently submitted search strings.

Made with Express.js and Heroku Postgres Database, along with [**Flickr API**](https://www.flickr.com/services/api/)

## Installation
Get an [**API key**](https://www.flickr.com/services/apps/create/) from Flickr

Sign up for a free account at [**Heroku**](https://www.heroku.com/)

Make sure to have the following installed:
* NodeJS
* [**Postgres**](https://www.postgresql.org/download/)
* [**Heroku Client**](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) for your terminal

Sign in to [**Heroku**](https://id.heroku.com/login) and click on `Create New App` button on the dashboard. Then, specify a name (or leave blank and Heroku will generate a name for you) and click `Create App`.

At this point, you should be in the dashboard of your project. There will either be `Resources` tab or an `icon of three horizontal lines`, depending on your window size. Click on it and you should be in the next screen.

On this screen, type `postgres` in the `Add-ons` search field and select `Heroku Postgres`. Select the `Hobby Dev - Free` option.

Select the `Heroku Postgress :: Datebase` add-on from the list. On the database page, click on the `View Credentials` button. You will then be presented with the credentials to your very own Postgres datebase!

With your terminal open, run the command that is labeled `Heroku CLI`. It should be start with a `heroku pg:sql`. Copy and execute the query in [**createTable.sql**](https://github.com/Li-Victor/Image-Search/blob/master/createTable.sql).

Create a new file called secret.js on the root directory of this project, copy the URI labeled `URI` on the Database Credentials.
Inside of secret.js:
```javascript
module.exports = {
    flickrAPIKey: YOUR FLICKR API KEY IN QUOTES ,
    DBconnection: YOUR URI TO DATABASE IN QUOTES + '?ssl=true'
}
```

With everything setup, run `npm install` and then `npm start`
