$( "#slider" ).slider({
    animate: "fast",
    max: 2019,
    min: 2015,
    // This value for our 'change' key will be the function
    // that tells d3 to make a new request to our flask API
    // For this example, it just updates html to show how
    // it works.
    change: sliderChange
});

// Initialize our variables
var year = 2015;
var city = 'Dallas';
var parameter = 'OZONE';

// Our function to run when the slider changes
function sliderChange() {

    // Get our new value (the year) from the slider
    var year = $( "#slider" ).slider( "value" );
    d3.select('#sliderLabel').html(`Year: ${year}`)

    grabData(city,year,parameter);
    // Run our updateChart function (below) when the slider changes
    // and points to new data
    //updateChart(dataDict[selection])
};

d3.selectAll("input").on("change", function(){
    //console.log(this.value)
    parameter = this.value;
    grabData(city,year,parameter);

});

