import { msgAdd } from "./monsterBattleCheck";
import { timeOut } from "./timeOut";

export async function characteristicCheck_doHarm(name,monsterA,monsterB){
    // console.log('characteristicCheck');
    let PP=monsterA.PP[name];
    let ch1=monsterA.characteristic;
    let ch2=monsterB.characteristic;
    // console.log(PP.feature);
    switch(ch2.en_name){
        case 'Water Absorb':{
            if(PP.feature==='water'){
                ch2.change(monsterB);
                let msg=msgAdd(this.state.message,'','但是失败了');
                await this.messageOut(msg);
                await timeOut(500);
                await this.HPAnimation(monsterB);
                await timeOut(250);
                msg=msgAdd(this.state.message,monsterB.name,ch2.discription);
                await this.messageOut(msg);
                await timeOut(500);
                return 'immune!';
            }
            
        }
    }
    
    return 'ok';

}