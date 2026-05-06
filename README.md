# ElLineup Client

Frontend de ElLineup — plataforma para gestionar ligas de softball. Construido con HTML, CSS y JavaScript vanilla.

**README fue escrito con la ayuda de IA**

##  Links
- **App en producción:** https://luispefigueroa.github.io/ellineup-client
- **Repositorio del backend:** https://github.com/LuispeFigueroa/ellineup-api

##  Screenshot

![ElLineup](screenshot.png)

## Correr localmente

1. Clona el repositorio:
```bash
git clone https://github.com/LuispeFigueroa/ellineup-client
cd ellineup-client
```

2. Asegúrate que el backend esté corriendo en `http://localhost:8080` (instrucciones en readme del API)

3. Abre `index.html` con Live Server en VSCode o directamente en el navegador.

> Para apuntar al backend en producción, cambiar `API_URL` en `js/api.js` a `https://ellineup-api-production.up.railway.app`

## Estructura

## Challenges implementados

- **Exportar standings a CSV** — generado manualmente desde JavaScript sin librerías, se descarga desde el navegador 
- **Subir imágenes** — logo de equipos visible en la vista del equipo 
- **Búsqueda por nombre** — búsqueda en tiempo real de divisiones y equipos 

##  Reflexión

AL trabajar el frontend solo con HTML, css y js vanilla siento que limite un poco el diseño final al que quería llegar, de cualquier forma trabajar de esta forma me permitió seguir practicando como estructuro una pagina con HTML, asegurándome que sea clara y funcional porque no voy a tener tantos recursos para decorarla o hacerla más dinámica. Esto lo hice principalmente usando colores brillantes para las acciones principales y un fondo más oscuro que los otros elementos para que se puedan diferenciar. Me gustó mucho trabajar con el el api y client separado, porque era mucho más facil identificar donde estaban los errores. En muchas ocasiones tenía problemas con el API, entonces solo modificaba los archivos del backend y el frontend casi no lo tocaba para ajustarlo. Para proyectos futuros seguiria usando javascript, pero me gustaría usar librerias o frameworks para que el UI sea mejor.