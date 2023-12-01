import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users-entity";


@Entity({
    name:'roles'
})

export class RolesEntity extends BaseEntity{

    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })    
    id:number

    @Column({
        name:'name',
        type:'varchar'
    })
    name:string



    @ManyToMany(()=>UsersEntity,(userss)=>userss.roles)
    @JoinTable({
        name:"users_roles",
        joinColumn:{
            name:'roles_id',
            referencedColumnName:'id'
        },
        inverseJoinColumn:{
            name:'users_id',
            referencedColumnName:'id',
        },
    })
    userss:UsersEntity[];


}