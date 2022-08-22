import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { checkAfter } from './lib/check';
import { tips } from './lib/tips';
import { randomSkill } from './lib/skillList';

import { randomCheck } from './lib/randomCheck';
import { skillIndex } from './lib/skillIndex';
import { monsterIndex } from './lib/monsterIndex';
import { characteristicIndex } from './lib/characteristicIndex';
import { skillList } from './lib/skillList';
import { multipleAttack,changingSkill, getCPU, singleAttack } from './lib/monsterBattleCheck';
import { checkFirst } from './lib/check';
import { timeOut } from './lib/timeOut';

import { Battle } from './lib/Battle';
import { Ending } from './lib/Ending';
import { Choose } from './lib/Choose';
import _ from 'lodash';
import { checkBegin } from './lib/check';
import { msgAdd } from './lib/monsterBattleCheck';
import { disableReactDevTools } from './lib/disableReactDevTools';

if(process.env.NODE_ENV === 'production'){
  disableReactDevTools();
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state={
      pokemon:null,
      P1:'为你的甲贺忍蛙选择技能!',
      isGolden:false,
      goldenNum:null,
      Cb:false,
      Ab:false,
      history:{
        number:0,
        logs:[],
      },
      message:'',
      round:1,
      tic:0,
      animation:false,
      player:{
        monster:{
          state:{
            inBattle:1,
          },
          skillNumber:0,
          skillList:_.cloneDeep(skillList[658]),
          1:_.cloneDeep(monsterIndex['658']),  //复制一份甲贺忍蛙
        }
      },
      CPU:{
        monster:{
          state:{
            inBattle:1,
          },
          1:_.cloneDeep(monsterIndex['006']), 
        },
      },
    };

    this.state.CPU.monster[1].PP={
      0:_.cloneDeep(skillIndex['Struggle']),
      1:_.cloneDeep(skillIndex['Flare Blitz']),
      2:_.cloneDeep(skillIndex['Dragon Claw']),
      3:_.cloneDeep(skillIndex['Swords Dance']),
      4:_.cloneDeep(skillIndex['Growl']),
      5:_.cloneDeep(skillIndex['Smokescreen']),
      6:_.cloneDeep(skillIndex['Mimic']),
    };
    this.state.CPU.monster[1].characteristic=_.cloneDeep(characteristicIndex['Water Absorb']);

    this.state.player.monster[1].characteristic=_.cloneDeep(characteristicIndex['Battle Bond']);

    this.state.player.monster[1].PP={
      1:_.cloneDeep(skillIndex['？？？']),
      2:_.cloneDeep(skillIndex['？？？']),
      3:_.cloneDeep(skillIndex['？？？']),
      4:_.cloneDeep(skillIndex['？？？']),
    };

    this.handleSkill=this.handleSkill.bind(this);
    this.getRound=this.getRound.bind(this);
    this.messageOut=this.messageOut.bind(this);
    this.godSkill=this.godSkill.bind(this);
    this.handlePage=this.handlePage.bind(this);
    this.reset=this.reset.bind(this);
    this.disharm=this.disharm.bind(this);
  }

  tic(){
    this.setState({
      tic:1-this.state.tic,
    })
  }

  async handlePage(num){
    this.state.animation=true;
    this.tic();
    this.captureFlag();
    if(this.state.isGolden){
      for(let i=1;i<=4;i++){
        this.state.player.monster[1].PP[i].PP*=100;
        if(this.state.player.monster[1].PP[i].harm!=='--' && this.state.player.monster[1].PP[i].harm!=='?')
          this.state.player.monster[1].PP[i].harm*=10;
      }
    }
    this.props.handlePage(num);
    await this.checkStr();
    
    let msg='请选择技能...';
    await this.messageOut(msg);
    this.state.animation=false;
    this.tic();
    return;
  }

  changingSkill;

  async reset(num){
    this.animation=true;
    this.messageClear();
    this.tic();
    let msg='请稍等，正在为宝可梦恢复精力...'
    await this.messageOut(msg);
    await timeOut(500);

    this.setState({
      pokemon:null,
      P1:'为你的甲贺忍蛙选择技能!',
      isGolden:false,
      goldenNum:num,
      Cb:false,
      Ab:false,
      history:{
        number:0,
        logs:[],
      },
      message:'',
      round:1,
      tic:0,
      animation:true,
      player:{
        monster:{
          state:{
            inBattle:1,
          },
          skillNumber:0,
          skillList:_.cloneDeep(skillList[658]),
          1:_.cloneDeep(monsterIndex['658']),  //复制一份甲贺忍蛙
        }
      },
      CPU:{
        monster:{
          state:{
            inBattle:1,
          },
          1:_.cloneDeep(monsterIndex['006']), 
        },
      },
    })

    
    this.state.player.monster[1].PP={
      1:_.cloneDeep(skillIndex['？？？']),
      2:_.cloneDeep(skillIndex['？？？']),
      3:_.cloneDeep(skillIndex['？？？']),
      4:_.cloneDeep(skillIndex['？？？']),
    };


    this.state.CPU.monster[1].PP={
      0:_.cloneDeep(skillIndex['Belly Drum']),
      1:_.cloneDeep(skillIndex['Flare Blitz']),
      2:_.cloneDeep(skillIndex['Dragon Claw']),
      3:_.cloneDeep(skillIndex['Swords Dance']),
      4:_.cloneDeep(skillIndex['Growl']),
      5:_.cloneDeep(skillIndex['Smokescreen']),
      6:_.cloneDeep(skillIndex['Mimic']),
    };
    this.state.CPU.monster[1].characteristic=_.cloneDeep(characteristicIndex['Water Absorb']);
    this.state.player.monster[1].characteristic=_.cloneDeep(characteristicIndex['Battle Bond']);
    if(num>1){
      this.state.isGolden=true;
      this.state.P1='金手指已开启~蛙蛙的技能极大提升！';
    }

    this.props.handlePage(1);
    this.tic();
    return ;
  }

  async HPAnimation(monsterA){
    let nowHP=monsterA.ability.nowHP;
    let aniHP=monsterA.ability.aniHP;
    
    let promise=await new Promise(resolve => {
      let interNum=(aniHP-nowHP)/20;
      let id=setInterval(
        ()=>{
          monsterA.ability.aniHP-=interNum;
          this.tic();
        },
        50
      )
      setTimeout(()=>clearInterval(id),950);
      setTimeout(()=>{
        monsterA.ability.aniHP=nowHP;
        this.tic();
        resolve('OKOK');
      },1000);
    })

    return ;
  }

  messageClear(){
    if(this.state.message!==''){
      this.state.history.logs.push(this.state.message);
      this.state.history.number+=1;
    }
    this.state.message="";
    return ;
  }

  async disharm(){
    this.state.animation=true;
    this.messageClear();
    await this.messageOut(this.state.pokemon);
    return;
  }

  async getOut(){
    if(this.state.Cb){
      await timeOut(500);
      this.messageClear();
      let msg='Good Job！You\'re a Pokemon Master now!';
      await this.messageOut(msg);
      this.state.animation=false;
      this.tic();
    } else {
      if(this.state.isGolden){
        await timeOut(500);
        this.messageClear();
        let msg='开了金手指都打不过，好菜哦~';
        await this.messageOut(msg);
        this.state.animation=false;
        this.tic();
      } else {
        await timeOut(500);
        this.messageClear();
        let msg='对面开挂怎么打得过嘛！不公平！重赛！';
        await this.messageOut(msg);
        this.state.animation=false;
        this.tic();
      }
    }
  }

  async checkStr(){
    let PP=this.state.player.monster[1].PP;
    if(PP[1].PP===0 && PP[2].PP===0 && PP[3].PP===0 && PP[4].PP===0){
      PP[1]=_.cloneDeep(skillIndex['Struggle']);

      await timeOut(500);
      this.messageClear();
      let msg='甲贺忍蛙已经无计可施了！他只能使用\'挣扎\'！';
      await this.messageOut(msg);
      await timeOut(500);
    }
    return ;
  }

  async messageOut(msg){
    let promise=await new Promise(resolve => {
      let time_1=msg?.length;
      let c=0;
      let id=setInterval(
        ()=>{
          this.state.message=this.state.message+msg[c];
          c++;
          this.tic();
        },
        50
      )
      setTimeout(()=>{clearInterval(id);resolve('ok')},50*time_1+10);
    })
    return ;
  }

  captureFlag(){
    // console.log('captureFlagnow!');
    let Pokemon={
      Th:_.cloneDeep(skillIndex['Night Slash']),
      Fg:_.cloneDeep(skillIndex['Night Slash']),
      Yu:_.cloneDeep(skillIndex['Role Play']),
      Re:_.cloneDeep(skillIndex['Role Play']),
      Kmn:_.cloneDeep(skillIndex['Role Play']),
      Mstr:_.cloneDeep(skillIndex['Role Play']),
    }
    let megaTxt;
    for(let key in Pokemon){
      switch(key){
        case 'Th':{
          megaTxt=key[0]+key[1]+Pokemon[key].en_name[1]+Pokemon[key].en_name[6];
          megaTxt+='_'+Pokemon[key].en_name[1]+Pokemon[key].en_name[6];
          break;
        }
        case 'Fg':{
          megaTxt+='_'+key[0]+Pokemon[key].en_name[7]+Pokemon[key].en_name[8]+key[1]+':';
          break;
        }
        case 'Yu':{
          megaTxt+=key[0]+Pokemon[key].en_name[1]+key[1];
          break;
        }
        case 'Re':{
          megaTxt+='_'+Pokemon[key].en_name[7]+key[0]+key[1];
          break;
        }
        case 'Kmn':{
          megaTxt+='_'+Pokemon[key].en_name[5]+Pokemon[key].en_name[1]+key[0]+Pokemon[key].en_name[3]+key[1]+Pokemon[key].en_name[1]+key[2];
          break;
        }
        case 'Mstr':{
          megaTxt+='_'+key[0]+Pokemon[key].en_name[7]+key[1]+key[2]+Pokemon[key].en_name[3]+key[3];
          break;
        }
      }
    }
    this.state.pokemon=megaTxt;
    return ;
  }

  async getRound(name){

    // console.log('getRound');

    tips(this.state.round);
    if(this.state.Ab || this.state.animation) return;

    this.messageClear();
    this.state.animation=true;

    // console.log('round');
    // console.log(name);
    // console.log(this.state);

    if(this.state.player.monster[1].PP[name].PP===0){
      let msg='PP值不足!';
      await this.messageOut(msg);
      await timeOut(1000);
      this.state.history.logs.push(this.state.message);
      this.messageClear();
      let msg1='请选择技能!';
      await this.messageOut(msg1);
      await timeOut(1000);
      this.state.animation=false;
      this.tic();
      return 'noPP!';
    }

    if(typeof(this.state.player.monster[1].PP[name].PP)==='number')
      this.state.player.monster[1].PP[name].PP-=1;
    this.tic();

    let monster={
      A:this.state.player.monster[1],
      B:this.state.CPU.monster[1],
    };

    
    let name_2=getCPU(monster.B);

    checkBegin(monster.A);
    checkBegin(monster.B);

    let first={
      '0':checkFirst(monster.A,monster.B,name,name_2),
    };
    let last;
    if(first[0]==='A'){
      first[1]=name;
      last={
        '0':'B',
        '1':name_2,
      }
    }
    else{
      first[1]=name_2;
      last={
        '0':'A',
        '1':name,
      }
    }

    let typeA=monster[first[0]].PP[first[1]].special.Type;
    let death;

    if(monster[first[0]].ability.states.abnormal.isOK.checks){
      switch(typeA){
        case 'changing':{
          let _changingSkill=changingSkill.bind(this);
          death=await _changingSkill(first[1],monster[first[0]],monster[last[0]]);
          break;
        };
        case 'single_attack':{
          let _singleAttack=singleAttack.bind(this);
          death=await _singleAttack(first[1],monster[first[0]],monster[last[0]]);
          break;
        };
        case 'multiple_attack':{
          let _multipleAttack=multipleAttack.bind(this);
          death=await _multipleAttack(first[1],monster[first[0]],monster[last[0]]);
          break;
        };
        case 'mimic':{
          if(monster[last[0]].lastSkill===null){
            let msg=monster[first[0]].name+'想要使用模仿';
            await this.messageOut(msg);
            await timeOut(500);
            msg=msgAdd(this.state.message,'','但是失败了');
            await this.messageOut(msg);
            await timeOut(500);
          }else{
            let tmp=_.cloneDeep(skillIndex[monster[last[0]].lastSkill]);
            this.messageClear();
            let msg=monster[first[0]].name+'模仿了'+monster[last[0]].name+'的'+tmp.name;
            await this.messageOut(msg);
            await timeOut(1000);
            this.messageClear();
            let swc=tmp;
            tmp=monster[first[0]].PP[first[1]];
            monster[first[0]].PP[first[1]]=swc;
            switch(monster[first[0]].PP[first[1]].special.Type){
              case 'changing':{
                let _changingSkill=changingSkill.bind(this);
                death=await _changingSkill(first[1],monster[first[0]],monster[last[0]]);
                break;
              };
              case 'single_attack':{
                let _singleAttack=singleAttack.bind(this);
                death=await _singleAttack(first[1],monster[first[0]],monster[last[0]]);
                break;
              };
              case 'multiple_attack':{
                let _multipleAttack=multipleAttack.bind(this);
                death=await _multipleAttack(first[1],monster[first[0]],monster[last[0]]);
                break;
              };
            }
            monster[first[0]].PP[first[1]]=tmp;
          }
          break;
        };
        case 'struggle':{
          let msg=monster[first[0]].name+'使用了挣扎';
          await this.messageOut(msg);
          await timeOut(500);

          monster[last[0]].ability.nowHP=0;
          await this.HPAnimation(monster[last[0]]);
          await timeOut(250);
          msg=msgAdd(this.state.message,monster[last[0]].name,'被秒杀了');
          await this.messageOut(msg);
          await timeOut(1000);

          this.messageClear();
          msg=monster[last[0]].name+'失去了战斗能力';
          await this.messageOut(msg);
          await timeOut(500);
          
          death='Bdying';
        };
      };
      
      if(death==='Adying'){
        await timeOut(500);
        this.messageClear();
        let msg=monster[last[0]].name+'取得了胜利!';
        await this.messageOut(msg);
        this.setState({
          Ab:true,
        })
        if(monster[first[0]].name_en==='CharizardX'){
          this.setState({
            Cb:true,
          })
        }

        this.getOut();
  
        return;
      }
      if(death==='Bdying'){
        await timeOut(500);
        this.messageClear();
        let msg=monster[first[0]].name+'取得了胜利!';
        await this.messageOut(msg);
        this.setState({
          Ab:true,
        })
        if(monster[first[0]].name_en==='Greninja'){
          this.setState({
            Cb:true,
          })
        }

        this.getOut();
  
        return;
      }
    } else {
      this.messageClear();
      let msg=monster[first[0]].name+monster[first[0]].ability.states.abnormal.isOK.discriptionBefore[0];
      await this.messageOut(msg);
      await timeOut(500);
    }
    let _checkAfter=checkAfter.bind(this);
    let res_checkAfter=await _checkAfter(monster[first[0]]);
    if(res_checkAfter==='dying'){
      await timeOut(500);
      this.messageClear();
      let msg=monster[first[0]].name+'失去战斗能力';
      await this.messageOut(msg);
      await timeOut(1000);
      this.messageClear();
      msg=monster[last[0]].name+'赢得了战斗！';
      await this.messageOut(msg);
      this.setState({
        Ab:true,
      })
      if(monster[first[0]].name_en!=='CharizardX'){
        this.setState({
          Cb:true,
        });
      }

      this.getOut();

      return;
    }

    let typeB=monster[last[0]].PP[last[1]].special.Type;

    await timeOut(500);
    if(monster[last[0]].ability.states.abnormal.isOK.checks){
      switch(typeB){
        case 'changing':{
          let _changingSkill=changingSkill.bind(this);
          death=await _changingSkill(last[1],monster[last[0]],monster[first[0]]);
          break;
        };
        case 'single_attack':{
          let _singleAttack=singleAttack.bind(this);
          death=await _singleAttack(last[1],monster[last[0]],monster[first[0]]);
          break;
        };
        case 'multiple_attack':{
          let _multipleAttack=multipleAttack.bind(this);
          death=await _multipleAttack(last[1],monster[last[0]],monster[first[0]]);
          break;
        };
        case 'mimic':{
          if(monster[first[0]].lastSkill===null){
            await timeOut(500);
            this.messageClear();
            let msg=monster[last[0]].name+'想要使用模仿';
            await this.messageOut(msg);
            await timeOut(500);
            msg=msgAdd(this.state.message,'','但是失败了');
            await this.messageOut(msg);
            await timeOut(500);
          }else{
            let tmp=_.cloneDeep(skillIndex[monster[first[0]].lastSkill]);
            this.messageClear();
            let msg=monster[last[0]].name+'模仿了'+monster[first[0]].name+'的'+tmp.name;
            await this.messageOut(msg);
            await timeOut(1000);
            this.messageClear();
            let swc=tmp;
            tmp=monster[last[0]].PP[last[1]];
            monster[last[0]].PP[last[1]]=swc;
            switch(monster[last[0]].PP[last[1]].special.Type){
              case 'changing':{
                let _changingSkill=changingSkill.bind(this);
                death=await _changingSkill(last[1],monster[last[0]],monster[first[0]]);
                break;
              };
              case 'single_attack':{
                let _singleAttack=singleAttack.bind(this);
                death=await _singleAttack(last[1],monster[last[0]],monster[first[0]]);
                break;
              };
              case 'multiple_attack':{
                let _multipleAttack=multipleAttack.bind(this);
                death=await _multipleAttack(last[1],monster[last[0]],monster[first[0]]);
                break;
              };
            }
            monster[last[0]].PP[last[1]]=tmp;
          }
          break;
        };
        case 'struggle':{
          let msg=monster[last[0]].name+'使用了挣扎';
          await this.messageOut(msg);
          await timeOut(500);

          monster[first[0]].ability.nowHP=0;
          await this.HPAnimation(monster[first[0]]);
          await timeOut(250);
          msg=msgAdd(this.state.message,monster[first[0]].name,'被秒杀了');
          await this.messageOut(msg);
          await timeOut(1000);

          this.messageClear();
          msg=monster[first[0]].name+'失去了战斗能力。';
          await this.messageOut(msg);
          await timeOut(500);

          death='Bdying';
        };

      }
      
      if(death==='Adying'){
        await timeOut(500);
        this.messageClear();
        let msg=monster[first[0]].name+'取得了胜利!';
        await this.messageOut(msg);
        this.setState({
          Ab:true,
        })
        if(monster[last[0]].name_en==='CharizardX'){
          this.setState({
            Cb:true,
          })
        }

        this.getOut();
  
        return;
      }
      if(death==='Bdying'){
        await timeOut(500);
        this.messageClear();
        let msg=monster[last[0]].name+'取得了胜利!';
        await this.messageOut(msg);
        this.setState({
          Ab:true,
        })
        if(monster[first[0]].name_en==='CharizardX'){
          this.setState({
            Cb:true,
          })
        }

        this.getOut();
  
        return;
      }
    } else {
      await timeOut(500);
      this.messageClear();
      let msg=monster[last[0]].name+monster[last[0]].ability.states.abnormal.isOK.discriptionBefore[0];
      await this.messageOut(msg);
      await timeOut(500);
    }


    res_checkAfter=await _checkAfter(monster[last[0]]);
    this.captureFlag();
    if(res_checkAfter==='dying'){
      await timeOut(500);
      this.messageClear();
      let msg=monster[last[0]].name+'失去战斗能力。';
      await this.messageOut(msg);
      await timeOut(1000);
      this.messageClear();
      msg=monster[first[0]].name+'赢得了战斗！';
      await this.messageOut(msg);
      this.setState({
        Ab:true,
      })
      if(monster[last[0]].name_en==='CharizardX'){
        this.setState({
          Cb:true,
        });
      }

      this.getOut();

      return;
    }
    
    await this.checkStr();

    await timeOut(500);
    this.messageClear();
    let msg='请选择技能...';
    await this.messageOut(msg);

    this.state.player.monster[1].lastSkill=this.state.player.monster[1].PP[name].en_name;  //上一次使用的技能
    this.state.CPU.monster[1].lastSkill=this.state.CPU.monster[1].PP[name_2].en_name;
    
    this.state.animation=false;
    this.state.round+=1;
    this.tic();

    return;
  }
  

  async handleSkill(number,name){   //选择技能
    if(name in this.state.player.monster.skillList && name!=='Struggle'){
      if(this.state.player.monster[1].PP[number].name==='？？？')
        this.state.player.monster.skillNumber+=1;
      else
        this.state.player.monster.skillList[this.state.player.monster[1].PP[number].name_en]=false;
      this.state.player.monster.skillList[name]=true;
      this.state.player.monster[1].PP[number]=_.cloneDeep(skillIndex[name]);
      this.tic();
    }else {
      if(this.state.P1!=='蛙蛙学不会那个技能！'){
        this.state.P1='';
        let promise= await new Promise(resolve => {
          let str='蛙蛙学不会那个技能！';
          let c=0;
          let id=setInterval(()=>{
            this.state.P1=this.state.P1+str[c];
            c++;
            this.tic();
          },50)
          setTimeout(()=>{clearInterval(id);resolve('ok')},510);
        })
      }
      return;
    }
  }

  godSkill(){   //选择技能
    let PP=this.state.player.monster[1].PP;
    this.captureFlag();
    let a=Math.floor(Math.random()*16+1);
    let b=Math.floor(Math.random()*16+1);
    let c=Math.floor(Math.random()*16+1);
    let d=Math.floor(Math.random()*16+1);
    
    PP[1]=_.cloneDeep(skillIndex[randomSkill[a]]);
    PP[2]=_.cloneDeep(skillIndex[randomSkill[b]]);
    PP[3]=_.cloneDeep(skillIndex[randomSkill[c]]);
    PP[4]=_.cloneDeep(skillIndex[randomSkill[d]]);
    return;
  }

  render(){
    if(this.props.page===1){
      return (
      <div>
      <Choose 
      handlePage={this.handlePage}
      page={this.props.page}
      list={this.state.player.monster.skillList}
      skillNumber={this.state.player.monster.skillNumber}
      PP={this.state.player.monster[1].PP}
      handleSkill={this.handleSkill}
      godBut={this.godSkill}
      P1={this.state.P1}
      />
      </div>
      );
    }
    if(this.props.page===2){
      return <Battle 
      handlePage={this.props.handlePage}
      page={this.props.page}
      player={this.state.player}
      CPU={this.state.CPU}
      Ani={this.state.animation}
      id='player1'
      id_='CPU'
      round={this.state.round}
      getRound={this.getRound}
      message={this.state.message}
      all={this.state}
      Cb={this.state.Cb}
      Ab={this.state.Ab}
      isGolden={this.state.isGolden}
      reset={this.reset}
      disharm={this.disharm}
      />;
    }
    if(this.props.page===3){
      return <Ending 
      handlePage={this.props.handlePage}
      page={this.props.page}
      msg={this.state.message}
      messageTest={this.messageTest}
      messageOut={this.messageOut}
      />;
    }

  }

}

class Paging extends React.Component{
  constructor(props){
    super(props);
    this.state={
      page:1,
    };
    this.handlePage=this.handlePage.bind(this);
  }

  handlePage(num){
    this.setState({
      page:num,
    })
  }
  render(){
    return <div>
    <Game 
    handlePage={this.handlePage}
    page={this.state.page}
    text={this.state.text}
    />
    </div>
  }

}

ReactDOM.render(
  <React.StrictMode>
    <Paging />
  </React.StrictMode>,
  document.getElementById('root')   //连接id=root的div标签
);

reportWebVitals();