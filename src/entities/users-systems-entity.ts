import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name:'users_systems'
})

export class UsersSystemsEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })
    id:number

    @Column({
        name:'user_id',
        type:'integer',
        nullable:true
    })
    user_id:number

    @Column({
        name:'system_id',
        type:'integer',
        nullable:true
    })
    system_id:number

    @Column({
        name:'role_id',
        type:'integer',
        nullable:true
    })
    role_id:number
}