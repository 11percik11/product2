import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import styles from "./index.module.css"
import { useLazyGetCurrentUsersQuery, useRegisterUserMutation} from "../../app/services/userApi"

interface Register {
  active: boolean
  setActive:React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  name: string
  group: string
  company: string
  presence: boolean
}

export const ModalRegister = ({ active, setActive }: Register) => {
  const [register] = useRegisterUserMutation()
  const [triggerCurrentQuery] = useLazyGetCurrentUsersQuery()
  const ArrGroup = ["Выбрать", "Прохожий", "Клиент", "Партнер"]

  const [formData, setFormData] = useState<FormData>({
    name: "",
    group: "",
    company: "",
    presence: true,
  })

  const [errors, setErrors] = useState({
    name: "",
    group: "",
    company: "",
  })
  useEffect(() => {
    setErrors({
      name: "",
      group: "",
      company: "",
    })
    setFormData({
      name: "",
      group: "",
      company: "",
      presence: true,
    })
  }, [active])


  const handleSubmit = async () => {
    if (!formData.name || !formData.group || !formData.company) {
      setErrors({
        name: formData.name ? "" : "Поле 'ФИО' обязательно для заполнения",
        group: formData.group ? "" : "Поле 'Группа' обязательно для заполнения",
        company: formData.company ? "" : "Поле 'Компания' обязательно для заполнения",
      })
      return
    }
    
    try {
      await register(formData).unwrap()
      await triggerCurrentQuery()
      setActive(false)
    } catch (err) {
      console.log(err)
    }
  }

  

  return (
    <div className={active ? styles.register + " " + styles.active : styles.register } onClick={() => setActive(false)}>
      <div className={styles.registerContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.register_box}>
          <svg className={styles.register_svg}
            onClick={() => setActive(false)}
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            width="40px"
            height="40px"
            viewBox="0 0 24 24"
            id="cross-circle"
          >
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.71,12.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.42,9.71,15.71a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.58,12,8.29,9.71A1,1,0,0,1,9.71,8.29L12,10.58l2.29-2.29a1,1,0,0,1,1.42,1.42L13.42,12Z" />
          </svg>
        </div>
        <form className={styles.register_form}>
          <div className={styles.register_form_container}>
            <div className={styles.register_box_input1}>
              <div className={styles.input_title}>ФИО</div>
              <div className={styles.box_input}>
              <input
                type="text"
                className={styles.register_input}
                onChange={(e) => setFormData({ ...formData, name: e.target.value,})}
                value={formData.name}
                id="name"
                name="name"

                />
              {errors.name && <div className={styles.error}>{errors.name}</div>}
                </div>
            </div>
            <div className={styles.register_box_input2}>
              <div className={styles.input_title}>Компания</div>
              <div className={styles.box_input}>
              <input
                type="text"
                name="company"
                value={formData.company}
                className={styles.register_input2}
                onChange={(e) => setFormData({ ...formData, company: e.target.value,})}
                
                />
              {errors.company && (
                <div className={styles.error}>{errors.company}</div>
              )}
              </div>
            </div>
            <div className={styles.register_box_input3}>
              <div className={styles.input_title}>Группа</div>
              <div className={styles.box_input}>

              <select
                className={styles.register_select}
                name="group"
                onChange={(e) => setFormData({ ...formData, group: e.target.value,})}
                value={formData.group}
                >
                {ArrGroup?.map((role, index) => (
                  <option key={index} value={role === "Выбрать" ? "" : role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.group && (
                <div className={styles.error}>{errors.group}</div>
              )}
              </div>
            </div>
            <div className={styles.register_box_input4}>
              <div className={styles.input_title}>Присутсвие</div>
              <input
                type="checkbox"
                className={styles.register_checkbox}
                name="presence"
                onChange={(e) => setFormData({ ...formData, presence: e.target.checked,})}
                checked={formData.presence}
              />
            </div>
            <div className={styles.buttonContainer}>
              <div onClick={handleSubmit} className={styles.addButton}>
                Добавить
              </div>
              <div
                className={styles.closeButton}
                onClick={() => setActive(false)}
              >
                Закрыть
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
