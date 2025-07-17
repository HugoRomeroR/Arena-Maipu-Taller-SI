import imageLayout from "../../../public/placeholder-bg.jpg";

export const PreviewLayouts = ({
  title,
  background,
}: {
  title: string;
  background: string;
}): React.ReactNode[] => {
  const fixedTitle = title === '' ? '¡Mi Nuevo Artículo!' : title;
  return layouts({ title: fixedTitle, background });
};

// 🔧 Función para generar estilos dinámicos según el tipo de fondo
const getBackgroundStyles = (background: string): React.CSSProperties => {
  if (!background) {
    const defaultImage = `${imageLayout.src}`;
    return {
      backgroundColor: 'transparent',
      backgroundImage: `url(${defaultImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  if (background.startsWith('#')) {
    return {
      backgroundColor: background,
      backgroundImage: 'none',
    };
  }

  return {
    backgroundColor: 'transparent',
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
};

const layouts = ({
  title,
  background,
}: {
  title: string;
  background: string;
}): React.ReactNode[] => [
  // 1. Imagen / Título / Fecha
  (
    <div key={1} style={styles.previewBoxLayout}>
      <div style={styles.imageLayout}>
        <div style={{ ...styles.imageBgLayout, ...getBackgroundStyles(background) }}></div>
      </div>
      <div style={styles.titleLayout}>{title}</div>
      <div style={styles.dateLayout}>DD/MM/YY</div>
    </div>
  ),

  // 2. Imagen a la izquierda / Título centrado / Fecha abajo
  (
    <div key={2} style={{ ...styles.previewBoxLayout, flexDirection: 'row' }}>
      <div style={{ ...styles.imageLayout, flexBasis: '65%', flexShrink: 0 }}>
        <div style={{ ...styles.imageBgLayout, ...getBackgroundStyles(background) }}></div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexBasis: '35%',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            ...styles.titleLayout,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
          }}
        >
          {title}
        </div>
        <div style={styles.dateLayout}>DD/MM/YY</div>
      </div>
    </div>
  ),

  // 3. Título centrado / Fecha abajo / Imagen a la derecha
  (
    <div key={3} style={{ ...styles.previewBoxLayout, flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '40%' }}>
        <div
          style={{
            ...styles.titleLayout,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {title}
        </div>
        <div style={{ ...styles.dateLayout, textAlign: 'right' }}>DD/MM/YY</div>
      </div>
      <div style={{ ...styles.imageLayout, flexBasis: '60%' }}>
        <div style={{ ...styles.imageBgLayout, ...getBackgroundStyles(background) }}></div>
      </div>
    </div>
  ),

  // 4. Título / Imagen / Fecha en columna
  (
    <div key={4} style={styles.previewBoxLayout}>
      <div style={{ ...styles.titleLayout, textAlign: 'center' }}>{title}</div>
      <div style={styles.imageLayout}>
        <div style={{ ...styles.imageBgLayout, ...getBackgroundStyles(background) }}></div>
      </div>
      <div style={{ ...styles.dateLayout, textAlign: 'center' }}>DD/MM/YY</div>
    </div>
  ),
];

const styles: { [key: string]: React.CSSProperties } = {
  containerLayout: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewBoxLayout: {
    width: '800px',
    height: '300px',
    border: 'none',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '"Helvetica Neue", sans-serif',
    color: 'white',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  imageLayout: {
    flexBasis: '100%',
    padding: '6px',
  },
  imageBgLayout: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '16px',
    // El fondo se aplica dinámicamente
  },
  titleLayout: {
    color: 'black',
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '4px',
    textAlign: 'left',
  },
  dateLayout: {
    color: '#4d4d4d',
    fontSize: '12px',
    padding: '4px',
    textAlign: 'left',
  },
};
