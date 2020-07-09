[toc]

# Vue 2.X key concepts - Part IV State management

## Passing props

root/parent --------state as props-----> children

```html
  
<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <counter :count="count"></counter>
  <counter :count="count"></counter>
  <counter :count="count"></counter>
  <button @click="count++">increment</button>
</div>

<script>
// a counter component rendered 3 times
// the component takes the current count via props
// and a button that increments all 3 counters at once
new Vue({
  el: '#app',
  data: {
    count: 0
  },
  components: {
    Counter: {
      props: {
        count: Number
      },
      template: `<div>{{ count }}</div>`
    }
  }
})
</script>
```



## Shared object

sharing without passing props

```html
<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <counter></counter>
  <counter></counter>
  <counter></counter>
  <button @click="inc">increment</button>
</div>

<script>
// create a counter component (that doesn't take any props)
// all instances of it should share the same count state
// and a button that increments all counters at the same time

    //shared object as state
const state = {
  count: 0
}

const Counter = {
  // Convert state into reactive object
    //data has to be a function in a component
  data () {
    //if you don't return the state to make it reactive, (call observe(state))
      //you can't do h('div',state.count) now the state belongs to data so call it by this.count
    return state
  },
  render (h) {
    // Proxy the object
      
    return h('div', this.count)
  }
}

new Vue({
  el: '#app',
    //register the component
  components: {
    Counter
  },
  methods: {
    inc () {
      state.count++
    }
  }
})
</script>
```



## Shared instance store

```js
//use the vue instance as state store and is reactive
//so the prop of the state object --> vue isntance
//this 'package' can be used everywhere as sotre
const state = new Vue({
  data: {
    count: 0
  },
  methods: {
    inc () {
      this.count++  //resemble to `mutation` where the state was actually mutated
        //has to be sync for the sake of dev-tool `timetravle` features
    }
  }
})

const Counter = {
    //reference it directly by state.count
    //it is defaultly reactive
    //so the render funciton is reactive as well depend on state.count
  render: h => h('div', state.count)
}

new Vue({
  el: '#app',
  components: {
    Counter
  },
  methods: {
    inc () {
      state.inc()
    }
  }
})
```

## Mutations

The API:

```js
const store = createStore({
  state: { count: 0 },
    //mutations is an object with id of mutaiton as the key
  mutations: {
      //mutation: inc
    inc (state) {
      state.count++
    }
  }
})

const Counter = {
  render (h) {
      //access to the state by store.state.count
    return h('div', store.state.count)
  }
}

new Vue({
  el: '#app',
  components: { Counter },
  methods: {
    inc () {
        //commit method that takes the id of the mutaiton 'type'
      store.commit('inc')
    }
  }
})
```

Wrapped the normal vue instance with more functionalities and expose the API:

```js
//takes an object 
//mutations are collection of funciton that takes the state as argument
function createStore ({ state, mutations }) {
    //return a vue instance just like previous code block
  return new Vue({
      //register the state to be reactive
    data: {
      state
    },
    methods: {
      commit (mutation) {
        if (!mutations.hasOwnProperty(mutation)) {
          throw new Error('Unknown mutation')
        }
          //each mutation takes the state to mutate it 
        mutations[mutation](state)
      }
    }
  })
}

```

## Functional

functional style?

React: `functional programming`  eg. redux the state is immutable

a reducer is a funciton takes the previous state and action 

return a new copy of the state

The change of state works as side-effect --> DOM updates

```js
// voila
app({
  el: '#app',
    //sate
  model: {
    count: 0
  },
  actions: {
      //each action takes in the prevState and return the new state
    inc: ({ count }) => ({ count: count + 1 }),
    dec: ({ count }) => ({ count: count - 1 })
  },
    //takes 3 arguments. model and actions are passed into the render function
    //everything are passed into function
   //the view function actually dosen't contain any mutation which was implemented by the app function
  view: (h, model, actions) => h('div', { attrs: { id: 'app' }}, [
    model.count, ' ',
    h('button', { on: { click: actions.inc }}, '+'),
    h('button', { on: { click: actions.dec }}, '-')
  ])
})
```

Implement:

````js
function app ({ el, model, view, actions }) {
  
  const vm = new Vue({
    el,
    data: {
      model
    },
    render (h) {
        //call the view function inside the render function
        //rather than directly pass the actions, pass a wrappedActions
        //because the action would be called on click and recieve the dom element rather than the state as the argument
      return view(h, this.model, wrappedActions)
    },
    methods: actions
  })
  //the wrappedAction has the same keys as actions but different implementation
    const wrappedActions = {}
//iterate through the incoming actions to 'clone' the acitons
  Object.keys(actions).forEach(key => {
      //store the original function in a variable
    const originalAction = actions[key]
    //make each of the values a function
    wrappedActions[key] = () => {
        //calling wrapped the warpped function means calling the original function
        //but pass it with the state: vm.model and 
        //makes the returned value the new vm.model in order to update the state
      let nextModel = originalAction(vm.model)
      vm.model=nextModel
    }
  })
}
````



attachment:

```js
//util.js
jest.setTimeout(1000)

const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

function getFilename (file) {
  const dir = path.dirname(file)
  const base = path.basename(file)
  const files = fs.readdirSync(path.resolve(dir, '../'))
  const id = base.match(/^\d+\.\d+/)[0]
  return files.filter(f => f.startsWith(id) && f.endsWith('.html'))[0]
}

exports.createTestCase = (file, fn, extra) => {
  const fileToTest = getFilename(file)
  it(fileToTest.replace(/\.html$/, ''), done => {
    JSDOM.fromFile(
      path.resolve(file, `../../${fileToTest}`),
      {
        resources: 'usable',
        runScripts: "dangerously"
      }
    ).then(({ window }) => {

      // test helper
      window.$click = function (target) {
        var evt = window.document.createEvent('HTMLEvents')
        evt.initEvent('click', false, true)
        window.document.querySelector(target).dispatchEvent(evt)
      }

      if (extra) {
        extra(window)
      }

      window.addEventListener('load', () => {
        const log = window.console.log = jest.fn(() => {})
        if (window.Vue) {
          window.Vue.config.productionTip = false
        }
        fn(window, log.mock.calls, done)
      })
    })
  })
}
```

