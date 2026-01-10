## AWS Serverless Labs – QA Automation

Repositorio de QA Automation enfocado en la validación de AWS Lambda mediante ejecución manual (CLI) y automatizada (Playwright).

Este proyecto NO es una aplicación productiva.
Es un laboratorio de testing serverless para practicar buenas prácticas de QA, automatización y CI en AWS.

🎯 Objetivo

Validar funciones AWS Lambda reales
Entender el comportamiento del AWS SDK v3
Separar claramente:
ejecución manual
automatización
lógica compartida

Ejecutar pruebas locales y en CI (GitHub Actions)

 Alcance actual

AWS Lambda ✅
Pruebas manuales vía CLI
Pruebas automatizadas con Playwright
CI con GitHub Actions
CloudWatch, S3 y otros servicios se incorporarán en etapas posteriores.

📁 Estructura del proyecto
aws-serverless-labs/
├── climate/            # Lambda Climate (scripts manuales)
├── order/              # Lambda Order Validator (scripts manuales)
├── user/               # Lambda User Profile (scripts manuales)
├── shared/             # Utilidades compartidas (LambdaInvoker, helpers)
├── tests/              # Tests automatizados (Playwright)
│   ├── climate-lambda.spec.ts
│   ├── order-validator-lambda.spec.ts
│   └── user-profile-lambda.spec.ts
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── README.md

▶️ Ejecución manual de Lambdas (CLI)

Usado para:

validar credenciales AWS
validar conectividad real con Lambda
depuración rápida sin framework de tests

npm run invoke:climate
npm run invoke:order
npm run invoke:user


⚠️ Estos NO son tests automatizados.
Son ejecuciones manuales controladas.

🧪 Pruebas automatizadas (Playwright)

Tests funcionales ejecutando Lambdas reales.
Ejecutar todos los tests:
npx playwright test
Ejecutar un test específico:

npx playwright test tests/order-validator-lambda.spec.ts


Ver reporte HTML:
npx playwright show-report
CI – GitHub Actions

Pipeline ejecutado en cada push a develop y main
Usa credenciales AWS configuradas como GitHub Secrets
Ejecuta exactamente el mismo comando que local:
npx playwright test --grep-invert @local --pass-with-no-tests


⚙️ Variables de entorno

Archivo .env (solo para uso local):

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxx
AWS_SECRET_ACCESS_KEY=xxxx

En CI, estas variables se configuran como GitHub Secrets.