path = "src/lib/email.ts"
with open(path, "r") as f:
    content = f.read()

# Funcion 1: notificarNuevoPago
old1 = '''  const destino = process.env.NOTIFICACION_EMAIL;
  if (!destino) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destino,
      subject: `Nuevo pago pendiente: ${nombreCliente} (Bs ${monto})`,'''
new1 = '''  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Nuevo pago pendiente: ${nombreCliente} (Bs ${monto})`,'''
assert content.count(old1) == 1
content = content.replace(old1, new1)

# Funcion 2: notificarRecordatorioCitas
old2 = '''  const destino = process.env.NOTIFICACION_EMAIL;
  if (!destino || citas.length === 0) return;'''
new2 = '''  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0 || citas.length === 0) return;'''
assert content.count(old2) == 1
content = content.replace(old2, new2)

old2b = '''    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destino,
      subject: `Recordatorio: ${citas.length} cita(s) hoy`,'''
new2b = '''    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Recordatorio: ${citas.length} cita(s) hoy`,'''
assert content.count(old2b) == 1
content = content.replace(old2b, new2b)

# Funcion 3: notificarNuevaCita
old3 = '''  const destino = process.env.NOTIFICACION_EMAIL;
  if (!destino) return;

  const fechaFormateada = fechaCita.toLocaleString("es-BO", {'''
new3 = '''  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0) return;

  const fechaFormateada = fechaCita.toLocaleString("es-BO", {'''
assert content.count(old3) == 1
content = content.replace(old3, new3)

old3b = '''    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destino,
      subject: `Nueva cita reservada: ${nombre} - ${fechaFormateada}`,'''
new3b = '''    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Nueva cita reservada: ${nombre} - ${fechaFormateada}`,'''
assert content.count(old3b) == 1
content = content.replace(old3b, new3b)

# Funcion 4: notificarNuevaConsulta
old4 = '''  const destino = process.env.NOTIFICACION_EMAIL;
  if (!destino) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destino,
      subject: `Nueva consulta: ${nombre} (${servicio})`,'''
new4 = '''  const destinos = await obtenerDestinatarios();
  if (destinos.length === 0) return;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: destinos,
      subject: `Nueva consulta: ${nombre} (${servicio})`,'''
assert content.count(old4) == 1
content = content.replace(old4, new4)

with open(path, "w") as f:
    f.write(content)

print("OK")
