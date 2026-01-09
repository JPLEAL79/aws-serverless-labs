# AWS Serverless Testing

Repositorio de **QA Automation** enfocado en la validación de **AWS Lambda** mediante ejecución **manual** y **automatizada**.

Este proyecto **no es una aplicación**, es un entorno de pruebas para aprender y aplicar buenas prácticas de testing en servicios Serverless.

---

## Alcance actual

- AWS Lambda ✅
- Pruebas manuales (CLI)
- Pruebas automatizadas con Playwright

Servicios como **CloudWatch** y **S3** se incorporarán en etapas posteriores.

---

## Estructura del proyecto

aws-serverless-testing/
├── climate/ # Lambda Climate (scripts manuales)
├── order/ # Lambda Order (scripts manuales)
├── user/ # Lambda User (scripts manuales)
├── shared/ # Utilidades compartidas (LambdaInvoker)
├── tests/ # Tests automatizados (Playwright)
├── playwright.config.ts
├── tsconfig.json
└── package.json

yaml
Copiar código

---

## Ejecución manual de Lambdas

Usado para validar credenciales AWS y conectividad con Lambda.

```bash
npm run invoke:climate
npm run invoke:order
npm run invoke:user
Los scripts manuales no son tests automatizados.

## Pruebas automatizadas
Tests funcionales usando Playwright como runner.

bash
Copiar código
npx playwright test
Ejecutar un test específico:

bash
Copiar código
npx playwright test tests/order-validator-lambda.spec.ts
Ver reporte HTML:

bash
Copiar código
npx playwright show-report

⚙️ Variables de entorno
Archivo .env:
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx