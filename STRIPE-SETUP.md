# Stripe — Ready to Deploy Academy

Configurado en la cuenta Codevargas, exclusivamente en modo de prueba.

- Curso individual de una hora: US$10, pago único, 12 meses de acceso.
- Suscripción: US$25 al mes, sin permanencia anual. Cancelación desde el portal al final del período pagado.
- Pase: US$50, pago único, un mes de acceso sin renovación.

Los identificadores y enlaces reales de prueba están en stripe-test-config.json. El curso individual es por ahora un producto base de prueba; antes de vender cada curso debe tener identidad propia y corresponder al curso elegido por el alumno.

## Configurado
Tres productos con su precio predeterminado; tres Payment Links; checkout alojado con datos mínimos y métodos dinámicos; confirmación de prueba; portal para facturas, datos, medio de pago y cancelación sin formulario obligatorio de motivos.

## Pendiente para lanzamiento
- Backend del campus, identidad y registro seguro de alumnos.
- Webhook público que verifique firmas y procese eventos idempotentemente. No hay ningún webhook creado: todavía no existe un endpoint de aplicación preparado para recibirlo.
- Procesar checkout.session.completed y checkout.session.async_payment_succeeded con validación del estado de pago; gestionar async_payment_failed.
- Sincronizar customer.subscription.*, invoice.paid e invoice.payment_failed; tratar reembolsos, disputas y alertas de fraude según una política definida. Usar las relaciones de los objetos de Stripe para resolver la matrícula afectada.
- Guardar y aplicar el vencimiento de 12 meses o de un mes desde el pago confirmado. La metadata del producto no hace cumplir el acceso por sí sola.
- Confirmar el catálogo incluido en cada opción, fechas y soporte, condiciones de compra y privacidad.
- Revisar impuestos, registros fiscales y clasificación antes de habilitar Stripe Tax; automatic_tax sigue desactivado.
- Validar pago completo, acceso, renovación, fallo, cancelación y vencimiento en pruebas. Solo se verificó la creación y lectura de precios; no se efectuaron pagos ni se crearon clientes o suscripciones de ensayo.
- Preparar una configuración separada en modo real antes de abrir ventas. La web conserva su acceso privado.
