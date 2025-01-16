'use client'
import styles from './page.module.css'
import { BotChatId, TelegramRequest } from '@/requests/RequestFunction'
import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import chief from '@/assets/images/andre-rush.png'
import { AnswerCircle } from '@/app/modules/AnswerCircle/AnswerCircle'

export const Home: React.FC = () => {
  const { formRequest } = TelegramRequest()
  const [message, setMessage] = useState<string>('')
  // we using | sign, not logic || sign
  const [phone, setPhone] = useState<number | null>(null)
  const [date, setDate] = useState<string>('')

  // Hardcoded chat ID. If you use this variant, comment useEffect & chat ID state save
  // const chatId = '1686652259'

  // chat ID state save
  const [chatId, setChatId] = useState<string | null>(null)
  // receiving state hooks from BotChatId
  const { chatId: storedChatId, getChatId } = BotChatId()

  // loaded chat ID on component mounting
  useEffect(() => {
    const fetchChatId = async () => {
      // taking chat ID (to our bot-chat with people) from localStorage
      const savedChatId: string | null = localStorage.getItem('chatId')
      setChatId(savedChatId)
    }
    // activating form-function
    fetchChatId()
  }, [getChatId, storedChatId])

  // form submit handler
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    // validation inspect
    if (!message || !phone || !date || !chatId) {
      console.error('Все поля должны быть заполнены')
      return
    }

    // Set up sending form data types
    await formRequest(
      String(message),
      Number(phone),
      Number(date),
      String(chatId),
    )
    alert('Your order was sending to chief')
  }

  return (
    <section className={styles.formSection}>
      <AnswerCircle />
      <form className={styles.telegramForm} onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Send your order, bich'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type='tel'
          placeholder='Enter the message, its very necessary for me'
          // we used zero merge operator for placed a default state
          value={phone ?? ''}
          onChange={(e) => setPhone(Number(e.target.value))}
        />
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className={styles.sendBtn}>Send order</button>
      </form>
      <Image
        width={350}
        height={390}
        alt='Chief'
        src={chief}
        priority
        className={styles.chief}
      />
    </section>
  )
}
export default Home
