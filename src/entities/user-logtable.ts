import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({
    name:'user_logstable'
})

export class UserLogsEntity extends BaseEntity{

    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })
    id:number


    @Column({
        name:'username',
        type:'varchar',
        nullable:false
    })
    username:string

    @Column({
        name:'logintime',
        type:'timestamp',
    })
    logintime:Date

    @Column({
        name:'logouttime',
        type:'timestamp'
    })
    logouttime:Date


    @Column({
        name:'action',
        type:'varchar'
    })
    action:string

}