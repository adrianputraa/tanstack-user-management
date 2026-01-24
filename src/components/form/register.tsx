import startCase from 'lodash-es/startCase'
import { ChangeEvent, useState } from 'react'

type FormSchema = {
  email: string
  username: string
  password: string
}

const defaultForm: FormSchema = {
  email: '',
  username: '',
  password: '',
}

export default function RegisterForm() {
  const [form, setForm] = useState(defaultForm)
  const fields = Object.entries(form)

  const onChange = (k: string, e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }))
  }

  const onSubmit = () => {
    if (!window) return
    window.alert(JSON.stringify(form, undefined, 4))
  }

  return (
    <section>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-full grid gap-4 p-8">
          {fields.map(([key, value]) => (
            <div key={key} className="w-full">
              <label htmlFor={key + '_input'} className="font-medium">
                {startCase(key)}
              </label>
              <input
                id={key + '_input'}
                value={value}
                type={key !== 'password' ? 'text' : 'password'}
                className="w-full border p-1"
                onChange={(evt) => onChange(key, evt)}
              />
            </div>
          ))}

          <button
            onClick={onSubmit}
            className="bg-muted hover:bg-muted/75 cursor-pointer p-2 border"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  )
}
