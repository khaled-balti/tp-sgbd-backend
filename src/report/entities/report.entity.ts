import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "reports"})
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    object: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    date: string;

    @ManyToOne(() => User, user => user.reports)
    user: User;
}
