# React + Vite

## Mercado Pago

1. Copiá `.env.example` como `.env` y completá `MERCADOPAGO_ACCESS_TOKEN` con el token privado de tu aplicación de Mercado Pago.
2. En una terminal ejecutá `npm run server`.
3. En otra terminal ejecutá `npm run dev` y abrí la dirección que muestra Vite.

El token se usa únicamente en el servidor y nunca se expone al navegador.

## Contacto por email

Para enviar consultas a `plasonthe@gmail.com`, activá la verificación en dos pasos de Gmail y creá una contraseña de aplicación. Completá `GMAIL_USER` y `GMAIL_APP_PASSWORD` en las variables privadas del backend. Nunca uses tu contraseña normal de Gmail ni subas `.env` al repositorio.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
