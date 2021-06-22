import { Component, OnInit } from '@angular/core';
import { concat, interval, of, timer, merge, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

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
    // this.intervalUnsubscription();
    // this.observableConcatanation();
    // this.observableMerging();
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

  // Problem: As the combination of different streams growns, it creates a callback hell conditions. This is not good.Hence, in javascript,we have RxJs library. 

  /////////////////// RxJs ////////////////////////////////////
  // RxJs(Reactive Extension For Javascript):
  // Using RxJs, we can defines the pattern of streaming of data and also can combines multiple streams without being in a callback hell condition.

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
  // (1) value callback : streams of value,example: event => console.log("fromEvent click => " + event),
  // (2) Error handler : stream error, example: error => console.log("error", error),
  // (3) complete handler : stream completion event,example: () => console.log("completed...")

  // Observalbe contract: 
  // According to observable contract, an observable will emit the streams of value or errors out or complete. If an observable is errors out or completes then it will no longer be emitting the value.


  // Unsubscribing an observable:
  // If an observalbe is continueously emitting streams of value, it will also consume a lots of memory space. Hence, to prevent memory leaks, it is very to to stop or break the observalbe stream.Hence, an observalbe need to be unscribed.

  // Example 03:

  public intervalTest$ = interval(1000);

  public intervalUnsubscription(): void {
    const subscription = this.intervalTest$.subscribe(value => console.log("steam of 1 => " + value));

    setTimeout(() => {
      subscription.unsubscribe();
    }, 3000);
  }


  // What is the difference between promise and observable?
  // Ans: A promise get executated immediatedly when it is defined. Where as an observalbe can only be executed after subscription.


  // Obserable concatanation:

  public observableConcatanation() {
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);

    const result$ = concat(source1$, source2$, source3$);

    result$.subscribe(value => console.log("concat observables", value));
  }


  // Merging observable:

  public observableMerging() {
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => val * 10));

    const result$ = merge(interval1$, interval2$);
    result$.subscribe(console.log);
  }


}
