import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Addresses } from "./customer";

export class Products {
    @Column()
    name: string;

    @Column()
    category: string;

    @Column({nullable: true, default: 0.1})
    weight: number;

    @Column()
    price: number;

    @Column()
    quantity: number
}


@Entity({ name: 'orders' })
export class Order {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    customerId: string;

    @Column({ nullable: false })
    amount: string

    @Column({nullable: false, type: 'jsonb'})
    products: Products[];

    @Column({ nullable: false, type: 'jsonb' })
    billing_address: Addresses;

    @Column({ nullable: false, type: 'jsonb' })
    shipping_address: Addresses;

    @Column({default: false})
    isOrderCancelled: boolean;

    @Column({default: 'pending'})
    orderStatus:string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}