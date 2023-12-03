import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'members' })
export class Members {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    customerId: string;

    @Column({ nullable: false })
    planId: string;

    @Column({nullable: false})
    price: number;

    @CreateDateColumn()
    start_date: string;

    @UpdateDateColumn()
    end_date: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}