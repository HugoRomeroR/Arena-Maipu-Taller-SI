'use client';

import Link from "next/link";

type leftContainerContent = {
  text: string;
	hasRef: boolean;
  ref: string;
  hasImage: boolean;
  imageUrl: string;
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

	// Contenido de Servicios
	const serviciosContent = [
		{
			text: 'Baby Fútbol',
			hasRef: true,
			ref: '/canchas?tag=baby',
			hasImage: false,
			imageUrl: ''
		},{
			text: 'Fútbolito',
			hasRef: true,
			ref: '/canchas?tag=futbolito',
			hasImage: false,
			imageUrl: ''
		},{
			text: 'Tenis',
			hasRef: true,
			ref: '/canchas?tag=tenis',
			hasImage: false,
			imageUrl: ''
		},{
			text: 'Padel',
			hasRef: true,
			ref: '/canchas?tag=padel',
			hasImage: false,
			imageUrl: ''
		}
	]

	// Contenido de Únetenos
	const unetenosContent = [
		{
			text: 'Registrate gratis',
			hasRef: false,
			ref: '',
			hasImage: false,
			imageUrl: ''
		}
	]

	// Contenedor con estilo para horas comunes
  function boxHourContainer(hours: string) {
		return (
			<div style={styles.boxHourContainer}>
				<p style={{ margin: '0px', paddingTop: '7px' }}>{hours}</p>
				<p style={{ margin: '0px', paddingBottom: '7px' }}>Hrs</p>
			</div>
		);
	}

	// Contenedor para información personalizada (Sección izquierda)
  function leftContainer(
			title: string,
			content: leftContainerContent[],
			btnColor: string,
			ref: string,
			btnText: string
		) {
		return (
			<div style={styles.whiteCardBox}>

				{ /* Titulo */ }
				<p style={{ fontWeight: 'bold', margin: '2px 0px' }}>{title}</p>
				{ /* Linea */ }
				<hr style={{ border: 'none', height: '1px', width: '100%', backgroundColor: '#AEAEAE' }} />
				{ /* Contenido */ }
				{content.map((item, index) => (
					<p key={index} style={{ margin: '2px 0px' }}>
						{item.hasRef ? (
								<Link href={item.ref} style={{ width: '100%', color: 'black', textDecoration: 'none' }}>
									{item.text} »
								</Link>
							):(
								item.text
							)
						}
					</p>
				))}
				{ /* Boton */ }
				<Link href={ref} style={{ ...styles.whiteCardBoxButton, backgroundColor: btnColor }} >
					{btnText}
        </Link>
			</div>
		);
	}

  return (
		<div className= 'scrollbarLayout'>

			{ /* Barra superior de canchas disponibles */ }
			<div style={styles.hoursWrapper}>

				<div style={{
					...styles.boxHourContainer,
					background: "linear-gradient(to right, #F3A6CD 0%, #F3A6CD 80%, #D9D9D9 100%)",
				}}>
					<p style={{ margin: '0px', paddingTop: '7px' }}>Canchas</p>
					<p style={{ margin: '0px', paddingBottom: '7px' }}>Disponibles</p>
				</div>

				<Link href="/canchas?tag=baby" style={styles.hoursLinkStyle}>
					<p style={{ paddingLeft: '12px', paddingRight: '6px' }}>BABY</p>
				</Link>
				{boxHourContainer("09:00 - 10:00")}
				{boxHourContainer("10:00 - 11:00")}
				{boxHourContainer("11:00 - 12:00")}

				<Link href="/canchas?tag=padel" style={styles.hoursLinkStyle}>
					<p style={{ paddingLeft: '12px', paddingRight: '8px' }}>PADEL</p>
				</Link>
				{boxHourContainer("09:00 - 10:00")}
				{boxHourContainer("10:00 - 11:00")}
				{boxHourContainer("11:00 - 12:00")}
				
				<Link href="/canchas" style={styles.hoursLinkStyle}>
					<div style={{
						...styles.boxHourContainer,
						background: "linear-gradient(to right, #D9D9D9 0%, #A6F095 20%, #A6F095 100%)",
					}}>
						<p style={{ margin: '0px', paddingTop: '7px' }}>Ver todas</p>
						<p style={{ margin: '0px', paddingBottom: '7px' }}>las canchas</p>
					</div>
				</Link>

			</div>

			{ /* Cuerpo de la pagina */ }
			<div style={styles.pageBodyWrapper}>
				
				<div style={{ display: 'flex', flexDirection: 'column', width: '200px', height: 'auto', gap: '40px' }}>
					{leftContainer('Servicios', serviciosContent, '#F09596', '/canchas', 'Ver más')}
					{leftContainer('Únetenos', unetenosContent, '#A6F095', '/registrarse', 'Registrarse')}
				</div>

				<div style={{ flexGrow: '1', height: 'auto' }}>
					{children}
				</div>
					
				<div style={{ width: '200px', height: 'auto' }}>
					
				</div>

			</div>
		</div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
	boxHourContainer: {
		width: '100px',
		padding: '1px 20px',
		backgroundColor: 'white',
		border: '0px solid',
		borderBottomLeftRadius: '16px',
		borderBottomRightRadius: '16px',
		textAlign: 'center',
	},
  hoursWrapper: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
		display: 'flex',
		flexDirection: 'row',
		fontFamily: '"Verdana", sans-serif',
		fontSize: '13px',
		gap: '6px',
		borderBottomLeftRadius: '16px',
		borderBottomRightRadius: '16px',
		userSelect: 'none',
  },
	hoursLinkStyle: {
		color: 'black',
		display: 'flex',
		flexDirection: 'row',
		textDecoration: 'none',
		gap: '6px',
	},
	pageBodyWrapper: {
		margin: '16px 48px',
		minHeight: '500px',
		display: 'flex',
		flexDirection: 'row',
		gap: '16px',
	},
	whiteCardBox: {
		display: 'flex',
		flexDirection: 'column',
		color: 'black',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
		fontFamily: '"Helvetica Neue", sans-serif',
		fontSize: '16px',
    width: '100%',
    minHeight: '32px',
    padding: '16px',
    margin: '0',
    boxSizing: 'border-box',
  },
	whiteCardBoxButton: {
		color: 'black',
		borderRadius: '16px',
		border: 'none',
    fontWeight: 'bold',
    textDecoration: 'none',
    userSelect: 'none',
    textAlign: 'center', // horizontal
    alignContent: 'center', // vertical
    padding: '4px 24px',
    cursor: 'pointer',
		width: 'auto',
		marginTop: '8px',
    fontSize: '16px',
  },
}