'use client'

import { useState } from 'react'
import Image from 'next/image'
import amlogo from '../../../public/amlogo.png'
import passwordVisible from '../../../public/open-eye.png'
import passwordInvisible from '../../../public/closed-eye.png'
import validator from 'validator'
import { lookForRepeatUserData } from '../lib/lookForRepeatedUserData'
import { verificationTokenHandler } from '../lib/verificationTokenHandler'

export default function Register() {
  const [form, setForm] = useState({
    userName: '',
    displayName: '',
    email: '',
    repeatEmail: '',
    phone: '',
    rut: '',
    password: '',
    repeatPassword: ''
  })
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isRepeatPasswordShown, setIsRepeatPasswordShown] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const [canRegister, setCanRegister] = useState<boolean>(false)

  // Gestiona cambios en el formulario y quita errores tras cambio
  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  // Intento de registro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validadores
    const newErrors: { [key: string]: string } = {}

    if (!form.userName.trim()) {
      newErrors.userName = 'Ingrese su nombre'
    } else if (!/^[A-Za-z0-9]+$/.test(form.userName.trim())) {
      newErrors.userName = 'Solo letras y números, sin espacios ni símbolos'
    }
    if (!form.displayName.trim()) {
      newErrors.displayName = 'Ingrese un nombre desplegable'
    } else if (!/^[A-Za-z0-9 ]+$/.test(form.displayName.trim())) {
      newErrors.displayName = 'Solo letras, números y espacios'
    }

    if (!form.email.trim()) {
      newErrors.email = 'Ingrese un correo electrónico'
    } else if (!validator.isEmail(form.email.trim())) {
      newErrors.email = 'Formato de correo inválido'
    }
    if (!form.repeatEmail.trim()) {
      newErrors.repeatEmail = 'Repita el correo electrónico'
    } else if (form.email !== form.repeatEmail) {
      newErrors.repeatEmail = 'Los correos electrónicos no coinciden'
    }

    if (!form.phone.trim()) newErrors.phone = 'Ingrese su teléfono'
    if (!form.rut.trim()) newErrors.rut = 'Ingrese su RUT'
    
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
    const userAvailable = await lookForRepeatUserData({
      email: form.email,
      userName: form.userName,
      phone: form.phone,
      rut: form.rut
    });

    // Revisa si ya existe un usuario con los datos ingresados
    if (userAvailable.messageType !== 'ok') {
      setLoading(false)
      setCanRegister(false)
      setErrors(prev => ({ ...prev, [userAvailable.messageType]: userAvailable.message }))
      return
    }
    else {
      // Si no hay errores, se procede a crear el token de verificación
      // Y enviar el correo de verificación de inmediato
      const data = {
        userName: form.userName,
        displayName: form.displayName,
        email: form.email,
        phone: form.phone,
        rut: form.rut,
        password: form.password
      }
      const token = await verificationTokenHandler('register', data);
      // Revisa si hubo un error al generar el token
      if (token.status === 'error') {
        setLoading(false)
        setCanRegister(false)
        setErrors(prev => ({ ...prev, default: token.message }))
        return
      } else {
        // Si se generó el token correctamente muestra mensaje de éxito
        setErrors({})
        setForm({
          userName: '',
          displayName: '',
          email: '',
          repeatEmail: '',
          phone: '',
          rut: '',
          password: '',
          repeatPassword: ''
        });
        setCanRegister(true)
        setLoading(false)
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
    }
  }

  // Handlers para cada campo con validaciones específicas
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
    handleChange('userName', value);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9 ]/g, '');
    handleChange('displayName', value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9@._]/g, '');
    handleChange('email', value);
  };

  const handleRepeatEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9@._]/g, '');
    handleChange('repeatEmail', value);
  };

  const formatPhone = (phone: string) => {
    // Elimina todo excepto números
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    // Limita el número a 11 dígitos
    cleanPhone = cleanPhone.slice(0, 11);
    // Formato: XX X XXXX XXXX
    // Elimina todo excepto números
    if (cleanPhone.length === 0) return '';
    let formatted = '';
    if (cleanPhone.length <= 2) {
      formatted = `+ ${cleanPhone}`;
    } else if (cleanPhone.length <= 3) {
      formatted = `+ ${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2)}`;
    } else if (cleanPhone.length <= 7) {
      formatted = `+ ${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 3)} ${cleanPhone.slice(3)}`;
    } else {
      formatted = `+ ${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 3)} ${cleanPhone.slice(3, 7)} ${cleanPhone.slice(7, 11)}`;
    }
    return formatted.trim();
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = formatPhone(value);
    handleChange('phone', value);
  };

  const formatRut = (rut: string) => {
    // Elimina todo excepto números y K/k
    let cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    // Limita el rut limpio a 10 caracteres (máximo 9 dígitos + 1 dv)
    cleanRut = cleanRut.slice(0, 10);
    if (cleanRut.length <= 1) return cleanRut;
    let body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    // Agrega puntos cada 3 dígitos desde el final
    body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const formattedRut = `${body}-${dv}`;
    // Limita el rut formateado a 14 caracteres (incluyendo puntos y guion)
    return formattedRut.slice(0, 14);
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9kK]/g, '');
    value = formatRut(value);
    handleChange('rut', value);
  };
  
  // Renderiza un campo con label, input field, type
  const renderField = (
    label: string,
    name: keyof typeof form,
    handler: ((e: React.ChangeEvent<HTMLInputElement>) => void) | null,
    type = 'text',
    isPassword = false,
  ) => (
    <div style={styles.fieldGroup}>
      <label htmlFor={name}>{label}</label>
      <div style={isPassword ? styles.passwordWrapper : undefined}>
        <input
          id={name}
          type={isPassword ? (name === 'password' && isPasswordShown ? 'text' : name === 'repeatPassword' && isRepeatPasswordShown ? 'text' : 'password') : type}
          value={form[name]}
          onChange={e => {
            handleChange(name, e.target.value);
            if (handler) handler(e);
          }}
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
        {
          canRegister &&
          <div style={styles.approved}>
            <div style= {{ fontSize: '48px' }}>✔</div>
            <div>Para poder validar su cuenta, por favor revise su correo electrónico.</div>
            <div>Tiene 24 horas para realizar la validación.</div>
          </div>
        }
        <form onSubmit={handleSubmit} style={styles.whiteBox}>
          <div style={styles.logoImageContainer}>
            <Image src={amlogo} alt="Logo" style={styles.logoImg} draggable={false} />
          </div>
          <h2 style={styles.titleBox}>Crear cuenta</h2>
          <div style={styles.doubleColumn}>
            <div style={styles.fieldsContainer}>
              {renderField('Nombre unico', 'userName', handleUserNameChange)}
              {renderField('Correo electrónico', 'email', handleEmailChange)}
              {renderField('Teléfono', 'phone', handlePhoneChange)}
              {renderField('Contraseña', 'password', null, 'password', true)}
            </div>
            <div style={styles.fieldsContainer}>
              {renderField('Nombre publico', 'displayName', handleDisplayNameChange)}
              {renderField('Repetir correo electrónico', 'repeatEmail', handleRepeatEmailChange)}
              {renderField('RUT', 'rut', handleRutChange)}
              {renderField('Repetir contraseña', 'repeatPassword', null, 'password', true)}
            </div>
          </div>
          <button type="submit" style={styles.whiteBoxButton} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          {errors['default'] && <span style={styles.errorText}>{errors['default']}</span>}

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
    width: '1000px',
    padding: '48px 0px',
    gap: '4px',
    marginTop: '4px',
    marginBottom: '4px',
    fontWeight: 'bold',
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
