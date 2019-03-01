const express = require('express');
const http = require('http');
const path = require('path');
var request = require("request");
const bodyParser = require('body-parser');
var weatherApi = 'aeef3d2ed53e72fbe6c0a8309db31f61';

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.render('index' ,{weather: null , error: null});
});

app.post('/', (req, res) => {

    var city = req.body.city;
    var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherApi}`;
    
    request(url, (err, response, body) => {
        if(err) {
            res.render('index', {weather: null, error: 'somethins went wrong, Please try agian.'})
        } else {
            var weather = JSON.parse(body)
            if(weather.main == undefined) {
                res.render('index', {weather: null, error: 'somethins went wrong, Please try agian.'})
            } else {
                var temCelcius = Math.round(((weather.main.temp - 32) * 5/9));
                var weatherTemp = `${temCelcius}`;
                var name = `${weather.name}`;
                var weatherTxt = 'It is '+ `${temCelcius}` +'&#8451; in '+ `${weather.name}` +'.';
                 res.render('index', {weather: weatherTxt, error: null, temperature: weatherTemp, city: name});
            }
        }
    });

});

app.use((req, res)=> {
    res.status(404).render('Page Not Found');
})


app.listen(port, function() {
    console.log('app is running on port '+ port);
})

