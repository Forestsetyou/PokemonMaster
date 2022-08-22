import { timeOut } from "./timeOut";
import { checkDying } from "./monsterBattleCheck";
import { abnormal } from "./abnormal";

export function checkBegin( monster ){  //回合前更新状态
  // console.log('checkBegin');

  for(let i in monster.ability.states.abnormal){
    monster.ability.states.abnormal[i].discount();
  }
  
  monster.ability.states.attribute.discriptionBefore={
    number:0,
  }

  monster.ability.nowSp=monster.ability.Sp;
  monster.ability.nowAt=monster.ability.At;
  monster.ability.nowSa=monster.ability.Sa;
  monster.ability.nowSd=monster.ability.Sd;
  monster.ability.nowDf=monster.ability.Df;

  monster.round+=1;

  if(monster.ability.states.abnormal.paralysis.checks){   //是否麻痹
    monster.ability.nowSp=Math.floor(monster.ability.Sp/2);
    if(monster.ability.states.abnormal.paralysis.judge()){
      monster.ability.states.abnormal.isOK.checks=false;
      monster.ability.states.abnormal.isOK.discriptionBefore[0]='被麻痹了，无法动弹';
    }
  }
  if(monster.ability.states.abnormal.flinch.checks){   //是否畏缩
    monster.ability.states.abnormal.isOK.checks=false;
    monster.ability.states.abnormal.isOK.discriptionBefore[0]='因畏缩而无法行动';
  }
}

export function checkFirst(monsterA,monsterB,nameA,nameB){
  // console.log('checkFirst');
  if(monsterA.PP[nameA].priority>monsterB.PP[nameB].priority) return 'A';
  if(monsterA.PP[nameA].priority<monsterB.PP[nameB].priority) return 'B';
  if(monsterA.ability.nowSp > monsterB.ability.nowSp) return 'A';
  if(monsterA.ability.nowSp < monsterB.ability.nowSp) return 'B';

  let a=Math.floor(Math.random*100+1);
  if(a>50) return 'A';
  else return 'B';
}

export async function checkAfter(monster){
  // console.log('checkAfter');

  monster.ability.states.abnormal.isOK.discriptionAfter={
    number:0,
  }

  if(monster.ability.states.abnormal.burn.checks){
    abnormal.burn(monster);
    await this.HPAnimation(monster);
    await timeOut(250);
    this.messageClear();
    let msg=monster.name+'被烧伤了';
    await this.messageOut(msg);
    await timeOut(500);
  }

  if(checkDying(monster)){
    return 'dying';
  }

  return 'ok';
}