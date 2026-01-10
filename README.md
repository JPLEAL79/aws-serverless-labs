# AWS Serverless Labs – QA Automation

Repositorio de **QA Automation** orientado a la **validación de servicios AWS Serverless**
mediante **ejecución manual (CLI)** y **automatizada (Playwright)**.

Este proyecto **NO es una aplicación productiva**.
Es un **laboratorio de testing** para practicar buenas prácticas de QA, automatización y CI
sobre servicios reales de AWS.

---

## 🎯 Objetivo

- Validar servicios AWS reales desde la perspectiva de QA
- Entender el uso del **AWS SDK v3**
- Separar claramente:
  - ejecución manual (CLI)
  - automatización
  - lógica compartida


- Ejecución de pruebas **locales** y en **CI (GitHub Actions)**

---

## Servicios cubiertos (por etapas)

### Etapa actual
- AWS Lambda ✅

### Etapas futuras (no implementadas aún)
- API Gateway
- S3
- Bases de datos (ej: DynamoDB / MongoDB)
- Observabilidad (CloudWatch)

---

## 📁 Estructura del proyecto

aws-serverless-labs/
├── climate/            # Scripts manuales Lambda Climate
├── order/              # Scripts manuales Lambda Order Validator
├── user/               # Scripts manuales Lambda User Profile
├── shared/             # Utilidades compartidas (LambdaInvoker, helpers)
├── tests/              # Tests automatizados (Playwright)
│   ├── climate-lambda.spec.ts
│   ├── order-validator-lambda.spec.ts
│   └── user-profile-lambda.spec.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md

---

## ▶️ Ejecución manual (CLI)

Usado para:
- validar credenciales AWS
- validar conectividad real con Lambda
- depuración rápida sin framework de tests

```bash
npm run invoke:climate
npm run invoke:order
npm run invoke:user

---

## ▶️ Pruebas automatizadas (Playwright)
Tests Lambdas reales.

Ejecutar todos los tests:
- npx playwright test

Ejecutar un test específico:
- npx playwright test "tests/order-validator-lambda.spec.ts"

Ver reporte HTML:
- npx playwright show-report


🔁 CI – GitHub Actions:

El pipeline se ejecuta automáticamente en cada push a `develop` y `main`.
Ejecuta la misma suite de pruebas automatizadas que en local, usando credenciales AWS configuradas como GitHub Secrets.

---

⚙️ Variables de entorno:
Uso local (.env)

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx
