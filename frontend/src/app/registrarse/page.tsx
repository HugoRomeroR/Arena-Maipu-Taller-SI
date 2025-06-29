'use client'

import { useState } from 'react'
import Image from 'next/image'
import amlogo from '../../../public/amlogo.png'
import passwordVisible from '../../../public/open-eye.png'
import passwordInvisible from '../../../public/closed-eye.png'
import validator from 'validator'

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    rut: '',
    displayName: '',
    password: '',
    repeatPassword: ''
  })
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isRepeatPasswordShown, setIsRepeatPasswordShown] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  // Gestiona cambios en el formulario y quita errores tras cambio
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Intento de registro
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Validadores
    const newErrors: { [key: string]: string } = {}

    if (!form.email.trim()) {
      newErrors.email = 'Ingrese un correo electrónico'
    } else if (!validator.isEmail(form.email.trim())) {
      newErrors.email = 'Formato de correo inválido'
    }

    if (!form.firstName.trim()) newErrors.firstName = 'Ingrese su nombre'
    if (!form.lastName.trim()) newErrors.lastName = 'Ingrese su apellido'
    if (!form.phone.trim()) newErrors.phone = 'Ingrese su teléfono'
    if (!form.rut.trim()) newErrors.rut = 'Ingrese su RUT'
    if (!form.displayName.trim()) newErrors.displayName = 'Ingrese un nombre desplegable'

    if (!form.password.trim()) {
      newErrors.password = 'Ingrese una contraseña'
    } else if (form.password.length < 5) {
      newErrors.password = 'Debe tener al menos 5 caracteres'
    }

    if (!form.repeatPassword.trim()) {
      newErrors.repeatPassword = 'Repita la contraseña'
    } else if (form.password !== form.repeatPassword) {
      newErrors.repeatPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // Aqui deberia ir la llamada a services
    setLoading(true)
    setTimeout(() => {
      alert('Registro simulado')
      setLoading(false)
    }, 1000)
  }

  // Renderiza un campo con label, input field, type
  const renderField = (label: string, name: keyof typeof form, type = 'text', isPassword = false) => (
    <div style={styles.fieldGroup}>
      <label htmlFor={name}>{label}</label>
      <div style={isPassword ? styles.passwordWrapper : undefined}>
        <input
          id={name}
          type={isPassword ? (name === 'password' && isPasswordShown ? 'text' : name === 'repeatPassword' && isRepeatPasswordShown ? 'text' : 'password') : type}
          value={form[name]}
          onChange={e => handleChange(name, e.target.value)}
          placeholder={label}
          style={{
            ...styles.input,
            borderColor: errors[name] ? 'red' : '#ccc',
            paddingRight: isPassword ? '48px' : undefined
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => {
              if (name === 'password') setIsPasswordShown(prev => !prev)
              if (name === 'repeatPassword') setIsRepeatPasswordShown(prev => !prev)
            }}
            style={styles.eyeButton}
          >
            <Image
              src={
                name === 'password'
                  ? isPasswordShown
                    ? passwordVisible
                    : passwordInvisible
                  : isRepeatPasswordShown
                    ? passwordVisible
                    : passwordInvisible
              }
              alt="toggle visibility"
              style={styles.eyeIcon}
              draggable={false}
            />
          </button>
        )}
      </div>
      {errors[name] && <span style={styles.errorText}>{errors[name]}</span>}
    </div>
  )

  return (
    <div style={styles.loginPage}>
      <div className="background-img" />
      <div className="background-img-color" />
      <div style={styles.whiteBoxWrapper}>
        <form onSubmit={handleSubmit} style={styles.whiteBox}>
          <div style={styles.logoImageContainer}>
            <Image src={amlogo} alt="Logo" style={styles.logoImg} draggable={false} />
          </div>
          <h2 style={styles.titleBox}>Crear cuenta</h2>
          <div style={styles.doubleColumn}>
            <div style={styles.fieldsContainer}>
                {renderField('Nombre', 'firstName')}
                {renderField('Teléfono', 'phone')}
                {renderField('Correo electrónico', 'email')}
                {renderField('Contraseña', 'password', 'password', true)}
            </div>
            <div style={styles.fieldsContainer}>
                {renderField('Apellido', 'lastName')}
                {renderField('RUT', 'rut')}
                {renderField('Nombre desplegable', 'displayName')}
                {renderField('Repetir contraseña', 'repeatPassword', 'password', true)}
            </div>
          </div>
          <button type="submit" style={styles.whiteBoxButton} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <p style={styles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <a href="/iniciar-sesion" style={styles.link}>
              Iniciar Sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  loginPage: {
    position: 'relative',
    width: '100%',
  },
  whiteBoxWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '24px',
    zIndex: 1,
    padding: '48px',
  },
  logoImageContainer: {
    width: 'auto',
    height: '80px',
    borderRadius: '12px',
  },
  logoImg: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  whiteBox: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: '20px',
    color: 'black',
    fontFamily: '"Helvetica Neue", sans-serif',
    fontSize: '16px',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 128px',
    gap: '16px',
    maxWidth: '90%',
    width: '1000px',
    boxSizing: 'border-box'
  },
  titleBox: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '0px',
  },
  doubleColumn: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '16px',
    border: '2px solid #a8a8a8',
    padding: '24px',
    gap: '24px',
    width: '100%',
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '24px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    gap: '4px',
  },
  input: {
    height: "48px",
    width: "100%",
    fontFamily: '"Helvetica Neue", sans-serif',
    background: "white",
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: "border-box",
    borderRadius: '24px',
    border: '1px solid #ccc',
    overflow: 'hidden',
    fontSize: '16px'
  },
  passwordWrapper: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  eyeButton: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  },
  eyeIcon: {
    width: '20px',
    height: '20px',
    objectFit: 'contain'
  },
  whiteBoxButton: {
    width: '100%',
    marginTop: '16px',
    color: 'black',
    backgroundColor: '#A6F095',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    textDecoration: 'none',
    userSelect: 'none',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '8px 24px',
  },
  footerText: {
    fontSize: '14px',
    marginTop: '8px',
    fontWeight: 'bold',
  },
  link: {
    color: '#DD2378',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  errorText: {
    color: 'red',
    fontSize: '14px'
  }
}
