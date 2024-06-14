import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  RawBodyRequest,
  Request,
} from '@nestjs/common';
import { MissionService } from './mission.service';
import { FamilyService } from 'src/family/family.service';
import { CreateMissionDTO } from './mission.dto';
import { plainToClass } from 'class-transformer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Mission')
@Controller('mission')
export class MissionController {
  constructor(
    private missionService: MissionService,
    private familyService: FamilyService,
  ) {}

  @Post('createMission')
  @ApiOperation({
    summary: '미션 생성',
    description:
      '미션을 생성합니다. 여러명을 선택하여 미션을 부여할 수 있습니다.',
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      properties: {
        contents: {
          description: '미션 내용',
          type: 'string',
        },
        expirationDate: {
          description: '만료 날짜 및 시간 (없는 경우도 만들까 생각중)',
          type: 'string',
          format: 'date-time',
        },
        exp: {
          description: '완료 시 지급할 경험치',
          type: 'number',
        },
        users: {
          description: '미션을 부여할 유저의 UID가 담긴 배열',
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  @ApiConsumes('application/json')
  async createMission(@Request() req: RawBodyRequest<Request>) {
    // 이 엔드포인트만큼은 복수의 인원을 처리하기위해
    // RawBody, JSON을 입력받는다.
    // 유저의 UID가 배열로 들어옴.
    const jsonData = JSON.parse(req.rawBody.toString());
    const createMissionDTO = plainToClass(CreateMissionDTO, jsonData);
    const users = jsonData.users;
    if (
      !Array.isArray(users) ||
      !users.every((item) => typeof item === 'string')
    ) {
      // 유저배열이 리스트가 아니거나 문자열로 이루어져있지않으면 실행거부
      throw new BadRequestException();
    }
    const userUID = req['user'].user_uid;
    const familyUID = await this.familyService.hasFamily(userUID);
    return this.missionService.createMission({
      familyUID: familyUID,
      createUserUID: userUID,
      targetUsersUID: users,
      contents: createMissionDTO.contents,
      expirationDate: createMissionDTO.expirationDate,
      exp: createMissionDTO.exp,
    });
  }

  @Get('getMissionInfo')
  @ApiOperation({
    summary: '미션 정보 조회',
    description: '미션 UID로 미션 정보를 조회합니다.',
  })
  @ApiBearerAuth()
  getMissionInfo(
    @Query('mission_uid') missionUID: string,
    @Request() req: Request,
  ) {
    if (missionUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    return this.missionService.getMissionInfo(missionUID, userUID);
  }

  @Put('editMission')
  @ApiOperation({
    summary: '미션 수정',
    description: '미션을 수정합니다. 자신이 부여한 미션만 수정할 수 있습니다.',
  })
  @ApiBearerAuth()
  editMission() {
    // TODO
  }

  @Delete('deleteMission')
  @ApiOperation({
    summary: '미션 삭제',
    description: '미션을 삭제합니다. 자신이 부여한 미션만 삭제할 수 있습니다.',
  })
  @ApiBearerAuth()
  deleteMission(
    @Query('mission_uid') missionUID: string,
    @Request() req: Request,
  ) {
    if (missionUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    return this.missionService.deleteMission(missionUID, userUID);
  }

  @Get('getMissionList')
  @ApiOperation({
    summary: '미션 목록 조회',
    description: '자신이 부여했거나 부여된 미션 목록을 조회합니다.',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'type',
    description: '리스트 타입 (0: 나에게 걸린 미션, 1: 내가 부여한 미션)',
    required: false,
  })
  getMissionList(@Query('type') type: number, @Request() req: Request) {
    type = type ?? 0;
    const userUID = req['user'].user_uid;
    return this.missionService.getMissionList(userUID, type);
  }

  @Post('completeMission')
  @ApiOperation({
    summary: '미션 완료 처리',
    description:
      '미션 UID로 미션을 완료처리하고 대상 유저에게 경험치를 지급합니다. 자신이 부여한 미션만 컨트롤할 수 있습니다.',
  })
  @ApiBearerAuth()
  async completeMission(
    @Query('mission_uid') missionUID: string,
    @Request() req: Request,
  ) {
    if (missionUID == null) throw new BadRequestException();
    const userUID = req['user'].user_uid;
    const result = await this.missionService.completeMission(
      missionUID,
      userUID,
    );
    return result;
  }
}
