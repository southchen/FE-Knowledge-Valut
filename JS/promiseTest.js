/**
 * 实现如下调用，lazyMan('xxx').sleep(1000).eat('333').sleepFirst(2000)
 * sleepFirst 最先执行。
 * **/
function lazyMan(val) {
  this.queue = [];
  this.queue.push(
    () =>
      new Promise((res) => {
        console.log('name ' + val);
        res();
      })
  );
  this.sleep = function (time) {
    this.queue.push(
      () =>
        new Promise((res) => {
          setTimeout(() => {
            console.log('sleep ' + time);
            res();
          }, time);
        })
    );
    return this;
  };
  this.eat = function (val) {
    this.queue.push(
      () =>
        new Promise((res) => {
          console.log('eat ' + val);
          res();
        })
    );
    return this;
  };
  this.sleepFirst = function (time) {
    this.queue.unshift(
      //第一个执行
      () =>
        new Promise((res) => {
          setTimeout(() => {
            console.log('sleepfirst ' + time);
            res();
          }, time);
        })
    );
  };
  //顺序执行
  let run = () => {
    let p = Promise.resolve();
    for (const func of this.queue) {
      p = p.then(() => func());
    }
  };
  //宏任务队列，待this.queue都设置好后再运行
  setTimeout(run, 0);
  return this;
}
//lazyMan('xxx').sleep(1000).eat('333').sleepFirst(2000);
/**
 * 任务队列可不断的添加异步任务（异步任务都是Promise），但只能同时处理5个任务，5个一组执行完成后才能执行下一组，任务队列为空时暂停执行，当有新任务加入则自动执行。
 * **/
class RunQune {
  constructor() {
    this.list = []; // 任务队列
    this.target = 5; // 并发数量
    this.flag = false; // 任务执行状态
    this.time = Date.now();
  }
  async sleep(time) {
    return new Promise((res) => setTimeout(res, time));
  }
  // 执行任务
  async run() {
    while (this.list.length > 0) {
      this.flag = true;
      let runList = this.list.splice(0, this.target);
      this.time = Date.now();
      await this.runItem(runList);
      await this.sleep(300); // 模拟执行时间
    }
    this.flag = false;
  }
  async runItem(list) {
    return new Promise((res) => {
      while (list.length > 0) {
        const fn = list.shift();
        fn()
          .then()
          .finally(() => {
            if (list.length === 0) {
              res();
            }
          });
      }
    });
  }
  // 添加任务
  push(task) {
    this.list.push(...task);
    !this.flag && this.run();
  }
}
/**
 * 期望id按顺序打印 0 1 2 3 4 ，且只能修改 start 函数。
 * **/
//   function start(id) {
//     execute(id);
//   }
function sleep() {
  const duration = Math.floor(Math.random() * 500);
  return new Promise((resolve) => setTimeout(resolve, duration));
}
function execute(id) {
  return sleep().then(() => {
    console.log('id', id);
  });
}
//链式调用：
function start(id) {
  this.promise = this.promise
    ? this.promise.then(() => execute(id)) //之后调用。链式then->按调用顺序执行
    : execute(id); //第一次调用
  //console.log(this.promise);
}
//list
function start(id) {
  this.list = this.list ? this.list : [];
  //同步构造list
  this.list.push(() => execute(id));
  this.t; //timer id
  if (this.t) clearTimeout(this.t);
  //在宏任务中加入
  this.t = setTimeout(() => {
    //从list中构造任务队列
    this.list.reduce((re, fn) => re.then(() => fn()), Promise.resolve());
  });
}
start(0);
start(1);
start(2);
start(3);
//queue
function queue(iter) {
  let p = Promise.resolve();
  iter.forEach((fn, i) => {
    p = p.then(() => {
      //把这个新的promise给下一个循环的p
      return new Promise((res) => {
        setTimeout(() => {
          res(fn(i)); //下一次的p会调用then方法
        }, 1000);
      });
    });
  });
}
//reduce
function redQueue(iter) {
  iter.reduce((p, fn, i) => {
    //return 把p给下一个fn
    console.log(p);
    return p.then(() => {
      //return 把新的p给下一个p
      return new Promise((res) => {
        setTimeout(() => {
          res(fn(i)); //res() 给下一个新的p，这样then方法才会被调用
        }, 1000);
      });
    }, Promise.resolve());
  });
}
//queue([console.log, console.log, console.log]);
//redQueue([console.log, console.log, console.log]);
