import { v4 as uuidv4 } from 'uuid';

export class ToolsService {
  createUID(length: number = 16) {
    return uuidv4().replace(/-/g, '').substring(0, length);
  }
}
