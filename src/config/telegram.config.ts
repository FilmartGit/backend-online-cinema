import { ConfigService } from '@nestjs/config'
import { Telegram } from 'src/telegram/telegram.interface'

const configService = new ConfigService();
export const getTelegramConfig = (): Telegram => ({
  chatId: configService.get('CHAT_ID')!,
  token: configService.get('TOKEN')!,
})
