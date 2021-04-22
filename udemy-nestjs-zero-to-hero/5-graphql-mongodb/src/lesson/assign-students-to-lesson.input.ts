import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignStudentsToLessonInput {
    @IsUUID()
    @Field(type => ID)
    lessonId: string;

    @IsUUID('4', { each: true }) // 4 - versão do UUID, each - todos os elementos do array
    @Field(type => [ID])
    studentIds: string[];
}