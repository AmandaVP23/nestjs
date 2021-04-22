import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';

@Entity()
@Unique(['username']) // array de column name
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    // vai usar a property user da task para o relacionamento
    // só um lado do relacionamento é eager
    // com eager: true -> pode acessar user.tasks logo!
    @OneToMany(type => Task, task => task.user, { eager: true }) // este é o lado one to many, na task vamos ter many to one
    tasks: Task[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}