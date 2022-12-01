import websockets
import asyncio

# The main function that will handle connection and communication 
# with the server
async def listen():
    #url = "ws://127.0.0.1:7000"
    url = "ws://3.125.155.58:7000"
    # Connect to the server
    async with websockets.connect(url) as ws:
        # Send a greeting message
        text = input()
        await ws.send(text)
        # Stay alive forever, listening to incoming msgs
        while True:
            msg = await ws.recv()
            print(msg)
            text = input()
            await ws.send(text)


# Start the connection
asyncio.get_event_loop().run_until_complete(listen())
