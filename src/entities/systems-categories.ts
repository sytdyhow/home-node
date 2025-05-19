import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity({
    name: 'systems_categories'
})

export class SystemCategoriesEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    })
    id: number

    @Column({
        name: 'system_id',
        type: 'integer'
    })
    system_id: number

    @Column({
        name: 'category_id',
        type: 'integer'
    })
    category_id: number

    @Column({
        name: 'user_id',
        type: 'integer'
    })
    user_id: number
}