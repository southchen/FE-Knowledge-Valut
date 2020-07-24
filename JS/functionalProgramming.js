 const arr = [1, 2, 3, 4];
      function processArr() {
        function multiple(val) {
          i = 10;
          return val * i;
        }

        // for (var i = 0; i < arr.length; i++) {
        //   arr[i] = multiple(arr[i]); //run one time
        // }
        arr.forEach((num, i) => (arr[i] = multiple(arr[i])));
        //arr.forEach((num, i) => (num = multiple(num)));

        return arr;
      }
      processArr();
      /**IIFE***/
      var myModule = (function myModule(obj) {
        let _private = 42;
        // console.log(_private);
        obj.say = function () {
          console.log(_private);
        };
        return obj;
      })(myModule || {});
      myModule.say();
      /*****map****/
      //map(arr,f)
      function _map(arr, fn) {
        let len = arr.length;
        let res = Array(len);
        for (let i = 0; i < len; i++) {
          res[i] = fn(arr[i], i, arr);
        }
        return res;
      }
      /***reduce***/
      //reduce(arr,fn,[acc])
      function _reduce(arr, fn, acc) {
        let res = acc || arr[0];
        let len = arr.length;
        for (let i = 0; i < len; i++) {
          res = fn(res, arr[i], i, arr);
        }
        return res;
      }
      /***data**/
      const Person = function (name, country) {
        this.name = name;
        this.country = country;
      };
      let j = new Person('jack', 'US');
      let t = new Person('tom', 'UK');
      let r = new Person('rose', 'UK');
      let w = new Person('will', 'AU');
      /****map-reduce****/
      const getCountry = (p) => p.country;
      const createStat = (stat, country) => {
        if (stat[country]) {
          stat[country]++;
        } else {
          stat[country] = 1;
        }
        return stat;
      };
      const persons = [j, t, r, w];
      let res = _reduce(_map(persons, getCountry), createStat, {});
      /*****/
      Array.prototype._map = function (fn) {
        return _map(this, fn);
      };
      Array.prototype._reduce = function (fn, acc) {
        return _reduce(this, fn, acc);
      };
      let stats = persons._map(getCountry)._reduce(createStat, {});
      /*******/
      function _filter(arr, predicate) {
        let len = arr.length;

        let res = [];
        for (let i = 0; i < len; i++) {
          if (predicate(arr[i])) res.push(arr[i]);
        }

        return res;
      }
      Array.prototype._filter = function (predi) {
        return _filter(this, predi);
      };
      const exclude = (country) => {
        if (country != 'US') {
          return true;
        }
      };
      let filted = persons
        ._map(getCountry)
        ._filter(exclude)
        ._reduce(createStat, {});
      /******/
      let names = ['aaa bbb', 'abc_abc', 'Abc cb'];
      names = names
        .map((name) => name.replace(/_/, ' ').split(' '))
        .map((name) => {
          let [fN, lN] = name;
          return [
            fN[0].toUpperCase() + fN.substring(1),
            lN[0].toUpperCase() + fN.substring(1),
          ].join(' ');
        })
        .sort();
      console.log(names);
      /*****/
      const Tuple = function (/* types */) {
        const typeInfo = Array.prototype.slice.call(arguments, 0);
        const _T = function (/* values */) {
          const values = Array.prototype.slice.call(arguments, 0);
          if (values.some((val) => val === null || val === undefined)) {
            throw new ReferenceError('Tuples may not have any null values');
          }
          if (values.length !== typeInfo.length) {
            throw new TypeError('Tuple arity does not match its prototype');
          }
          values.map((val, index) => {
            this['_' + (index + 1)] = checkType(typeInfo[index], val);
          }, this);

          Object.freeze(this);
        };
        _T.prototype.values = function () {
          return Object.keys(this).map((k) => this[k] /*, this*/);
        };
        return _T;
      };
      const checkType = (type, target) => {
        if (
          type
            .toString()
            .toUpperCase()
            .indexOf((typeof target).toUpperCase()) > -1
        ) {
          return target;
        } else {
          return;
        }
      };
      const status = Tuple(Boolean, String);
      let s = new status(true, 'a');
      /****currying****/
      function currying(fn) {
        let len = fn.length;
        let fullArg = [];
        return function curry(...args) {
          len -= args.length;
          fullArg.push(...args);
          4;
          if (len === 0) return fn(...fullArg);
          return curry;
        };
      }
      function add(a, b, c) {
        return a + b + c;
      }
      let f1 = currying(add);
      let f2 = f1(1); //function can take upto 2 argus
      let f3 = f2(3);
      let f4 = f3(4);
      const fullname = (firstname) => (lastname) => firstname + ' ' + lastname;
      let first = fullname('jack');
      let name = first('whites');
      /******/
      //compose(f1,f2,f3)
      //
      function compose(...fns) {
        let start = fns.lenght - 1;
        return function (...args) {
          let i = start;
          let result = fns[start].apply(this, args);
          while (i--) {
            result = fns[i].call(this, result);
          }
          return result;
        };
      }
      /****/
      class Wrapper {
        constructor(val) {
          this._val = val;
        }
        map(f) {
          return f(this._val);
        }
        toString() {
          return 'Wrapper (' + this._val + ')';
        }
      }
      const warp = (val) => new Wrapper(val);
      Wrapper.prototype.fmap = function (f) {
        return wrap(f(this._val));
      };
      /***memorization**/
      Function.prototype.memoized = function () {
        let key = JSON.stringify(arguments);
        this._cache = this.cache || {};
        this._cache[key] = this._cache[key] || this.apply(this, arguments);
        return this._cache[key];
      };
      Function.prototype.memoize = function () {
        let fn = this;
        if (fn.length === 0 || fn.length > 1) {
          return;
        }
        return function () {
          return fn.memoized.apply(fn, arguments);
        };
      };
      /****/
      function* addGenerator() {
        var i = 0;
        while (true) {
          i += yield i;
        }
      }
      let adder = addGenerator();
      console.log(adder.next().value);
      console.log(adder.next(5).value);
      function range(start, end) {
        return {
          [Symbol.iterator]() {
            return this;
          },

          next() {
            if (start < end) {
              return { value: start++, done: false };
            }
            return { done: true, value: end };
          },
        };
      }

      let result = [];
      for (let num of range(0, 5)) {
        console.log(num);
        result.push(num);
      }
      console.log(result); //[0,1,2,3,4]
      /*****/
      function squares(m) {
        let n = 1;
        return {
          [Symbol.iterator]() {
            return this;
          },
          next() {
            if (n <= m) return { value: n * n++ };
            return {done:true,value:}
          },
        };
      }