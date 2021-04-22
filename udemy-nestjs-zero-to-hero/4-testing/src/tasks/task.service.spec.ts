import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = {
    id: 100,
    username: 'Test user'
};

// boa prática deixar vazio inicialmente e ir adicionando o que precisa enquanto vai fazendo os testes
const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }, // em todos os testes corre o useFactory
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' }

            // call tasksService.getTasks
            const result = await tasksService.getTasks(filters, mockUser);

            // expect taskRepository.getTasks to have been called
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.find() and succesfully retrieve and return the task', async () => {
            const mockTask = {
                title: 'Test task',
                description: 'Test description'
            };

            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);

            expect(result).toEqual(mockTask);
            expect(taskRepository.findOne).toHaveBeenCalledWith({ where: { id: 1, userId: mockUser.id } })
        });

        it('throws an error as task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            // rejects - tipo catch
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.createTask() and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('someTask');

            const newTask: CreateTaskDto = {
                title: 'Test task',
                description: 'Test description',
            };

            expect(taskRepository.createTask).not.toHaveBeenCalled();

            const result = await tasksService.createTask(newTask, mockUser);

            expect(taskRepository.createTask).toHaveBeenCalledWith(newTask, mockUser);
            expect(result).toEqual('someTask');
        });
    });

    describe('deleteTask', () => {
        it('calls taskRepository.delete()', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });

            expect(taskRepository.delete).not.toHaveBeenCalled();

            await tasksService.deleteTask(1, mockUser);

            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        });

        it('throws an error as task could not be found', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });

            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTask', () => {
        it('update tasks status', async () => {
            const save = jest.fn();

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save: save.mockResolvedValue(true),
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();

            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);

            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    })
});