
const API_UTILS={
    baseUrl: window.API_BASE_URL,
    
    get_headers(){
        const accessToken = localStorage.getItem('access_token');
        return { 'Authorization': `Bearer ${accessToken}` }
    },

    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: this.get_headers()
            });

            // Si hay error de autenticación (Token expirado), redirigir al login
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = "/select_profile/";
                return null;
            }

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error en GET ${endpoint}:`, error);
            throw error;
        }
    },
    async get_by_id(endpoint, id){
        return await this.get(`${endpoint}${id}/`)
    },
    async get_filter_by_column(endpoint, column, id){
        return await this.get(`${endpoint}?${column}=${id}`)
    },
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    ...this.get_headers(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error en POST ${endpoint}:`, error);
            throw error;
        }
    }
};