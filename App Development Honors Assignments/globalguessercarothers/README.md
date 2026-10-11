# GeoGuesser (global guesser) App: Emma Carothers

I have made a Geo Guesser app where the user is given an image of a place somewhere in the world and the user has to pick a place on a map where they believe the image is, points are based on how close the guess is to the real location.

My interface is set up so the image being guessed and the map are visible fully at the same time, with current score and highscore at the top and at the bottom guess and next buttons used to lock in guess and go to next image. The color scheme is pastels and the map has a border, its color matches the font color of dark grey.

For my map I have used map view and marker and polyline are utilized. The user can pinch and zoom on the map and move around as much as they would like, whenever they press the map as long as they have not already locked in a guess, a marker will be placed that represents their guess (`handleMapPress()`). This marker will move around as many times as the user clicks on the map until the guess button is pressed, and that coordinate is saved as the current guess coordinate, that button calls a function (`guessB()`) that now makes the guess button disbaled and uses getDistance from geolib to calculate the distance from the guess coordinate and the real location coordinates of the image as the real location marker is now placed. A function is then called that calculates the score based on the distance in miles (`calcScore()`) (I convert it from meters to miles) and adds it to the current score. Then the next button can be pressed, this button will then change the image being guessed and allow the user to make a new guess and move the guess marker around while the real location marker goes away (`nextB()`).

When the guess button is enabled, the next is disable and when next is enabled, guess is disabled to ensure the user can't skip any image before guessing or adding onto their score more than once after already guessing and guessing again on the same image.

When the guess is confirmed another marker pops up that reflects the real location (both markers have labels if pressed on saying either 'your guess' or 'real location') and a line (polyline) that connects the two markers and is not active before a guess is made. It will also zoom to fit both markers in the frame, but then since locations are all across the world I made it so it will then zoom (animate to region) to the real location marker, how much it zooms is based on how far the guess was, farther it won't zoom in as much if it were really close but still zoom to the marker. (this zooming code is in the function `guessB()`)

For the score, I used Async Storage so whenever the game is over it will take the current score and see if it is bigger than what is stored, if so it will replace it. When there is no score loaded it defaults to 0. The max score is 100,000 points (`saveScore()`function updates the score and `loadScore()` is when the game is first loaded to get what should be displayed)

When the game gets to the last image of the round, the next button text changes to 'restart' and changes the font color from grey to red to make it noticable, when it is pressed the game starts again from the beginning (`restart()`), the current score is set to 0, it checks if highscore needs to be updates, and everything else is reset and the user can keep playing as long as they want.

My images are in a list (`imgs[]`), each item has the image to show and the coordinates of the location. They are all images of theaters from around the world.













