import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

export class Review {
    @Column({nullable: false})
    public review: string

    @Column({nullable: false})
    public customer: string

}

export class Rating {
    @Column({nullable: false})
    public rating: number

    @Column({nullable: false})
    public customer: string

}

export class FAQObj {
    @Column({nullable: true})
    public question: string;

    @Column({nullable: true})
    public answer: string;

    @Column({nullable: true})
    public customer: string
}

@Entity({name: 'products'})
export class Product {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({nullable: false})
    public assetManagerId: string;

    @Column({nullable: false})
    public name: string;

    @Column({nullable: true})
    public brand: string;

    @Column({nullable: false})
    public description: string;

    @Column({nullable: false})
    public category: string;

    @Column({nullable: false})
    public subCategory: string;

    @Column({nullable: true, type: 'jsonb', default: []})
    public images: string[];

    @Column({nullable: true, type: 'jsonb', default:[]})
    public size: number[] | string[];

    @Column({nullable: true, type: 'jsonb', default:[]})
    public colour: string[];

    @Column({nullable: true, type: 'decimal', precision: 10, scale: 2, default: 0})
    public weight: number;

    @Column({nullable: false})
    public quantity: number;

    @Column({nullable: false})
    public price: number;  

    @Column({nullable: true, type: 'jsonb', default:[]})
    public review: Review[];

    @Column({nullable: true, type: 'jsonb', default:[]})
    public rating: Rating[];

    @Column({nullable: true, type: "decimal", default: 0})
    public avg_rating: number;

    @Column({nullable: true, type: 'jsonb', default: []})
    public faq: FAQObj[];

    @Column({nullable: true})
    public isProductDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}