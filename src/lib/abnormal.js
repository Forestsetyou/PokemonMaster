export var abnormal={
    burn(monsterA){
        let hp=monsterA.ability.nowHP;
        let maxHP=monsterA.ability.maxHP;
        monsterA.ability.nowHP=(0>(hp-maxHP*(0.0625)))?0:(hp-maxHP*(0.0625));
    },
}