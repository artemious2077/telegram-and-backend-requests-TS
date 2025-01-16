import { useState } from 'react'
import styles from './AnswerCircle.module.css'

export const AnswerCircle = () => {
  const [state, setState] = useState(false)

  const handleClick = () => {
    setState((state) => !state)
  }

  return (
    <section className={styles.answerSection}>
      <div className={styles.questionBlock} onClick={handleClick}>
        <p>?</p>
      </div>
      {state && (
        <div className={styles.answerBlock}>
          <p>
            You need create your telegram bot & send bot username to customer.
            Customer need communication with bot (he need hust send 1 message or
            click [/start] button on the bot chat) and after, you can give chat
            ID with your customer.
          </p>
        </div>
      )}
    </section>
  )
}
