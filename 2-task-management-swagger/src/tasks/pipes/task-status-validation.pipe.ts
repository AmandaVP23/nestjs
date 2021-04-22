import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ]

    transform(value: any, metadata: ArgumentMetadata): any {
        const valueUpperCase = value.toUpperCase();

        if (!this.isStatusValid(valueUpperCase)) {
            throw new BadRequestException('status is a invalid status');
        }

        return value;
    }

    private isStatusValid(status: any) {
        return this.allowedStatuses.includes(status);
    }
}