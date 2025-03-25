import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({
    name:'permissions'
})

export class PermissionsEntity extends BaseEntity{
    @PrimaryGeneratedColumn({
        name:'id',
        type:'integer'
    })    
    id:number

    @Column({
        name:'permission_name',
        type:'varchar'
    })
    permission_name:string
}