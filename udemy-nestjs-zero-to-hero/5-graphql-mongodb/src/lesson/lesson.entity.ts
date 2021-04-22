import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from 'typeorm';

// isto vai ser para o typeorm
@Entity()
export class Lesson {
    @ObjectIdColumn() // isto vai ser para o mongodb, id interno do mongodb
    _id: string;

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @Column()
    students: string[];
}