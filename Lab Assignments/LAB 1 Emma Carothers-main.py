# Imports go at the top
from microbit import *
import time

min =  0
max = 0



while True:

    lightL = display.read_light_level()

    if min == 0 and max == 0:
        min = lightL
        max = lightL
    else:
        if lightL < min:
            min = lightL
        if lightL > max:
            max = lightL
        
    
    display.scroll("L: " + str(lightL))
    
    if lightL > 180:
        display.show(Image.HAPPY)
    elif lightL > 100:
        display.show(Image.MEH)
    else:
        display.show(Image.SAD)

    if button_b.was_pressed():
        display.scroll("min: " + str(min) + "max: " + str(max))
    time.sleep(2)


    