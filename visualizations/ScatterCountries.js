class ScatterCountries {
    constructor(svg, url1, url2) {
        this.svg = svg;
        this.url1 = url1;
        this.url2 = url2;

        this.filterEmptyValues2 = function (d) {
            return (d.value1 != null && d.value2 != null);
        }

        this.filterNoISO3Code = function (d) {
            return (d.countryiso3code != "");
        }

        this.padding = 70;
    }

    visualize() {
        if (this.url1 && this.url2) {
            console.log("two urls received")
            var promises = [];
            promises.push(d3.json(this.url1))
            promises.push(d3.json(this.url2))

            Promise.all(promises).then(this.test2.bind(this));
        }
        else if (this._url1) {
            console.log("Only one data provided, expected two.")
        }
        else {
            console.log("No data provided.")
        }

    }

    test2(values) {
        console.log("arrived at test2");

        console.log("All values:")
        console.log(values);

        var data1 = values[0][1].filter(this.filterNoISO3Code);
        var data2 = values[1][1].filter(this.filterNoISO3Code);
        console.log("data1:")
        console.log(data1);
        console.log("data2:")
        console.log(data2);

        var maxdate1 = d3.max(data1, function (d) { return d.date; });
        var maxdate2 = d3.max(data2, function (d) { return d.date; });
        var mindate1 = d3.min(data1, function (d) { return d.date; });
        var mindate2 = d3.min(data2, function (d) { return d.date; });
        var maxdate, mindate;
        if (maxdate1 == maxdate2) {
            maxdate = maxdate1;
        }
        else {
            console.log("Error: both data don't have the same max date.");
        }
        if (mindate1 == mindate2) {
            mindate = mindate1;
        }
        else {
            console.log("Error: both data don't have the same min date.");
        }

        var len = maxdate - mindate + 1;
        var combined = {};

        for (var i = 0; i < data1.length; i++) {
            if (!(Array.isArray(combined[data1.date]))) {
                combined[data1.date] = [];
            }
            combined[data1.date].push({ "countryiso3code": data1[i].countryiso3code, "value1": data1[i].value, "value2": data2[i].value });
        }

        console.log(combined)

        combined = combined.filter(this.filterEmptyValues2);
        console.log(combined);

        //Create scale functions
        var xScale = d3.scaleLinear()
            .domain([
                d3.min(combined, function (d) { return d.value1; }),
                d3.max(combined, function (d) { return d.value1; })
            ])
            .range([this.padding, this.svg.attr('width') - this.padding]);

        var yScale = d3.scaleLinear()
            .domain([
                d3.min(combined, function (d) { return d.value2; }),
                d3.max(combined, function (d) { return d.value2; })
            ])
            .range([this.svg.attr('height') - this.padding, this.padding]);

        //Define X axis
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);

        //Define Y axis
        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        //Generate circles last, so they appear in front
        this.svg.selectAll("circle")
            .data(combined)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d.value1);
            })
            .attr("cy", function (d) {
                return yScale(d.value2);
            })
            .attr("r", 2);

        //Create X axis
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - this.padding) + ")")
            .call(xAxis);

        //Create Y axis
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + this.padding + ",0)")
            .call(yAxis);
    }
}