import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"


export class Addresses {
    @Column({ nullable: false })
    addressLine1: string;

    @Column({ nullable: false })
    addressLine2: string

    @Column({ nullable: true })
    landmark: string

    @Column({ nullable: false })
    city: string

    @Column({ nullable: false })
    state: string

    @Column({ nullable: false })
    country: string

    @Column({ nullable: false })
    pincode: string
}

@Entity({ name: 'customers' })
export class Customer {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: false})
    assetManagerId: string;

    @Column({ nullable: false })
    firstName: string

    @Column({ nullable: false })
    lastName: string

    @Column({ nullable: false })
    email: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false })
    username: string

    @Column({ nullable: false, type: 'jsonb' })
    billing_address: Addresses

    @Column({ nullable: false, type: 'jsonb' })
    shipping_address: Addresses;

    @Column({nullable: true})
    stripeCustomerId: string;

    @Column({nullable: true})
    mobile_number: string

    @Column({nullable: true})
    planId: string;

    @Column({nullable: true, default: false})
    isFreeDelivery: boolean;

    @Column()
    isCustomerDeleted: boolean;

    @Column()
    isEmailVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
