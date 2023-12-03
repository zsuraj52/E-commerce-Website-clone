import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'interactions' })
export class Interactions {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false, type:'jsonb', default:[]})
    keyword: string[];

    @Column({ nullable: false })
    customerId: string;

    @Column({ nullable: false, type:'jsonb', default:[] })
    productId: string[]

    @Column({nullable: false})
    interaction_type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}