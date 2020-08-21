

# AggregateError

https://tc39.es/proposal-promise-any/#sec-aggregate-error-objects

https://github.com/es-shims/AggregateError

> creates and initializes a new AggregateError object when called as a function rather than as a [constructor](https://tc39.es/ecma262/#constructor). Thus the function call `AggregateError(…)` is equivalent to the object creation expression `new AggregateError(…)` with the same arguments.

>1. If NewTarget is undefined, let newTarget be the [active function object](https://tc39.es/ecma262/#active-function-object), else let newTarget be NewTarget.
>2. Let O be ? [OrdinaryCreateFromConstructor](https://tc39.es/ecma262/#sec-ordinarycreatefromconstructor)(newTarget, `"%AggregateError.prototype%"`, « [[ErrorData]] »).···

```js
AggregateError(errors,msg){
    let err=new Error(msg)
    Object.setPrototype(err,proto)
    delete err.construcotr
    //....
    return err;
}
let proto=AggregateError.prototype
```

>If message is not undefined, then
>
>1. Let msg be ? [ToString](https://tc39.es/ecma262/#sec-tostring)(message).
>2. Let msgDesc be the PropertyDescriptor { [[Value]]: msg, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true }.
>3. Perform ! [DefinePropertyOrThrow](https://tc39.es/ecma262/#sec-definepropertyorthrow)(O, "message", msgDesc).

```js
AggregateError(errors,message){
	const msg = messgage.toString()
    const msgDsc = {
    value: msg,
    writable: true,
    enumerable: false,
    configurable: true,
  };
    const err=new Error(message)
    Object.setPrototype(err,proto)
    delete err.construcotr
    Object.defineProperty(err, 'message', msgDsc);
    ....
    return err;
}
let proto=AggregateError.prototype
```

> 1. Let errorsList be ? [IterableToList](https://tc39.es/proposal-promise-any/#sec-iterabletolist)(errors).
> 2. Perform ! [DefinePropertyOrThrow](https://tc39.es/ecma262/#sec-definepropertyorthrow)(O, `"errors"`, [Property Descriptor](https://tc39.es/ecma262/#sec-property-descriptor-specification-type) { [[Configurable]]: true, [[Enumerable]]: false, [[Writable]]: true, [[Value]]: ! [CreateArrayFromList](https://tc39.es/ecma262/#sec-createarrayfromlist)(errorsList) }).

```js
AggregateError(errors,message){
	const msg = messgage.toString()
    const err=new Error(message)
    Object.setPrototype(err,proto)
    delete err.construcotr
    let errorList = Array.from(errors);
    Object.defineProperties(err:{
              'errors':{
        			configurable:true,
        			enumerable:false,
        			writable:true,
        			value:erroList
        			},
        	'message':{
               		value: msg,
    				writable: true,
    				enumerable: false,
    				configurable: true,
            		}
           })
    return err;
}
let proto=AggregateError.prototype
```

> The AggregateError [constructor](https://tc39.es/ecma262/#constructor):
>
> - has a [[Prototype]] internal slot whose value is the intrinsic object [%Error%](https://tc39.es/ecma262/#sec-error-constructor).
> - has the following properties:

```js
Object.setPrototypeOf(AggregateError.prototype, Error.prototype);
```

> The initial value of `AggregateError.prototype` is the intrinsic object [%AggregateError.prototype%](https://tc39.es/proposal-promise-any/#sec-properties-of-the-aggregate-error-prototype-objects).
>
> This property has the attributes { [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false }.

>The initial value of `AggregateError.prototype.constructor` is the intrinsic object [%AggregateError%](https://tc39.es/proposal-promise-any/#sec-aggregate-error-constructor).

```js
Object.defineProperties(AggragateError.prototype,{
    					'constructor':{
                        	value:AggregateError,
                        	writable:true,
                            enumerable:false,
                            configuarble:true
                        },
    					'name':{
                            value:'AggregateError',
                            writable:true,
                            enumerable:false,
                            configuarble:true
                        },
                          'message':{
                            value:'',
                            writable:true,
                            enumerable:false,
                            configuarble:true
						}
})

```

The final version:

```js
AggregateError(errors,message){
	const msg = messgage.toString()
    const err=new Error(message)
    Object.setPrototype(err,proto)
    delete err.construcotr
    let errorList = Array.from(errors);
    Object.defineProperties(err:{
              'errors':{
        			configurable:true,
        			enumerable:false,
        			writable:true,
        			value:erroList
        			},
        	'message':{
               		value: msg,
    				writable: true,
    				enumerable: false,
    				configurable: true,
            		}
           })
    return err;
}
let proto=AggregateError.prototype
Object.defineProperties(AggragateError.prototype,{
    					'constructor':{
                        	value:AggregateError,
                        	writable:true,
                            enumerable:false,
                            configuarble:true
                        },
    					'name':{
                            value:'AggregateError',
                            writable:true,
                            enumerable:false,
                            configuarble:true
                        },
                          'message':{
                            value:'',
                            writable:true,
                            enumerable:false,
                            configuarble:true
						}
})
```



