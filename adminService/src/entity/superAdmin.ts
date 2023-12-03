import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity({name: 'superAdmin'})
export class SuperAdmin {

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

    @Column({nullable: false, default:"super admin"})
    role: string;

    @Column({nullable: true})
    public isEmailVerified: boolean;

    @Column({nullable: true})
    public isSuperAdminDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}