I have made a Forecast app that uses an API to get outside information to get actual weather information. I have used screen navigation to make 2 screens, the first one is the welcome screen that allows the user to enter the latitude and longitude of the location they would like the weather of. Then they can press the "Weather Here" button that will then navigate to the next screen. 

The second screen displays all the info based on the latitude and longitude entered before. When the screen is loaded a useEffect is called that accesses the API by using fetch with the API link that included the lat and long of the user input and takes the json response and calls a few functions I have made to get all the info I needed from the API for the app. I get the temperature (in F) at the current time that is displayed at the top, then i get the city where the coordinates are and display it under the temp.The under it I have a little window that displays whatever icon that reflects the weather conditions and under that is the current conditions verbalized that are reflected like sunny or rainy. Then I have the high and low temperatures for the day which are found by comparing the temp at each 3 hour increment of the day and finding the highest and lowest out of those values for the specific day. I also have the current wind speed listed under the high and low temps.

Then if you press the 5 Day Forecast button a modal is used and a pop up comes up that displayes the next 5 dates and the average temperature of each of those days. Those temps are found by going through all the current temp data from each 3 hour increment of each day and adding all the temps and dividing by the number of data points.


However, if the input on the first screen is not valid for the API call, then all values are not displayed and an error message is displayed saying that invalid coordinates were entered, even if the user presses the button for the modal, there is no data presented and the app still works if they go back and enter valid values.



