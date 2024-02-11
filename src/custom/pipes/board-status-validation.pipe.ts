import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from 'src/boards/board.model';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} isn't in the status options`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    return this.StatusOptions.indexOf(status) !== -1;
  }
}
