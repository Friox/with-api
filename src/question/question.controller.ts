import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateAnswerDTO, CreateQuestionDTO } from './question.dto';
import { ToolsService } from 'src/shared/tools.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Q&A')
@Controller('question')
export class QuestionController {
  constructor(
    private questionService: QuestionService,
    private toolsService: ToolsService,
  ) {}

  @Post('createQuestion')
  @ApiOperation({
    summary: '질문 생성',
    description: '패밀리 구성원 중 한명을 지정하여 질문을 생성합니다.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateQuestionDTO })
  @ApiConsumes('application/x-www-form-urlencoded')
  createQuestion(
    @Body() createQuestionDTO: CreateQuestionDTO,
    @Request() req: Request,
  ) {
    const userUID = req['user'].user_uid;
    createQuestionDTO.uid = this.toolsService.createUID();
    createQuestionDTO.createUserUid = userUID;
    return this.questionService.createQuestion(createQuestionDTO);
  }

  @Get('getQuestionInfo')
  @ApiOperation({
    summary: '질문 정보 조회',
    description: '질문 UID로 질문 상세정보를 조회합니다.',
  })
  @ApiBearerAuth()
  getQuestionInfo(
    @Query('question_uid') questionUID: string,
    @Request() req: Request,
  ) {
    if (questionUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    return this.questionService.getQuestionInfo(questionUID, userUID);
  }

  @Put('editQuestion')
  @ApiOperation({
    summary: '질문 수정',
    description: '질문을 수정합니다. 자신이 작성한 질문만 수정할 수 있습니다.',
  })
  @ApiBearerAuth()
  editQuestion() {
    // TODO
  }

  @Delete('deleteQuestion')
  @ApiOperation({
    summary: '질문 삭제',
    description: '질문을 삭제합니다. 자신이 작성한 질문만 삭제할 수 있습니다.',
  })
  @ApiBearerAuth()
  deleteQuestion(
    @Query('question_uid') questionUID: string,
    @Request() req: Request,
  ) {
    if (questionUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    return this.questionService.deleteQuestion(questionUID, userUID);
  }

  @Get('getQuestionList')
  @ApiOperation({
    summary: '질문 목록 조회',
    description: '내가 작성하거나 나에게 온 질문 목록을 조회합니다.',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'type',
    description: '리스트 타입 (0: 나에게 온 질문, 1: 내가 쓴 질문)',
    required: false,
  })
  getQuestionList(@Query('type') type: number, @Request() req: Request) {
    type = type ?? 0;
    const userUID = req['user'].user_uid;
    return this.questionService.getQuestionList(userUID, type);
  }

  @Post('createAnswer')
  @ApiOperation({
    summary: '답변 생성',
    description: '질문에 대해 답변을 작성합니다.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAnswerDTO })
  @ApiConsumes('application/x-www-form-urlencoded')
  createAnswer(
    @Query('question_uid') questionUID: string,
    @Body() createAnswerDTO: CreateAnswerDTO,
    @Request() req: Request,
  ) {
    if (questionUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    createAnswerDTO.uid = this.toolsService.createUID();
    createAnswerDTO.userUid = userUID;
    createAnswerDTO.createDate = new Date();
    return this.questionService.createAnswer(createAnswerDTO);
  }

  @Put('editAnswer')
  @ApiOperation({
    summary: '답변 수정',
    description: '답변을 수정합니다.',
  })
  @ApiBearerAuth()
  editAnswer() {
    // TODO
  }

  @Delete('deleteAnswer')
  @ApiOperation({
    summary: '답변 삭제',
    description: '답변을 삭제합니다.',
  })
  @ApiBearerAuth()
  deleteAnswer(
    @Query('answer_uid') answerUID: string,
    @Request() req: Request,
  ) {
    if (answerUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    return this.questionService.deleteAnswer(answerUID, userUID);
  }

  @Get('getAnswerList')
  @ApiOperation({
    summary: '답변 목록 조회',
    description: '특정 질문에 대해 작성된 답변 목록을 조회합니다.',
  })
  @ApiBearerAuth()
  getAnswerList(@Query('question_uid') questionUID: string) {
    if (questionUID == null) throw new BadRequestException();
    return this.questionService.getAnswerList(questionUID);
  }
}
