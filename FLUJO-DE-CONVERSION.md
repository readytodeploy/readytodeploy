# Ready to Deploy Academy — Flujo de conversión

## Objetivo
Convertir una visita con intención de aprender en una compra con el mínimo de pasos y una entrega de acceso verificable.

## Recorrido propuesto
1. Inicio: mostrar resultado de aprendizaje, qué incluye la compra y un único CTA principal «Ver programas y precios».
2. Oferta: precio final y moneda, modalidad de cobro (único o recurrente), disponibilidad, requisitos, entregables y condiciones claras. Acción «Continuar al pago» hacia Stripe Checkout o Payment Link del producto elegido. Sin carrito para una compra individual.
3. Pago: usar el checkout alojado de Stripe; pedir el correo allí, sin repetirlo antes en la academia. Solicitar solo los datos necesarios para la transacción. Mostrar los métodos habilitados por la cuenta y compatibles con el comprador.
4. Confirmación: mostrar el estado real del pedido y los siguientes pasos. No conceder acceso por una URL de éxito o una señal del navegador.
5. Acceso: vincular el pago confirmado a una identidad de alumno con acceso seguro al contenido. Evitar contraseñas y formularios de perfil largos cuando la plataforma de identidad elegida permita enlaces o códigos por correo. No confundir el portal de facturación de Stripe con una cuenta del campus.

## Jerarquía de la web
- Encabezado: programas y acceso de alumnos; el selector de paleta pasa a una posición secundaria para evitar competir con la compra.
- Portada: propuesta concreta, evidencia real y CTA hacia ofertas.
- Ofertas: resultado, contenido incluido, precio y modalidad de pago. Sin cifras inventadas ni programas aún no disponibles para vender.
- Calidad y confianza: ejemplos reales de proyectos, docentes confirmados, condiciones de compra y soporte verificable.
- FAQ: requisitos, funcionamiento del acceso, cobros y cancelación o devoluciones según las condiciones definidas.
- CTA final: repetir la misma acción de compra.

## Decisiones comerciales pendientes
- Suscripción, compra por programa o ambas.
- Precio y moneda; impuestos y mercados de venta.
- Producto efectivamente disponible y fecha de acceso.
- Cuenta de Stripe y producto/precio configurados; empezar en pruebas.
- Condiciones comerciales y contacto de soporte.

## Implementación segura
Para la primera venta, evaluar un Payment Link de Stripe: evita mantener un formulario de tarjetas propio. Para acceso automático al campus se necesita un backend con eventos de pago verificados, almacenamiento de matrículas e identidad de alumnos.

Procesar eventos de forma idempotente, verificar la firma y confirmar el pago antes de activar acceso. Contemplar métodos con confirmación diferida. Para suscripciones, manejar renovaciones, cobros fallidos, cancelación y la política de acceso definida. La página de confirmación debe permitir reintentos seguros y no depender de que el comprador regrese desde Stripe.

La web actual es una presentación estática privada en Sites. Su acceso privado exige identificación de la plataforma antes de visitar la web. Una captación abierta requiere una decisión explícita sobre hacerla pública. La identidad de alumnos con correo propio requiere confirmar compatibilidad de hosting o seleccionar un entorno que admita ese flujo; no prometerlo usando la identidad de ChatGPT como sustituto.

## Medición
Medir vistas de oferta, inicio de checkout, pagos confirmados y primer acceso al curso. Calcular conversión entre pasos y tiempo hasta la primera lección. No contar un clic en «Pagar» como venta. El ingreso y la activación proceden de eventos verificados del servidor.

## Estado
Propuesta de flujo; no hay pagos, suscripciones ni registro de alumnos activados. Espera las decisiones comerciales y la configuración real de Stripe antes de publicar una oferta comprable.

## Condiciones confirmadas por el fundador
- Curso individual de una hora: US$10, pago único. Acceso durante 12 meses, confirmado por el fundador.
- Suscripción mensual: US$25 cada mes, renovación automática, cancelable en cualquier momento y sin permanencia anual. No es un plan anual.
- Pase de un mes: US$50, pago único; termina al completar el mes y no se renueva.
- Definir catálogo incluido y condiciones de cancelación/acceso restantes antes de vender. Ninguna opción está conectada todavía a Stripe.
