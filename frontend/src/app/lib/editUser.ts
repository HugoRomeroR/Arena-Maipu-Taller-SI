export async function editUser(newData: string, column: string) {
  const response = await fetch('/api/editUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newData: newData,
      column: column,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al editar');
  }

  const data = await response.json();

  return data;
}