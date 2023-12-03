import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { UUID } from "typeorm/driver/mongodb/bson.typings";

@Entity({name: 'assetManager'})
export class AssetManager {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({nullable: false})
    public firstName: string;

    @Column({nullable: false})
    public lastName: string;

    @Column({nullable: false})
    public username: string

    @Column({nullable: false})
    public email: string

    @Column({nullable: false})
    public password: string;

    @Column({nullable: true})
    phoneNumber: string;

    @Column({nullable: false, default:"asset manager"})
    role: string;

    @Column({nullable: true})
    public isEmailVerified: boolean;

    @Column({nullable: true, default: false})
    public isAssetManagerDeleted: boolean;

    @Column({nullable: true, default: false})
    isAssetManagerVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}