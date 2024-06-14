import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { FamilyService } from './family.service';
import { CreateFamilyDTO } from './family.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Family')
@Controller('family')
export class FamilyController {
  constructor(private familyService: FamilyService) {}

  @Post('createFamily')
  @ApiOperation({
    summary: '패밀리 생성',
    description: '패밀리를 생성합니다.',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateFamilyDTO })
  @ApiConsumes('application/x-www-form-urlencoded')
  async createFamily(
    @Body() createFamilyDTO: CreateFamilyDTO,
    @Request() req: Request,
  ) {
    const userUID = req['user'].user_uid;
    if ((await this.familyService.hasFamily(userUID)) == undefined) {
      return this.familyService.createFamily(createFamilyDTO, req);
    } else {
      throw new ConflictException();
    }
  }

  @Get('getFamilyInfo')
  @ApiOperation({
    summary: '패밀리 정보 조회',
    description: '패밀리 UID로 패밀리 정보를 조회합니다.',
  })
  @ApiBearerAuth()
  async getFamilyInfo(@Request() req: Request) {
    // 일단은 내가 속해있는 패밀리의 정보만 가져옴
    // 패밀리에 속해있지 않을경우 undefined
    const userUID = req['user'].user_uid;
    return this.familyService.getFamilyInfo(userUID);
  }
}
