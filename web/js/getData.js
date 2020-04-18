// initialize global variables that will capture our data 
var lineData;
var barData;
var mapData;
var catList = ['Good','Moderate','Unhealthy for Sensitive Groups','Unhealthy','Very Unhealthy',
                'Hazardous']

function grabData(city,year,parameter) {
    d3.json(`http://127.0.0.1:5000/${city}/${year}/${parameter}`, function(data) {
        
        //console.log(Object.keys(data['stacked-bar-data'][0]));

        lineData = data['line-plot-data'];
        barData = data['stacked-bar-data'];
        mapData = data['map-aqi'];

        barData.forEach(entry => {
        
            catList.forEach(cat => {
                if (!Object.keys(entry).includes(cat)) {
                    entry[cat] = 0;
                }
            });

        });

        // run functions to update bars and map,      note: updateBar function updates bar and line graphs
        updateBar(barData,lineData);
        updateMap(mapData);

    });
};

// Initialize our charts the first time
grabData(city,year,parameter);