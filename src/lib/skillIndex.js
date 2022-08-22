import { random } from "lodash";
import { randomCheck } from "./randomCheck"
import { checkCritical } from "./checkCritical";

export var skillIndex={
    'Mimic':{
      name:'模仿',
      en_name:'Mimic',
      priority: 0,
      special:{
        Type: 'mimic',
        self:{
          number:0,
        },
        opposite:{
          number:0,
        },
      },
      PP:5,
      harm: '--',
      feature: 'normal',
      type: 'changing',
      hit_rate: 100,   //命中率
      critical_hit:0,  //要害命中等级
      lastHarm:null,
    },

    '？？？':{
      name:'？？？',
      PP:0,
      harm:0,
      feature: '？？？',
      type: '？？？',
      hit_rate: '?',   //命中率
    },

    'Belly Drum':{
      name:'腹鼓',
      en_name:'Belly Drum',
      priority: 0,
      special:{
        Type: 'changing',
        self:{
          number:1,
          1:{
            type:'bellyDrum',
            check(monsterA){
              if(monsterA.ability.nowHP>monsterA.ability.maxHP/2){
                this.discription='失去了一半HP，但攻击力提升到最高了';
                return true;
              }
              else{
                this.discription='没能成功';
                return false;
              }
            },
            change(monsterA){
              monsterA.ability.nowHP=Math.floor(monsterA.ability.nowHP-(monsterA.ability.maxHP/2));   //有可能直接归零哟
              monsterA.ability.states.attribute.At=6;
            },
            discription:'失去了一半HP，但攻击力提升到最高了',
          },
        },
        opposite:{
          number:0,
        },
      },
      PP:5,
      harm: '--',
      feature: 'normal',
      type: 'changing',
      hit_rate: 100,   //命中率
      critical_hit:0,  //要害命中等级
    },

    'Flare Blitz':{
      name:'闪焰冲锋',
      en_name:'Flare Blitz',
      priority: 0,
      special:{
        Type: 'single_attack',
        self:{
          number:1,
          1:{
            type:'reboundHarm',  //反弹伤害
            change(monsterA){
              let hp=monsterA.ability.nowHP;
              let harm=monsterA.lastHarm;
              monsterA.ability.nowHP=(1>(hp-(harm*0.33)))?1:(hp-(harm*0.33));
            },
            discription:'自己也受到了反弹伤害',
          },
        },
        opposite:{
          number:1,
          1:{
            discription:'被灼伤了',
            type:'rate',
            change(monsterA){
              if(monsterA.ability.states.abnormal.burn.checks===true){
                this.discription='';
                return;
              }
              if(randomCheck(20)){
                this.discription='被灼伤了';
                monsterA.ability.states.abnormal.burn.checks=true;
                monsterA.ability.states.abnormal.burn.duration=3;
              } else {
                this.discription='';
              }
            },
          },
        },
      },
      PP:5,
      harm: 120,
      feature: 'fire',
      type: 'physic',
      hit_rate: 100,   //命中率
      critical_hit:0,  //要害命中等级
      lastHarm:null,
    },

    'Dragon Claw':{
      name:'龙爪',
      en_name:'Dragon Claw',
      priority: 0,
      special:{
        Type: 'single_attack',   //多重攻击
        self:{    //对对方效果
          number:0,
        },
        opposite:{   //对本方效果
          number:0,
        },
      },
      PP:10,
      harm: 80,
      feature: 'dragon',
      type: 'physic',
      hit_rate: 100,   //命中率
      critical_hit:0,  //要害命中等级
    },

    'Swords Dance':{
      name:'剑舞',
      en_name:'Swords Dance',
      priority: 0,
      special:{
        Type: 'changing',   //多重攻击
        self:{    //对本方效果
          number:1,
          1:{
            discription:'的攻击大幅度提高了',
            type:'absolute',
            change(monsterA){
              if(monsterA.ability.states.attribute.At===6){
                this.discription='的攻击已经无法再提高了';
              }
              else{
                monsterA.ability.states.attribute.At+=2;
                if(monsterA.ability.states.attribute.At>6) monsterA.ability.states.attribute.At=6;
                this.discription='的攻击大幅度提高了';
              }
            },
          },
        },
        opposite:{   //对对方效果
          number:0,
        },
      },
      PP:20,
      harm:'--',
      feature: 'normal',
      type: 'changing',
      hit_rate: 100,   //命中率
      critical_hit:0,  //要害命中等级
    },

    'Golden Shuriken':{
      name:'黄金手里剑',
      en_name:'Golden Shuriken',
      priority: 1,
      special:{
        Type: 'multiple_attack',   //多重攻击
        self:{    //对对方效果
          number:0,
        },
        opposite:{   //对本方效果
          number:0,
        },
        count:0,   //存储攻击结果
        res:3,
        getRes(){   //获得攻击结果
          this.res=3;
        },
      },
      PP:20,
      harm: 20,
      feature: 'water',
      type: 'magic',
      hit_rate: 100,   //命中率
      critical_hit:0,  //要害命中等级
    },

    'Water Shuriken':{
      name:'飞水手里剑',
      en_name:'Water Shuriken',
      priority: 1,
      special:{
        Type: 'multiple_attack',   //多重攻击
        self:{    //对对方效果
          number:0,
        },
        opposite:{   //对本方效果
          number:0,
        },
        count:null,
        res:1,
        getRes(){
          let a=Math.floor(Math.random()*100+1);
          if(a>83){
            this.res=5;
            return ;
          }
          if(a>66){
            this.res=4;
            return ;
          }
          if(a>33){
            this.res=3;
            return ;
          }
          this.res=2;
          return ;
        },
      },
      PP:20,
      harm: 15,
      feature: 'water',
      type: 'magic',
      hit_rate: 100,   //命中率
      critical_hit:0,  //要害命中等级
    },

    'Struggle':{
      name:'挣扎',
      en_name:'Struggle',
      priority:7,
      special:{
        Type: 'struggle',
        self:{
          number:0,
        },
        opposite:{
          number:0,
        },
      },
      feature:'?',
      PP: '?',
      harm: '?',
      hit_rate: 1000,
    },

    'Hydro Pump':{
      name: '水炮',
      en_name:'Hydro Pump',
      priority: 0,
      special:{
        Type: 'single_attack',   //单次攻击
        self:{
          number:0,
        },
        opposite:{
          number:0,
        },
      },
      PP: 5,
      harm: 110,
      feature: 'water',
      type: 'magic',
      hit_rate: 85,
      critical_hit: 0,  
    },

    'Double Team':{
      name: '影分身',
      en_name:'Double Team',
      priority: 0,
      special:{
        Type: 'changing', //变化类
        self:{
          number:1,
          1:{
            discription:'的闪避提高了',
            type:'absolute', //属性变化
            change(monsterA){
              monsterA.ability.states.attribute.Ms+=2;
              if(monsterA.ability.states.attribute.Ms>6){
                monsterA.ability.states.attribute.Ms=6;
                this.discription='的闪避已经无法再提高了'
              } else {
                this.discription='的闪避提高了';
              }
            },
          },
        },
        opposite:{
          number:0,
        },
      },
      PP: 15,
      harm: '--',   //无威力
      feature: 'normal',   
      type: 'changing',
      hit_rate: 100,
      critical_hit: null,
    },

    'Night Slash':{
      name:'暗袭要害',
      en_name:'Night Slash',
      priority: 0,
      special:{
        Type:'single_attack',
            self:{
              number:0,
            },
            opposite:{
              number:0,
            },
      },
      PP: 15,
      harm: 70,
      feature: 'dark',
      type: 'physic',
      hit_rate: 100,
      critical_hit: 1,
    },

    'Haze':{
      name:'黑雾',
      en_name:'Haze',
      priority: 0,
      special:{
        Type:'changing',
        self:{
          number:1,
          1:{
            discription:'的属性复原了',
            type:'absolute',  //强制改变等级
            change(monsterA){
              monsterA.ability.states.attribute={
                HP: 0,
                At: 0,
                Df: 0,
                Sa: 0,
                Sd: 0,
                Sp: 0,
                Ht: 0,
                Ms: 0,
                Cr: 0,
              };
            },
          },
        },
        opposite:{
          number:1,
          1:{
            discription:'的属性复原了',
            type:'absolute',  //强制改变等级
            change(monsterA){
              monsterA.ability.states.attribute={
                HP: 0,
                At: 0,
                Df: 0,
                Sa: 0,
                Sd: 0,
                Sp: 0,
                Ht: 0,
                Ms: 0,
                Cr: 0,
              };
            },
          },
        },
      },
      PP: 30,
      harm: '--',
      feature: 'ice',
      type: 'changing',
      hit_rate: 100,
      critical_hit: null,
    },

    'Role Play':{
      name:'扮演',
      en_name:'Role Play',
      priority: 0,
      special:{
        Type:'changing',
            self:{	//对自己的效果
              number:1,
              1:{
                discription:'获得了对方的特性',
                type:'switch',  //属性交换
                change(monsterA,monsterB){
                  let ch1=monsterA.characteristic;
                  let ch2=monsterB.characteristic;
                  if(ch1.en_name==='Battle Bond')
                    this.discription='无法获得对方的特性';
                  else{
                    monsterA.characteristic=ch2;
                    this.discription='获得了对方的特性';
                  }
                }
              },
            },
            opposite:{	//对敌方的效果
              number:0,
            },
      },
      PP: 10,
      harm: '--',
      feature: 'psychic',	//技能属性
      type: 'changing',	//技能类型：physic(物理) || magic(特殊) || chaging(变化)
      hit_rate: 100,	//命中率
      critical_hit: null,	//要害命中等级加成
    },

    'Mat Block':{
      name:'掀榻榻米',
      en_name:'Mat Block',
      priority: 0,
      special:{
        Type:'changing',
            self:{	//对自己的效果
              number:1,
              1:{
                discription:'进入了守住状态',
                type:'matBlock',
                check(num){   //检查回合数是否满足
                  // console.log('inside:'+num);
                  if(num===1){
                    this.discription='进入了守住状态';
                    return true;
                  }
                  else{
                    this.discription='想要守住，但是失败了';
                    return false;
                  } 
                },
                change(monsterA){
                  // console.log(monsterA);
                  monsterA.ability.states.abnormal.block.checks=true;
                  monsterA.ability.states.abnormal.block.duration=1;
                },
              },
            },
            opposite:{	//对敌方的效果
              number:0,
            },
      },
      PP: 10,
      harm: '--',
      feature: 'fighting',	//技能属性
      type: 'changing',	//技能类型：physic(物理) || magic(特殊) || chaging(变化)
      hit_rate: 100,	//命中率
      critical_hit: null,	//要害命中等级加成
    },

    'Pound':{
      name:'拍击',
      en_name:'Pound',
      priority: 0,
      special:{
        Type:'single_attack',
            self:{	//对自己的效果
              number:0,
            },
            opposite:{	//对敌方的效果
              number:0,
            },
      },
      PP: 35,
      harm: 40,
      feature: 'normal',	//技能属性
      type: 'physic',	//技能类型：physic(物理) || magic(特殊) || chaging(变化)
      hit_rate: 100,	//命中率
      critical_hit: 0,	//要害命中等级加成
    },

    'Growl':{
      name:'叫声',
      en_name:'Growl',
      priority: 0,
      special:{
        Type:'changing',
            self:{	//对自己的效果
              number:0,
            },
            opposite:{	//对敌方的效果
              number:1,
              1:{
                discription:'的攻击力下降了',
                type:'absolute',  //必定触发
                change(monsterA){
                  monsterA.ability.states.attribute.At-=1;
                  if(monsterA.ability.states.attribute.At<-6){
                    monsterA.ability.states.attribute.At=-6;
                    this.discription='的攻击力已经无法再下降了';
                  } else {
                    this.discription='的攻击力下降了';
                  }
                }
              },
            },
      },
      PP: 40,
      harm: '--',
      feature: 'normal',	//技能属性
      type: 'changing',	//技能类型：physic(物理) || magic(特殊) || chaging(变化)
      hit_rate: 100,	//命中率
      critical_hit: null,	//要害命中等级加成
    },

    'Bubble':{
      name:'泡沫',
      en_name:'Bubble',
      priority: 0,
      special:{
        Type:'single_attack',
            self:{	//对自己的效果
              number:0,
            },
            opposite:{	//对敌方的效果
              number:0,
            },
            detail:{},
      },
      PP: 25,
      harm: 40,
      feature: 'water',	//技能属性
      type: 'magic',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
      hit_rate: 100,	//命中率
      critical_hit: 0,	//要害命中等级加成
    },

    'Quick Attack':{
      name:'电光一闪',
      en_name:'Quick Attack',
      priority: 1,
      special:{
        Type:'single_attack',
            self:{	//对自己的效果
              number:0,
            },
            opposite:{	//对敌方的效果
              number:0,
            },
            detail:{},
      },
      PP: 20,
      harm: 40,
      feature: 'normal',	//技能属性
      type: 'physic',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
      hit_rate: 100,	//命中率
      critical_hit: 0,	//要害命中等级加成
    },

    'Lick':{
      name:'舌舔',
      en_name:'Lick',
      priority: 0,
      special:{
        Type:'single_attack',
            self:{	//对自己的效果
              number:0,
            },
            opposite:{	//对敌方的效果
              number:1,
              1:{
                type:'rate',
                discription:'被麻痹了',
                change(monsterA){
                  if(monsterA.ability.states.abnormal.paralysis.checks===true){
                    this.discription='';
                    return;
                  }
                  if(randomCheck(30)){
                    monsterA.ability.states.abnormal.paralysis.checks=true;
                    monsterA.ability.states.abnormal.paralysis.duration=-1;
                    this.discription='被麻痹了';
                  } else {
                    this.discription='';
                  }
                }
              },
            },
      },
      PP: 30,
      harm: 30,
      feature: 'ghost',	//技能属性
      type: 'physic',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
      hit_rate: 100,	//命中率
      critical_hit: 0,	//要害命中等级加成
    },
    
    'Smokescreen':{
        name:'烟幕',
        en_name:'Smokescreen',
        priority: 0,	//优先级
        special:{
            Type:'changing',
            self:{	//对自己的效果
                number:0,
            },
            opposite:{	//对敌方的效果
                number:1,
                1:{
                    type:'absolute',
                    change(monsterA){
                      monsterA.ability.states.attribute.Ht-=1;
                      if(monsterA.ability.states.attribute.Ht<-6){
                        monsterA.ability.states.attribute.Ht=-6;
                        this.discription='的命中已经无法再降低了';
                      } else {
                        this.discription='的命中下降了';
                      }
                    },
                    discription:'的命中下降了',
                },
            },
        },
        PP: 20,
        harm: '--',
        feature: 'normal',	//技能属性
        type: 'changing',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
        hit_rate: 100,	//命中率
        critical_hit: null,	//要害命中等级加成
    },

    // 'Spikes':{
    //     name:'撒菱',
    //     priority: 0,	//优先级
    //     special:{
    //         Type: 'changing',
    //         self:{	//对自己的效果
    //             number:0,
    //         },
    //         opposite:{	//对敌方的效果
    //             number:1,
    //             1:{
    //                 discription:'身边充满了地菱',
    //                 type:'public',
    //                 range:'all',
    //                 change(monsterA){
    //                   if(monsterA.ability.state.attribute.abnormal.spikes.checks===true){
    //                     this.discription='身边满是地菱';
    //                   }
    //                   monsterA.ability.state.attribute.abnormal.spikes.checks=true;
    //                   monsterA.ability.state.attribute.abnormal.spikes.duration=3;
    //                 },
    //             },
    //         },
    //     },
    //     PP: 20,
    //     harm: 40,
    //     feature: 'ground',	//技能属性
    //     type: 'physic',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
    //     hit_rate: 100,	//命中率
    //     critical_hit: 0,	//要害命中等级加成
    // },

    'Shadow Sneak':{
        name:'影子偷袭',
        en_name:'Shadow Sneak',
        priority: 1,	//优先级
        special:{
            Type:'single_attack',
            self:{	//对自己的效果
                number:0,
            },
            opposite:{	//对敌方的效果
                number:0,
            },
            detail:{},
        },
        PP: 20,
        harm: 40,
        feature: 'ghost',	//技能属性
        type: 'physic',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
        hit_rate: 100,	//命中率
        critical_hit: 0,	//要害命中等级加成
    },

    // 'Feint Attack':{
    //     name:'出奇一击',
    //     priority: 0,	//优先级
    //     special:{
    //         Type:'single_attack',
    //         self:{	//对自己的效果
    //             number:0,
    //         },
    //         opposite:{	//对敌方的效果
    //             number:0,
    //         },
    //     },
    //     PP: 20,
    //     harm: 60,
    //     feature: 'dark',	//技能属性
    //     type: 'physic',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
    //     hit_rate: 1000,	//命中率
    //     critical_hit: 0,	//要害命中等级加成
    // },

    'Extrasensory':{
        name:'神通力',
        en_name:'Extrasensory',
        priority: 0,	//优先级
        special:{
            Type:'single_attack',
            self:{	//对自己的效果
                number:0,
            },
            opposite:{	//对敌方的效果
                number:1,
                1:{
                    discription:'畏缩了',
                    type:'rate',  //概率触发
                    change(monsterA){
                      if(randomCheck(10)){
                        monsterA.ability.states.abnormal.flinch.checks=true;
                        monsterA.ability.states.abnormal.flinch.duration=1;
                      }
                    },
                },
            },
        },
        PP: 15,
        harm: 70,
        feature: 'psychic',	//技能属性
        type: 'magic',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
        hit_rate: 100,	//命中率
        critical_hit: 0,	//要害命中等级加成
    },

    // 'Substitute':{
    //     name:'替身',
    //     priority: 0,	//优先级
    //     special:{
    //         Type:'changing',
    //         self:{	//对自己的效果
    //             number:1,
    //             1:{
    //                 type:'substitute',
    //             },
    //         },
    //         opposite:{	//对敌方的效果
    //             number:0,
    //         },
    //     },
    //     PP: 10,
    //     harm: '--',
    //     feature: 'normal',	//技能属性
    //     type: 'changing',	//技能类型：physic(物理) || magic(特殊) || changing(变化)
    //     hit_rate: 100,	//命中率
    //     critical_hit: null,	//要害命中等级加成
    // },

    'Water Pulse':{
      name:'水之波动',
      en_name:'Water Pulse',
      priority: 0,	//优先级
      special:{
          Type:'single_attack',
          self:{	//对自己的效果
              number:0,
          },
          opposite:{	//对敌方的效果
              number:0,
          },
      },
      PP: 20,
      harm: 60,
      feature: 'water',
      type: 'magic',	
      hit_rate: 1000,	//必定命中
      critical_hit: 0,	
  },
};
  