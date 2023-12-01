import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersEntity } from "./users-entity";


@Entity({
    name:'systems'
})

export class SystemsEntity extends BaseEntity{

    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })
    id:number


    @Column({
        name:'name',
        type:'varchar',
        nullable:false
    })
    name:string

    @Column({
        name:'url',
        type:'varchar',

    })
    url:string

    @Column({
        name:'description',
        type:'varchar'
    })
    description:string

    @Column({
        name:'is_active',
        type:'boolean'
    })
    is_active:boolean


    
    @Column({ 
        name:'icon',
        nullable: true
     })
    icon: string;

    @ManyToMany(()=>UsersEntity,(users)=>users.systems)
    @JoinTable({
        name:"users_systems",
        joinColumn:{
            name:'system_id',
            referencedColumnName:'id'
        },
        inverseJoinColumn:{
            name:'user_id',
            referencedColumnName:'id',
        },
    })
    users:UsersEntity[];

}
