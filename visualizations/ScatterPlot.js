class ScatterPlot {
    constructor(svg, url1, url2) {
        this._url1 = url1;
        this._url2 = url2;
        this.svg = svg;

        this.filterEmptyValues = function (d) {
            return (d.value != null);
        }

        this.filterEmptyValues2 = function (d) {
            return (d.value1 != null && d.value2 != null);
        }

        this.padding = 70;
    }

    visualize() {
        if (this._url1 && this._url2) {
            console.log("two urls received")
            var promises = [];
            promises.push(d3.json(this._url1))
            promises.push(d3.json(this._url2))

            Promise.all(promises).then(this.test2.bind(this));
        }
        else if (this._url1) {
            d3.json(this._url1).then(this.test1.bind(this));
        }
        else {
            console.log("No data provided")
        }

    }

    test2(values) {
        console.log("arrived at test2");

        var data1 = values[0][1];
        var data2 = values[1][1];
        console.log(data1);
        console.log(data2);
        console.log(values);

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
        var combined = [];

        for (var i = 0; i < len; i++) {
            combined[i] = {"date": data1[i].date, "value1": data1[i].value, "value2": data2[i].value};
        }

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

        var formatTime = d3.timeFormat("%b %e");

        // Generate date labels first, so they are in back
        // this.svg.selectAll("text")
        //     .data(json)
        //     .enter()
        //     .append("text")
        //     .text(function (d) {
        //         return formatTime(d.date);
        //     })
        //     .attr("x", function (d) {
        //         return xScale(d.date) + 4;
        //     })
        //     .attr("y", function (d) {
        //         return yScale(d.value) + 4;
        //     })
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "11px")
        //     .attr("fill", "#bbb");

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

    test1(data) {
        console.log("arrived at test1");
        var padding = 100;

        console.log(data);

        var json = data[1].filter(this.filterEmptyValues);

        //Create scale functions
        var xScale = d3.scaleLinear()
            .domain([
                d3.min(json, function (d) { return d.date; }),
                d3.max(json, function (d) { return d.date; })
            ])
            .range([padding, this.svg.attr('width') - padding]);

        var yScale = d3.scaleLinear()
            .domain([
                d3.min(json, function (d) { return d.value; }),
                d3.max(json, function (d) { return d.value; })
            ])
            .range([this.svg.attr('height') - padding, padding]);

        //Define X axis
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5);

        //Define Y axis
        var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(5);

        var formatTime = d3.timeFormat("%b %e");

        // Generate date labels first, so they are in back
        // this.svg.selectAll("text")
        //     .data(json)
        //     .enter()
        //     .append("text")
        //     .text(function (d) {
        //         return formatTime(d.date);
        //     })
        //     .attr("x", function (d) {
        //         return xScale(d.date) + 4;
        //     })
        //     .attr("y", function (d) {
        //         return yScale(d.value) + 4;
        //     })
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "11px")
        //     .attr("fill", "#bbb");

        //Generate circles last, so they appear in front
        this.svg.selectAll("circle")
            .data(json)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d.date);
            })
            .attr("cy", function (d) {
                return yScale(d.value);
            })
            .attr("r", 2);

        //Create X axis
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(xAxis);

        //Create Y axis
        this.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);


    }
}