import { randomCheck } from "./randomCheck";
import greninja from '../greninja-ash.png';
import charizard from '../Charizard-Mega_X.png';
import _ from "lodash";

export var monsterStates={	//状态机
  attribute:{		//属性
    HP: 0,
    At: 0,
    Df: 0,
    Sa: 0,
    Sd: 0,
    Sp: 0,
    Ht: 0,
    Ms: 0,  //闪避等级
    Cr: 0,  //命中要害几率
  },
  abnormal:{
    isOK:{
      discount(){
        this.checks=true;
      },
      checks:true,
      discriptionBefore:{
        number:0,
      },
      discriptionAfter:{
        number:0,
      },
    },
    flinch:{
      checks:false,
      duration:0,
      discount(){
        if(this.duration===-1 || this.duration===0) return;
        this.duration-=1;
        if(this.duration===0) this.checks=false;
      },
    },
    burn:{
      checks:false,
      duration:0,
      discount(){   //检查状态是否结束
        if(this.duration===-1 || this.duration===0) return;
        this.duration-=1;
        if(this.duration===0) this.checks=true;
      }
    },
    block:{	  //守住状态
      duration:0,
      discount(){
        if(this.duration===0 || this.duration===-1) return;
        this.duration-=1;
        if(this.duration===0)
          this.checks=false;
      },
      checks:false,
    },
    paralysis:{
      checks:false,
      duration:0,
      judge(){   //判定能否行动
        return randomCheck(25);
      },
      discount(){
        if(this.duration===-1 || this.duration===0) return;
        this.duration-=1;
        if(this.duration===0) this.checks=true;
      }
    },
  },
}

export function initialMonster(monster,name){
  var monsterA=_.cloneDeep(monsterIndex[name]);
  monsterA.ability.states=_.cloneDeep(monsterStates);
  monster=monsterA;
  return ;
}

export var monsterIndex={
    ['658']:{
      LV: 90,
      ord:658,
      name: '甲贺忍蛙',
      name_en: 'Greninja',
      src: greninja,
      characteristic:{},  //特性
      feature:{
        water:'water',
        dark:'dark',
      },
      ability: {
        maxHP: 331,
        aniHP:331,  //用于血量动画制作
        nowHP: 331,
        At: 214,
        nowAt: 214,
        Df: 161,
        nowDf: 161,
        Sa: 290,
        nowSa: 290,
        Sd: 169,
        nowSd: 169,
        Sp: 267,
        nowSp: 267,
        Ht: 100,  //一伯命中率
        states:_.cloneDeep(monsterStates),
      },
      PP:{
        1:null,
        2:null,
        3:null,
        4:null,
      },
      round:0,    //在场回合数
      lastSkill:null,
    },
    ['006']:{
      LV: 100,
      ord:6,
      name: '喷火龙X',
      name_en: 'CharizardX',
      src: charizard,
      characteristic:{},  //特性
      feature:{
        fire:'fire',
        fly:'fly',
      },
      ability: {
        maxHP: 360,
        aniHP:360,
        nowHP:360,
        At: 359,
        nowAt: 359,
        Df: 258,
        nowDf: 258,
        Sa: 296,
        nowSa:296,
        Sd: 206,
        nowSd:206,
        Sp: 237,
        nowSp:237,
        Ht: 100,  //一伯命中率
        states:_.cloneDeep(monsterStates),
      },
      PP:{
        1:null,
        2:null,
        3:null,
        4:null,
      },
      round:0,
      lastSkill:null,
    },
  };