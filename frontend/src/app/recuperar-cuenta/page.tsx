'use client'

import { useState } from 'react'
import Image from 'next/image'
import amlogo from '../../../public/amlogo.png'
import validator from 'validator'
import { lookForRepeatUserData } from '../lib/lookForRepeatedUserData'
import { verificationTokenHandler } from '../lib/verificationTokenHandler'

export default function RecoverAccount() {
  const [form, setForm] = useState({
    email: '',
    repeatEmail: '',
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [canRecover, setCanRecover] = useState<boolean>(false)

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9@._]/g, '')
    handleChange('email', value)
  }

  const handleRepeatEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9@._]/g, '')
    handleChange('repeatEmail', value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!form.email.trim()) {
      newErrors.email = 'Ingrese su correo electrónico'
    } else if (!validator.isEmail(form.email.trim())) {
      newErrors.email = 'Formato de correo inválido'
    }

    if (!form.repeatEmail.trim()) {
      newErrors.repeatEmail = 'Repita su correo electrónico'
    } else if (form.email !== form.repeatEmail) {
      newErrors.repeatEmail = 'Los correos no coinciden'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    const emailExists = await lookForRepeatUserData({
        email: form.email,
    });

    // Revisa si existe una cuenta con ese email
    if (emailExists.messageType !== 'email' && emailExists.messageType !== 'default') {
        setLoading(false)
        setCanRecover(false)
        setErrors(prev => ({ ...prev, email: 'No existe una cuenta asociada a ese correo.' }))
        return
    }
    else {
        // Si no hay errores, se procede a crear el token de verificación
        // Y enviar el correo de verificación de inmediato
        const data = {
            email: form.email,
        }
        const token = await verificationTokenHandler('recover', data);
        // Revisa si hubo un error al generar el token
        if (token.status === 'error') {
            setLoading(false)
            setCanRecover(false)
            setErrors(prev => ({ ...prev, default: token.message }))
            return
        } else {
            // Si se generó el token correctamente muestra mensaje de éxito
            setErrors({})
            setForm({
                email: '',
                repeatEmail: '',
            });
            setCanRecover(true)
            setLoading(false)
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }, 100)
        }
    }
  }

  const renderField = (
    label: string,
    name: keyof typeof form,
    handler: ((e: React.ChangeEvent<HTMLInputElement>) => void) | null,
    type = 'text',
  ) => (
    <div style={styles.fieldGroup}>
      <label htmlFor={name}>{label}</label>
      <div>
        <input
          id={name}
          type={type}
          value={form[name]}
          onChange={e => {
            handleChange(name, e.target.value)
            if (handler) handler(e)
          }}
          placeholder={label}
          style={{
            ...styles.input,
            borderColor: errors[name] ? 'red' : '#ccc',
          }}
        />
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
          canRecover &&
          <div style={styles.approved}>
            <div style= {{ fontSize: '48px' }}>✔</div>
            <div>Para poder recuperar su cuenta, por favor revise su correo electrónico.</div>
            <div>Tiene 24 horas para realizar la validación.</div>
          </div>
        }
        <form onSubmit={handleSubmit} style={styles.whiteBox}>
          <div style={styles.logoImageContainer}>
            <Image src={amlogo} alt="Logo" style={styles.logoImg} draggable={false} />
          </div>
          <h2 style={styles.titleBox}>Recuperar cuenta</h2>
          <div style={styles.fieldsContainer}>
            {renderField('Correo electrónico', 'email', handleEmailChange)}
            {renderField('Repetir correo electrónico', 'repeatEmail', handleRepeatEmailChange)}

            <button type="submit" style={styles.whiteBoxButton} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
          <p style={styles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" style={styles.link}>
              Inicia sesión
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
    boxSizing: 'border-box',
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
    boxSizing: 'border-box',
    wordBreak: 'break-word',
    padding: '48px',
    gap: '4px',
    marginTop: '4px',
    marginBottom: '4px',
    fontWeight: 'bold',
  },
  titleBox: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '0px',
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    border: '2px solid #a8a8a8',
    width: '100%',
    padding: '24px',
    gap: '24px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    gap: '4px',
  },
  input: {
    height: '48px',
    width: '100%',
    fontFamily: '"Helvetica Neue", sans-serif',
    background: 'white',
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: 'border-box',
    borderRadius: '24px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  whiteBoxButton: {
    marginTop: '16px',
    color: 'black',
    backgroundColor: '#A6F095',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
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
    cursor: 'pointer',
  },
  errorText: {
    color: 'red',
    fontSize: '14px',
  },
}
