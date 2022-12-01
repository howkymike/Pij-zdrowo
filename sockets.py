#!/usr/bin/python
WSHOST = "ws://3.125.155.58:7000"
import sys
sys.path.insert(0, '/usr/lib/python2.7/websocket/')  

import websocket
ws = websocket.WebSocket()
ws.connect(WSHOST)
                                               
sys.path.insert(0, '/usr/lib/python2.7/bridge/')  
from bridgeclient import BridgeClient as bridgeclient                                                
value = bridgeclient()                              

from time import sleep
#sleep(5)

while(True):
    tds=0;ph=0
    try:
        tds = value.get('TDS').split('.')[0]
        ph = value.get('pH').split('.')[0]
    except:
        continue
    try:
        ws.send("""{"TDS":"""+tds+""", "PH":"""+ph+""", "source":"ArduinoPrototypeSensor"}""")
        ws.recv()
    except Exception as e:
        print e
        continue
    print "OK"
    sleep(30)
    
