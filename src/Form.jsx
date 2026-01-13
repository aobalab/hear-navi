import { useState, useEffect } from 'react'
import './Form.css'

const initialFormData = {
  name: '',
  email: '',
  message: ''
}

function Form() {
  const [formData, setFormData] = useState(initialFormData)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  useEffect(() => {
    if (submitted) {
      const timeoutId = setTimeout(() => {
        setFormData(initialFormData)
        setSubmitted(false)
      }, 2000)

      return () => clearTimeout(timeoutId)
    }
  }, [submitted])

  return (
    <div className="form-container">
      <h2>お問い合わせフォーム</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">お名前</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">メッセージ</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        
        <button type="submit" disabled={submitted}>送信</button>
        
        {submitted && (
          <p className="success-message">送信完了しました！</p>
        )}
      </form>
    </div>
  )
}

export default Form
