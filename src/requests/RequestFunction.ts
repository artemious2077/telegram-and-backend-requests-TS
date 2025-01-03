import { create } from 'zustand'
import axios from 'axios'

// токен бота @Private_messege_bot
const botToken = '7958626938:AAHN03izGXXvHLpKyjoRJM-r0Jp-xN7xz3A'

export const TelegramRequest = create(() => ({
  // по скольку идёт только POST запрос, без сохранения данных в локально и не использую их в UI
  // formData: [],
  formRequest: async (
    message: string,
    phone: number,
    date: number,
    // тип string т.к. получаемое ID с localStorage является строкой
    chatId: string,
  ) => {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    // Форматируем сообщение
    const formattedMessage = `
     Сообщение: ${message}
     ID пользователя: ${phone}
     Дата: ${date}
   `
    try {
      const response = await axios.post(telegramUrl, {
        // мой ID чата
        // const chatId = 1686652259
        // ID чата с Ваньком
        // const chatId = 6493188313
        // специализированный бот (это то же айди чата с Ваньком)
        // const chatId = 6493188313
        chat_id: chatId,
        text: formattedMessage,
        // text: JSON.stringify(data) нужно выбирать, если у меня в форме не просто отправка текстового сообщения а например номер и почта ещё
        // text: data,
      })
      // очень опасно в консоль отправлять данные с формы. Не опасно только на время тестирвоания формы
      //   console.log('Сообщение отправлено:', response.data)
      console.log('Сообщение отправлено')
    } catch (error) {
      console.error('Ошибка отправки сообщения', error)
    }
  },
}))

// глобальная константа получения ID чата с ботом
const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getUpdates`

// тип состояния для ф-ции BotChatId
interface BotChatId_state {
  chatId: string | null
  offset: number
  getChatId: () => Promise<void>
}

// функция получения ID чата с ботом
export const BotChatId = create<BotChatId_state>((set, get) => ({
  chatId: null,
  offset: 0,
  getChatId: async () => {
    // Получаем текущее состояние с помощью get
    const { offset } = get()

    const updateResponse = await axios.get(telegramApiUrl, {
      params: {
        // Получаем обновления с текущим offset
        offset: offset,
      },
    })

    const updates = updateResponse.data.result

    if (updates.length > 0) {
      updates.forEach((update: any) => {
        const chatId = update.message.chat.id
        // Обновляем chatId в состоянии и перед этим фильтруем только ID заказчика
        if (chatId == 6088640425) {
          set({ chatId })
          localStorage.setItem('Customer chat_id', chatId)
        } else {
          console.log('Not customer chat_id')
        }
      })
      // Обновляем offset, чтобы не получать уже обработанные обновления
      set({ offset: updates })
    } else {
      console.log('No updates found')
    }
  },
}))
