import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'systems'
})

export class SystemsEntity extends BaseEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'integer'
    })
    id: number

    @Column({
        name: 'name',
        type: 'varchar',
        nullable: false
    })
    name: string

    @Column({
        name: 'subtitle',
        type: 'varchar',
        nullable: false
    })
    subtitle: string

    @Column({
        name: 'url',
        type: 'varchar',
    })
    url: string

    @Column({
        name: 'permission_url',
        type: 'varchar',
    })
    permission_url: string

    @Column({
        name: 'description',
        type: 'varchar'
    })
    description: string

    @Column({
        name: 'is_active',
        type: 'boolean'
    })
    is_active: boolean

    @Column({
        name: 'icon',
        nullable: true
    })
    icon: string;

}
