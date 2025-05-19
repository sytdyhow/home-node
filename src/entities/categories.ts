import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories_table')
export class CategoriesEntity extends BaseEntity{

    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    })
    id:number

    @Column({
        name:'category_name',
        type:'varchar'
    })
    category_name:string

    @Column({
        name:'user_id',
        type:'integer'
    })
    user_id:number

}