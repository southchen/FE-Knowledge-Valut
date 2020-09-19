[toc]

# Vue 2.X key concepts - Part V Routing

## Routing

keeps the url as a part of the reactive state

```html
<script>
// to access the current hash:
//window.location.hash
// to listen for hash changes:
//window.addEventListener('hashchange', () => {
//  // read hash and update app
//})
</script>

<div id="app">
  <component :is="url"></component>
  <a @click="routeTo('#foo')" href="#foo">foo</a>
  <a @click="routeTo('#bar')" href="#bar">bar</a>
</div>

<script>
window.addEventListener('hashchange', () => {
  app.url = window.location.hash.slice(1)
})

const app = new Vue({
  el: '#app',
  data: {
      //default
    url: 'foo'
  },
  components: {
    foo: { template: `<div>foo</div>`},
    bar: { template: `<div>bar</div>`},
  },
  methods: {
    routeTo (route) {
      window.location.hash = route
    }
  }
})
</script>
```

## Route table

no hard coded routing config

```html
<div id="app">
  <component :is="matchedComponent"></component>
  <a href="#foo">foo</a>
  <a href="#bar">bar</a>
</div>

<script>
// '#/foo' -> Foo
// '#/bar' -> Bar
// '#/404' -> NotFound

const Foo = { template: `<div>foo</div>` }
const Bar = { template: `<div>bar</div>` }
const NotFound = { template: `<div>not found!</div>` }

const routeTable = {
  foo: Foo,
  bar: Bar
}

window.addEventListener('hashchange', () => {
  app.url = window.location.hash.slice(1)
})

const app = new Vue({
  el: '#app',
  data: {
    url: 'foo'
  },
    render(h){
        return h('div',[
            h(routeTable[this.url] || NotFound),
            h('a',{attrs:{href:'#foo'}},'foo'),
            h('a',{attrs:{href:'#bar'}},'bar'),
        ])
    },
  computed: {
    matchedComponent () {
      return routeTable[this.url] || NotFound
    }
  }
})
</script>
```

## Dynamic routing / regExp



```html
<script src="../node_modules/vue/dist/vue.js"></script>
<!--helper regexp parser-->
<script src="./path-to-regexp.js"></script>
<div id="app"></div>
<script>
// '#/foo/123' -> foo with id: 123
// '#/bar' -> Bar
// '#/404' -> NotFound

// path-to-regexp usage:
// const regex = pathToRegexp(pattern)
// const match = regex.exec(path)
const Foo = {
  props: ['id'],
  template: `<div>foo with id: {{ id }}</div>`
}
const Bar = { template: `<div>bar</div>` }
const NotFound = { template: `<div>not found!</div>` }
//the public API
const routeTable = {
    //dynamic routing
  '/foo/:id': Foo,
  '/bar': Bar
}

const compiledRoutes = []
//iterate the routeTable to create a new table with pre-compole regExp
Object.keys(routeTable).forEach(key => {
  const dynamicSegments = []
  const regex = pathToRegexp(key, dynamicSegments)
  const component = routeTable[key]
  compiledRoutes.push({
    component,
    regex,
    dynamicSegments
  })
})

window.addEventListener('hashchange', () => {
  app.url = window.location.hash.slice(1)
})

const app = new Vue({
  el: '#app',
  data: {
    url: window.location.hash.slice(1)
  },
  render (h) {
      //current path
    const path = '/' + this.url

    let componentToRender
    let props = {}
//iterate the new route table not the raw table
    compiledRoutes.some(route => {
        //find the match
      const match = route.regex.exec(path)
      //init with NotFound
      componentToRender = NotFound
      if (match) {
        componentToRender = route.component
          
        route.dynamicSegments.forEach((segment, index) => {
            //pass it as props
          props[segment.name] = match[index + 1]
        })
        return true
      }
    })

    return h('div', [
      h(componentToRender, { props }),
      h('a', { attrs: { href: '#foo/123' }}, 'foo 123'),
      ' | ',
      h('a', { attrs: { href: '#foo/234' }}, 'foo 234'),
      ' | ',
      h('a', { attrs: { href: '#bar' }}, 'bar'),
      ' | ',
      h('a', { attrs: { href: '#garbage' }}, 'garbage')
    ])
  }
})
</script>
```

