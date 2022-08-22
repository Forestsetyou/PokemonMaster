


class PP extends React.Component {  //props是传入的参数,以获得Game对象中的内容
  render() {
    let ply1 = this.props.player1;
    let ply2 = this.props.player2;
    let n = this.props.num.ply;
    let ply;
    let ply_;
    if (n === 1) {    //判断哪个玩家是受击方(ply_)
      ply = ply1;
      ply_ = ply2;
    } else {
      ply = ply2;
      ply_ = ply1;
    }
    if (!ply) {
      return (
        <div></div>
      )
    } 
    return (      //渲染按钮与PP信息
      <button className="Button" onClick={() => this.props.onClick(ply, n, this.props.num.ord, ply_)}>{ply["PP" + this.props.num.ord].name + ' \n 威力:' + ply["PP" + this.props.num.ord].harm + ' PP:' + ply["PP" + this.props.num.ord].pp + ' 命中：' + ply["PP" + this.props.num.ord].mz}</button>
    )                                            //注意这里才是真正调用了attack函数，而不是在下方按钮的onClick触发，{sth}表示取sth变量的值
  }
}

class Game extends React.Component {
    constructor(props) {    //props涵盖传入的内容
      super(props);   //补足继承的构造函数
      this.state = {
        Player1: null,
        Player2: null,
        oneIsNext: true,
        winner: null,
        history: null,
        name: "Game",
      }
      // this.attack=this.attack.bind(this);
      this.history = Array(100).fill(null);
      this.hisnum = 0;
      this.monster = {
      }
    }
  
    calculatorWinner(p1, p2) {    
      if (p1?.ability.HP === 0 || p2?.ability.HP === 0) return true;  //HP被封装进了ability中所以无效化了...
      return false;
    }
  
    counter(f1, f2) {   //属性克制
      if (f1 === 'grass')
        if (f2 === 'water' || f2 === 'electricity')
          return 1;
        else
          if (f2 === 'fire')
            return -1;
          else
            return 0;
      else
        if (f1 === 'fire')
          if (f2 === 'grass')
            return 1;
          else
            if (f2 === 'water')
              return -1;
            else
              return 0;
        else
          if (f1 === 'water')
            if (f2 === 'fire')
              return 1;
            else
              if (f2 === 'grass' || f2 === 'electricity')
                return -1;
              else
                return 0;
          else
            if (f1 === 'electricity')
              if (f2 === 'water')
                return 1;
              else
                if (f2 === 'grass')
                  return -1;
                else
                  return 0;
            else
              return 0;
    }
  
    hit(a) {
      let b = Math.floor(Math.random() * 100 + 1);
      if (b > a) return false;
      return true;
    }
  
    /*
    战斗分析函数
    注意这里是调用了PP对象并给PP先传参，再传参到该函数，而非直接借助按钮信息给attack传入参数
    也就是传入的箭头函数与变量名是在构造这个函数的参数特点
    */
    attack(p1, _p1, pp, p2) {
      console.log("This is "+this.state.name);
      if (!p1) return;    //是否两只怪兽都已经选定
      if (!p2) return;
      if (_p1 === 1 && !this.state.oneIsNext) return;   //是否有攻击权
      if (_p1 === 2 && this.state.oneIsNext) return;
      if (p1['PP' + pp].pp === 0) return;
      if (this.calculatorWinner(p1, p2)) return;  //若已经有结果则不进行攻击,_p1才是p2的实际内容
      let s = this.counter(p1['PP' + pp].feature, p2.feature);
      let damage;
      if (this.hit(p1['PP' + pp].mz)) {
        if (s === 1) {
          damage = p1['PP' + pp].harm * 2;
          this.history[this.hisnum] = p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',造成了' + damage + '点伤害，效果拔群';
          this.hisnum++;
          this.setState({
            oneIsNext: !this.state.oneIsNext,
            history: p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',造成了' + damage + '点伤害，效果拔群',
          })
          p2.ability.HP = (p2.ability.HP < damage) ? 0 : p2.ability.HP - damage;
          p1['PP' + pp].pp -= 1;
        }
        if (s === -1) {
          damage = p1['PP' + pp].harm * (0.5);
          this.history[this.hisnum] = p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',造成了' + damage + '点伤害，效果较差';
          this.hisnum++;
          this.setState({
            oneIsNext: !this.state.oneIsNext,
            history: p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',造成了' + damage + '点伤害，效果较差',
          })
          p2.ability.HP = (p2.ability.HP < damage) ? 0 : p2.ability.HP - damage;
          p1['PP' + pp].pp -= 1;
        }
        if (s === 0) {
          damage = p1['PP' + pp].harm;
          this.history[this.hisnum] = p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',造成了' + damage + '点伤害，效果一般';
          this.hisnum++;
          this.setState({
            oneIsNext: !this.state.oneIsNext,
            history: p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',造成了' + damage + '点伤害，效果一般',
          })
          p2.ability.HP = (p2.ability.HP < damage) ? 0 : p2.ability.HP - damage;
          p1['PP' + pp].pp -= 1;
        }
      } else {
        p1['PP' + pp].pp -= 1;
        this.history[this.hisnum] = p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',但被' + p2.name + '躲开了';
        this.hisnum++;
        this.setState({
          oneIsNext: !this.state.oneIsNext,
          history: p1.name + '对' + p2.name + '使用了' + p1['PP' + pp].name + ',但被' + p2.name + '躲开了',
        })
      }
      if (this.calculatorWinner(p1, p2)) {
        this.setState({
          winner: (p1?.HP === 0) ? p2 : p1,
        })
      }
      return;
    }
  
    clear1() {      //重置对战信息，玩家的怪兽状态
      this.setState(
        {
          oneIsNext: true,  //攻击轮换
          winner: null,
        }
      )
      this.history = Array(100).fill(null);   //存储战斗历史信息
      this.hisnum = 0;
      this.monster = {
        1: {
          name: '皮卡丘',
          src: pikachu,
          feature: 'electricity',
          ability: { 
            HP: 95,
            At: 54,
            Df: 40,
            Sa: 49,
            Sd: 59,
            Speed: 85,
          },
          PP1: {
            pp: 30,
            name: '电击',
            harm: 8,
            feature: 'electricity',
            mz: 100,
          },
          PP2: {
            pp: 30,
            name: '电光一闪',
            harm: 8,
            feature: 'normal',
            mz: 100,
          },
          PP3: {
            pp: 20,
            name: '摔打',
            harm: 16,
            feature: 'normal',
            mz: 75,
          },
          PP4: {
            pp: 15,
            name: '十万伏特',
            harm: 16,
            feature: 'electricity',
            mz: 100,
          },
          LV: 50,
        },
        2: {
          name: '妙蛙种子',
          src: bulbasaur,
          feature: 'grass',
          ability: {
            HP: 105,
            At: 48,
            Df: 48,
            Sa: 63,
            Sd: 63,
            Speed: 45,
          },
          PP1: {
            feature: 'normal',
            pp: 35,
            name: '撞击',
            harm: 8,
            mz: 100,
          },
          PP2: {
            feature: 'grass',
            pp: 25,
            name: '藤鞭',
            harm: 9,
            mz: 100,
          },
          PP3: {
            feature: 'normal',
            pp: 25,
            name: '飞叶快刀',
            harm: 11,
            mz: 95,
          },
          PP4: {
            feature: 'normal',
            pp: 20,
            name: '魔法叶',
            harm: 12,
            mz: 100,
          },
          LV: 50,
        },
        3: {
          name: '小火龙',
          src: charmander,
          feature: 'fire',
          ability: {
            HP: 99,
            At: 51,
            Df: 43,
            Sa: 58,
            Sd: 49,
            Speed: 63,
          },
          PP1: {
            feature: 'normal',
            pp: 35,
            name: '抓',
            harm: 8,
            mz: 100,
          },
          PP2: {
            feature: 'fire',
            pp: 25,
            name: '火花',
            harm: 8,
            mz: 100,
          },
          PP3: {
            feature: 'fire',
            pp: 15,
            name: '火焰牙',
            harm: 13,
            mz: 95,
          },
          PP4: {
            feature: 'normal',
            pp: 20,
            name: '劈开',
            harm: 14,
            mz: 100,
          },
          LV: 50,
        },
        4: {
          name: '杰尼龟',
          src: squirtle,
          ability: {
            HP: 104,
            At: 47,
            Df: 63,
            Sa: 49,
            Sd: 62,
            Speed: 43,
          },
          feature: 'water',
          PP1: {
            pp: 25,
            feature: 'water',
            name: '水枪',
            harm: 8,
            mz: 100,
          },
          PP2: {
            pp: 35,
            feature: 'normal',
            name: '撞击',
            harm: 8,
            mz: 100,
          },
          PP3: {
            pp: 40,
            feature: 'normal',
            name: '高速旋转',
            harm: 10,
            mz: 100,
          },
          PP4: {
            pp: 20,
            feature: 'water',
            name: '水之波动',
            harm: 12,
            mz: 100,
          },
          LV: 50,
        },
      }
    }
  
    firstCalculate(p1, p2) {  //判断先手
      if (p1.ability.Speed >= p2.ability.Speed) return 1;
      return 2;
    }
    
    chooseMonster(name,ply){  //同一个功能函数分开写并调用两次，是为了确保数据及时更新
      this.chooseMoreMonster(name, ply);
      this.chooseMoreMonster(name, ply);
    }
  
    chooseMoreMonster(name, ply) {    //重选怪兽？
      this.clear1();
      if (ply === 1) {  //给玩家1选择怪兽
        this.setState({
          Player1: this.monster[+name],   //+name将name转化成数字，用数字标记怪兽
        });
        let ply2=this.state.Player2;
        let ply1=this.monster[+name];
        if (ply1 && ply2) {
          let fir = this.firstCalculate(ply1, ply2);
    
          this.setState({
            Bugrp: ply1.name + '  ' + ply2.name,
          })
          if (fir === 1) {
            this.setState(
              {
                oneIsNext: true,
              }
            )
          }
          else {
            this.setState(
              {
                oneIsNext: false,
              }
            )
          }
        }
      } else {  //给玩家2选择怪兽
        this.setState({ Player2: this.monster[(+name)], });
        let ply2=this.monster[+name];
        let ply1=this.state.Player1;
        if (ply1 && ply2) {
          let fir = this.firstCalculate(ply1, ply2);
    
          this.setState({
            Bugrp: ply1.name + '  ' + ply2.name,
          })
          if (fir === 1) {  //先手判断
            this.setState(
              {
                oneIsNext: true,
              }
            )
          }
          else {
            this.setState(
              {
                oneIsNext: false,
              }
            )
          }
        }
      }
    }
  
  
    render() {  //渲染函数
      let ply1 = this.state.Player1;
      let ply2 = this.state.Player2;
      let his = this.state.history;
      let ginfo;    //VS信息
      let Next;   //下一步提示或者获胜提示
      let status;
      let info1;
      let info2;
      let srcone = "";
      let srctwo;
      let name1 = "";
      let name2;
      let Win = this.state.winner;
      if (ply1) {
        if (ply2) {
          if (Win) {    //出现胜利者
            status = "Well Battle!";
            ginfo = ply1.name + "   VS   " + ply2.name;
            info1 =ply1.name + " HP:" + ply1.ability.HP + " LV:" + ply1.LV;
            info2 =ply2.name + " HP:" + ply2.ability.HP + " LV:" + ply2.LV;
            srcone = ply1.src;
            srctwo = ply2.src;
            name1 = ply1.name;
            name2 = ply2.name;
            Next = Win.name + '取得了胜利！';
          } else {    //无胜利者
            status = "Welcome to Pokemon Battle!";
            ginfo = ply1.name + "   VS   " + ply2.name;
            info1 = ply1.name + " HP:" + ply1.ability.HP + " LV:" + ply1.LV;
            info2 = ply2.name + " HP:" + ply2.ability.HP + " LV:" + ply2.LV;
            srcone = ply1.src;
            srctwo = ply2.src;
            name1 = ply1.name;
            name2 = ply2.name;
            Next = this.state.oneIsNext ? '轮到' + ply1.name + '行动' : '轮到' + ply2.name + '行动';
          }
        } else {    //ply2还没选择怪兽
          ginfo = ply1.name + "   VS   ??";
          info1 = ply1.name + " HP:" + ply1.ability.HP + " LV:" + ply1.LV;
          srcone = ply1.src;
          name1 = ply1.name;
          status = "Choose Your Pokemon!";
        }
      } else {    //ply1还没选择怪兽
        if (ply2) {
          ginfo = "??   VS   " + ply2.name;   //标题信息栏
          info2 = ply2.name + " HP:" + ply2.ability.HP + " LV:" + ply2.LV;    //ply2信息栏
          srctwo = ply2.src;
          name2 = ply2.name;
          status = "Choose Your Pokemon!";
        } else {
          status = "Choose Your Pokemon!";
        }
      }
  
      return (  //渲染界面
        <div className="Game">
          <header className="heading">
            <p className="P1">{status}</p>
            <div className="Choice">
              <p className="FP">For Player1</p>
              <table>
                <thead>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(1, 1)}>皮卡丘</button>
                    </th>
                    <th>
                      <img src={Pikachu} alt="Pikachu"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(2, 1)}>妙蛙种子</button>
                    </th>
                    <th>
                      <img src={Bulbasaur} alt="Bulbasaur"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(3, 1)}>小火龙</button>
                    </th>
                    <th>
                      <img src={Charmander} alt="Charmander"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(4, 1)}>杰尼龟</button>
                    </th>
                    <th>
                      <img src={Squirtle} alt="Squirtle"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(Math.floor(Math.random() * 4 + 1), 1)}>随机</button>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="Choice">
              <p className="FP">For Player2</p>
              <table>
                <thead>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(1, 2)}>皮卡丘</button>
                    </th>
                    <th>
                      <img src={Pikachu} alt="Pikachu"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(2, 2)}>妙蛙种子</button>
                    </th>
                    <th>
                      <img src={Bulbasaur} alt="Bulbasaur"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(3, 2)}>小火龙</button>
                    </th>
                    <th>
                      <img src={Charmander} alt="Charmander"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(4, 2)}>杰尼龟</button>
                    </th>
                    <th>
                      <img src={Squirtle} alt="Squirtle"></img>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <button onClick={() => this.chooseMonster(Math.floor(Math.random() * 4 + 1), 2)}>随机</button>
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </header>
          <div className="battle">
            <div className="Monster">
              <div className="HP">
                {info1}
              </div>
              <div>
                <img src={srcone} alt={name1} className="Mon"></img>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 1,
                          ply: 1,
                        }}  //注意这里没有用bind绑定this,但是利用了箭头函数绑定了this,但需要额外的渲染浪费性能
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)} 
                      /></th>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 2,
                          ply: 1,
                        }}
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)}
                      /></th>
                    </tr>
                    <tr>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 3,
                          ply: 1,
                        }}
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)}
                      /></th>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 4,
                          ply: 1,
                        }}
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)}
                      /></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div className="Monster">
              <div className="HP">
                {info2}
              </div>
              <div>
                <img src={srctwo} alt={name2} className="Mon"></img>
              </div>
              <div>
                <table>   
                  <thead>
                    <tr>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 1,
                          ply: 2,
                        }}
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)}
                      /></th>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 2,
                          ply: 2,
                        }}
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)}
                      /></th>
                    </tr>
                    <tr>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 3,
                          ply: 2,
                        }}
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)}
                      /></th>
                      <th><PP
                        player1={ply1}
                        player2={ply2}
                        num={{
                          ord: 4,
                          ply: 2,
                        }}
                        onClick={(lo1, lo2, lo3, lo4) => this.attack(lo1, lo2, lo3, lo4)}
                      /></th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div className="game-info">
              <p className="Vs">{ginfo}</p>
              <p className="Vs1">{Next}</p>
              <ul>
                {his}
              </ul>
            </div>
          </div>
        </div>
      )
    }
  }
  