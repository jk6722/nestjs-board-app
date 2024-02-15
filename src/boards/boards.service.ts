import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './\bdto/request/create-board.dto';
import { Board } from './board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  //유저의 모든 게시물 조회
  async getAllBoards(user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');

    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();
    return boards;
  }

  //게시물 생성
  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
      user,
    });

    await this.boardRepository.save(board);
    return board;
  }

  //특정 게시물 조회
  async getBoardById(id: number, user: User): Promise<Board> {
    const findBoard = await this.boardRepository.findOneBy({ id, user });

    if (!findBoard)
      throw new NotFoundException(`Can't find Board with id ${id}`);

    return findBoard;
  }

  //특정 게시물 삭제
  async deleteBoardById(id: number, user: User): Promise<void> {
    //id와 user 정보 모두 일치하는 경우 삭제
    const result = await this.boardRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Can't find board with id ${id}`);
    }
  }

  //특정 게시물 상태 업데이트
  async updateBoardStatus(
    id: number,
    status: BoardStatus,
    user: User,
  ): Promise<Board> {
    const findBoard = await this.getBoardById(id, user);

    findBoard.status = status;
    this.boardRepository.save(findBoard);

    return findBoard;
  }
}
