import { Component, OnInit } from '@angular/core';
import { concat, interval, of, timer, merge, fromEvent, Subject, BehaviorSubject, pipe } from 'rxjs';
import { filter, map } from 'rxjs/operators';

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
    // this.subjectExample();
    this.behaviorSubjectExample();
  }


  ////////// Read About RxJs: https://rxjs.dev/guide/overview     ////////////////////

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
      console.log("counter", counter);
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

  // Problem: As the combination of different streams growns, it creates a callback hell conditions. This is not good. Hence, in javascript, we have RxJs library. 

  //////////////////////////// RxJs ////////////////////////////////////

  // RxJs(Reactive Extension For Javascript):

  // Using RxJs, we can defines the pattern of streaming of data and also can combines multiple streams without being in a callback hell condition.

  ///////////////////////// Observable: //////////////////////
  // Observables are lazy Push collections of multiple values.

  //////////////////////// Observer: /////////////////////////
  // An Observer is a consumer of values delivered by an Observable. Observers are simply a set of callbacks, one for each type of notification delivered by the Observable: next, error, and complete. 
  // To use the Observer, provide it to the subscribe of an Observable
  // observable.subscribe(observer);


  /////////////////////// RxJS Operators ////////////////////
  // Operators:

  // Operators are the essential pieces that allow complex asynchronous code to be easily composed in a declarative manner.
  // Operators are functions. There are two kinds of operators:
  // (1) Pipeable Operators
  // (2) Creation Operators

  // Pipeable Operators: 

  // A Pipeable Operator is a function that takes an Observable as its input and returns another Observable. It is a pure operation: the previous Observable stays unmodified.
  // Pipeable Operators are the kind that can be piped to Observables using the syntax observableInstance.pipe(operator()). These include, filter(...), and mergeMap(...). When called, they do not change the existing Observable instance. Instead, they return a new Observable, whose subscription logic is based on the first Observable.
  // Subscribing to the output Observable will also subscribe to the input Observable.
  // Observables have a method called .pipe() 
  // example of piping: obs.pipe(op1(), op2(), op3(), op4());

  // Creation Operators:

  // Creation Operators are the other kind of operator, which can be called as standalone functions to create a new Observable. For example: of(1, 2, 3) creates an observable that will emit 1, 2, and 3, one right after another.
  //  creation operators are functions that can be used to create an Observable with some common predefined behavior or by joining other Observables.
  // example: interval()

  //////////////////// Higher-order Observables ///////////////////////////////

  // Observables most commonly emit ordinary values like strings and numbers, but surprisingly often, it is necessary to handle Observables of Observables, so-called higher-order Observables. 
  // For example, 
  // imagine you had an Observable emitting strings that were the URLs of files you wanted to see. The code might look like this:
  // public  fileObservable = urlObservable.pipe(map((url) => http.get(url)));
  // http.get() returns an Observable (of string or string arrays probably) for each individual URL. Now you have an Observable of Observables, a higher-order Observable.

  // how do you work with a higher-order Observable? 
  // Typically, by flattening: by (somehow) converting a higher-order Observable into an ordinary Observable. For example:

  // const fileObservable = urlObservable.pipe(
  // map((url) => http.get(url)),
  // concatAll()
  // );
  // The concatAll() operator subscribes to each "inner" Observable that comes out of the "outer" Observable, and copies all the emitted values until that Observable completes, and goes on to the next one. All of the values are in that way concatenated. 


  //////////// Marble Diagrams ////////////////////////
  // Marble Diagrams are visual representations of how operators work, and include the input Observable(s), the operator and its parameters, and the output Observable.
  // In a marble diagram, time flows to the right, and the diagram describes how values ("marbles") are emitted on the Observable execution.







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

  //////////////////////////// Subscription ///////////////////
  // Subscription
  // A Subscription is an object that represents a disposable resource, usually the execution of an Observable. 
  // A Subscription has one important method, unsubscribe, that takes no argument and just disposes the resource held by the subscription. In previous versions of RxJS, Subscription was called "Disposable".
  // A Subscription essentially just has an unsubscribe() function to release resources or cancel Observable executions.

  // Unsubscribing an observable:
  // If an observalbe is continueously emitting streams of value, it will also consume a lots of memory space. Hence, to prevent memory leaks, it is very to to stop or break the observalbe stream. Hence, an observalbe need to be unscribed.

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

  ////////////// Multicasted Observables //////////////////////////////////////

  // A "multicasted Observable" passes notifications through a Subject which may have many subscribers, whereas a plain "unicast Observable" only sends notifications to a single Observer.
  // A multicasted Observable uses a Subject under the hood to make multiple Observers see the same Observable execution.

  ////////////////////////// Subjects ////////////////////////////////////////

  // Subjects: 

  // An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers. While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.
  // A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

  // Every Subject is an Observable as well as an observer.

  // Every Subject is an Observable.
  // Given a Subject, you can subscribe to it, providing an Observer, which will start receiving values normally. From the perspective of the Observer, it cannot tell whether the Observable execution is coming from a plain unicast Observable or a Subject.

  // Every Subject is an Observer.
  //  It is an object with the methods next(v), error(e), and complete(). To feed a new value to the Subject, just call next(theValue), and it will be multicasted to the Observers registered to listen to the Subject.

  // example:
  public subject$ = new Subject<number>();

  public subjectExample(): void {

    this.subject$.subscribe({
      next: (v) => console.log(`observerA: ${v}`)
    });
    this.subject$.subscribe({
      next: (v) => console.log(`observerB: ${v}`)
    });

    this.subject$.next(1);
    this.subject$.next(2);
  }

  // Specialization of Subject type:
  // (1) BehaviorSubject
  // (2) ReplaySubject
  // (3) AysncSubject


  // BehaviourSubject:
  // One of the variants of Subjects is the BehaviorSubject, which has a notion of "the current value". It stores the latest value emitted to its consumers, and whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.
  // BehaviorSubjects are useful for representing "values over time". For instance, an event stream of birthdays is a Subject (because birthday comes every year), but the stream of a person's age would be a BehaviorSubject (because age comes only once and latest value of the age has meaning).

  // Example:

  public behaviourSubject$ = new BehaviorSubject(0); // 0 is the initial value


  public behaviorSubjectExample(): void {

    this.behaviourSubject$.subscribe({
      next: (v) => console.log(`observerA: ${v}`)
    });

    this.behaviourSubject$.next(1);
    this.behaviourSubject$.next(2);

    this.behaviourSubject$.subscribe({
      next: (v) => console.log(`observerB: ${v}`)
    });

    this.behaviourSubject$.next(3);
  }


  ///////////////////////// List of operators catogories //////////////////////
  // (1) Creation Operators
  // (2)Join creation Operators
  // (3) Transformation Operators
  // (4) Filtering Operators
  // (5) Join Operators
  // (6) Multicasting Operators
  // (7) Utility Operators
  // (8) Conditional and Boolean Operators
  // (9) Mathematical and aggregate Operators



  //////////// Using multiple RxJs Operators one after another //////////////////

  // Use observable.pipe() method on observable in case you wish to use multiple operators in sequence or chaining of operators.

  // Example: Here, we are using filter() and map() operators. Hence, we need to use pipe() on the observable.
  public discardOddDoubleEven() {
    return pipe(
      filter((v: any) => !(v % 2)),
      map((v) => v + v)
    );
  }

  //////////////// Commonly used Operators() //////////////////////////////

  // (1) tap(): 
  // Used to perform side-effects for notifications from the source observable. Example: In case you wish to console log something or show some error. 

  // (2) map(): 
  // Applies a given project function to each value emitted by the source Observable, and emits the resulting values as an Observable

  // (3) of(): 
  // Converts the arguments to an observable sequence.

  // (4) from(): 
  // Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object.

  // (5) timer():

  // (6) interval():

  // (7) concat():

  // (8) concatMap(): it helps in sequential chaining observable and map its value to another observable. Internally, first it subscribes and unsubscribe the result of one observable and pass it to another.

  // (8) merge():

  // (8) meregeMap(): if you in parall chaining or contanation of two observable. in this case, we want to use sequenctial concatanation, hence, we are using concatMap().

  // (15) switchMap():

  // (9) shareReplay():

  // (10) retryWhen():

  // (11) fromPromise(): In order to convert this promise to an observerable fromPromise () operator is used.

  // (12) exhaustMap():  it ignors the coming observable, if an observable is already emitting.Hence,in this way here, we can ignor the multiple api calls in button clicks.

  // (13) debounceTime():

  // (14) distinctUntilChanged():



}
