import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './\bdto/request/create-board.dto';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  //모든 게시물 조회
  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  //게시물 생성
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });

    await this.boardRepository.save(board);
    return board;
  }

  //특정 게시물 조회
  async getBoardById(id: number): Promise<Board> {
    const findBoard = await this.boardRepository.findOneBy({ id });

    if (!findBoard)
      throw new NotFoundException(`Can't find Board with id ${id}`);

    return findBoard;
  }

  //특정 게시물 삭제
  async deleteBoardById(id: number): Promise<void> {
    const result = await this.boardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find board with id ${id}`);
    }
  }

  //특정 게시물 상태 업데이트
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const findBoard = await this.getBoardById(id);

    findBoard.status = status;
    this.boardRepository.save(findBoard);

    return findBoard;
  }
}
