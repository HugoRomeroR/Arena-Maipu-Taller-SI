export default function Inicio() {
  return (
    <div>
      <div style={{ padding: '24px', fontFamily: '"Helvetica Neue", sans-serif', }}>
        <h1>Pagina de ejemplo para testeos</h1>
        {[...Array(50)].map((_, i) => (
          <p key={i}>Linea {i + 1}</p>
        ))}
      </div>
    </div>
  );
}