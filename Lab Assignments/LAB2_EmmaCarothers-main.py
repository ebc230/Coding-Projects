# Imports go at the top
from microbit import *
import random


# Code in a 'while True:' loop repeats forever

history = []
while True:
    #display.clear()

    w = random.uniform(0.5,2.0)
    startT = running_time()
    endT = 0

    
    sleep(w*1000)
    display.show(Image.HEART)
    
    while True:
        
        if button_a.is_pressed():
            display.clear()
            endT = running_time()
            display.scroll(endT-startT)
            if len(history) == 5:
                history.pop(0)
            history.append(endT - startT)
            
    
        if pin_logo.is_touched():
            if not len(history) == 0:
                m = 0
                for i in history:
                    if i < m or m == 0:
                        m = i
                display.scroll(m)
            break
        
        
