// Jquery tool to initialize slider on dashboard
$( "#slider" ).slider({
    animate: "fast",
    max: 2020,
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
    year = $( "#slider" ).slider( "value" );
    d3.select('#sliderLabel').html(`Year: ${year} (Change Year with Slider!)`)

    console.log(`${city}, ${year}, ${parameter}`)

    grabData(city,year,parameter);
};

// Our function to run when user selects a parameter (ozone or PM2.5)
d3.selectAll("input").on("change", function(){
    //console.log(this.value)
    parameter = this.value;
    grabData(city,year,parameter);
});

// Our function to run when user clicks on a new city on the map
function mapClick(new_city) {
    console.log(`${city}, ${year}, ${parameter}`)
    grabData(new_city,year,parameter);
}

