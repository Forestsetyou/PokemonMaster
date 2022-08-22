import { timeOut } from './timeOut';
import { randomCheck } from './randomCheck';
import { counter } from './counter';
import { characteristicCheck_doHarm } from './characteristicCheck';

export async function harmCal(name,monsterA,monsterB){      //伤害计算
    // console.log('harmCal');
    
    let characteristic=1;
    let _characteristicCheck_doHarm=characteristicCheck_doHarm.bind(this);
    let res_ch=await _characteristicCheck_doHarm(name,monsterA,monsterB);

    switch(res_ch){
        case 'immune!':{
            return 'failed';
        };
        case 'ok':{
            characteristic=1;
            break;
        }
    }

    let type=monsterA.PP[name].feature;
    let typeA=monsterA.feature;
    let typeB=monsterB.feature;
    
    let typeRate=1;
    let typeEffect=0;


    for(let i in typeB){
        typeRate*=counter[type][typeB[i]];
        if(counter[type][typeB[i]]>1) typeEffect+=1;
        if(counter[type][typeB[i]]<1 && counter[type][typeB[i]]>0) typeEffect-=1;
        if(counter[type][typeB[i]]===0) typeEffect=-5;
    }
    if(type in typeA)
        typeRate*=1.5;
    
    
    let at;
    let df;

    if(monsterA.PP[name].type==='magic'){
        at=monsterA.ability.nowSa;
        df=monsterB.ability.nowSd;
    } else {
        at=monsterA.ability.nowAt;
        df=monsterB.ability.nowDf;
    }

    let LV=monsterA.LV;
    let harm=monsterA.PP[name].harm;

    let C=monsterA.PP[name].critical_hit+monsterA.ability.states.attribute.Cr;

    let critical=1;
    // console.log('C=:'+C);
    if(C>3) C=3;
    switch(C){
        case 0:{
            if(randomCheck(100/24)) critical=1.5;
            break;
        };
        case 1:{
            if(randomCheck(100/8)) critical=1.5;
            break;
        };
        case 2:{
            if(randomCheck(100/2)) critical=1.5;
            break;
        };
        case 3:{
            if(randomCheck(100)) critical=1.5;
            break;
        };
    }

    let randomNum=(Math.floor(Math.random()*16+85))/100;
    

    var res=Math.floor(((2*LV+10)/250*at/df*harm+2)*typeRate*critical*randomNum);

    if(res!==0){
        if(monsterB.ability.states.abnormal.block.checks){
            await timeOut(500);
            this.messageClear();
            let msg=monsterB.name+'守住了';
            await this.messageOut(msg);
            await timeOut(500);
            return 'failed';
        }
    }

    monsterB.ability.nowHP-=res;

    if(monsterB.ability.nowHP<=0 && monsterB.name==='喷火龙X' && monsterA.PP[name].feature!=='water'){
        monsterB.ability.nowHP+=res;
        let msg=msgAdd(this.state.message,'','但是'+monsterB.name+'使用了神技\'闪开\'躲开了攻击！');
        await this. messageOut(msg);
        await timeOut(500);
        return 'hack!';
    }

    monsterA.lastHarm=res;


    if(monsterB.ability.nowHP<0)
        monsterB.ability.nowHP=0;
    
    await this.HPAnimation(monsterB);
    await timeOut(250);

    if(critical===1.5){
        let criticalDis=msgAdd(this.state.message,'','会心一击！');
        await this.messageOut(criticalDis);
        await timeOut(500);
    }

    let typeDis;

    if(typeEffect>0){
        typeDis='效果显著';
    }else
        if(typeEffect===0){
            typeDis='效果一般';
        }else
            if(typeEffect===-5)
                typeDis='毫无效果';
            else typeDis='效果较差';

    let isMulti=(monsterA.PP[name].special.Type==='multiple_attack');

    if(isMulti){
        let number={
            1:'一',
            2:'二',
            3:'三',
            4:'四',
            5:'五',
        };
        let num=monsterA.PP[name].special.count;
        let msg=msgAdd(this.state.message,'','命中第'+number[num]+'次');
        await this.messageOut(msg);
        await timeOut(500);
        if(num===monsterA.PP[name].special.res || checkDying(monsterB)){
            let msg=msgAdd(this.state.message,'',typeDis);
            await this.messageOut(msg);
            await timeOut(500);
        }
    } else {
        let msg=msgAdd(this.state.message,'',typeDis);
        await this.messageOut(msg);
        await timeOut(500);
    }

    if(checkDying(monsterB)){
        return 'dying';
    }
    
    return 'ok';
}

export async function checkHit(name,monsterA,monsterB){         //命中判定
    // console.log('checkHit');
    let hit=monsterA.ability.Ht*monsterA.PP[name].hit_rate/100;
    if(hit>100){
        return true;
    }

    if(monsterA.PP[name].feature==='water') return true;        //水系必中哒



    let level=monsterA.ability.states.attribute.Ht-monsterB.ability.states.attribute.Ms;

    if(level>6) level=6;
    if(level<-6) level=-6;

    if(level>=0){
        let rate=(3+level)/3;
        hit*=rate;
    }else{
        let rate=level/(3-level);
        hit*=rate;
    }

    if(randomCheck(hit)) return true;
    else{
        let msg=msgAdd(this.state.message,monsterA.name,'没能命中');
        await this.messageOut(msg);
        await timeOut(500);
        return false;
    }

}

export function msgAdd(msg,name,dis){   //文本逗号
    // console.log('msgAdd');
    if(dis==='') return '';
    let message='';
    if(msg!=='' && (msg[msg.length]!=='，' || msg[msg.length]!=='！' || msg[msg.length]!=='。')) message=message+'，';
    message=message+name+dis;
    return message;
}

async function selfCheck(name,monsterA,monsterB){       //自己状态检测
    // console.log('selfCheck');

    let PP=monsterA.PP[name];
    for(let i=1;i<=PP.special.self.number;i++){
        let type=PP.special.self[i].type;
        switch(type){
            case 'solidHarm':{
                PP.special.self[i].change(monsterA);
                let msg=msgAdd(this.state.message,monsterA.name,PP.special.self[i].discription);
                await this.HPAnimation(monsterA);
                await timeOut(250);
                await this.messageOut(msg);
                await timeOut(500);
                if(checkDying(monsterA)) return 'dying';
                break;
            };
            case 'bellyDrum':{
                if(PP.special.self[i].check(monsterA)){
                    PP.special.self[i].change(monsterA);
                    await this.HPAnimation(monsterA);
                    await timeOut(250);
                }
                let msg=msgAdd(this.state.message,monsterA.name,PP.special.self[i].discription);
                await this.messageOut(msg);
                await timeOut(500);
                break;
            };
            case 'reboundHarm':{
                PP.special.self[i].change(monsterA);
                let msg=msgAdd(this.state.message,monsterA.name,PP.special.self[i].discription);
                await this.HPAnimation(monsterA);
                await timeOut(250);
                await this.messageOut(msg);
                await timeOut(500);
                if(checkDying(monsterA)) return 'dying';
                break;
            };
            case 'absolute':{
                PP.special.self[i].change(monsterA);
                let msg=msgAdd(this.state.message,monsterA.name,PP.special.self[i].discription);
                await this.messageOut(msg);
                await timeOut(500);
                break;
            };
            case 'switch':{
                PP.special.self[i].change(monsterA,monsterB);
                let msg=msgAdd(this.state.message,monsterA.name,PP.special.self[i].discription);
                await this.messageOut(msg);
                await timeOut(500);
                break;
            };
            case 'matBlock':{
                // console.log('outside:'+monsterA.round);
                // console.log(monsterA);
                if(PP.special.self[i].check(monsterA.round)){
                    // console.log('block here');
                    // console.log(PP);
                    PP.special.self[i].change(monsterA);
                    // console.log(monsterA);
                }
                let msg=msgAdd(this.state.message,monsterA.name,PP.special.self[i].discription);
                await this.messageOut(msg);
                await timeOut(500);
                break;
            };
        }

    }

    return 'ok';
}

async function oppositeCheck(name,monsterA,monsterB){       //对方状态检测
    // console.log('oppositeCheck');
    let PP=monsterA.PP[name];
    for(let i=1;i<=PP.special.opposite.number;i++){
        let type=PP.special.opposite[i].type;
        switch(type){
            case 'OTK':{
                PP.special.opposite[i].change(monsterB);
                await this.HPAnimation(monsterB);
                await timeOut(250);
                let msg=msgAdd(this.state.message,monsterB.name,PP.special.opposite[i].discription);
                await this.messageOut(msg);
                await timeOut(500);
                return 'dying';
            };
            case 'rate':{
                PP.special.opposite[i].change(monsterB);
                if(PP.special.opposite[i].discription==='')
                    break;
                let msg=msgAdd(this.state.message,monsterB.name,PP.special.opposite[i].discription);
                await this.messageOut(msg);
                await timeOut(500);
                break;
            };
            case 'absolute':{
                PP.special.opposite[i].change(monsterB);
                let msg=msgAdd(this.state.message,monsterB.name,PP.special.opposite[i].discription);
                await this.messageOut(msg);
                await timeOut(500);
                break;
            };
        }
    }

    return 'ok';
}

export function checkDying(monsterA){      //检查有无阵亡
    // console.log('checkDying');
    if(monsterA.ability.nowHP===0) return true;
    else return false;
}

export function getCPU(monster){        //随机选择技能
    // console.log('getCPU');
    let a=Math.floor(Math.random()*100+1);
    let name={};
    for(let i in monster.PP){
        name[i]=monster.PP[i].name;
    }
    if(a>83) return 1;
    if(a>66) return 2;
    if(a>50) return 3;
    if(a>33) return 4;
    if(a>16) return 5;
    return 6;
}

export async function changingSkill(name,monsterA,monsterB){        //变化类技能
    // console.log('changingSkill');
    let PP=monsterA.PP[name];

    let death='ok';

    this.messageClear();
    let msg=monsterA.name+'使用了'+PP.name;
    await this.messageOut(msg);
    await timeOut(500);

    if(PP.special.self.number>0){
        let _selfCheck=selfCheck.bind(this);
        death=await _selfCheck(name,monsterA,monsterB);
        if(death==='dying'){
            await timeOut(500);
            this.messageClear();
            let msg=monsterA.name+'失去了战斗能力。';
            await this.messageOut(msg);
            await timeOut(500);
            this.messageClear();
            death='Adying';
            return death;
        }
    }
    
    if(PP.special.opposite.number>0){
        let _oppositeCheck=oppositeCheck.bind(this);
        death=await _oppositeCheck(name,monsterA,monsterB);
        if(death==='dying'){
            await timeOut(500);
            this.messageClear();
            let msg=monsterB.name+'失去了战斗能力。';
            await this.messageOut(msg);
            await timeOut(500);
            death='Bdying';
        }
    }
       
    return death;
}

export async function singleAttack(name,monsterA,monsterB){     //单次攻击
    // console.log('singleAttack');
    let PP=monsterA.PP[name];
    let death='ok';

    this.messageClear();
    let msg=monsterA.name+'使用了'+monsterA.PP[name].name;
    await this.messageOut(msg);
    await timeOut(500);

    let _checkHit=checkHit.bind(this);
    let hit=await _checkHit(name,monsterA,monsterB);
    
    if(!hit){
        return 'notHit';
    }
    
    let _harmCal=harmCal.bind(this);        //伤害计算
    let res_harm=await _harmCal(name,monsterA,monsterB);
    switch(res_harm){
        case 'dying':{
            await timeOut(500);
            this.messageClear();
            let msg=monsterB.name+'失去了战斗能力';
            await this.messageOut(msg);
            await timeOut(500);

            return 'Bdying';
        };
        case 'failed':{
            return 'failed';
        };
        case 'hack!':{
            return 'hack!';
        };
    }

    
    if(PP.special.self.number>0){       //效果判定
        let _selfCheck=selfCheck.bind(this);
        death=await _selfCheck(name,monsterA,monsterB);
        if(death==='dying'){
            await timeOut(500);
            this.messageClear();
            let msg=monsterA.name+'失去了战斗能力。';
            await this.messageOut(msg);
            await timeOut(500);
            this.messageClear();
            death='Adying';
            return death;
        }
    }

    if(PP.special.opposite.number>0){
        let _oppositeCheck=oppositeCheck.bind(this);
        death=await _oppositeCheck(name,monsterA,monsterB);
        if(death==='dying'){
            await timeOut(500);
            this.messageClear();
            let msg=monsterB.name+'失去了战斗能力。';
            await this.messageOut(msg);
            await timeOut(1000);
            death='Bdying';
        }
    }
       
    return death;


}

export async function multipleAttack(name,monsterA,monsterB){     //多次攻击
    // console.log('multipleAttack');
    let PP=monsterA.PP[name];
    let death='ok';

    this.messageClear();
    let msg=monsterA.name+'使用了'+monsterA.PP[name].name;
    await this.messageOut(msg);
    await timeOut(500);

    let _checkHit=checkHit.bind(this);
    let hit=await _checkHit(name,monsterA,monsterB);
    
    if(!hit){
        return 'notHit';
    }

    PP.special.getRes()
    let num=PP.special.res;
    for(let i=1;i<=num;i++){
        PP.special.count=i;

        let _harmCal=harmCal.bind(this);        //伤害计算
        let res_harm=await _harmCal(name,monsterA,monsterB);
        switch(res_harm){
            case 'dying':{
                await timeOut(500);
                this.messageClear();
                let msg=monsterB.name+'失去了战斗能力';
                await this.messageOut(msg);
                await timeOut(500);
    
                return 'Bdying';
            };
            case 'failed':{
                return 'failed';
            };
            case 'hack!':{
                return 'hack!';
            };
        }
    
        
        if(PP.special.self.number>0){       //效果判定
            let _selfCheck=selfCheck.bind(this);
            death=await _selfCheck(name,monsterA,monsterB);
            if(death==='dying'){
                await timeOut(500);
                this.messageClear();
                let msg=monsterA.name+'失去了战斗能力。';
                await this.messageOut(msg);
                await timeOut(500);
                this.messageClear();
                death='Adying';
                return death;
            }
        }
    
        if(PP.special.opposite.number>0){
            let _oppositeCheck=oppositeCheck.bind(this);
            death=await _oppositeCheck(name,monsterA,monsterB);
            if(death==='dying'){
                await timeOut(500);
                this.messageClear();
                let msg=monsterB.name+'失去了战斗能力。';
                await this.messageOut(msg);
                await timeOut(1000);
                death='Bdying';
            }
        }
           

    }
    
    return death;


}