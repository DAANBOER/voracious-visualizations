class BarChart {
    constructor(data, svg) {
        this._data = data;
        this.svg = svg;

        this.xScale = [];
        this.yScale = [];
    }

    visualize() {
        d3.json(this._data).then(this.test.bind(this));
    }

    sort(ascending = true) {
        this.svg.selectAll('g')
            .sort(function (a, b) {
                if (ascending) {
                    return d3.ascending(a.value, b.value);
                } else {
                    return d3.descending(a.value, b.value);
                }
            })
            .transition()
            .duration(1000)
            .attr("transform", function (d, i) {
                return "translate(0," + this.yScale(i) + ")";
            }.bind(this));
    };

    test(data) {
        var xPadding = 25;
        var yPadding = 0;

        var key = function (d) {
            return d.country.id;
        };

        
        var filterCombined = function (d) {
            return (d.countryiso3code != "");
        }

        var json = data[1].filter(filterCombined);

        h = json.length * 25;

        this.svg.attr('height', h);

        console.log(json);
        console.log(json.length);

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(json, function (d) { return d.value; })])
            .range([1, this.svg.attr('width') - 2 * xPadding]);

        this.yScale = d3.scaleBand()
            .domain(d3.range(json.length))
            .rangeRound([0, h])
            .paddingInner(0.05);

        var groups = this.svg.selectAll('g')
            .data(json, key)
            .enter()
            .append('g')
            .attr("transform", function (d, i) {
                return "translate(0," + this.yScale(i) + ")";
            }.bind(this))
            .on('mouseover', function () {
                d3.select(this)
                    .select('rect.bar')
                    .attr('fill', 'orange');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .select('rect.bar')
                    .transition()
                    .duration(50)
                    .attr('fill', 'teal');
            });

        groups.append('rect')
            .attr('class', 'bar')
            .attr("x", xPadding)
            .attr("y", 0)
            .attr('width', function (d) {
                return this.xScale(d.value);
            }.bind(this))
            .attr('height', this.yScale.bandwidth())
            .attr("fill", "teal");

        groups.append("text")
            .text(function (d) {
                return d.country.id;
            })
            .attr('text-anchor', 'end')
            .attr("x", function (d) {
                return xPadding - 3;
            })
            .attr("y", function (d) {
                return this.yScale.bandwidth() / 2 + 5;
            }.bind(this))
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "black");

        groups.append('rect')
            .attr('class', 'row')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', w)
            .attr('height', this.yScale.bandwidth())
            .attr('fill', 'none')
            .attr('pointer-events', 'all');
    }
}