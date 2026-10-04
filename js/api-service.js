const ApiService = {

    async getProfile() {
        const response = await fetch("./data/profile.json");

        if (!response.ok) {
            throw new Error(`Gagal mengambil profile: ${response.status}`);
        }

        return await response.json();
    },

    async getProjects() {
        const response = await fetch("./data/projects.json");

        if (!response.ok) {
            throw new Error(`Gagal mengambil projects: ${response.status}`);
        }

        return await response.json();
    },

    async getServices() {
        const response = await fetch("./data/services.json");

        if (!response.ok) {
            throw new Error(`Gagal mengambil services: ${response.status}`);
        }

        return await response.json();
    }

};