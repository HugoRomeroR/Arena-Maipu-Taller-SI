'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import LayoutCarousel from '../components/LayoutCarousel';
import { PreviewLayouts } from '../components/PreviewLayouts';
import { useRouter } from 'next/navigation';

const MarkdownEditor = dynamic(() => import('../components/MarkdownEditor'), { ssr: false });

export default function NuevoArticulo() {
  const router = useRouter()
  const [title, setTitle] = useState<string>('');
  const [isImage, setIsImage] = useState<boolean>(false);
  const [background, setBackground] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [articleLayout, setArticleLayout] = useState<number>(1);
  const blogPath = '/inicio/blog/'

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  }

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground);
  }

  const handleSlugChange = (newSlug: string) => {
    setSlug(textToSlug(newSlug));
  }

  const handleLayoutChange = (index: number) => {
    setArticleLayout(index);
  };

  const handleSubmit = async () => {
    const post = {
      title: title,
      background: background,
      content: content,
      slug: slug,
      articleLayout: articleLayout,
      dateLayout: new Date(),
    };
    const res = await fetch('/api/nuevo-articulo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: post.title,
        background: post.background,
        content: post.content,
        slug: post.slug,
        articleLayout: post.articleLayout,
        dateLayout: post.dateLayout,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      alert('✅ Artículo agregado con éxito!');
      router.replace('/inicio');
    } else {
      alert(`❌ Error al agregar el artículo: ${result.error || 'Error desconocido'}`);
    }
  };

  const textToSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-') // Reemplaza espacios con guiones
    .replace(/[^a-z0-9-]/g, '') // Elimina caracteres que no sean a-z, 0-9 o guión
    .replace(/-+/g, '-') // Evita múltiples guiones seguidos
    .replace(/^-+/g, ''); // Elimina guiones al inicio
  };

  /* const blogPathGenerator = (text: string) => {
    return `${process.env.NEXT_PUBLIC_DOMAIN_URL}${blogPath}${textToSlug(text)}`
  }; */

  return (
    <div style={styles.nuevoArticuloBody}>

      { /* Título y URL del artículo */ }
      <div style={styles.whiteContainer}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Creando un nuevo artículo:
        </div>
        <hr style={styles.nuevoArticuloLineStyle} />

        { /* Título del artículo */ }
        <label htmlFor="articleTitle" style={{ margin: '16px 0px 16px 16px', display: 'block' }}>
          Título del artículo
        </label>
        <input
          type="text"
          id="articleTitle"
          style={styles.articleDefaultBox}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Escribe aquí el título de tu artículo..."
        />

        { /* URL del artículo */ }
        <label htmlFor="articleURL" style={{ margin: '16px 0px 16px 16px', display: 'block' }}>
          URL del artículo
        </label>
        <div style={styles.articleDefaultBox}>
          <p>{process.env.NEXT_PUBLIC_DOMAIN_URL}{blogPath}</p>
          <input
            type="text"
            id="articleSlug"
            style={styles.articleDefaultInput}
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder={textToSlug(title)}
          />
          <button style={styles.autoButton} onClick={() => handleSlugChange(textToSlug(title))}>
            Generar automáticamente
          </button>
        </div>
      </div>

      { /* Contenido del artículo */ }
      <div style={styles.whiteContainer}>
        <label htmlFor="articleContent" style={{ margin: '16px 0px 16px 16px', display: 'block' }}>
          Contenido del artículo
        </label>
        <div id="articleContent" style={{ boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)', borderRadius: '16px' }}>
          <MarkdownEditor
            onContentChange={setContent}
          />
        </div>
      </div>

      { /* Imagen o color del artículo */ }
      <div style={styles.whiteContainer}>
        <label htmlFor="articleBackground" style={{ margin: '16px 0px 16px 16px', display: 'block' }}>
          {isImage ? 'Imagen' : 'Color'} del artículo
        </label>
        <div style={styles.articleDefaultBox}>
          <p>El artículo tendra {isImage ? 'la' : 'el'} siguiente {isImage ? 'imagen' : 'color'}:</p>
          {isImage ? (
            <input
              type="text"
              id="backgroundImage"
              style={styles.articleDefaultInput}
              placeholder="URL de la imagen"
              value={background}
              onChange={(e) => handleBackgroundChange(e.target.value)}
            />
          ) : (
            <input
              type="color"
              id="backgroundColor"
              style={styles.articleDefaultInput}
              value={background || '#000000'}
              onChange={(e) => handleBackgroundChange(e.target.value)}
            />
          )}
          <button style={styles.autoButton} onClick={() => setIsImage(true)}>Usar imagen</button>
          <button style={styles.autoButton} onClick={() => setIsImage(false)}>Usar color</button>
        </div>
      </div>

      { /* Disposición del artículo */ }
      <div style={styles.whiteContainer}>
        <label htmlFor="articleLayout" style={{ margin: '16px 0px 16px 16px', display: 'block' }}>
          Disposición del artículo
        </label>
        <div id="articleLayout" style={styles.articleLayoutWrapper}>
          <LayoutCarousel
            layouts={PreviewLayouts({title: title, background: background})}
            onSelect={handleLayoutChange} 
          />
        </div>
      </div>

      <button onClick={handleSubmit} style={styles.publishButton}>
        Publicar
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  nuevoArticuloBody: {
    fontFamily: '"Helvetica Neue", sans-serif',
    margin: '48px',
    padding: '0px 48px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  whiteContainer: {
    padding: '18px',
    backgroundColor: 'white',
    borderRadius: '16px' 
  },
  nuevoArticuloLineStyle: {
    border: 'none',
    height: '2px',
    width: '100%',
    backgroundColor: '#AEAEAE',
    margin: '16px 0px',
  },
  articleDefaultBox: {
    position: "relative",
    height: "48px",
    width: "100%",
    fontFamily: '"Helvetica Neue", sans-serif',
    background: "white",
    paddingLeft: '24px',
    paddingRight: '24px',
    boxSizing: "border-box",
    borderRadius: '24px',
    border: 'none',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
    display: 'flex',
    fontSize: '14px',
    alignItems: 'center',
  },
  articleDefaultInput: {
    position: "relative",
    height: "48px",
    width: "100%",
    fontFamily: '"Helvetica Neue", sans-serif',
    paddingRight: '24px',
    boxSizing: "border-box",
    border: 'none',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    fontSize: '14px',
  },
  articleLayoutWrapper: {
    borderRadius: '24px',
    padding: '24px 0px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  publishButton: {
    fontFamily: '"Helvetica Neue", sans-serif',
    width: '100%',
    marginTop: '16px',
    color: 'white',
    backgroundColor: '#e64cb7ff',
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
  autoButton: {
		boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.4)',
    border: 'none',
    backgroundColor: 'white',
		borderRadius: "16px",
		width: "auto",
		height: "calc(100% - 8px)",
    padding: '4px 16px',
    margin: '4px',
    boxSizing: 'border-box',
		cursor: "pointer",
		fontSize: "14px",
		color: "#000",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		textDecoration: 'none',
	},
}