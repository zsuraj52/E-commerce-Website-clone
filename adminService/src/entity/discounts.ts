import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'discounts' })
export class Discounts {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({nullable: false})
    public superAdminId: string;

    @Column({nullable: false})
    public name: string;

    @Column({nullable: false})
    public description: string;
    
    @Column({nullable: true, default:0})
    public price: number;

    @Column({nullable: true, default:0})
    public discountAmount: number;

    @Column({nullable: true, default:0})
    public discountPercentage: number;

    @Column({nullable: true, default: 0})
    public minTotal: number;

    @Column({nullable: false, default:""})
    public type: string;

    @Column({default: false, nullable: true})
    isPlanDeactivated: boolean; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}