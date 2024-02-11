import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.model';
import { CreateBoardDto } from './\bdto/request/create-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  //모든 게시물 조회
  @Get()
  getAllBoards(): Board[] {
    return this.boardsService.getAllBoards();
  }

  //게시물 생성
  @Post()
  createBoard(@Body() createBoardDto: CreateBoardDto): Board {
    return this.boardsService.createBoard(createBoardDto);
  }

  //게시물 단건 조회
  @Get('/:id')
  getBoardById(@Param('id') id: string): Board {
    return this.boardsService.getBoardById(id);
  }
}
