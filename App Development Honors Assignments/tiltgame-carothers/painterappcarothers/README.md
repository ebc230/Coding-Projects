# Painter App Carothers


In this app I added features to the pad to make it so I can also draw perfect rectangels and circles with SVG that change based on when I drag on the pad. I also made buttons that utilize rewind and clear to undo and delete all strokes. I also added features where the user and change stroke width and color of line.

For this painter app I figured out how I had to access the clear and rewind functions in pad in app.js to function when I press the touchable opacity buttons I made by using ref object of the pad. For the stroke width, I used a slider that when the sliding is complete it takes the value and makes it a little bigger and changes the variable strokeWidth that is used in pad to dictate the width. When the stroke button is pressed it opens a modal that has the slider and when the user slides and picks a value the modal automatically closes, there is also a button to close it if the value isn't changed. It is somewhat similar for the color button, when it is pressed a different modal is opened that has a list of 12 colors to pick from. The colors are buttons that are made with a flatlistand when they are pressed it changes the variable color that is used is pad to render the color of the stroke (more on that later). When it a color is pressed a black border also appears only on the color selected to show that it is selected and there is also a hide button to hide the modal. When the rectangle or circle button is pressed it becomes highlighted with a light yellow background, the default mode of the pen is to do free hand strokes and when either shape button is pressed it changes to that type and then back to pen when it is pressed again and it is no longer highlighted anymore. The shapes are autmomatically filled when drawn. 

Now for the pad logistics. First off, I made a list called total shapes where all past strokes would be stored so when the color of the stroke is changed the previous strokes color is stored in total shapes as the color they were when the pen was lifted, so all new strokes are used and saved as the new color. This also allows for rewind and clear to work if there are multiple types of shapes used on the pad, it recognizes all in that list and can get ride of the most recent full stroke/shape for rewind and for clear it just gets rid of everything in that one list. Now for the shapes, I used SVG rect and circle to create the shapes. For both of them they are set to fill so they are fillled in and for the rectangle when you press it starts as the top left (or bottom right if you go backwards) corner of the rectangle and draws as you move it and for the circle it starts in the very middle of the circle and goes out as you drag. I added a prop called mode that based on what the value is (pen, rect, or circ) it will have the pen do the corresponding drawing. For respondergrant for each, (when it is first pressed down) it is setting the important coordinates needed to where the shape begins, for pen it just gets the point and adds to it its own list since its a bunch of points connected basically, for rect it sets the 2 points needed beginning and end, and for circ you need point of middle/starting and radius. For responder move (when it is being dragged), it updates the points for the pen to connect them, for rect it keeps the starting point and upadtes the 2nd point to update and change as it moves, and for circ it upadtes only the raidus based on the current locaiton of the cursor. Then on responder release it doesn't change any more points for any of them it just adds the properties of color and stroke size and it is added to total shapes. Now all of this is then rendered in render, this is where SVG is used to actually visually create the strokes on the pad, SVG takes the the points recorded for like rectangle 2 separate points and for circle 1 point and the radius to create it on the screen based on the data saved for what was pressed and dragged on. This render is called and used when the dragging is happening as each shape is being updated in responder move as the points are being updates that are used for render for the shapes. Whatever is saved in total shapes is what is saved when the pen is released, when it is being dragged it is being currently updated and then what is finished is saved and stays rendered afterwards. Those are the changes I made to pad for this app to work to be able to recreate the android robot guy.


(also sorry this is last minute, have fun with baby soon!)














