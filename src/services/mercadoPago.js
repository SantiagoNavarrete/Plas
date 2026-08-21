const API_URL = import.meta.env.VITE_API_URL || ''

export async function createDonationPreference(amount) {
  if (!API_URL) {
    throw new Error('Configura VITE_API_URL para conectar el backend de Mercado Pago.')
  }

  const response = await fetch(`${API_URL}/api/donations/preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  })

  if (!response.ok) throw new Error('No se pudo iniciar la donación.')
  return response.json()
}
