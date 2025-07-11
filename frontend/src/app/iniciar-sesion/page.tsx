'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from "next-auth/react"
import Image from "next/image"
import amlogo from "../../../public/amlogo.png"
import passwordVisible from "../../../public/open-eye.png"
import passwordInvisible from "../../../public/closed-eye.png"
import validator from 'validator'

export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  
  const getParams = () => {
    const registerResult = searchParams.get('registro-exitoso') === 'true'
    return registerResult
  }

  // Gestiona cambios en el formulario y quita errores tras cambio
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Intento de iniciar sesión
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validadores
    const newErrors: { [key: string]: string } = {}

    if (!form.email.trim()) {
      newErrors.email = 'Ingrese el correo asociado a su cuenta'
    } else if (!validator.isEmail(form.email.trim())) {
      newErrors.email = 'El formato de correo ingresado es incorrecto'
    }

    if (!form.password.trim()) {
      newErrors.password = 'Ingrese su contraseña'
    } else if (form.password.length < 5) {
      newErrors.password = 'Su contraseña debe tener al menos 5 caracteres'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      router.replace('/inicio');
    } else {
      newErrors.email = 'Correo o Contraseña incorrecto'
      newErrors.password = 'Correo o Contraseña incorrecto'
      setErrors(newErrors)
    }
    setLoading(false);
  }

  // Renderiza un campo con label, input field, type
  const renderField = (label: string, name: keyof typeof form, type = 'text', isPassword = false) => (
    <div style={styles.fieldGroup}>
      <label htmlFor={name}>{label}</label>
      <div style={isPassword ? styles.passwordWrapper : undefined}>
        <input
          id={name}
          type={isPassword ? (isPasswordShown ? 'text' : 'password') : type}
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
            onClick={() => setIsPasswordShown(prev => !prev)}
            style={styles.eyeButton}
          >
            <Image
              src={isPasswordShown ? passwordVisible : passwordInvisible}
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
        {
          getParams() &&
          <div style={styles.approved}>
            <div style= {{ fontSize: '48px' }}>✔</div>
            <div>¡Su cuenta ha sido confirmada con exito!</div>
            <div>Ahora puede iniciar sesión a su cuenta.</div>
          </div>
        }
        <form onSubmit={handleSubmit} style={styles.whiteBox}>
          <div style={styles.logoImageContainer}>
            <Image src={amlogo} alt="Logo" style={styles.logoImg} draggable={false} />
          </div>
          <h2 style={styles.titleBox}>Iniciar sesión</h2>
          <div style={styles.fieldsContainer}>
            {renderField('Correo electrónico', 'email')}
            {renderField('Contraseña', 'password', 'password', true)}

            <button type="submit" style={styles.whiteBoxButton} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          <p style={styles.footerText}>
            ¿No tienes cuenta?{' '}
            <a href="/registrarse" style={styles.link}>
              Regístrate
            </a>
          </p>
          <p style={styles.footerText}>
            ¿Olvidaste tu contraseña?{' '}
            <a href="/recuperar-cuenta" style={styles.link}>
              Recuperar cuenta
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
    width: '700px',
    boxSizing: 'border-box'
  },
  titleBox: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '0px',
  },
  approved: {
    display: 'flex',
		flexDirection: 'column',
		color: '#3f9b0b',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
		borderRadius: '20px',
    border: 'none',
    fontFamily: '"Helvetica Neue", sans-serif',
    fontSize: '20px',
    textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
    width: '700px',
    padding: '48px 0px',
    gap: '4px',
    marginTop: '4px',
    marginBottom: '4px',
    fontWeight: 'bold',
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    border: '2px solid #a8a8a8',
    width: '100%',
    padding: '24px',
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
    padding: '8px 24px'
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
