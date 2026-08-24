import http from 'node:http'
import nodemailer from 'nodemailer'

const port = Number(process.env.PORT || 3001)
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim()
const siteUrl = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
const webhookUrl = process.env.MERCADOPAGO_WEBHOOK_URL?.trim()
const emailUser = process.env.GMAIL_USER
const emailPassword = process.env.GMAIL_APP_PASSWORD
const mailTransport = emailUser && emailPassword ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: emailUser, pass: emailPassword },
}) : null

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  response.end(JSON.stringify(payload))
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' })
    response.end()
    return
  }

  if (request.method === 'GET' && (request.url === '/' || request.url === '/health')) {
    sendJson(response, 200, { status: 'ok', service: 'plas-donations' })
    return
  }

  if (request.method === 'POST' && request.url === '/api/contact') {
    if (!mailTransport) {
      sendJson(response, 500, { error: 'Falta configurar GMAIL_USER y GMAIL_APP_PASSWORD en el servidor.' })
      return
    }

    try {
      let rawBody = ''
      for await (const chunk of request) rawBody += chunk
      const { name, email, whatsapp, service, message } = JSON.parse(rawBody)
      if (!name?.trim() || !email?.trim() || !message?.trim()) {
        sendJson(response, 400, { error: 'Completá nombre, email y mensaje.' })
        return
      }

      await mailTransport.sendMail({
        from: emailUser,
        to: emailUser,
        replyTo: email.trim(),
        subject: `Nueva consulta de ${name.trim()}`,
        text: `Nombre: ${name.trim()}\nEmail: ${email.trim()}\nWhatsApp: ${whatsapp?.trim() || 'No informado'}\nServicio: ${service || 'No informado'}\n\nMensaje:\n${message.trim()}`,
      })
      sendJson(response, 200, { sent: true })
    } catch {
      sendJson(response, 502, { error: 'No se pudo enviar el email.' })
    }
    return
  }

  if (request.method === 'POST' && request.url === '/api/donations/webhook') {
    sendJson(response, 200, { received: true })
    return
  }

  if (request.method !== 'POST' || request.url !== '/api/donations/preference') {
    sendJson(response, 404, { error: 'Ruta no encontrada.' })
    return
  }

  if (!accessToken) {
    sendJson(response, 500, { error: 'Falta MERCADOPAGO_ACCESS_TOKEN en el servidor.' })
    return
  }

  try {
    let rawBody = ''
    for await (const chunk of request) rawBody += chunk
    const { amount } = JSON.parse(rawBody)
    if (!Number.isInteger(amount) || amount < 100 || amount > 1000000) {
      sendJson(response, 400, { error: 'El monto debe ser un entero entre 100 y 1.000.000.' })
      return
    }

    const preferenceBody = {
      items: [{ title: 'Apoyo a PLAS', quantity: 1, currency_id: 'ARS', unit_price: amount }],
      back_urls: { success: `${siteUrl}/#apoyar`, failure: `${siteUrl}/#apoyar`, pending: `${siteUrl}/#apoyar` },
    }
    if (webhookUrl?.startsWith('https://')) preferenceBody.notification_url = webhookUrl

    const mercadoPagoResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(preferenceBody),
    })

    const preference = await mercadoPagoResponse.json()
    if (!mercadoPagoResponse.ok || !preference.init_point) {
      sendJson(response, 502, { error: 'Mercado Pago no pudo crear la preferencia.' })
      return
    }
    sendJson(response, 200, { init_point: preference.init_point })
  } catch {
    sendJson(response, 400, { error: 'Solicitud inválida.' })
  }
})

server.listen(port, () => console.log(`Servidor de donaciones: http://localhost:${port}`))