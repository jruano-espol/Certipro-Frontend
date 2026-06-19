# Cómo realizar cambios a este repositorio.

Para saber cómo correr la aplicación, lean el `README.md`.

## Carpetas importantes

- La configuración del proyecto está en la carpeta `certipro_frontend` (no toquen nada aquí por ahora).
- En la carpeta `frontend` está todo lo relevante (código, imágenes, etc.).
- En `frontend/templates/frontend` están los htmls.
- En `frontend/static/frontend` están los css, svgs (imágenes vectoriales) y assets en general.

Si no les gusta cómo están organizadas esas carpetas, no es mi culpa, por alguna razón django recomienda organizar las cosas así o advierte que abrán problemas.

## Cómo referenciar archivos en los HTML

Los archivos HTML en django usan algo llamado un _template engine_, que define regiones del archivo html que van a ser expandidas con partes del código en python al momento de ejecutarse, y también permiten importar partes de un documento en otro (por ejemplo `frontend/templates/base.html` se importa en **TODOS** los otros desgraciados archivos de html).

### Referenciar una url a otra página

Primero modifiquen `frontend/urls.py`, añadiendo esto a `urlpatterns`:

```
path("nombre_de_tu_url/", views.nombre_de_tu_funcion, name="nombre_de_la_vista")
```

Luego usen en el html que quieren:

```
{% url 'nombre_de_la_vista'%}
```

### Referenciar un estilo .css

```
<link rel="stylesheet" href="{% static 'frontend/nombre_de_tu_estilo.css' %}">
```

## Proceso para crear una nueva página

Cuando hagan modificaciones, asegúrense de pasarle el contexto de los archivos relevantes a la IA para que no se invente huevadas.

1. Crear el archivo `frontend/templates/frontend/nombre_de_tu_página.html`
2. Crear el archivo `frontend/static/frontend/nombre_de_tu_página.css`
3. Pasarle a la IA el siguiente contexto:
   - Imágen de la pantalla que quieren que haga.
   - Los archivos html y css que crearon.
   - `frontend/static/frontend/style.css` (Estilo global)

> [!WARNING]
> No trabajen en los mismos archivos, sinó en archivos distintos, porque después van a haber **merge conflicts**.
