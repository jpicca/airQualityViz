
// Create our slider with jQuery (that's what the dollar sign is)

$( "#slider" ).slider({
    animate: "fast",
    max: 2017,
    min: 2015,
    // This value for our 'change' key will be the function
    // that tells d3 to make a new request to our flask API
    // For this example, it just updates html to show how
    // it works.
    change: sliderChange
});

// Our function to run when the slider changes
function sliderChange() {

    // Get our new value (the year) from the slider
    var selection = $( "#slider" ).slider( "value" );
    d3.select('#slider_val').html(selection)

    // Check the console if you want to see what's being logged
    console.log(dataDict[selection])

    // Run our updateChart function (below) when the slider changes
    // and points to new data
    updateChart(dataDict[selection])
};

// Formatting stuff
var margin = ({top: 10, right: 10, bottom: 20, left: 40})
var height = 400
var width = 700

// Here's our dummy data (data1,data2,data3)
// Note that in reality, our javascript will receive a json from flask
// and that will always be our current data. However, for now, I created
// three datasets to show the transition functionality with our slider
//
// Also note the style that our datasets are in -- this is necessary for
// d3.stack() to work properly (which allows us to created the stacked bars)

var data1 = [
    {
        'month': 'January',
        'Good': 0.4,
        'Moderate': 0.3,
        'Bad': 0.3
    },
    {   
        'month': 'February', 
        'Good': 0.5,
        'Moderate': 0.4,
        'Bad': 0.1
    },
    {   
        'month':'March', 
        'Good': 0.2,
        'Moderate': 0.6,
        'Bad': 0.2
    }
]

var data2 = [
    {
        'month': 'January',
        'Good': 0.5,
        'Moderate': 0.2,
        'Bad': 0.3
    },
    {   
        'month': 'February', 
        'Good': 0.8,
        'Moderate': 0.1,
        'Bad': 0.1
    },
    {   
        'month':'March', 
        'Good': 0.1,
        'Moderate': 0.3,
        'Bad': 0.6
    }
]

var data3 = [
    {
        'month': 'January',
        'Good': 0.9,
        'Moderate': 0.1,
        'Bad': 0.0
    },
    {   
        'month': 'February', 
        'Good': 0.5,
        'Moderate': 0.3,
        'Bad': 0.2
    },
    {   
        'month':'March', 
        'Good': 0.4,
        'Moderate': 0.3,
        'Bad': 0.3
    }
]

// Our final code will not need a dictionary like this because in reality
// our slider change will kick off d3 to ask flask for a new json.
// However, since we don't have that functionality here, I created a 
// dictionary to map the slider years to our dummy datasets

var dataDict = {
    2015: data1,
    2016: data2,
    2017: data3
}

// This code creates a variable that is formatted in a way to make
// the bar charts work quite nicely 
// Note that we'll have more categories than Good, Moderate, and Bad
// so we'll need to update these manually when we're ready

var series = d3.stack().keys(['Good','Moderate','Bad'])(data1)

console.log(series)

// Cookie cutter svg/g creation
var svg = d3.select("body")
    .append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)

var g = svg.append('g')
        .attr("transform", "translate("+margin.left+","+margin.top+")");

// This grabs all of the months from one of the datasets to make our
// xScale. Note that we won't need to change this because our bar chart
// will always have the same months in the x axis

var xScale = d3.scaleBand()
        .domain(data1.map(function(d){return d.month;}))
        .range([0, width])
        .padding(0.1);

// This is an overly fancy (grabbed from the example) way of creating
// our y scale. In reality, I think we could just do .domain([0,1])
// because we plan to show the categories as a proportion of the total
// for that month. In other words, the category values will always add up
// to 1. But I left it with the fancy method just in case. This dynamically
// scales to the total for each month.

var yScale = d3.scaleLinear()
        .domain([0,d3.max(series, d => d3.max(d, d=> d[1]))])
        .range([height,0]);

// Set up our color scheme -- we can mess with this later.

const color = d3.scaleOrdinal(d3.schemeCategory10);

// This function is called to create our first chart

function createChart() {

    // Create our rectangle groups by binding them with our
    // series variable data
    var rects = g.selectAll("g").data(series).enter()
        .append("g")
        .attr("fill", d => color(d.key));

    // Create our individual rectangles/bars in each group
    // by joining them with our data inside of series
    // Note that join is new way to do enter/update/exit in d3 v5
    // If the code below doesn't make sense, that's OK. It took
    // me a while to figure out too, and it's still kinda fuzzy.

    rects.selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d, i) => xScale(d.data.month))
        .attr("y", d=> yScale(d[1]))
        .attr("height", d=> yScale(d[0]) - yScale(d[1]))
        .attr("width", xScale.bandwidth())
}

// Create an update chart function to be called when the slider changes
function updateChart(data) {

    // Make a new series variable using whatever our new data may be
    let new_series = d3.stack().keys(['Good','Moderate','Bad'])(data)

    // Grab our old rectange groups, but bind them with our new series
    var rects = g.selectAll("g").data(new_series)
 
    // Select all our old rectangles and bind them with the data
    // inside our series variable.
    //
    // You'll notice I've commented out joining rects (we already
    // have our rects now since this is an update), or changing 'x' since
    // our months won't change position, or changing 'width' since
    // our bars will remain the same width.

    rects.selectAll("rect")
        .data(d => d)
        //.join("rect")
        //.attr("x", (d, i) => xScale(d.data.month))
        .transition()
        .duration(500)
        .attr("y", d=> yScale(d[1]))
        .attr("height", d=> yScale(d[0]) - yScale(d[1]))
        //.attr("width", xScale.bandwidth())

}

// Call createChart() to make our first chart
createChart();

// Add an x and y axis. These won't change so we don't need them
// in a function
const xAxis = g.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(0,"+height+")")
    .call(d3.axisBottom(xScale));

const yAxis = g.append("g")
    .attr("id", "yAxis")
    .call(d3.axisLeft(yScale));

//sliderChange();