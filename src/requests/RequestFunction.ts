import { create } from 'zustand'
import axios from 'axios'

// our bot token @Private_messege_bot
const botToken = '7958626938:AAHN03izGXXvHLpKyjoRJM-r0Jp-xN7xz3A'

export const TelegramRequest = create(() => ({
  // [] - massive for show our receive UI. Because we use POST request, we don't need this state
  // formData: [],
  formRequest: async (
    message: string,
    phone: number,
    date: number,
    // I placed "string" type, because I receive chat ID from localStorage
    chatId: string,
  ) => {
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
    // Set up our sended message on the telegram
    const formattedMessage = `
     Message: ${message}
     User ID: ${phone}
     Order date: ${date}
   `
    try {
      const response = await axios.post(telegramUrl, {
        // My chat ID
        // const chatId = 1686652259
        // Bot chat ID with my friend. I can see it on browser console
        // const chatId = 6493188313
        chat_id: chatId,
        text: formattedMessage,
        // text: JSON.stringify(data) need to selected if i have no only one input, if o have many inputs (text, data, number...)
        // text: data,
      })
      // Its very dangerous sending form data to browser console. Not dangerous on testing time
      //   console.log('Message sended:', response.data)
      console.log('Message sended')
    } catch (error) {
      console.error('Message sended error', error)
    }
  },
}))

// Global const for receive bot chat ID
const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getUpdates`

// BotChatId_state - this is type state for BotChatId function
interface BotChatId_state {
  chatId: string | null
  offset: number
  getChatId: () => Promise<void>
}

// Received ID bot chat function
export const BotChatId = create<BotChatId_state>((set, get) => ({
  chatId: '1686652259',
  offset: 0,
  getChatId: async () => {
    // Hardcode. If you use this variant, comment all underside code
    // const chatId = '1686652259'
    // set({ chatId })

    // Receive update by using get
    const { offset } = get()

    const updateResponse = await axios.get(telegramApiUrl, {
      params: {
        // Receive updates with current offset
        offset: offset,
      },
    })

    const updates = updateResponse.data.result

    if (updates.length > 0) {
      updates.forEach((update: any) => {
        const chatId = update.message.chat.id
        // Now, we updating chatId state
        // If we need filter our chatId, we can create next logic (this logic in commented)
        // if (chatId == 6088640425) {
        set({ chatId })
        localStorage.setItem('Customer chat ID', chatId)
        // } else {
        //   console.log('Not customer chat ID')
        // }
      })
      // Update offset state for avoid received processed update
      set({ offset: updates })
    } else {
      console.log('No updates found')
    }
  },
}))
