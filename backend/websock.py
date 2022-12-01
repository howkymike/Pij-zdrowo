import asyncio
import websockets
import json
from json import JSONDecodeError
import time
import uuid

from pymongo import MongoClient


client_mongo = MongoClient("127.0.0.1", 27017)
db_data = client_mongo["data"]

PORT = 7000

async def echo(websocket, path):
    try:
        async for message in websocket:
            try:
                message_json = json.loads(message)
                if message_json["TDS"] and message_json["PH"] and message_json["source"]:
                    print(message_json)
                    new_obj = {
                        "_id": str(uuid.uuid4()),
                        "TDS": message_json["TDS"],
                        "PH": message_json["PH"],
                        "source": message_json["source"],
                        "date": round(time.time())
                    }
                    db_data.measurement.insert_one(new_obj)
                    await websocket.send("success")
                else:
                    await websocket.send("error")
            except (KeyError, JSONDecodeError):
                await websocket.send("error")
            

    except websockets.exceptions.ConnectionClosed as e:
        print("A client just disconnected")

start_server = websockets.serve(echo, "0.0.0.0", PORT)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

