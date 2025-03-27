import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({
    name:'permissions_systems'
})

export class PermissionsSystemsEntity extends BaseEntity{
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
        name:'system_id',
        type:'integer'
    })
    system_id:number
}