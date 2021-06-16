import { Component, OnInit } from '@angular/core';
import { fromEvent, interval, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    // this.clickEvent();
    // this.setIntervalFunction();
    // this.setTimeOutFunction();
    // this.combineMultipeStreams();

    // this.subscribingInterval();
    // this.combineTwoObservable();
    this.intervalUnsubscription();
  }



  // Streams of Value:
  // These examples generates streams of values.

  // Example 01:
  public clickEvent(): void {
    document.addEventListener('click', event => {
      console.log("click event", event)
    })
  }

  // Example 02:
  setIntervalFunction() {
    let counter = 0;
    setInterval(() => {
      console.log(counter);
      counter++;
    }, 1000)
  }

  // Example 03:
  setTimeOutFunction() {
    setTimeout(() => {
      console.log("finished...")
    }, 3000);
  }

  // What if you need to put the above streams in sequence? we will do something like this.

  // Ans: There are several ways,we can nest them. one of the method is shown below.


  public combineMultipeStreams(): void {
    document.addEventListener('click', event => {
      this.setIntervalFunction();
      this.setTimeOutFunction();
      console.log("click event", event)
    })
  }

  // Problem: As the streams growns, it creates a call-back hell conditions. This is not good.Hence, in javascript,we have RxJs library. 

  /////////////////// RxJs ////////////////////////////////////
  // RxJs(Reactive Extension For Javascript):
  // Using RxJs, we can defines the pattern of streaming of data and also can combines multiple streams without being in a call-back hell condition.

  // RxJs Observable:

  // Example 01: interval() operator

  //  Creating Blueprint of Observable: 
  // How the observable will behave.
  public interval$ = interval(1000);

  // Instantiating Observable: 
  // An observer will only becomes stream after subscription.

  public subscribingInterval(): void {
    this.interval$.subscribe(value => console.log("stream 1 =>" + value));
    this.interval$.subscribe(value => console.log("stream 2 =>" + value));
  }

  // In this case, we have creates two instances of interval$, hence, two streams of data are simultaneouly being emitted.


  // Example 02: Combining

  // timer() operator
  public timer$ = timer(3000, 1000);

  public subscribingTimer(): void {
    this.timer$.subscribe(value => console.log("timer stream 1 => " + value));
  }

  // Browser event operator: fromEvent()
  public click$ = fromEvent(document, 'click');

  public subscribingFromEvent(): void {
    this.click$.subscribe(
      event => console.log("fromEvent click => " + event),
      error => console.log("error", error),
      () => console.log("completed...")
    );
  }

  public combineTwoObservable(): void {
    this.subscribingTimer();
    this.subscribingFromEvent();
  }

  // Subscribe() method can take 3 arguments:
  // (1) value callback : streams of value, event => console.log("fromEvent click => " + event),
  // (2) Error handler : stream error, error => console.log("error", error),
  // (3) complete handler : stream completion event, () => console.log("completed...")

  // Observalbe contract: 
  // According to observable constract, an observable will emit the streams of value or errors out or complete. If an observable is errors out or completes then it will no longer be emitting the value.


  // Unsubscribing an observable:
  // Example 03:

  public intervalTest$ = interval(1000);

  public intervalUnsubscription(): void {
    const subscription = this.intervalTest$.subscribe(value => console.log("steam of 1 => " + value));

    setTimeout(() => {
      subscription.unsubscribe();
    }, 3000);
  }


}
