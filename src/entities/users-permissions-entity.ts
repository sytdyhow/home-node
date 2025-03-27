import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({
    name:'users_permissions'
})

export class UsersPermissionsEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })    
    id:number

    @Column({
        name:'permission_id',
        type:'integer'
    })
    permission_id:number

    @Column({
        name:'user_id',
        type:'integer'
    })
    user_id:number
}