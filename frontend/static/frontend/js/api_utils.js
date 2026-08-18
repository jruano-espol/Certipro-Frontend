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

            if (response.status === 204) {
                console.log(`SUCCESSFUL (No Content)`);
                return null;
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
    },

    async delete(endpoint, id){
        return await this.fetch(`${endpoint}${id}/`, 'DELETE');
    },

    async categorize_tasks(tasks){
        for (const task of tasks) {
            let status = "Aceptada";

            const requiredEvidences = await API_UTILS.get_filter_by_column(
                "/required_evidences/", "requirement_version", task.requirement_version
            );

            for (const requiredEvidence of requiredEvidences){
                const uploadedEvidences = await API_UTILS.get_filter_by_column(
                    "/uploaded_evidences/", "required_evidence", requiredEvidence.id
                );
                if(uploadedEvidences.length > 0){
                    const feedbacks = await this.get_filter_by_column(
                        "/feedbacks/", "uploaded_evidence", uploadedEvidences[0].id
                    );

                    if (feedbacks.length > 0){
                        if(feedbacks[0].result_type === "REJECT"){
                            status = "Pendiente";
                            break;
                        }
                    }
                    else{
                        status = "En Revisión";
                    }
                    
                }
                else{
                    status = "Pendiente";
                }
            }

            task.status = status;
        }
        return tasks;
    },

    async categorize_requirements(requirements){
        for (requirement of requirements){
            let status = "Desconocido";
            let evidence_count = 0;

            const requirementVersions = await this.get_filter_by_column(
                "/requirement_versions/", "requirement", requirement.id
            );

            if (!requirementVersions || requirementVersions.length === 0) continue;

            let latestVersion = requirementVersions[0];
            let i = 0;
            while (i < requirementVersions.length && !latestVersion.is_active){
                i++;
                if (i < requirementVersions.length) {
                    latestVersion = requirementVersions[i];
                }
            }

            if (latestVersion && latestVersion.is_active){
                const requiredEvidences = await this.get_filter_by_column(
                    "/required_evidences/", "requirement_version", latestVersion.id
                );

                evidence_count = requiredEvidences.length;

                for (const requiredEvidence of requiredEvidences){
                    const uploadedEvidences = await this.get_filter_by_column(
                        "/uploaded_evidences/", "required_evidence", requiredEvidence.id
                    );
                    if(uploadedEvidences.length > 0){
                        const latestEvidence = uploadedEvidences[0];
                        status = "Aceptada";

                        const feedbacks = await this.get_filter_by_column(
                            "/feedbacks/", "uploaded_evidence", latestEvidence.id
                        );

                        if (feedbacks.length > 0){
                            if(feedbacks[0].result_type === "REJECT"){
                                status = "Pendiente";
                                break;
                            }
                        }
                        else{
                            status = "En Revisión";
                        }
                        
                    }
                    else{
                        status = "Pendiente";
                    }
                }
            }
            requirement.status = status;
            requirement.evidence_count = evidence_count;
        }
        return requirements;
    },

    async categorize_required_evidences(requiredEvidences){
        for (requiredEvidence of requiredEvidences){
            let status = "Desconocido";

            const uploadedEvidences = await this.get_filter_by_column(
                "/uploaded_evidences/", "required_evidence", requiredEvidence.id
            );
            if(uploadedEvidences.length > 0){
                const latestEvidence = uploadedEvidences[0];
                status = "Aceptada";

                const feedbacks = await this.get_filter_by_column(
                    "/feedbacks/", "uploaded_evidence", latestEvidence.id
                );

                if (feedbacks.length > 0){
                    if(feedbacks[0].result_type === "REJECT"){
                        status = "Pendiente";
                        break;
                    }
                }
                else{
                    status = "En Revisión";
                }
                
            }
            else{
                status = "Pendiente";
            }
            requiredEvidence.status = status;
            requiredEvidence.uploaded_evidences_count = uploadedEvidences.length;
        }
        return requiredEvidences;
    }
};