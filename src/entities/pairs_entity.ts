import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pairs_table')
export class PairsEntity extends BaseEntity{

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    })
    id:number

    @Column({
        name:'pairdetail_id',
        type:'integer'
    })
    pairdetail_id:number

    @Column({
        name:'user_id',
        type:'integer'
    })
    user_id:number

    @Column({
        name:'rule_id',
        type:'integer'
    })
    rule_id:number
}