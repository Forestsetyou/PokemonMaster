export var characteristicIndex={
    'Battle Bond':{
        name:'牵绊变身',
        en_name:'Battle Bond',
    },
    'Water Absorb':{
        name:'储水',
        en_name:'Water Absorb',
        change(monster){
            if(monster.ability.nowHP===monster.ability.maxHP){
                this.discription='的HP已经满了！';
                return ;
            }else{
                this.discription='因自身的储水特性恢复了少许HP';
                monster.ability.nowHP+=monster.ability.maxHP/4;
                if(monster.ability.nowHP>monster.ability.maxHP)
                    monster.ability.nowHP=monster.ability.maxHP;
            }
        },
        discription:'因自身的储水特性恢复了四分之一的HP',
    }
};