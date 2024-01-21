import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { SystemsEntity } from "./systems-entity";
import { RolesEntity } from "./roles-entity";
import { RulesEntity } from "./rules-entity";

@Entity({
    name:'users'
})

export class UsersEntity extends BaseEntity{


    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })
    id:number

    @Column({
        name:'username',
        type:'varchar',
        nullable:false,
        unique:true
    })
    username:string

    @Column({
        name:'password',
        type:'varchar',
        nullable:false
    })
    password:string
    
    @Column({
        name:'is_active',
        type:'boolean',

    })
    is_active:boolean

    @Column({
        name:'data_joined',
        type:'timestamp',
        nullable:true
    })
    data_joined:Date


    @Column({
        name:'roles_id',
        type:'integer',
        nullable:false
    })
    roles_id:number




    @ManyToMany(()=>SystemsEntity,(systems)=>systems.users)
    systems:SystemsEntity[];

    // @ManyToMany(()=>RolesEntity,(roles)=>roles.userss)
    // roles:RolesEntity[];

    // @ManyToMany(()=>RulesEntity,(rules)=>rules.userss)
    // rules:RulesEntity[];


}