import json
from channels import Group
from channels.auth import channel_session_user, channel_session_user_from_http
import threading
import random

def sendmsg(num):
    Group('stocks').send({'text':num})

t = 0

def periodic():
    global t;
    n = random.randint(100,200);
    sendmsg(str(n))
    t = threading.Timer(1, periodic)
    t.start()

def ws_message(message):
    global t
    # ASGI WebSocket packet-received and send-packet message types
    # both have a "text" key for their textual data.
    print(message.content['text'])
    if ( message.content['text'] == "start"):
        periodic()
    else:
        t.cancel()
   # message.reply_channel.send({'text':'200'})

def ws_connect(message):
    Group('stocks').add(message.reply_channel)
    Group('stocks').send({'text':'connected'})



def ws_disconnect(message):
    Group('stocks').send({'text':'disconnected'})
    Group('stocks').discard(message.reply_channel)
