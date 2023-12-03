import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'cart' })
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    productId: string;

    @Column({ nullable: false })
    customerId: string;

    @Column({nullable: false})
    quantity: number;

    @Column({nullable: false})
    price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}