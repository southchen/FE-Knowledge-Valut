[TOC]

# 适配器模式

**定义：**将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

**主要解决：**主要解决在软件系统中，常常要将一些"现存的对象"放到新的环境中，而新环境要求的接口是现对象不能满足的。

**何时使用：** 

* 系统需要使用现有的类，而此类的接口不符合系统的需要。 
* 想要建立一个可以重复使用的类，用于与一些彼此之间没有太大关联的一些类，包括一些可能在将来引进的类一起工作，这些源类不一定有一致的接口。 
* 通过接口转换，将一个类插入另一个类系中。

**如何解决：**继承或依赖（推荐）。

**关键代码：**适配器继承或依赖已有的对象，实现想要的目标接口。

**优点：** 

* 可以让任何两个没有关联的类一起运行。 
* 提高了类的复用。 
* 增加了类的透明度。 
* 灵活性好。

**缺点：** 过多地使用适配器，会让系统非常零乱，不易整体进行把握。比如，明明看到调用的是 A 接口，其实内部被适配成了 B 接口的实现，一个系统如果太多出现这种情况，无异于一场灾难。因此如果不是很有必要，可以不使用适配器，而是直接对系统进行重构。

**使用场景：**有动机地修改一个正常运行的系统的接口，这时应该考虑使用适配器模式。

**注意事项：**适配器不是在详细设计时添加的，而是解决正在服役的项目的问题。

将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

## ES6中的适配器模式

在前端项目中，适配器模式的使用场景一般有以下三种情况：库的适配、参数的适配和数据的适配。

### 库的适配

百度统计提供的埋点接口格式如下：

```JS
_hmt.push(['_trackEvent', category, action, opt_label,opt_value]);
```

按照产品经理的要求，你根据上面的格式将埋点代码写到了页面的多个地方：

```JS
//index.html
_hmt.push(['_trackEvent', 'web', 'page_enter', 'position', 'index.html']);

//product-detail.html
_hmt.push(['_trackEvent', 'web', 'page_enter', 'position', 'product-detail.html']);

_hmt.push(['_trackEvent', 'web', 'product_detail_view', 'product_id', productId]);

_hmt.push(['_trackEvent', 'web', 'add-product-chart', 'product_id', productId]);

//...还有几十个页面
```

数据采集平台需要从百度统计切换到神策数据，神策数据提供的埋点接口格式如下：

```JS
sa.track(eventName, {
  attrName: value 
})
```

接口的规则不同，就意味着你需要将几十个百度统计的`_htm.push`接口更改成为神策提供的`sa.track`接口。其实不用这么麻烦，写一个适配器就可以完成所有埋点事件的迁移：

```JS
//app.js

let _hmt = {
  push: (arr) {
    const [eventName, attrName, value] = [...arr.splice(2)];
    let attrObj = {
      [attrName]: value
    };
    sa.track(eventName, attrObj);
  }
}
```

通过分析比较百度统计的接口和神策的接口，可以知道在神策中只需要传入三个参数，`eventName`对应的是百度统计接口中的`action`, `attrName`对应的是百度统计接口中的`opt_label`， `value`对应的是百度统计接口中的`opt_value`; 删除了百度统计的SDK后，SDK所提供的`_htm`这个全局变量也就不存在了，我们可以利用该变量名做适配器，在`push`方法获取`sa.track`所需要的三个参数并调用`sa.track`即可。

### 参数的适配

有的情况下一个方法可能需要传入多个参数，例如在`SDK`这个类中有一个`phoneStatus`，需要传入五个参数用于接收手机的相关信息：

```JS
class SDK {
  phoneStatus(brand, os, carrier, language, network) {
    //dosomething.....
  }
}
```

通常在传入的参数大于3的时候，我们就可以考虑将参数合并为一个对象的形式。下面我们可以将`phoneStatus`的参数接口定义如下（`String`代表参数类型，`?:` 代表可选项）

```
{
  brand: String
  os: String
  carrier:? String
  language:? String
  network:? String
}
```

可以看出，`carrier`、`language`，`network`这三个属性不是必须传入的，它们在方法内部可能被设置一些默认值。所以这个时候我们就可以在方法内部采用适配器来适配这个参数对象。

```JS
class SDK {
  phoneStatus(config) {
    
    let defaultConfig = {
      brand: null,  //手机品牌
      os: null, //系统类型： Andoird或 iOS
      carrier: 'china-mobile', //运营商，默认中国移动
      language: 'zh', //语言类型，默认中文
      network: 'wifi', //网络类型，默认wifi
    }
    //参数适配
    for( let i in config) {
      defaultConfig[i] = config[i] || defaultConfig[i];
    }
    //dosomething.....
  }
}
```

### 数据的适配

数据的适配在前端中是最为常见的场景，这时适配器在解决前后端的数据依赖上有着重要的意义。通常服务器端传递的数据和我们前端需要使用的数据格式是不一致的，特别是在在使用一些UI框架时，框架所规定的数据有着固定的格式。所以，这个时候我们就需要对后端的数据格式进行适配。

例如网页中有一个使用Echarts折线图对网站每周的`uv`，通常后端返回的数据格式如下所示：

```JS
[
  {
    "day": "周一",
    "uv": 6300
  },
  {
    "day": "周二",
    "uv": 7100
  },  {
    "day": "周三",
    "uv": 4300
  },  {
    "day": "周四",
    "uv": 3300
  },  {
    "day": "周五",
    "uv": 8300
  },  {
    "day": "周六",
    "uv": 9300
  }, {
    "day": "周日",
    "uv": 11300
  }
]
```

但是Echarts需要的x轴的数据格式和坐标点的数据是长下面这样的:

```JS
["周二", "周二", "周三"， "周四"， "周五"， "周六"， "周日"] //x轴的数据

[6300. 7100, 4300, 3300, 8300, 9300, 11300] //坐标点的数据
```

所以这是我们就可以使用一个适配器，将后端的返回数据做适配：

```JS
//x轴适配器
function echartXAxisAdapter(res) {
  return res.map(item => item.day);
}

//坐标点适配器
function echartDataAdapter(res) {
  return res.map(item => item.uv);
}
```

## 总结

适配器模式在JS中的使用场景很多，在参数的适配上，有许多库和框架都使用适配器模式；数据的适配在解决前后端数据依赖上十分重要。但是适配器模式本质上是一个亡羊补牢的模式，它解决的是现存的两个接口之间不兼容的问题，你不应该在软件的初期开发阶段就使用该模式；如果在设计之初我们就能够统筹的规划好接口的一致性，那么适配器就应该尽量减少使用。