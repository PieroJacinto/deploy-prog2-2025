// ✅ Script para filtrar productos por categoría
document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll('input[name="categoria"]');
    const productos = document.querySelectorAll('.velacardAll');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const categoriasSeleccionadas = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value.toLowerCase());

            productos.forEach(prod => {
                const categoriasProducto = prod.dataset.categorias.toLowerCase().split(' ');
                // Mostrar si el producto tiene al menos una categoría seleccionada
                const visible = categoriasProducto.some(cat => categoriasSeleccionadas.includes(cat));
                prod.style.display = visible ? 'inline-block' : 'none';
            });
        });
    });
});