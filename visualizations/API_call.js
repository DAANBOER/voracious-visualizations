class APIurl {
    constructor(country, indicator, date) {
        this.country = country;
        this.indicator = indicator;
        this.date = date;
    }

    constructURL() {
        var base_url = "http://api.worldbank.org/v2";
        var _country, _indicator, _date;

        if (country.length > 1) {
            for (var i = 0; i < country.length; i++) {
                _country = _country + ";" + country[i];
            }
        }
        else {
            _country = country;
        }

        if (indicator.length > 1) {
            for (var i = 0; i < indicator.length; i++) {
                _indicator = _indicator + ";" + indicator[i];
            }
        }
        else {
            _indicator = indicator;
        }

        if (date.length == 2) {
            _date = date[0] + ":" + date[1];
        }
        else if (date.length > 2) {
            console.log("Error: date should either contain one or two values, but not more")
            _date = "";
        }
        else {
            _date = date;
        }

        var country_url, indicator_url, date_url;

        if (country) { country_url = "/country" + _country }
        if (indicator) { indicator_url = "/indicator" + _indicator }
        if (date) { date_url = "date=" + _date + "&" }

        var query_url = "?" + date_url + "format=json"


        return base_url + country_url + indicator_url + query_url;
    }
}