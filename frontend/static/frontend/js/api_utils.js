const API_UTILS = {
    baseUrl: window.API_BASE_URL,
    
    get_headers(isFormData = false) {
        const accessToken = localStorage.getItem('access_token');
        const headers = { 'Authorization': `Bearer ${accessToken}` };
        
        // Si es FormData, NO debemos colocar 'Content-Type', 
        // el navegador se encarga de poner el boundary automáticamente.
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    },

    async fetch(endpoint, method, body = null) {
        try {
            const isFormData = body instanceof FormData;

            console.log(
                `Attempting ${method} fetch at: ${endpoint} ${body ? `\nWith: ${isFormData ? '[FormData File/Data]' : JSON.stringify(body)}` : ''}`
            );            

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: method,
                headers: this.get_headers(isFormData),
                body: body ? (isFormData ? body : JSON.stringify(body)) : null
            });

            // Si hay error de autenticación (Token expirado), redirigir al login
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/select_profile/";
                return null;
            }

            if (!response.ok) {
                // Capturar el error detallado que devuelva Django para depurar mejor
                const errorBody = await response.text();
                console.error("Detalle del error del servidor:", errorBody);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const response_json = await response.json();
            console.log(`SUCCESFUL\nResponse: ${JSON.stringify(response_json)}`);

            return response_json;
        } catch (error) {
            console.error(`Error en {${method}} ${endpoint}:`, error);
            throw error;
        }
    },

    async get(endpoint) {
        return await this.fetch(endpoint, 'GET');
    },

    async get_by_id(endpoint, id) {
        return await this.fetch(`${endpoint}${id}/`, 'GET');
    },

    async get_filter_by_column(endpoint, column, id) {
        return await this.fetch(`${endpoint}?${column}=${id}`, 'GET');
    },

    async post(endpoint, body) {
        return await this.fetch(endpoint, 'POST', body);
    },

    async put(endpoint, id, body) {
        return await this.fetch(`${endpoint}${id}/`, 'PUT', body);
    },

    async patch(endpoint, id, body) {
        return await this.fetch(`${endpoint}${id}/`, 'PATCH', body);
    }
};