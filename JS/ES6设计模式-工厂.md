[toc]

# 工厂模式

工厂模式是用来创建对象的一种最常用的设计模式。我们不暴露创建对象的具体逻辑，而是将将逻辑封装在一个函数中，那么这个函数就可以被视为一个工厂。工厂模式根据抽象程度的不同可以分为：简单工厂，工厂方法和抽象工厂

模式的三种实现方法： 简单工厂模式、工厂方法模式、抽象工厂模式。

## 简单工厂模式

简单工厂模式又叫静态工厂模式，由一个工厂对象决定创建某一种产品对象类的实例。主要用来创建同一类对象。

```js
let UserFactory = function (role) {
  function User(opt) {//👈构造函数
    this.name = opt.name;
    this.viewPage = opt.viewPage;
  }

  switch (role) {//👈在条件分支中才创建实例
    case 'superAdmin':
      return new User({ name: '超级管理员', viewPage: ['首页', '通讯录', '发现页', '应用数据', '权限管理'] });
      break;
    case 'admin':
      return new User({ name: '管理员', viewPage: ['首页', '通讯录', '发现页', '应用数据'] });
      break;
    case 'user':
      return new User({ name: '普通用户', viewPage: ['首页', '通讯录', '发现页'] });
      break;
    default:
      throw new Error('参数错误, 可选参数:superAdmin、admin、user')
  }
}

//调用
let superAdmin = UserFactory('superAdmin');
let admin = UserFactory('admin') 
let normalUser = UserFactory('user')
```

简单工厂的优点在于，**你只需要一个正确的参数，就可以获取到你所需要的对象，而无需知道其创建的具体细节**。但是在函数内包含了所有对象的创建逻辑（构造函数）和判断逻辑的代码，每增加新的构造函数还需要修改判断逻辑代码。当我们的对象不是上面的3个而是30个或更多时，这个函数会成为一个庞大的超级函数，便得难以维护。所以，简单工厂只能作用于**创建的对象数量较少，对象的创建逻辑不复杂时使用**。

### ES6重写简单工厂模式

使用ES6重写简单工厂模式时，我们不再使用构造函数创建对象，而是使用`class`的新语法，并使用`static`关键字将简单工厂封装到`User`类的静态方法中:

```js
//User类
class User {
  //构造器
  constructor(opt) {
    this.name = opt.name;
    this.viewPage = opt.viewPage;
  }
  //静态方法
  static getInstance(role) {
    switch (role) {
      case 'superAdmin':
        return new User({ name: '超级管理员', viewPage: ['首页', '通讯录', '发现页', '应用数据', '权限管理'] });
        break;
      case 'admin':
        return new User({ name: '管理员', viewPage: ['首页', '通讯录', '发现页', '应用数据'] });
        break;
      case 'user':
        return new User({ name: '普通用户', viewPage: ['首页', '通讯录', '发现页'] });
        break;
      default:
        throw new Error('参数错误, 可选参数:superAdmin、admin、user')
    }
  }
}

//调用
//不直接new User()，而是直接调用类的静态方法
let superAdmin = User.getInstance('superAdmin');
let admin = User.getInstance('admin');
let normalUser = User.getInstance('user');
```

## 工厂方法模式

工厂方法模式的本意是将实际创建对象的工作推迟到子类中，这样核心类就变成了抽象类。但是在JavaScript中很难像传统面向对象那样去实现创建抽象类。所以在JavaScript中我们只需要参考它的核心思想即可。我们可以将工厂方法看作是一个实例化对象的工厂类。

在简单工厂模式中，我们每添加一个构造函数需要修改两处代码。现在我们使用工厂方法模式改造上面的代码，刚才提到，工厂方法我们只把它看作是一个实例化对象的工厂，它只做实例化对象这一件事情！ 我们采用安全模式创建对象。

```js
//安全模式创建的工厂方法函数
let UserFactory = function(role) {
  if(this instanceof UserFactory) {
    var s = new this[role]();//👈A，调用的是prototype上的各个方法->构造函数
    return s;
  } else {
    return new UserFactory(role);//👈调用【A
  }
}

//工厂方法函数的原型中设置所有对象的构造函数
UserFactory.prototype = {
  SuperAdmin: function() {//构造函数
    this.name = "超级管理员",
    this.viewPage = ['首页', '通讯录', '发现页', '应用数据', '权限管理']
  },
  Admin: function() {
    this.name = "管理员",
    this.viewPage = ['首页', '通讯录', '发现页', '应用数据']
  },
  NormalUser: function() {
    this.name = '普通用户',
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}

//调用，不用new调用
let superAdmin = UserFactory('SuperAdmin');
let admin = UserFactory('Admin') 
let normalUser = UserFactory('NormalUser')
```

将`SuperAdmin`、`Admin`、`NormalUser`等构造函数保存到了`UserFactory.prototype`中，也就意味着我们必须实例化`UserFactory`函数才能够进行以上对象的实例化。

```js
let UserFactory = function() {}

UserFactory.prototype = {
 //...
}

//调用
let factory = new UserFactory();
let superAdmin = new factory.SuperAdmin();
```

用安全模式创建对象省去new

###  ES6重写工厂方法模式

虽然ES6也没有实现`abstract`，但是我们可以使用`new.target`来模拟出抽象类。`new.target`指向直接被`new`执行的构造函数，我们对`new.target`进行判断，如果指向了该类则抛出错误来使得该类成为抽象类。

```js
class User {
  constructor(name = '', viewPage = []) {
    if(new.target === User) {
      throw new Error('抽象类不能实例化!');
    }
    this.name = name;
    this.viewPage = viewPage;
  }
}

class UserFactory extends User {
  constructor(name, viewPage) {
    super(name, viewPage)
  }
  create(role) {
    switch (role) {
      case 'superAdmin': 
        return new UserFactory( '超级管理员', ['首页', '通讯录', '发现页', '应用数据', '权限管理'] );
        break;
      case 'admin':
        return new UserFactory( '普通用户', ['首页', '通讯录', '发现页'] );
        break;
      case 'user':
        return new UserFactory( '普通用户', ['首页', '通讯录', '发现页'] );
        break;
      default:
        throw new Error('参数错误, 可选参数:superAdmin、admin、user')
    }
  }
}

let userFactory = new UserFactory();
let superAdmin = userFactory.create('superAdmin');
let admin = userFactory.create('admin');
let user = userFactory.create('user');
```

## 抽象工厂模式

上面介绍了简单工厂模式和工厂方法模式都是直接生成实例，但是抽象工厂模式不同，**抽象工厂模式并不直接生成实例， 而是用于对产品类簇的创建**。

上面例子中的`superAdmin`，`admin`，`user`三种用户角色，其中`user`可能是使用不同的社交媒体账户进行注册的，例如：`wechat`，`qq`，`weibo`。那么这三类社交媒体账户就是对应的类簇。**在抽象工厂中，类簇一般用父类定义，并在父类中定义一些抽象方法，再通过抽象工厂让子类继承父类。**所以，抽象工厂其实是**实现子类继承父类的方法**。

上面提到的抽象方法是指声明但不能使用的方法。在JavaScript中可以通过在类的方法中抛出错误来模拟抽象类。

```js
let WechatUser = function() {}
WechatUser.prototype = {
  getName: function() {
    return new Error('抽象方法不能调用');
  }
}
```

上述代码中的`getPrice`就是抽象方法，我们定义它但是却没有去实现。**如果子类继承`WechatUser`但是并没有去重写`getName`，那么子类的实例化对象就会调用父类的`getName`方法并抛出错误提示。**

下面我们分别来实现账号管理的抽象工厂方法:

```js
let AccountAbstractFactory = function(subType, superType) {
  //判断抽象工厂中是否有该抽象类
  if(typeof AccountAbstractFactory[superType] === 'function') {
    //缓存类
    function F() {};
    //继承父类属性和方法
    F.prototype = new AccountAbstractFactory[superType] ();
    //将子类的constructor指向子类
    subType.constructor = subType;
    //子类原型继承父类
    subType.prototype = new F();
  } else {
    throw new Error('抽象类不存在!')
  }
}

//微信用户抽象类,用来创建wechatUser簇
AccountAbstractFactory.WechatUser = function() {
  this.type = 'wechat';
}
AccountAbstractFactory.WechatUser.prototype = {
    //需要被子类重写的方法
  getName: function() {
    return new Error('抽象方法不能调用');
  }
}
//qq用户抽象类
//新浪微博用户抽象类
```

`AccountAbstractFactory `就是一个抽象工厂方法，该方法在参数中传递子类和父类，在方法体内部实现了子类对父类的继承。对抽象工厂方法添加抽象类的方法我们是通过点语法进行添加的。

下面我们来定义普通用户的子类:

```JS
//普通微信用户子类
function UserOfWechat(name) {
  this.name = name;
  this.viewPage = ['首页', '通讯录', '发现页']
}
//抽象工厂实现WechatUser类的继承
AccountAbstractFactory(UserOfWechat, 'WechatUser');
//调用了new AccountAbstractFactory.WechatUser()
//子类中重写抽象方法
UserOfWechat.prototype.getName = function() {
  return this.name;
}

//普通qq用户子类
//普通微博用户子类
```

我们来分别对这三种类进行实例化，检测抽象工厂方法是实现了类簇的管理。

```js
//实例化微信用户
let wechatUserA = new UserOfWechat('微信小李');
console.log(wechatUserA.getName(), wechatUserA.type); //微信小李 wechat
let wechatUserB = new UserOfWechat('微信小王');
console.log(wechatUserB.getName(), wechatUserB.type); //微信小王 wechat

//实例化qq用户
let qqUserA = new UserOfQq('QQ小李');
console.log(qqUserA.getName(), qqUserA.type); //QQ小李 qq
let qqUserB = new UserOfQq('QQ小王');
console.log(qqUserB.getName(), qqUserB.type); //QQ小王 qq
```

从打印结果上看，`AccountAbstractFactory`这个抽象工厂很好的实现了它的作用，将不同用户账户按照社交媒体这一个类簇进行了分类。这就是抽象工厂的作用，它不直接创建实例，而是通过类的继承进行类簇的管理。抽象工厂模式一般用在多人协作的超大型项目中，并且严格的要求项目以面向对象的思想进行完成。

### ES6重写抽象工厂模式

我们同样使用`new.target`语法来模拟抽象类，并通过继承的方式创建出`UserOfWechat`, `UserOfQq`, `UserOfWeibo`这一系列子类类簇。使用`getAbstractUserFactor`来返回指定的类簇。

```js
class User {
  constructor(type) {
    if (new.target === User) {
      throw new Error('抽象类不能实例化!')
    }
    this.type = type;
  }
}

class UserOfWechat extends User {
  constructor(name) {
    super('wechat');
    this.name = name;
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}

class UserOfQq extends User {
  constructor(name) {
    super('qq');
    this.name = name;
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}

class UserOfWeibo extends User {
  constructor(name) {
    super('weibo');
    this.name = name;
    this.viewPage = ['首页', '通讯录', '发现页']
  }
}

function getAbstractUserFactory(type) {
  switch (type) {
    case 'wechat':
      return UserOfWechat;
      break;
    case 'qq':
      return UserOfQq;
      break;
    case 'weibo':
      return UserOfWeibo;
      break;
    default:
      throw new Error('参数错误, 可选参数:superAdmin、admin、user')
  }
}

let WechatUserClass = getAbstractUserFactory('wechat');
let QqUserClass = getAbstractUserFactory('qq');
let WeiboUserClass = getAbstractUserFactory('weibo');

let wechatUser = new WechatUserClass('微信小李');
let qqUser = new QqUserClass('QQ小李');
let weiboUser = new WeiboUserClass('微博小李');
```

## 工厂模式的项目实战应用

在实际的前端业务中，最常用的简单工厂模式。如果不是超大型的项目，是很难有机会使用到工厂方法模式和抽象工厂方法模式的。下面我介绍在Vue项目中实际使用到的简单工厂模式的应用。

在普通的vue + vue-router的项目中，我们通常将所有的路由写入到`router/index.js`这个文件中。


```js
// index.js
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import SuperAdmin from '../components/SuperAdmin.vue'
import NormalAdmin from '../components/Admin.vue'
import User from '../components/User.vue'
import NotFound404 from '../components/404.vue'

Vue.use(Router)

export default new Router({
  routes: [
    //重定向到登录页
    {
      path: '/',
      redirect: '/login'
    },
    //登陆页
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    //超级管理员页面
    //普通管理员页面
    //普通用户页面
    //404页面
    {
      path: '*',
      name: 'NotFound404',
      component: NotFound404
    }
  ]
})
```

当涉及权限管理页面的时候，通常需要在用户登陆根据权限开放固定的访问页面并进行相应权限的页面跳转。但是如果我们还是按照老办法将所有的路由写入到`router/index.js`这个文件中，那么低权限的用户如果知道高权限路由时，可以通过在浏览器上输入url跳转到高权限的页面。所以我们必须在登陆的时候根据权限使用`vue-router`提供的`addRoutes`方法给予用户相对应的路由权限。这个时候就可以使用简单工厂方法来改造上面的代码。

在`router/index.js`文件中，我们只提供`/login`这一个路由页面。

```js
//index.js
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    //重定向到登录页
    {
      path: '/',
      redirect: '/login'
    },
    //登陆页
    {
      path: '/login',
      name: 'Login',
      component: Login//👈Login组件
    }
  ]
})
```

我们在`router/`文件夹下新建一个`routerFactory.js`文件，导出`routerFactory`简单工厂函数，用于根据用户权限提供路由权限，代码如下

```js
//routerFactory.js
import SuperAdmin from '../components/SuperAdmin.vue'
import NormalAdmin from '../components/Admin.vue'
import User from '../components/User.vue'
import NotFound404 from '../components/404.vue'

let AllRoute = [
  //超级管理员页面
  {
    path: '/super-admin',
    name: 'SuperAdmin',
    component: SuperAdmin
  },
  //普通管理员页面
  {
    path: '/normal-admin',
    name: 'NormalAdmin',
    component: NormalAdmin
  },
  //普通用户页面
  {
    path: '/user',
    name: 'User',
    component: User
  },
  //404页面
  {
    path: '*',
    name: 'NotFound404',
    component: NotFound404
  }
]

let routerFactory = (role) => {//👈路由工厂
  switch (role) {
    case 'superAdmin':
      return {
        name: 'SuperAdmin',
        route: AllRoute//根据role返回对应的route
      };
      break;
    case 'normalAdmin':
      return {
        name: 'NormalAdmin',
        route: AllRoute.splice(1)
      }
      break;
    case 'user':
      return {
        name: 'User',
        route:  AllRoute.splice(2)
      }
      break;
    default: 
      throw new Error('参数错误! 可选参数: superAdmin, normalAdmin, user')
  }
}
export { routerFactory }
```

在登陆页导入该方法，请求登陆接口后根据权限添加路由:

```js
//Login.vue
import {routerFactory} from '../router/routerFactory.js'
export default {
  //... 
  methods: {
    userLogin() {
      //请求登陆接口, 获取用户权限, 根据权限调用this.getRoute方法
      //..
    },
    
    getRoute(role) {//👈传入login后得到的role
      //根据权限调用routerFactory方法
      let routerObj = routerFactory(role);
      //给vue-router添加该权限所拥有的路由页面
      this.$router.addRoutes(routerObj.route);
      //跳转到相应页面
      this.$router.push({name: routerObj.name})
    }
  }
};
```

在实际项目中，因为使用`this.$router.addRoutes`方法添加的路由刷新后不能保存，所以会导致路由无法访问。通常的做法是本地加密保存用户信息，在刷新后获取本地权限并解密，根据权限重新添加路由。这里因为和工厂模式没有太大的关系就不再赘述。

## 总结

* 简单工厂模式又叫静态工厂方法，用来创建某一种产品对象的实例，用来创建单一对象；

* 工厂方法模式是将创建实例推迟到子类中进行；

* 抽象工厂模式是对类的工厂抽象用来创建产品类簇，不负责创建某一类产品的实例。

Ref: [从ES6重新认识JavaScript设计模式(二): 工厂模式](https://segmentfault.com/a/1190000014196851)