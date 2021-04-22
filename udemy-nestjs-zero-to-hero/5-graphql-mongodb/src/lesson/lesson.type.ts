import { Field, ObjectType, ID } from '@nestjs/graphql';
import { StudentType } from '../student/student.type';

@ObjectType('Lesson') // --> name = Lesson e não LessonType
export class LessonType {
    @Field(type => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    startDate: string;

    @Field()
    endDate: string;

    @Field(type => [StudentType])
    students: string[];
}
