
var hora = dayjs().hour();
var minutos = dayjs().minute();

const h = `${hora}:${minutos}`;

const horaHeader = document.getElementById('horario')
horaHeader.innerHTML = h;

