'use client'
import styles from './page.module.css'
import { BotChatId, TelegramRequest } from '@/requests/RequestFunction'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import chief from '@/assets/images/babinovWatchYou.png'

export const Home: React.FC = () => {
  const { formRequest } = TelegramRequest()
  const [message, setMessage] = useState<string>('')
  const [phone, setPhone] = useState<number | null>(null)
  const [date, setDate] = useState<string>('')
  // используем объединение типов знаком | а не логическим сравнением ||
  const [chatId, setChatId] = useState<string | null>(null) // состояние для хранения chatId

  // получаем хуки состояния из BotChatId
  const { chatId: storedChatId, getChatId } = BotChatId()

  // загружаем chatId при монтировании компонента
  useEffect(() => {
    const fetchChatId = async () => {
      // берём сохранённое ID чата заказчика с ботом из localStorage
      const savedChatId: string | null = localStorage.getItem('chatId')
      if (savedChatId) {
        // получаем обновления с помощью getChatId
        setChatId(savedChatId)
        console.log('ID чата загружен из локального хранилища:', savedChatId)
      } else {
        await getChatId()
        // преобразуем в строку полученное ID чата с localStorage т.к. в хранилище оно является строкой
        const fetchedChatId = String(storedChatId)
        if (fetchedChatId) {
          // обновление состояние chatId
          setChatId(storedChatId)
          // првоеряем в консоли зпгруденный ID
          console.log('ID чата загружен:', storedChatId)
          // сохранение полученного ID чата в localStorage в виде строки т.к. в виде числа никак нельзя в TS
          localStorage.setItem('ID чата взято', fetchedChatId.toString())
        } else {
          console.error('Не удалось загрузить ID чата')
        }
      }
    }
    // запускаем ф-цию отправкии данных с формы
    fetchChatId()
  }, [getChatId, storedChatId])

  // обработчик отправки формы
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    // проверка заполнения формы и наличия chatId
    if (!message || !phone || !date || !chatId) {
      console.error('Все поля должны быть заполнены')
      return
    }

    // отправка данных в Telegram той самой ф-цией formRequest
    await formRequest(
      String(message),
      Number(phone),
      Number(date),
      String(chatId),
    )
  }

  return (
    <section className={styles.formSection}>
      <form className={styles.telegramForm} onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Отправляй поздравление, огузок!'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type='tel'
          placeholder='Введите своё ID чтоб тебя потом спец-службы вычислили'
          // используем оператор нулевого слияния для предоставления значения по умолчанию
          value={phone ?? ''}
          onChange={(e) => setPhone(Number(e.target.value))}
        />
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className={styles.sendBtn}>Отправить поздравление</button>
      </form>
      <Image
        width={300}
        height={300}
        alt='Chief'
        src={chief}
        priority
        className={styles.chief}
      />
    </section>
  )
}
export default Home
