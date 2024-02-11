import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './\bdto/request/create-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  //모든 게시물 반환
  getAllBoards(): Board[] {
    return this.boards;
  }

  //게시물 생성
  createBoard(createBoardDto: CreateBoardDto): Board {
    const { title, description } = createBoardDto;
    const board: Board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };
    this.boards.push(board);
    return board;
  }

  //특정 게시물 조회
  getBoardById(id: string): Board {
    const findBoard = this.boards.find((board) => board.id === id);
    if (!findBoard)
      throw new NotFoundException(`Can't find Board with id ${id}`);
    return findBoard;
  }

  //특정 게시물 삭제
  deleteBoardById(id: string): void {
    const findBoard = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== findBoard.id);
  }

  //특정 게시물 상태 업데이트
  updateBoardStatus(id: string, status: BoardStatus): Board {
    const findBoard = this.getBoardById(id);
    findBoard.status = status;
    return findBoard;
  }
}
