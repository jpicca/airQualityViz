var svgWidth = 1000;
var svgHeight = 500;

// create an SVG element
var svg = d3.select("#lineChart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var data = {'April': 66.14285714285714,
    'August': 63.285714285714285,
    'December': 33.142857142857146,
    'February': 38.857142857142854,
    'January': 34.57142857142857,
    'July': 57.714285714285715,
    'June': 60.142857142857146,
    'March': 44.714285714285715,
    'May': 52.0,
    'November': 43.42857142857143,
    'October': 55.0,
    'September': 70.71428571428571}

var monthList = ['January','February','March','April','May','June','July','August','September',
                    'October','November','December']

// var entries = Object.entries(data);
// console.log(entries);

// var chart = anychart.line();

// // set series type
// chart.spline(entries);
    
//       // set chart container
// chart.container('#my_dataviz');
d3.json(data, function(response) {

    //var keys = Object.keys(data)
        var formatData = []
        monthList.forEach(entry => {
            let emptyDict = {}
            emptyDict['month'] = entry
            emptyDict['value'] = data[entry]
            console.log(emptyDict)
            formatData.push(emptyDict)
    })
    console.log(formatData)

    var parseTime = d3.timeParse('%B');

    formatData.forEach(function(data) {
        data.month = parseTime(data.month)
        data.value = +data.value;
    });

    console.log(formatData)

    // Create a scale for your independent (x) coordinates
    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(formatData, d => d.month))
        .range([0, svgWidth]);

    /*var xScale = d3.scale.ordinal()
        .domain(d3.extent(emptyDict, d => d.month))
        .range([0, svgWidth]);*/

    // Create a scale for your dependent (y) coordinates
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(formatData, d => d.value)])
        .range([svgHeight, 0]);

    // create a line generator function and store as a variable
    // use the scale functions for x and y data
    var createLine = d3.line()
        .x(data => xTimeScale(data.month))
        .y(data => yScale(data.value));

    // Append a path element to the svg, make sure to set the stroke, stroke-width, and fill attributes.
    svg.data([formatData])
        .append('path')
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .attr("fill", "none")
        .attr("d", d => createLine(d));

});
