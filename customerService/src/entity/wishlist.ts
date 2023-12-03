import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'wishlist' })
export class Wishlist {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({nullable: false})
    public productId: string;

    @Column({ nullable: false })
    public customerId: string;

    @Column({nullable: false})
    public name: string;

    @Column({nullable: false})
    public description: string;

    @Column({nullable: false})
    public price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}