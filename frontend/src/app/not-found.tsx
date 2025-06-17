import Link from "next/link";
import background from "../../public/placeholder-bg.jpg";

export default function NotFound() {
  return (
		<div style={styles.notFoundPage}>
			<div style={styles.backgroundImg} />
			<div style={styles.backgroundImgColor} />
			<div style={styles.whiteBoxWrappers}>
				<div style={styles.whiteBox}>
					<div style={{ fontSize: '32px', fontWeight: 'bold' }}>
						Página no encontrada
					</div>
				</div>
				<div style={styles.whiteBox}>
					<div>
						¡Lo sentimos!, la pagina que buscas no se pudo encontrar o no existe.
					</div>
					<Link href="/inicio" style={styles.whiteBoxButton}>
						<div style={{ paddingLeft: '12px', paddingRight: '8px', alignContent: 'center' }}>
							Volver al inicio
						</div>
					</Link>
				</div>
			</div>
		</div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
	notFoundPage: {
		position: 'relative',
		width: '100%',
		height: 'calc(100vh - 60px)',
	},
	backgroundImg: {
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		backgroundImage: `url(${background.src})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundAttachment: 'fixed',
		opacity: '0.5',
		zIndex: '-1',
	},
	backgroundImgColor: {
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		backgroundColor: 'gray',
		zIndex: '-2',
	},
	whiteBoxWrappers: {
		position: 'relative',
		display: 'flex',
		height: 'calc(100vh - 60px)',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		flexGrow: '1',
		gap: '16px',
	},
	whiteBox: {
		display: 'flex',
		flexDirection: 'column',
		color: 'black',
		backgroundColor: 'rgba(255, 255, 255, 0.65)',
		borderRadius: '20px',
		border: 'none',
		fontFamily: '"Helvetica Neue", sans-serif',
		fontSize: '16px',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		width: 'auto',
		padding: '24px 64px',
		margin: '0',
		gap: '16px',
		boxSizing: 'border-box',
	},
		whiteBoxButton: {
		color: 'black',
		backgroundColor: 'white',
		borderRadius: '16px',
		border: 'none',
		boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    textDecoration: 'none',
    userSelect: 'none',
    textAlign: 'center',
    padding: '4px 24px',
    cursor: 'pointer',
		width: 'fit-content',
		marginTop: '8px',
    fontSize: '16px',
		display: 'inline-block',
  },
}