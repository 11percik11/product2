import styles from "./index.module.css"
import {useDeleteUserMutation,useLazyGetCurrentUsersQuery,useUpdateUserMutation,} from "../../app/services/userApi"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

interface UpdateProps {
  active: boolean
  setActive:React.Dispatch<React.SetStateAction<boolean>>;
  data: {
    id: string
    name: string
    group: string
    company: string
    presence: boolean
  }
}

interface FormData {
  id: string
  name: string
  group: string
  company: string
  presence: boolean
}

export const ModalUpdate = ({ active, setActive, data }: UpdateProps) => {

  const [updateProduct] = useUpdateUserMutation()
  const [triggerCurrentQuery] = useLazyGetCurrentUsersQuery()
  const [deleteUser] = useDeleteUserMutation()
  const ArrGroup = ["Выбрать", "Прохожий", "Клиент", "Партнер"]

  const [formData, setFormData] = useState<FormData>({
    id: data.id || "",
    name: data.name || "",
    group: data.group || "",
    company: data.company || "",
    presence: data.presence || false,
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
      id: data.id || "",
      name: data.name || "",
      group: data.group || "",
      company: data.company || "",
      presence: data.presence || false,
    })
  }, [active, data])

  const handleUpdate = async () => {
    if (!formData.name || !formData.group || !formData.company) {
      setErrors({
        name: formData.name ? "" : "Поле 'ФИО' обязательно для заполнения",
        group: formData.group ? "" : "Поле 'Группа' обязательно для заполнения",
        company: formData.company ? "" : "Поле 'Компания' обязательно для заполнения",
      })
      return
    }

    if (formData.name == data.name && formData.group == data.group && formData.company == data.company && formData.presence == data.presence) {
      return
    }

    try {
      await updateProduct({ id: data.id, userData: formData }).unwrap()
      await triggerCurrentQuery()
      await setActive(false)
    } catch (err) {
      console.log(err)
    }
  }

  const DeleteUser = async () => {
    try {
      await deleteUser({ id: data.id }).unwrap()
      await triggerCurrentQuery()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={active ? styles.update + " " + styles.active : styles.update } onClick={() => setActive(false)}>
      <div className={styles.updateContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.update_box}>
          <svg
            className={styles.update_svg}
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
        <form className={styles.update_form}>
          <div className={styles.update_form_container}>
            <div className={styles.update_box_input1}>
              <div className={styles.input_title}>ФИО</div>
              <div className={styles.box_input}>

              <input
                type="text"
                className={styles.update_input}
                onChange={(e) => setFormData({ ...formData, name: e.target.value,})}
                value={formData.name}
                id="name"
                name="name"

                />
              {errors.name && <div className={styles.error}>{errors.name}</div>}
            </div>
                </div>
            <div className={styles.update_box_input2}>
              <div className={styles.input_title}>Компания</div>
              <div className={styles.box_input}>

              <input
                type="text"
                name="company"
                value={formData.company}
                className={styles.update_input2}
                onChange={(e) => setFormData({ ...formData, company: e.target.value,})}

                />
              {errors.company && (
                <div className={styles.error}>{errors.company}</div>
              )}
              </div>
            </div>
            <div className={styles.update_box_input3}>
              <div className={styles.input_title}>Группа</div>
              <div className={styles.box_input}>

              <select
                className={styles.update_select}
                name="group"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value})}
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
            <div className={styles.update_box_input4}>
              <div className={styles.input_title}>Присутствие</div>
              <input
                type="checkbox"
                className={styles.update_checkbox}
                name="presence"
                checked={formData.presence}
                onChange={(e) => setFormData({ ...formData, presence: e.target.checked})}
              />
            </div>
            <div className={styles.buttonContainer}>
              <div className={styles.updateButton} onClick={handleUpdate}>
                Изменить
              </div>
              <div className={styles.deleteButton} onClick={DeleteUser}>
                Удалить
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
