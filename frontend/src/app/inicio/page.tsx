'use client';

import Link from "next/link";
import Image from "next/image";
import infoIcon from "../../../public/info-icon.svg";
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useSession } from "next-auth/react";
import { generateArticleLayout } from "../components/ArticleLayouts";

type leftContainerContent = {
  text: string;
  hasRef: boolean;
  ref: string;
  hasImage: boolean;
  imageUrl: string;
};

interface PostInfo {
	id_articulo: string;
	layout: number;
	titulo: string;
	imagen_url: string;
	slug: string;
	fecha_publicacion: string;
}

export default function Inicio() {
	const { data: session, status } = useSession();
	const searchParams = useSearchParams();
	const router = useRouter();

	// Consigue la información actualizada
  	const [informacion, setInformacion] = useState('Cargando información...');

	// Estado para artículos
	const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('pagina') || '1'));
	const [posts, setPosts] = useState([]);
  	const [totalPages, setTotalPages] = useState(1);
	const inputRef = useRef<HTMLInputElement>(null);

	// Consulta los articulos de la pagina actual
	useEffect(() => {
		async function consultarArticulos() {
			const res = await fetch('/api/getArticles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ page: currentPage }),
			});
			const data = await res.json();
			setPosts(data.posts || []);
			setTotalPages(data.totalPages || 1);
		}

		consultarArticulos();
	}, [currentPage]);

	// Consigue la informacion
	useEffect(() => {
		async function getInformacion() {
			const res = await fetch('/api/getArticleContentBySlug', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ slug: 'informacion' }),
			});
			const data = await res.json();
			if (data.status === 'ok') {
				setInformacion(data.contenido || 'Error al obtener la informacion');
			} else {
				setInformacion('Error al obtener la informacion');
			}
		}

		getInformacion();
	}, []);

	// Navegar hacia la pagina
	const handleBuscar = () => {
		const value = Number(inputRef.current?.value);
		if (value > 0 && !isNaN(value)) {
			setCurrentPage(value);
			router.push(`/inicio?pagina=${value}`);
		}
	};

	// Navegar hacia la pagina con Enter
	const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleBuscar();
		}
	}

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

	// Contenido de Clubes
	const clubesContent = [
		{
			text: 'Club Amarillo',
			hasRef: true,
			ref: '/inicio/blog/club-amarillo',
			hasImage: true,
			imageUrl: 'https://i.imgur.com/oVWodlR.png'
		},{
			text: 'Club Dorado',
			hasRef: true,
			ref: '/inicio/blog/club-dorado',
			hasImage: true,
			imageUrl: 'https://i.imgur.com/wYec3or.png'
		},{
			text: 'Club Azul',
			hasRef: true,
			ref: '/inicio/blog/club-azul',
			hasImage: true,
			imageUrl: 'https://i.imgur.com/FLWCpFY.png'
		},{
			text: 'Club Negro',
			hasRef: true,
			ref: '/inicio/blog/club-negro',
			hasImage: true,
			imageUrl: 'https://i.imgur.com/dlTjhwM.png'
		}
	]

	// Contenedor con estilo para horas comunes
  	function boxHourContainer(hours: string) {
		return (
			<div style={styles.boxHourContainer}>
				<div style={{ margin: '0px', paddingTop: '7px' }}>{hours}</div>
				<div style={{ margin: '0px', paddingBottom: '7px' }}>Hrs</div>
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
				<div style={{ fontWeight: 'bold', margin: '2px 0px' }}>{title}</div>
				{ /* Linea */ }
				<hr style={{ border: 'none', height: '1px', width: '100%', backgroundColor: '#AEAEAE' }} />
				{ /* Contenido */ }
				{content.map((item, index) => (
					<div key={index} style={{ margin: '2px 0px' }}>
						{item.hasImage &&
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={ item.imageUrl }
								style={{ width: '16px', height: '16px', objectFit: 'contain' }}
								alt="Imagen"
							/>
						}
						{item.hasRef ? (
								<Link href={item.ref} style={{ width: '100%', color: 'black', textDecoration: 'none' }}>
									<span> {item.text} »</span>
								</Link>
							):(
								<span> {item.text}</span>
							)
						}
					</div>
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
					<div style={{ margin: '0px', paddingTop: '7px' }}>Canchas</div>
					<div style={{ margin: '0px', paddingBottom: '7px' }}>Disponibles</div>
				</div>

				<Link href="/canchas?tag=baby" style={styles.hoursLinkStyle}>
					<div style={{ paddingLeft: '12px', paddingRight: '6px', alignContent: 'center' }}>BABY</div>
				</Link>
				{boxHourContainer("09:00 - 10:00")}
				{boxHourContainer("10:00 - 11:00")}
				{boxHourContainer("11:00 - 12:00")}

				<Link href="/canchas?tag=padel" style={styles.hoursLinkStyle}>
					<div style={{ paddingLeft: '12px', paddingRight: '8px', alignContent: 'center' }}>PADEL</div>
				</Link>
				{boxHourContainer("09:00 - 10:00")}
				{boxHourContainer("10:00 - 11:00")}
				{boxHourContainer("11:00 - 12:00")}
				
				<Link href="/canchas" style={styles.hoursLinkStyle}>
					<div style={{
						...styles.boxHourContainer,
						background: "linear-gradient(to right, #D9D9D9 0%, #A6F095 20%, #A6F095 100%)",
					}}>
						<div style={{ margin: '0px', paddingTop: '7px' }}>Ver todas</div>
						<div style={{ margin: '0px', paddingBottom: '7px' }}>las canchas</div>
					</div>
				</Link>

			</div>

			{ /* Cuerpo de la pagina */ }
			<div style={styles.pageBodyWrapper}>
				
				{ /* Sección izquierda: Cosas relevantes */ }
				<div style={{ width: '200px', display: 'flex', flexDirection: 'column', height: 'auto', gap: '40px' }}>
					{leftContainer('Servicios', serviciosContent, '#F09596', '/canchas', 'Ver más')}
					{status !== "authenticated" && leftContainer('Únetenos', unetenosContent, '#A6F095', '/registrarse', 'Registrarse')}
					{leftContainer('Clubs', clubesContent, '#F09596', '/inicio/blog/clubes', 'Saber más')}
				</div>

				{ /* Sección central: Artículos */ }
				<div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flexGrow: '1', height: 'auto' }}>
					{(session !== null) && (session.user?.role === 'admin') && (
							<div style={styles.createArticle}>
								<h3 style={{ margin: 0 }}>Crear nuevo artículo:</h3>
								<Link href="/nuevo-articulo" aria-label="Crear nuevo artículo" style={styles.newArticle}>
									+
								</Link>
							</div>
						)
					}
					{posts.length > 0 ? (
						posts.map((post: PostInfo) => (
							<div key={post.id_articulo}>
								{generateArticleLayout(
									post.layout,
									post.titulo,
									post.imagen_url,
									post.slug,
									post.fecha_publicacion
								)}
							</div>
						))
					) : (
						<div style={{ fontFamily: '"Helvetica Neue", sans-serif', display: 'flex', justifyContent: 'center', width: '100%' }}>No hay artículos disponibles.</div>
					)}
					<div style={styles.panelNavegacion}>
						<a href={`/inicio?pagina=${Math.max(1, currentPage - 1)}`} style={styles.botonNavegacion}>← Atrás</a>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
							<a
							key={num}
							href={`/inicio?pagina=${num}`}
							style={{
								padding: '0.5rem 1rem',
								backgroundColor: currentPage === num ? '#F09596' : '#f0f0f0',
								border: '1px solid #ccc',
								borderRadius: '4px',
								color: currentPage === num ? 'black' : '#333',
								textDecoration: 'none',
								fontFamily: '"Verdana", sans-serif',
							}}
							>
							{num}
							</a>
						))}

						<a href={`/inicio?pagina=${Math.min(totalPages, currentPage + 1)}`} style={styles.botonNavegacion}>Siguiente →</a>

						<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
							<input
								type="number"
								min="1"
								placeholder="Buscar página"
								onKeyDown={handleEnter}
								ref={inputRef}
								style={styles.buscadorNavegacion}
							/>
							<button
								onClick={handleBuscar}
								style={styles.buscadorBotonNavegacion}
							>
								Ir
							</button>
						</div>
					</div>
				</div>
					
				{ /* Sección derecha: Información y eventos */ }
				<div style={{ width: '250px', height: 'auto' }}>
					<div style={styles.whiteCardBox}>
						<div style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
							<Image
								src={infoIcon}
								alt="Información"
								style={styles.whiteCardImg}
								draggable={false}
							/>
							<div style={{ fontWeight: 'bold', margin: '2px 0px' }}>Información:</div>
						</div>
						<div style={{ paddingRight: '20px', overflowX: 'hidden' }}>
							<ReactMarkdown rehypePlugins={[rehypeRaw]}>
								{informacion}
							</ReactMarkdown>
						</div>
					</div>
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
		gap: '48px',
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
	whiteCardImg: {
		height: '24px',
		width: '24px',
		objectFit: 'contain',
  	},
	panelNavegacion: {
		display: 'flex',
		gap: '0.5rem',
		marginBottom: '16px',
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	botonNavegacion: {
		padding: '0.5rem 1rem',
		backgroundColor: '#ddd',
		border: '1px solid #bbb',
		borderRadius: '4px',
		fontFamily: '"Helvetica Neue", sans-serif',
		textDecoration: 'none',
		color: '#333'
	},
	buscadorNavegacion: {
		padding: '0.5rem',
		borderRadius: '4px',
		border: '1px solid #ccc',
		width: '100px'
	},
	buscadorBotonNavegacion: {
		padding: '0.5rem 1rem',
		backgroundColor: 'black',
		color: 'white',
		border: 'none',
		borderRadius: '4px',
		cursor: 'pointer',
		fontFamily: '"Helvetica Neue", sans-serif',
	},
	newArticle: {
		backgroundColor: "#A6F095",
		border: "none",
		borderRadius: "50%",
		width: "40px",
		height: "40px",
		boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
		cursor: "pointer",
		fontSize: "20px",
		fontWeight: "bold",
		color: "#000",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		textDecoration: 'none',
	},
	createArticle: {
		fontFamily: '"Helvetica Neue", sans-serif',
		padding: '16px',
		backgroundColor: 'white',
		borderRadius: '16px',
		display: "flex",
		gap: '16px',
		justifyContent: 'center',
		alignItems: "center",
	}
}