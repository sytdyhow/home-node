import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity(
    'rules'
)

export class RulesEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:number


    @Column({
        name:'ruleName',
        type:'varchar'
    })
    ruleName:string

    @Column({
        name:'severity_in',
        type:'varchar'

    })
    severity_in:string

    @Column({
        name:'severity_out',
        type:'varchar'

    })
    severity_out:string

    @Column({
        name:'application',
        type:'varchar'

    })
    application:string

    @Column({
        name:'keywords',
        type:'varchar'

    })
    keywords:string


    @Column({
        name:'index',
        type:'varchar'

    })
    index:string



    @Column({
        name:'splitter',
        type:'varchar'

    })
    splitter:string



    @Column({
        name:'description',
        type:'varchar',
        length:300

    })
    description:string

    
}