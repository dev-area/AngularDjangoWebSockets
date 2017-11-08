import {Component, OnInit} from '@angular/core';
import {Observable,Subject,Observer}  from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  ngOnInit(){this.setsock()}
  title = 'app';
  URL = 'ws://localhost:8000/stocks';
  socket:WebSocket;
  ///////////////////////////////////////////////////
  setsock() {
     this.socket = new WebSocket('ws://' + window.location.host + '/stocks/');

    this.socket.onopen = () => {
      console.log('WebSockets connection created.');
    };

    this.socket.onmessage = (event) => {
      //  var data = JSON.parse(event.data);
      console.log("data from socket:" + event.data);
      this.title = event.data;
    };

    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.onopen(null);
    }
  }
 start1()
{
  this.socket.send('start');
}
 stop1() {
  this.socket.send('stop');
}



  ///////////////////////////////////////////////////

  start()
  {
    this.messages.next("start");
  }

  stop()
  {
    this.messages.next("stop");
  }
  ngOnInit1(){
    this.messages = <Subject<string>>this.connect(this.URL)
      .map((response: MessageEvent): string => {
            return  response.data
         })
    this.messages.subscribe(msg => {
      console.log("from server:" + msg);
      this.title = msg;
      }

    )
  }
  public messages: Subject<string>;

  private connect(url): Subject<MessageEvent> {
    let ws = new WebSocket(url);

    let observable = Observable.create(
      (obs: Observer<MessageEvent>) => {
        ws.onmessage = obs.next.bind(obs);
        ws.onerror = obs.error.bind(obs);
        ws.onclose = obs.complete.bind(obs);
        return ws.close.bind(ws);
      })
    let observer = {
      next: (data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
          if(data=="stop")
            ws.close(1000,"bye")
        }
      }
    }
    return Subject.create(observer, observable);
  }

}

