# Dependencies
import pandas as pd
import numpy as np
import sqlalchemy
from flask_cors import CORS
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
import datetime

#################################################
# Database / Connection / Dataframe Setup
#################################################

#postgres engine 
# **** Note -- port number is currently 5433, but most users likely need 5432 ****
connection_string = "postgres:postgres@localhost:5432/aq_db"
engine = create_engine(f'postgresql://{connection_string}')

# Query to postgres database, capture our data in a dataframe 
aq_df = pd.read_sql('city_aq',con=engine)

# creates a second date column which holds the dates from 'DataObserved' in a datetime format
aq_df['Datetime'] = pd.to_datetime(aq_df['DateObserved'], format="%m/%d/%y")

# creates a third date column which captures only the YYYY value of the date from the new 'Datetime' column 
aq_df['year'] = aq_df['Datetime'].dt.strftime("%Y")

# creates a fourth date column which captures only the month name value of the date from the new 'Datetime' column (i.e. 'January', 'February', etc)
aq_df['month'] = aq_df['Datetime'].dt.strftime("%B")




#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

#################################################
# Flask Routes
#################################################

# D3.json will navigate to a specified url based on a given user interaction/selection  
# Based on the route navigated to, we will feed in different data

@app.route("/<cityname>/<year>/<parametername>")
def home(cityname, year, parametername):

    # Capture user Year selection in a variable
    dateSelected = year
    
    # Capture user City selection in a variable
    citySelected = cityname

    # Capture user parameter selection (Ozone or PM2.5) in a variable
    parameter = parametername

    # Filter by year
    all_cities = aq_df.loc[(aq_df["year"] == dateSelected),:]

    avgCityAQI = all_cities.groupby('csaPrimaryCity')['AQI'].mean().to_dict()

    # filters data by city name
    selected_data = all_cities.loc[all_cities["csaPrimaryCity"] == citySelected, :]  

    # Isolates Ozone or PM2.5 data points for the selected year and city 
    parameter_data = selected_data.loc[selected_data["ParameterName"] == parameter, :]

    # Groups the data by month and AQI Quality Category (good, moderate, etc.), then gets a count of each quality category for each month
    grouped_parameter_data = parameter_data.groupby(['month', 'AQICategory'])
    count_parameter = grouped_parameter_data['AQICategory'].count() 
    
    # convert the count_parameter series into a dataframe that we can manipulate and structure as needed 
    paramFrame = count_parameter.to_frame()
    paramFrame = paramFrame.rename(columns={"AQICategory":"CategoryVal"}).reset_index()

    # Iterate through our dataframe to build out a new array of dictionaries for each month in the selected year, providing key-value pairs for each category and its respective count for the month
    monthlist = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August','September','October','November','December']
    month_Dict_Arr = []
    for month in monthlist: 
        monthDict = {}
        monthDict['month'] = month
        dfnew = paramFrame[paramFrame['month'] == month]
        categorySum = dfnew['CategoryVal'].sum()
        for index, row in dfnew.iterrows():
            monthDict[row['AQICategory']] = (row['CategoryVal']/categorySum)
        month_Dict_Arr.append(monthDict)

        # we will pass the month_Dict_Arr that we just built out into our final dictionary that gets returned 


    # Line chart: average for the city for that month of the year --> actual value is 'AQI'
    grouped_parameter_data_2 =  parameter_data.groupby(['month'])
    average_parameter_values = grouped_parameter_data_2['AQI'].mean()
    monthly_averages_dictionary = average_parameter_values.to_dict()

        # we will pass our monthly_averages_dictionary into our final dictionary that gets returned 

    final_dictionary = {
        'stacked-bar-data': month_Dict_Arr,
        'line-plot-data': monthly_averages_dictionary,
        'map-aqi': avgCityAQI
    }

    return jsonify(final_dictionary)

    

if __name__ == '__main__':
    app.run(debug=True)
