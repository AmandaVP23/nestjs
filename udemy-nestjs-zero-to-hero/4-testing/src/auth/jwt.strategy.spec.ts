import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { TasksService } from '../tasks/tasks.service';
import { TaskRepository } from '../tasks/task.repository';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({
    findOne: jest.fn(),
})

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UserRepository, useFactory: mockUserRepository }, // em todos os testes corre o useFactory
            ]
        }).compile();

        jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('validate', () => {
        it('returns user object', async () => {
            const user = new User();
            user.username = 'TestUser';

            userRepository.findOne.mockResolvedValue(user);

            const result = await jwtStrategy.validate({ username: user.username });

            expect(userRepository.findOne).toHaveBeenCalledWith({ username: user.username });
            expect(result).toBe(user);
        });

        it('throws unauthorized exception', async() => {
            userRepository.findOne.mockResolvedValue(null);

            expect(jwtStrategy.validate({ username: 'TestUsername' })).rejects.toThrow(UnauthorizedException);
        });
    })
});
