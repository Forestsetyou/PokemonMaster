# PokemonMaster.

留存一下制作该项目的思路和笔记

```
喷火龙努力值分配:{
	At:252,
	HP:252,
	Sp:6,
}
甲贺忍蛙努力值分配:{
	Sa:252,
	
}
```



**加密通话**

```
接下来是来自小智的朋友们的提示哦~
小刚说：要想成为宝可梦大师，首先得了解宝可梦的知识哦（https://wiki.52poke.com/wiki/%E4%B8%BB%E9%A1%B5）
小霞说：阿岚的喷火龙有着储水特性，水系技能会让他回血呢，正因如此，他根本不屑于躲水系技能
小胜说：小智的忍蛙有很特殊的特性‘牵绊变身’，别的精灵可以窃取该特性，但是拥有该特性的精灵不能窃取别的特性
小光说：阿岚的喷火龙会一个很特殊的技能叫模仿，会使用对方精灵上回合用过的技能
小茂说：小智的忍蛙很强，他能学会好多技能
爱丽丝说：小智的忍蛙因为有‘牵绊变身’的特性，可以使用飞水手里剑的升级版——黄金手里剑！它必定先手攻击，如果命中的话必定击中三次！
瑟蕾娜说：小智的忍蛙拥有独一无二的必杀技'挣扎'
```



## More Problems

### JS

对象：普通的 `obj` 的键会被自动视为字符串，当某参数 `typeof(num)===number` 时，给对象左

注释：`//` 

模块：`export` 标记可导出元素，`import` 导入模块元素，如下导入了'./sayHi.js'中的函数 `sayHi()` :

```js
import {sayHi} from './sayHi.js';
```

非函数的导入只会被解析一次，创建出一个所有模块共享的变量。

函数传参是复制行为，因此除了对象其他参数的函数内部的修改不影响外部。对象的复制行为实质上是对原对象的引用，复制内容是引用地址，因此会起到传入地址的效果。复制行为例如：`obj1=obj2`

**参考：[**

[现代 JavaScript 教程](https://zh.javascript.info/)

**]**

### HTML & CSS

`<font color="red"> </font>` 字体标签可设置字体颜色，也可以直接设置 `color:red` 来设置文本颜色

CSS中后出现的规则优先级更高

`border-radius` 为元素添加圆角边框

如果一个box的设置为 `display:inline` ，那么它的width与height将不再起作用；使用 `display:inline-block` 可以使得box既不换行，又可设置宽高

`<span>` 内联元素，不换行；`<p>` 块级元素，换行，有时会忽略空格；当标签被竖置，则不精确读取内容（忽略空白字符），但可以精确读取引号中的内容（自然就无法读取引号本身）

`<input>` 必须为空标签，当 `type='submit'` 时设置 `value='提交'` 来创建一个内容为"提交"的上传按钮

`<form>` 的提交必定会刷新页面，因此要靠 `onChange` 来实现

#### 内联盒子并排塌陷问题

设置合适的 `vertical-align` 可以改变内联盒子的参考基线，所有盒子都沿着参考基线向下生长，若想从上方对齐，则设置 `vertical-align:top` 。

#### button上方出现多于空隙问题

当时用如下Button：

```html
<button className="rightBut">
	<span color='red'>一般</span><span> 拍击</span><br />
	<span>PP:20 威力:40</span>
</button>
```

如果使用如下CSS：

```css
body {
	font-size: calc(10px + 2vmin);
}
```

则button上方会出现多于空隙，并且调整浏览器的大小会改变其间隙大小，这也许是因为 `<button>` 也是内联元素的关系，受到了字体大小的影响（?），但实践结果表明即便 `<button>` 内部无任何文字，仍会出现这一段多于的距离，目前仍未清楚原因；

#### 插入自适应背景图片

```CSS
body {
    margin: 0;	/* 不影响background */
    background: url(./PK.jpeg);
    background-size: cover;	 /* 背景图片自适应大小 */
}
```

**vmin:视口高度 vw 和宽度 vh 两者之间的最小值。**

```css
height: 100vmin;
width: 100vw;
```

图片存在最大尺寸，根据所在盒子的大小，取较大的边长、保持长宽比、变化尺寸。



**参考：[**

[YOLO8899-HTML常用长度单位](https://blog.csdn.net/qq_51379218/article/details/121174508)

**]**

#### npm

**全局安装npm:**

```npm
npm i -g npm
```



## React

`Ctrl + C` 可以退出终端批处理

规则上采用小驼峰命名法，不采用HTML默认的命名规则

`ReactDOM.render()`：主渲染函数

```react
function Welcome(props){	//传入的参数被放在props中
    return <h1>Hello, {props.name}</h1>;	//大括号可以传入表达式的值
}	//这是一个函数组件
ReactDOM.render(	// Welcome传入一个自定义组件与参数
	<Welcome name="Sara" />	//首字母大写用于区分HTML默认标签
);
```

在 `map()` 方法中需要为标签指定 `key` 属性，默认为索引 `index` .（参考 [React文档-列表 & Key](https://react.docschina.org/docs/lists-and-keys.html)）

#### 导入 `_.cloneDeep(obj)` 模块

```
npm i --save lodash.clonedeep
```

安装lodash包

```react
import _,{ set } from 'lodash';
```

使用非node.js语法导入

也可以不导入直接使用函数 `._cloneDeep(obj)`

#### setState()

解决 `this.props` `this.state` 异步更新导致合并失败问题：

```react
this.setState((state, props)=>({	//传入并执行函数
	counter: state.counter + props.increment
}));	//返回一个新对象用于更新state
```



如果出现 `this.setState() is not a function` 的报错说明 `setState` 不小心被赋值了

#### State修改

**在state中写入修改state的函数，修改效果其实是有效的。**但是react更新结点的判定是根据是否**调用**了 `setState()`  函数并且**更新**了state对象，因此若只是调用修改state的内部函数，则其值修改了，但DOM结点不会及时更新。
因此，为了方便的修改state（内部函数比 `setState()` 要快捷），可以选择将内部函数装入一个大函数中，然后调用 `setState()` 随意修改一个无用的属性，起到一个DOM结点更新的作用。如下：

```react
ability{
	change(){
          this.nowHP-=1;
          console.log('test!'+ this?.nowHP);
    },
}
// ...
handleHP(){
    this.state.player.monster[1].ability.change();
    console.log(this.state.player.monster[1].ability.nowHP);
    // this.props.handlePage();
    this.setState({
      number:this.state.number+1,
    })
  }
```

当然了，别忘记绑定一下 `this` ；先给 `change` 绑上 `ability` ，再给 `handleHP` 绑定是不会出现冲突的，这一操作推荐在构造函数中完成。

另一方面，**执行 `ReactDOM.render()` 函数也能更新DOM结点**，你可以将其放在函数中，通过**调度办法**，多次调用函数来实现结点的更新，但那显然不是一个好选择。

`setState()` 函数会将新旧state进行合并，但只做潜合并，也就是只合并第一层，更深的对象是覆盖的。

#### 传参

```react
for(var num=1;num<=4;++num){
            console.log(num);
                skill[num]=
                <form key={num.toString()} onSubmit={this.handleSubmit}>
                    <label>技能栏{toChi[num]}：{this.props.PP[num].name}</label><br />
                    <input list='skill' type='text'></input>
                    <datalist id='skill'>
                        {skillList}
                    </datalist>
                     <input type='submit' value='选择一个新技能'></input>
                </form>
        }
// ...
handleSkill(number,name){
    console.log(name);
    console.log(skillIndex[name]);
    console.log(number);
    console.log(this.state.player.monster[1].PP[1].name);
  }
```

上述函数登记的number等于5，而将 `var` 换为 `let` 后则为正常的数字，原因暂且不明

`setState()` 有延迟，若执行后立刻输出其内容则有很大可能尚未更新

#### 给JSX设置style属性

`style` 接受一个小驼峰命名属性的JS对象，而非CSS字符串。

```react
const divStyle={
	color: 'blue',
	backgroundImage: 'url(' + imgUrl + ')',
    border: '1px solid',
}
function HelloWorldComponent(){
	return <div style={divStyle}>Hello World!</div>
}
```

如下语句段，将"inlineBlock"换成"inline-block"也有用，但前者更正常一点，理由不明

```react
let hpText2={
            display:'inlineBlock',
            backgroundColor: 'red',
            width:'80px',
            height:'24.5px',
            margin:0,
            paidding:0,
        };
```

#### 实现文本显示动画：

```react
 handlePage(){
    var timeID=setInterval(
      ()=>{
        // var text=this.state.text;
        this.setState({
          text:this.state.text+"嗷呜!",
        })
      },
      500,
    );
    setTimeout(() => {clearInterval(timeID)},2000);
    console.log(this.state.text);
  }
```

该代码能让输出的text每隔0.5秒多输出一个"嗷呜!"，并总共多输出了4个，需要注意计时器传入函数的引用而非调用，因此带参数最好使用箭头函数；另一方面若是将参数放在后面，如下：

```react
var timeID=setInterval(
      this.setState,
      500,
      {
      	text:this.state.text+'嗷呜!',
      }
    );
```

则需要注意参数被固定了！所以只会多输出一个嗷呜。正确写法应该同第一种，或者新建一个text变量读取state，再用来更新state也是可以的。

动画的成功实现还说明一个问题：不论函数是否在进行中，只要调用了有效的 `setState()` 就会更新DOM，这可太棒了。

#### 箭头函数

比较下列两段语句：

```react
return(
	<div>
		<p> Page1 </p>
		<button onClick={(this.props.monster) => this.props.handleTest()}>				{this.props.HP}	
		</button>
	</div>
)
```

```react
return (      //渲染按钮与PP信息
	<button className="Button" onClick={() => this.props.onClick(ply, n, this.props.num.ord, ply_)}>
		233
	</button>
)
```

上方的语句会报错，参数需要直接传入到箭头函数的函数体中；可以理解为左侧参数是会被赋值的变量，该语句在组成了一个函数，而不是在调用某个语句，右侧的函数才是在调用语句；可以把左参付给右侧的函数，也可以把更大环境下的变量参数付给右侧函数。

比较下列两段语句：

```react
return(
	<div>
		<p> Page1 </p>
		<button onClick={() => alert('xixi?')}>{this.props.HP}</button>
	</div>
)
```

```react
return(
	<div>
		<p> Page1 </p>
		<button onClick={alert('xixi?')}>{this.props.HP}</button>
	</div>
)
```

上方的语句会在单机按钮后弹出窗口，而下方语句则无论有无单机按钮都会不停弹出窗口，这是因为我们需要传入的应该是函数的引用，而非具体函数的调用，所以如果需要带上参数则必须嵌套函数，以此来新建一个函数

已知 `handleSubmit()` 函数如下：

```react
handleSubmit(event){
        alert(this===undefined);
        // this.props.handleSkill(event.target.value);
        event.preventDefault();
    }
```

比较下列两段语句：

```react
<form key={num.toString()} onSubmit={this.handleSubmit}>
```

```react
<form key={num.toString()} onSubmit={(event) => this.handleSubmit(event)}>
```

上方的语句会弹出'true'，下方的语句会弹出'false'，此处传给onSubmit的一个函数的引用，当调用函数 `onSubmit()` 的时候 `this` 指针若没有绑定就为 `undefined` ，而箭头函数暗含绑定的效果（代价是较高的渲染负担），因此下方的语句 `this` 有上下文。

#### 挂载与卸载

```react
class Clock extends React.Component{
    constructor(props){
        super(props);	//向父组件的构造函数传递参数
        this.state={data:new Date()};
    }
    componentDidMount(){	//组件被添入DOM时
        this.timerID=setInterval(	//挂载计时器
        	()=>this.tick(), 1000
        );
    }
    componentWillUnmount(){		//组件被删除时
        clearInterval(this.timerID);	//卸载计时器
    }
    tick(){
        this.setState({		//更新时间
            date: new Date()
        });		//构造函数外只能使用setState
    }
    render(){
        return(		//渲染时钟
        	<h1>It is {this.state.date.toLocaleTimeString()}.</h1>
        );
    }
}
```

#### 超棒的血条形状:

```react
        let hpText={
            margin: 0,
            marginTop: '3px',
            border: '2.5px solid #8B5A00',
            paddingLeft: '0.5px',
            paddingTop:'0.5px',
            paddingBottom: '0.5px',
            width:'230px',
            height:'15px',
            backgroundColor: 'white',
            borderRadius: '10% / 100%',
        };
        let hpText2={
            display:'inlineBlock',
            backgroundColor: hpColor,
            width: hpCal+'px',
            height:'14.5px',
            margin:0,
            paidding:0,
            borderRadius: '10% / 100%',
        };
        let HPStream=<div style={hpText}>
            <div style={hpText2}></div>
        </div>;
```

#### 奇怪的对象类BUG

![image-20220429061520372](E:\PictureBed\image-20220429061520372.png)

看到这个诡异的 `checks` 了嘛，它是以下代码的产物：

```react
block:{	  //守住状态
      discount(){
        if(this.checks===true)
        	this.checks=false;
      },
      checks:false,
    },
```

首先说明这个 `discount()` 函数在控制台返回的上下文是没有被调用的，根据前后文此处的 `checks` 应该是true，而事实也正是如此，但它在控制台就是会有这种奇怪的BUG，这里稍微改一下都没事，哪怕直接写成 `this.checks=false` 而不加if，上面的 `checks` 都是正常的，但就是这个写法让控制台返回的被包装的 `checks` 永远都是 `false` ，除了你直接访问它本身的时候是 `true` 。	

#### Deploy部署问题

首先我之前不知道有工具叫React Developer Tools、Redux DevTools，他们可以轻松的分解React项目的参数...所以需要一些手段来解决这个工具问题。我们希望当项目处在生产模式的时候开发者工具被禁用，因此我们需要新建一个禁用函数，并在生产模式下调用，详情参考：[Justin0223-React生产模式下禁止React Developer Tools、RedU型 DevTools](https://blog.csdn.net/u010377383/article/details/98476995)，其思路大致是将挂载的工具读取的信息全部清空为 `null` 或 `undefined` ，其中具体调用的判定可以如下：

```react
if(process.env.NODE_ENV === 'production'){
	disableReactDevTools();
}
```

生产模式：即 `process.env.NODE_ENV === 'production'` ，`process.env.NODE_ENV` 可在任意地方被访问，在 `npm start` 下值为 `development` ，在 `npm run build` 后的文件中值为 `production` ；

当项目被 `npm run build` 打包后会生成一个 `build` 文件夹，在CLI中输入 `npm install -g serve` 先安装serve服务，再输入 `serve -s build` 即可将build文件夹的在本地服务器挂起来。事实上 `build` 文件夹已经可以提供完整的服务，因此直接在该文件夹下启动CLI，并输入 `serve -s` 即可启动服务，要关闭服务可以使用 `Ctrl+C` 。

#### npm run build 吞注释

这个暂时没有解决办法，无论是JSX中的注释 `{/* */}` 还是网页入口的注释都会被过滤掉，只能选择设置透明文字来代替。





**参考：[**

[React文档](https://react.docschina.org/docs/getting-started.html)

**]**



## English Test

```
Attribute:属性
    attributes-复数
	attribution:属性

characteristic:特性

Avatar:头像

mount:挂载
    unmount:卸载

camelCase：小驼峰

Cyber:电脑的，网络的

endpoint:终点，端点

berry:浆果

slack:松散的

Cli:命令行接口

dashboard:仪表盘

multiple:多重的

critical hit:会心一击

psychic:超能

duration:持续时间

priority:优先级

existence:存在

paralysis:麻痹

substitute:替身

Flinch:畏缩

pixel:像素

preserve:保护

immune:免疫

manifest:显示
```