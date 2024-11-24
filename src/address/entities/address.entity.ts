import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "addresses"})
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    country: string;

    @Column()
    state: string;

    @Column()
    city: string;
}
