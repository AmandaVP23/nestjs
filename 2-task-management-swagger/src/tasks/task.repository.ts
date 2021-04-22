import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task'); // criar uma query builder que interage com a task

        // userId é uma coluna criada automaticamente mas ainda precisamos adicionar na entidade
        query.where('task.userId = :userId', { userId: user.id });

        if (status) {
            // andWhere pq quer que trabalhem juntos, se usar só where faz override
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            // LIKE permite um match parcial
            // `% permite pegar parciallmente
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}` });
        }

        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = new Task();
        task.title = createTaskDto.title;
        task.description = createTaskDto.description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();

        // para não devolver o user inteiro na task, não apaga da BD
        delete task.user;

        return task;
    }
}