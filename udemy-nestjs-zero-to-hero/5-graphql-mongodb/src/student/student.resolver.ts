import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LessonType } from '../lesson/lesson.type';
import { StudentService } from './student.service';
import { StudentType } from './student.type';
import { CreateStudentInput } from './create-student.input';

@Resolver(of => LessonType)
export class StudentResolver {
    constructor(
        private studentService: StudentService,
    ) {}

    @Query(returns => StudentType)
    async student(
        @Args('id') id: string,
    ) {
        return this.studentService.getStudent(id);
    }

    @Query(returns => [StudentType])
    students() {
        return this.studentService.getStudents();
    }

    @Mutation(returns => StudentType)
    createStudent(
        @Args('createStudentInput') createStudentInput: CreateStudentInput,
    ) {
        return this.studentService.createStudent(createStudentInput);
    }
}