import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({
    name:'permission_content'
})

export class PermissionContentEntity extends BaseEntity{
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

    @Column({
        name:'permission_label',
        type:'varchar'
    })
    permission_label:string

    @Column({
        name:'permission_key',
        type:'varchar'
    })
    permission_key:string

    @Column({
        name:'permission_type',
        type:'varchar'
    })
    permission_type:string

    @Column({
        name:'permission_value',
        type:'varchar',
        nullable: true
    })
    permission_value:string
}