import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users-entity";
// import { PairDetailsEntity } from "./pairdetails_entity";

@Entity('rules_table')
export class RulesEntity extends BaseEntity{

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    })
    id:number


    @Column({
        name:'rule_name',
        type:'varchar'
    })
    rule_name:string

    @Column({
        name:'severity_in',
        type:'varchar'

    })
    severity_in:string

    @Column({
        name:'severity_out',
        type:'varchar'

    })
    severity_out:string

    @Column({
        name:'application',
        type:'varchar'

    })
    application:string

    @Column({
        name:'keywords',
        type:'varchar'

    })
    keywords:string

    @Column({
        name:'description',
        type:'varchar',
        length:300

    })
    description:string

    @Column({
        name: 'deny_duplicate',
        type: 'integer'
    })
    deny_duplicate:number

    @Column({
        name: 'interval',
        type: 'integer'
    })
    interval:number
   
    

    // @ManyToMany(()=>UsersEntity,(userss)=>userss.rules)
    // @JoinTable({
    //     name:"users_rules",
    //     joinColumn:{
    //         name:'rules_id',
    //         referencedColumnName:'id'
    //     },
    //     inverseJoinColumn:{
    //         name:'users_id',
    //         referencedColumnName:'id',
    //     },
    // })
    // userss:UsersEntity[];


}
