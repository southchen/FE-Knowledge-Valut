[toc]

# Vue 2.X key concepts - Part II Plugins

## About Plugin

```vue
Vue.use(myPlugin)
```

A plugin is enssential a funciton that takes Vue as the first argument , and an option object as the second argument

Uder the hood it relys on the `Mixin` API which is part of the Vue options that can be reused in different component.

```js
Vue.mixin(options) //a global api that will affect all the instances
```

the differences are the .use() API implement the dedupe feature: for multiple .use(sameoption) it only runs once while the mixin API dosen't. Therefore it'd better to wrap a mixin in a plugin interface

## Implement a plugin

```js
const RulesPlugin = {
    //object format of pulgin
    //it exposed a install method
  install (Vue) {
      //when you call Vue.use(plugin) it 'teaches' the global instance the mixins
    Vue.mixin({
        //when the components is created, it call the hook
      created () {
          //check if the rules exist
        if (this.$options.hasOwnProperty('rules')) {
          // access the rules by this.$options.rules
            //Do something with rules
          const rules = this.$options.rules
          Object.keys(rules).forEach(key => {
            const rule = rules[key]
            //
            this.$watch(key, newValue => {
              const result = rule.validate(newValue)
              if (!result) {
                console.log(rule.message)
              }
            })
          })
        }
      }
    })
  }
}

Vue.use(RulesPlugin)
```



```js
const vm = new Vue({
  data: { foo: 10 },
  rules: {
      //works for the 'foo' prop
    foo: {
      validate: value => value > 1,
      message: 'foo must be greater than one'
    }
  }
})

vm.foo = 0 // should log: "foo must be greater than one"
```

