// lib/lookForRepeatUserData.ts
export async function lookForRepeatUserData(data: {
  email?: string;
  userName?: string;
  phone?: string;
  rut?: string;
}): Promise<{ message: string, messageType: string }> {
  try {
    const res = await fetch('/api/lookForRepeatUserData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (json && typeof json.message === 'string' && typeof json.messageType === 'string') {
      return { message: json.message, messageType: json.messageType };
    } else {
      return { message: 'error', messageType: 'unknown' };
    }
  } catch (err) {
    console.error('Error al validar usuario:', err);
    return { message: 'error', messageType: 'unknown' };;
  }
}