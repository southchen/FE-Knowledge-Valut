[toc]

# Vue 2.X key concepts - Part III Render Function

## About Virtual DOM

```js
//Actual DOM
[object HTMLDivElement]
document.createElement('div')
//Virtual DOM -> plain js object
{tag:'div',data:{attr:{},childre:[]}
 vm.$createElement('div')
```

it decouling the rendering logic from the DOM which enables the non-browser rendering.

Manupilate v-dom is cheaper than actual DOM

## About render function

A funciton that returns v-dom

< Template > ---> [complier] ----> Render Function

When rendering we're in the `autorun funciton`. Each componet track its own dependecies;

Top-down rendering

## JSX vs Template

same: DOM <- JSX/Template ->State

differences: 

* Template: static can be parsed by html parser; better comling optimization

*  JSX: dynamic, programming language

## Render function API

```js
export default {
    render(h){
        //return it and the tree would be returned
       return h('div',{class:'foo'},[
         'sometext', h('span', 'bar')
       ])
    }
}
```

```js
import MyComponent from '..'
h(MyComponent,{props:{...}})
```

## Implement

### rendering tag

```html
  
<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <example :tags="['h1', 'h2', 'h3']"></example>
</div>

<script>
Vue.component('example', {
  functional: true,
  props: {
    tags: {
      type: Array,
      validator (arr) { return !!arr.length }
    }
  },
  render: (h, context) => {
    const tags = context.props.tags
    return h('div', context.data, tags.map((tag, index) => h(tag, index)))
  }
})

new Vue({ el: '#app' })
</script>
```



### Dynamically Render Components

```html

<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <example :ok="ok"></example>
  <button @click="ok = !ok"></button>
</div>

<script>
    //functional component stateless; no `this`
const Foo = {
  functional: true,
    //second argument ->context obj  context.slot/.children
  render: h => h('div', 'foo')
}

const Bar = {
  functional: true,
  render: h => h('div', 'bar')
}

Vue.component('example', {
  functional: true,
  props: {
    ok: Boolean
  },
  render: (h, context) => h(context.props.ok ? Foo : Bar)
})

new Vue({
  el: '#app',
  data: {
    ok: true
  }
})
</script>
```



### higher-order-component.html

outter component <== wrappedFunction(inner component)

```html
<script src="../node_modules/vue/dist/vue.js"></script>

<div id="app">
  <smart-avatar username="vuejs"></smart-avatar>
</div>

<script>
// mock API
function fetchURL (username, cb) {
  setTimeout((username) => {
      cb(`https://avatars.com/${username}`)
  }, 500)
}
//a componetnjust for rendering some template, a reuseable component
const Avatar = {
    //it requires a full src link, the task is when yor cannot pass a url link all the time but username/userid
  props: ['src'],
  template: `<img :src="src">`
}
//wrap the innercomponent, return the needed info to the outter component
//can be used as a decorator @withAvatarUrl before a component
//'enhancer'
function withAvatarURL (InnerComponent) {
    //takes in the inner component
    //returns a new wrapped/decorated component options, a plain js object
  return {
    props: {
        //it enables the outter comp to recieve the username rather than url/src
      username: String
    },
    data () {
      return {
          //default url
        url: `http://palcehodler.com/200x200`
      }
    },
    created () {
      fetchURL(this.username, (url) => { this.url = url })
    },
    render (h) {
        //for the render funciton it just return the 'innercomponent' as the tag
        // and pass the wrapped url as the props
      return h(InnerComponent, { props: { src: this.url } })
    }
  }
}
//the outter component
const SmartAvatar = withAvatarURL(Avatar)

new Vue({
  el: '#app',
  components: { SmartAvatar }//put the optin inside
})
</script>
```

the difference between of using a mixin is that a HOC won't pollute the inner component (maintaining its pristine condition)