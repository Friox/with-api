import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { FamilyService } from 'src/family/family.service';
import { CreateDiaryDTO, ReplyDiaryDTO } from './diary.dto';
import { ToolsService } from 'src/shared/tools.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Diary')
@Controller('diary')
export class DiaryController {
  constructor(
    private diaryService: DiaryService,
    private familyService: FamilyService,
    private toolsService: ToolsService,
  ) {}

  @Get('getMyDiaryList')
  @ApiOperation({
    summary: '내 일기목록 조회',
    description: '본인이 작성한 일기를 조회합니다.',
  })
  @ApiBearerAuth()
  getMyDiaryList(@Request() req: Request) {
    return this.diaryService.getMyDiaryList(req);
  }

  @Get('getFamilyDiaryList')
  @ApiOperation({
    summary: '패밀리의 일기 조회',
    description: '자신이 속해있는 패밀리에 작성 및 공개된 일기를 조회합니다.',
  })
  @ApiBearerAuth()
  async getFamilyDiaryList(@Request() req: Request) {
    const userUID = req['user'].user_uid;
    const familyUID = await this.familyService.hasFamily(userUID);
    return this.diaryService.getFamilyDiaryList(userUID, familyUID);
  }

  @Post('createDiary')
  @ApiOperation({
    summary: '일기 작성',
    description: '일기를 생성합니다.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateDiaryDTO })
  @ApiConsumes('application/x-www-form-urlencoded')
  async createDiary(
    @Body() createDiaryDTO: CreateDiaryDTO,
    @Request() req: Request,
  ) {
    const userUID = req['user'].user_uid;
    createDiaryDTO.uid = this.toolsService.createUID();
    createDiaryDTO.familyUid = await this.familyService.hasFamily(userUID);
    createDiaryDTO.userUid = req['user'].user_uid;
    createDiaryDTO.createDate = new Date();
    return this.diaryService.createDiary(createDiaryDTO);
  }

  @Get('getDiary')
  @ApiOperation({
    summary: '일기 조회',
    description: '일기 UID로 일기를 조회합니다.',
  })
  @ApiBearerAuth()
  getDiary(@Query('diary_uid') diaryUID: string) {
    if (diaryUID == null) throw new BadRequestException();
    return this.diaryService.getDiary(diaryUID);
  }

  @Put('editDiary')
  @ApiOperation({
    summary: '일기 수정',
    description: '일기를 수정합니다. 본인이 작성한 일기만 수정할 수 있습니다.',
  })
  @ApiBearerAuth()
  editDiary(@Query('diary_uid') diaryUID: string, @Request() req: Request) {
    // TODO
    if (diaryUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    console.log(userUID);
  }

  @Delete('deleteDiary')
  @ApiOperation({
    summary: '일기 삭제',
    description:
      '일기 UID로 일기를 삭제합니다. 본인이 작성한 일기만 삭제할 수 있습니다.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 403, description: '삭제 권한이 없거나 없는 일기 UID' })
  async deleteDiary(
    @Query('diary_uid') diaryUID: string,
    @Request() req: Request,
  ) {
    const userUID = req['user'].user_uid;
    if (diaryUID == null) throw new BadRequestException();
    if (await this.diaryService.isOwn(userUID, diaryUID)) {
      return this.diaryService.deleteDiary(diaryUID);
      /*
      "data": {
          "raw": [],
          "affected": 1
      }
      */
    } else {
      throw new ForbiddenException();
    }
  }

  @Post('replyDiary')
  @ApiOperation({
    summary: '일기 답글',
    description: '특정 일기에 답글을 작성합니다.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: ReplyDiaryDTO })
  @ApiConsumes('application/x-www-form-urlencoded')
  replyDiary(
    @Query('diary_uid') diaryUID: string,
    @Body() replyDiaryDTO: ReplyDiaryDTO,
    @Request() req: Request,
  ) {
    if (diaryUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    replyDiaryDTO.uid = this.toolsService.createUID();
    replyDiaryDTO.diaryUid = diaryUID;
    replyDiaryDTO.userUid = userUID;
    replyDiaryDTO.createDate = new Date();
    return this.diaryService.replyDiary(replyDiaryDTO);
  }

  @Get('getReplyList')
  @ApiOperation({
    summary: '일기 답글 조회',
    description: '특정 일기의 답글목록을 조회합니다.',
  })
  @ApiBearerAuth()
  getReplyList(@Query('diary_uid') diaryUID: string) {
    // TODO: 패밀리 여부에 맞게 권한 컨트롤 하기
    if (diaryUID == null) throw new BadRequestException();
    return this.diaryService.getReplyList(diaryUID);
  }
}
