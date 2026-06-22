# CertiPro - Uso de la API REST

Este documento detalla todos los puntos de acceso (endpoints) disponibles para el frontend.

## Configuración de URLs Base

* **Desarrollo (Codespaces):** 

1. Levantar un Codespace en este repositorio
2. En la raíz del proyecto, crear (si no existe) un archivo llamado *.env*. En este archivo, pegar la variable de enlace a la base de datos Neon (se encuentra en el grupo de WhatsApp)
3. En la terminal, crear el ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate
```
4. Instalar las dependencias:
```bash
pip install -r requirements.txt
```
5. Levantar el servidor local con:
```bash
python manage.py runserver
```
6. En la parte inferior, en la pestaña *Puertos*, hacer click derecho en el puerto recién abierto (8000), seleccionar: Visibilidad -> Público.
7. En el frontend, utilizar el enlace que ofrece el puerto desplegado y añadirle */api* al final. Debería tener el siguiente formato:
`https://<nombre del codespace>-<código>-8000.app.github.dev/api` 
 
**Producción:** `TODO`
* 
---

## Login (JWT)

Todos los endpoints (excepto el login) están protegidos. El Frontend debe guardar el token `access` en el `localStorage` o cookies y adjuntarlo en las cabeceras de **cada petición** como Bearer Token.

Para conseguir el token de `access`, el frontend tiene que realizar una petición http POST de la siguiente manera:

`<url_base>/auth/login/`

Con el siguiente cuerpo JSON:

```JSON
{
    "username": "<nombre de usuario>",
    "password": "<contraseña>"
}
```

Si la respuesta es exitosa (200 OK), la respuesta JSON será:

```JSON
{
    "refresh": "<codigo super largo",
    "access": "<codigo super largo>",
    "user": {
        "username": "<nombre de usuario>",
        "email": "<email>",
        "full_name": "<nombre completo>",
        "role": "<rol>"
    }
}
```
---
## Endpoints por Tabla

### Sucursales (Branches)
**Obtener todas las sucursales o crear nueva sucursal**

Endpoint: `/branches/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/branches/<id>/ `

Métodos: 
- GET: obtener detalles de la sucursal
- PUT: editar la sucursal
- DELETE: borrar la sucursal

**Body para crear/editar:**

```JSON
{
    "name": "<nombre>",
    "location": "<ubicación>",
    "supervisor": <id del supervisor>
}
```

### Departamentos (Departments)
**Obtener todos los departamentos o crear nuevo departamento**

Endpoint: `/departments/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/departments/<id>/`

Métodos:
- GET: obtener detalles del departamento
- PUT: editar el departamento
- DELETE: borrar el departamento

**Filtrar por sucursal específica**

Endpoint: `/departments/?branch=<id_sucursal>`

Método: GET

**Body para crear/editar:**

```JSON
{
    "name": "<nombre>",
    "branch": <id de la sucursal>,
    "supervisor": <id del supervisor>
}
```

### Grupos de Trabajo (WorkGroups)
**Obtener todos los grupos o crear nuevo grupo**

Endpoint: `/work-groups/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/work_groups/<id>/`

Métodos:
- GET: obtener detalles del grupo
- PUT: editar el grupo
- DELETE: borrar el grupo

**Filtrar por departamento específico**

Endpoint: `/work_groups/?department=<id_departamento>`

Método: GET

**Body para crear/editar:**
```JSON
{
    "name": "<nombre>",
    "department": <id del departamento>,
    "supervisor": <id del supervisor>,
    "members": [<id_usuario_1>, <id_usuario_2>]
}
```

### Modelos de Certificación (CertificationModels)
**Obtener todos los modelos o crear nuevo modelo**

Endpoint: `/certification_models/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: ``/certification_models/<id>/``

Métodos:
- GET: obtener detalles del modelo
- PUT: editar el modelo
- DELETE: borrar el modelo

**Body para crear/editar:**

```JSON
{
    "title": "<título>",
    "accreditor": "<acreditador>",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD"
}
```

### Periodos de Evaluación (Periods)
**Obtener todos los periodos o crear nuevo periodo**

Endpoint: `/periods/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/periods/<id>/`

Métodos:
- GET: obtener detalles del periodo
- PUT: editar el periodo
- DELETE: borrar el periodo

**Filtrar por modelo de certifiación específico**

Endpoint: `/periods/?certification_model=<id_modelo_certificacion>`

Método: GET

**Body para crear/editar:**

```JSON
{
    "name": "<nombre>",
    "reason": "<motivo>",
    "allow_editing": true,
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "certification_model": <id del modelo>
}
```

### Criterios (Criteria)
**Obtener todos los criterios o crear nuevo criterio**

Endpoint: `/criteria/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/criteria/<id>/`

Métodos:
- GET: obtener detalles del criterio
- PUT: editar el criterio
- DELETE: borrar el criterio

**Filtrar criterios raíces o hijos**

Endpoints:

`/criteria/?parent=null` (Trae solo los padres)

`/criteria/?parent=<id_padre>` (Trae los subcriterios de ese padre)

Método: GET

**Filtrar por modelo de certifiación específico**

Endpoint: `/crtieria/?certification_model=<id_modelo_certificacion>`

Método: GET

**Body para crear/editar:**

```JSON
{
    "code": "<código>",
    "title": "<título>",
    "description": "<descripción>",
    "certification_model": <id del modelo>,
    "parent": <id del criterio padre o null si es raíz>
}
```

### Requerimientos Base (Requirements)
**Obtener todos los requerimientos o crear nuevo requerimiento**

Endpoint: `/requirements/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/requirements/<id>/`

Métodos:

- GET: obtener detalles (incluye lista automática de versiones)
- PUT: editar el requerimiento
- DELETE: borrar el requerimiento

**Body para crear/editar:**

```JSON
{
    "title": "<título>",
    "description": "<descripción>"
}
```

### Versiones de Requerimientos (RequirementVersions)
**Obtener todas las versiones o crear nueva versión**

Endpoint: `/requirement_versions/`

Métodos: GET o POST respectivamente

Operaciones filtradas por id

Endpoint: `/requirement_versions/<id>/`

Métodos:
- GET: obtener detalles de la versión
- PUT: editar la versión
- DELETE: borrar la versión

**Filtrar por requerimiento específico**

Endpoint: `/requirement_versions/?requirement=<id_requerimiento>`

Método: GET

**Body para crear/editar:**

```JSON
{
    "requirement": <id del requerimiento base>,
    "version_number": "<ej: 2026-A>",
    "is_active": true
}
```

### Tareas (Tasks)
**Obtener todas las tareas o crear nueva tarea**

Endpoint: `/tasks/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/tasks/<id>/`

Métodos:

- GET: obtener detalles de la tarea
- PUT: editar la tarea
- DELETE: borrar la tarea

**Filtrar tareas por grupo responsable**

Endpoint: `/tasks/?group_responsible=<id_grupo>`

Método: GET

**Filtrar por criterio específico**

Endpoint: `/tasks/?crtierion=<id_criterio>`

Método: GET

**Body para crear/editar:**

```JSON
{
    "title": "<título>",
    "description": "<descripción>",
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "criterion": <id del criterio>,
    "requirement_version": <id de la versión>,
    "group_responsible": <id del grupo de trabajo>
}
```

### Evidencias Requeridas (RequiredEvidences)
**Obtener todas las evidencias requeridas o crear una nueva**

Endpoint: `/required_evidences/`

Métodos: GET o POST respectivamente

Operaciones filtradas por id

Endpoint: `/required_evidences/<id>/`

Métodos:

- GET: obtener detalles del slot
- PUT: editar el slot
- DELETE: borrar el slot

**Filtrar por versión de requerimiento específica**

Endpoint: `/required_evidences/?requirement_version=<id_versión_requerimiento>`

Método: GET

**Body para crear/editar:**

```JSON
{
    "title": "<título>",
    "description": "<descripción>",
    "file_type": "<ej: .pdf>",
    "requirement_version": <id de la versión>
}
```

### Evidencias Subidas (UploadedEvidences)
**Obtener todas las evidencias subidas o subir una nueva**

Endpoint: `/uploaded_evidences/`

Métodos: GET o POST respectivamente

>IMPORTANTE: El POST para este endpoint NO usa JSON, debe enviarse como formato multipart/form-data en el cuerpo de la petición debido al archivo físico.

**Operaciones filtradas por id**

Endpoint: `/uploaded_evidences/<id>/`

Métodos:

- GET: obtener detalles de la evidencia (incluye URL del archivo)
- PUT: editar los metadatos o reemplazar el archivo
- DELETE: borrar la evidencia subida

**Filtrar por evidencia requerida específico**

Endpoint: `/periods/?certification_model=<id_sucursal>`

Método: GET

**Campos para el Form-Data (Crear/Editar):**
```
description: <descripción en texto>

task: <id de la tarea>

required_evidence: <id de la evidencia requerida>

file_path: [Seleccionar Archivo Binario desde PC]
```

### Retroalimentaciones (Feedbacks)
Obtener todas las retroalimentaciones o crear una nuevo retroalimentación

Endpoint: `/feedbacks/`

Métodos: GET o POST respectivamente

**Operaciones filtradas por id**

Endpoint: `/feedbacks/<id>/`

Métodos:

- GET: obtener detalles de la revisión
- PUT: editar el feedback
- DELETE: borrar el feedback

**Filtrar por evidencia subida específica**

Endpoint: `/feedbacks/?uploaded_evidence=<id_evidencia_subida>`

Método: GET

**Body para crear/editar:**

```JSON
{
    "comment": "<comentario del supervisor>",
    "result_type": "<solo acepta 'APPROVE' o 'REJECT'>",
    "uploaded_evidence": <id de la evidencia subida>,
    "evaluator": <id del usuario supervisor>
}
```
