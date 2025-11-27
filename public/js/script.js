// document.body.addEventListener("pointermove", (e)=> {
//     const { currentTarget: el, clientX: x, clientY: y } = e;
//     const { top: t, left: l, width: w, height: h } = el.getBoundingClientRect();
//     el.style.setProperty('--posX',  x-l-w/2);
//     el.style.setProperty('--posY',  y-t-h/2);
//   })

// document.addEventListener("mousemove", function (event) {
//   const windowWidth = window.innerWidth;
//   const windowHeight = window.innerHeight;

//   const mouseXpercentage = Math.round((event.pageX / windowWidth) * 100);
//   const mouseYpercentage = Math.round((event.pageY / windowHeight) * 100);

//   document.body.style.background = `radial-gradient(at ${mouseXpercentage}% ${mouseYpercentage}%,  #000000 10%, #F6E4D4 10%)`;
// });

// document.addEventListener("mousemove", function (event) {
//   const mouseX = event.pageX;
//   const mouseY = event.pageY;

//   document.body.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, #F6E4D4, #000000)`;
// });


document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const submenu = document.querySelector(".submenu");

  menuToggle.addEventListener("click", function (event) {
      event.preventDefault(); // Evita que el enlace recargue la página
      submenu.classList.toggle("show"); // Muestra u oculta el submenú
  });

  // Cierra el submenú si se hace clic fuera
  document.addEventListener("click", function (event) {
      if (!menuToggle.contains(event.target) && !submenu.contains(event.target)) {
          submenu.classList.remove("show");
      }
  });
});
