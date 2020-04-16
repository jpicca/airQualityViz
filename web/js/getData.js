var lineData;
var barData;
var catList = ['Good','Moderate','Unhealthy for Sensitive Groups','Unhealthy','Very Unhealthy',
                'Hazardous']

function grabData(city,year,parameter) {
    d3.json(`http://127.0.0.1:5000/${city}/${year}/${parameter}`, function(data) {
        
        //console.log(Object.keys(data['stacked-bar-data'][0]));

        lineData = data['line-plot-data'];
        barData = data['stacked-bar-data'];

        barData.forEach(entry => {
        
            catList.forEach(cat => {
                if (!Object.keys(entry).includes(cat)) {
                    entry[cat] = 0;
                }
            });

        });

        updateBar(barData);

    });
};

// Initialize our charts
grabData(city,year,parameter);