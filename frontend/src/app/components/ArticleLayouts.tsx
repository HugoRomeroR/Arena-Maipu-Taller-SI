import React from "react";
import imageLayout from "../../../public/placeholder-bg.jpg";
import { parseShortDate } from "./utilities/parseData";

export function generateArticleLayout(
  layout: number,
  title: string,
  image: string,
  slug: string,
  date: string
): React.ReactElement {
  const imageSrc = image ? image : imageLayout.src;
  const shortDate = parseShortDate(date);
  switch (layout) {
    case 1:
      // 1. Imagen / Título / Fecha
      return (
        <a href={`/inicio/blog/${slug}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div key={1} style={styles.previewBoxLayout}>
            <div style={styles.imageLayout}>
              <div style={{ ...styles.imageBgLayout, backgroundImage: `url(${imageSrc})` }}></div>
            </div>
            <div style={styles.titleLayout}>{title}</div>
            <div style={styles.dateLayout}>{shortDate}</div>
          </div>
        </a>
      );
    case 2:
      // 2. Imagen a la izquierda / Título centrado / Fecha abajo
      return (
        <a href={`/inicio/blog/${slug}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div key={2} style={{ ...styles.previewBoxLayout, flexDirection: 'row' }}>
            <div style={{ ...styles.imageLayout, flexBasis: '65%', flexShrink: 0 }}>
              <div style={{ ...styles.imageBgLayout, backgroundImage: `url(${imageSrc})` }}></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flexBasis: '35%', flexShrink: 0 }}>
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
              <div style={styles.dateLayout}>{shortDate}</div>
            </div>
          </div>
        </a>
      );
    case 3:
      // 3. Título centrado / Fecha abajo / Imagen a la derecha
      return (
        <a href={`/inicio/blog/${slug}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
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
              <div style={{ ...styles.dateLayout, textAlign: 'right' }}>{shortDate}</div>
            </div>
            <div style={{ ...styles.imageLayout, flexBasis: '60%' }}>
              <div style={{ ...styles.imageBgLayout, backgroundImage: `url(${imageSrc})` }}></div>
            </div>
          </div>
        </a>
      );
    case 4:
      // 4. Título / Imagen / Fecha en columna
      return (
        <a href={`/inicio/blog/${slug}`} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div key={4} style={styles.previewBoxLayout}>
            <div style={{ ...styles.titleLayout, textAlign: 'center' }}>{title}</div>
            <div style={styles.imageLayout}>
              <div style={{ ...styles.imageBgLayout, backgroundImage: `url(${imageSrc})` }}></div>
            </div>
            <div style={{ ...styles.dateLayout, textAlign: 'center' }}>{shortDate}</div>
          </div>
        </a>
      );
    default:
      return <div>No layout found</div>;
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  containerLayout: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewBoxLayout: {
    width: '100%',
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
    boxSizing: 'border-box',
    padding: '18px',
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
    backgroundSize: 'cover',
  },
  titleLayout: {
    color: 'black',
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '4px',
    textAlign: 'left',
  },
  dateLayout: {
    color: '#4d4d4d',
    fontSize: '16px',
    padding: '4px',
    textAlign: 'left',
  },
};