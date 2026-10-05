document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    loadProjects();
    loadServices();

    // Filter project
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;

            loadProjects(category);

            // Reset semua tombol
            document.querySelectorAll(".filter-btn").forEach(btn => {
                btn.classList.remove("active");
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-outline-primary");
            });

            // Aktifkan tombol yang diklik
            button.classList.remove("btn-outline-primary");
            button.classList.add("btn-primary");
            button.classList.add("active");
        });
    });

    // Contact form
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("contact-name").value;
            const email = document.getElementById("contact-email").value;
            const message = document.getElementById("contact-message").value;

            try {
                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/posts",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            message: message
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Gagal mengirim pesan");
                }

                const result = await response.json();

                console.log("Pesan berhasil dikirim:", result);

                const status = document.getElementById("contact-status");

                if (status) {
                    status.innerHTML = `
                        <div class="alert alert-success">
                            Pesan berhasil dikirim!
                        </div>
                    `;
                }

                contactForm.reset();

            } catch (error) {
                console.error("Gagal mengirim pesan:", error);

                const status = document.getElementById("contact-status");

                if (status) {
                    status.innerHTML = `
                        <div class="alert alert-danger">
                            Gagal mengirim pesan. Silakan coba lagi.
                        </div>
                    `;
                }
            }
        });
    }
});


// ================================
// PROFILE
// ================================

async function loadProfile() {
    try {
        const profile = await ApiService.getProfile();

        document.getElementById("profile-name").textContent =
            profile.name;

        document.getElementById("profile-title").textContent =
            profile.title;

        document.getElementById("profile-description").textContent =
            profile.description;

        document.getElementById("profile-location").textContent =
            profile.location;

        document.getElementById("profile-education").textContent =
            profile.education;

        document.getElementById("profile-interests").textContent =
            profile.interests.join(" & ");

    } catch (error) {
        console.error("Gagal memuat profile:", error);
    }
}


// ================================
// PROJECTS
// ================================

async function loadProjects(category = "all") {
    const container = document.getElementById("projects-container");

    try {
        // Loading state
        container.innerHTML = `
            <div class="col-12 text-center">
                <p>Loading projects...</p>
            </div>
        `;

        const projects = await ApiService.getProjects();

        const filteredProjects =
            category === "all"
                ? projects
                : projects.filter(
                    project => project.category === category
                );

        // Empty state
        if (filteredProjects.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>Tidak ada project pada kategori ini.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = "";

        filteredProjects.forEach(project => {
            container.innerHTML += `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm">

                        <img
                            src="${project.image}"
                            class="card-img-top"
                            alt="${project.title}"
                        >

                        <div class="card-body">

                            <h5 class="card-title">
                                ${project.title}
                            </h5>

                            <p class="card-text">
                                ${project.description}
                            </p>

                            <span class="badge bg-info text-dark">
                                ${project.category}
                            </span>

                            <br>

                            <button
                                type="button"
                                class="btn btn-outline-primary mt-3"
                                onclick="showProjectDetail(${project.id})"
                            >
                                Lihat Project
                            </button>

                        </div>

                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Gagal memuat projects:", error);

        container.innerHTML = `
            <div class="col-12 text-center">
                <p>
                    Gagal memuat projects. Silakan coba lagi.
                </p>
            </div>
        `;
    }
}


// ================================
// SERVICES
// ================================

async function loadServices() {
    const container = document.getElementById("services-container");

    try {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p>Loading services...</p>
            </div>
        `;

        const services = await ApiService.getServices();

        if (services.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center">
                    <p>Tidak ada service yang tersedia.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = "";

        services.forEach(service => {
            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">

                        <div class="card-body text-center">

                            <i class="${service.icon} fs-1 mb-3"></i>

                            <h5 class="card-title">
                                ${service.title}
                            </h5>

                            <p class="card-text">
                                ${service.description}
                            </p>

                        </div>

                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error("Gagal memuat services:", error);

        container.innerHTML = `
            <div class="col-12 text-center">
                <p>
                    Gagal memuat services. Silakan coba lagi.
                </p>
            </div>
        `;
    }
}


// ================================
// PROJECT DETAIL MODAL
// ================================

async function showProjectDetail(projectId) {
    try {
        const projects = await ApiService.getProjects();

        const project = projects.find(
            item => item.id === projectId
        );

        if (!project) {
            return;
        }

        document.getElementById("modalProjectTitle").textContent =
            project.title;

        document.getElementById("modalProjectDescription").textContent =
            project.description;

        document.getElementById("modalProjectCategory").textContent =
            project.category;

        document.getElementById("modalProjectMetrics").textContent =
            project.metrics;

        const tagsContainer =
            document.getElementById("modalProjectTags");

        tagsContainer.innerHTML = "";

        project.tags.forEach(tag => {
            const tagElement =
                document.createElement("span");

            tagElement.className =
                "badge bg-secondary me-1";

            tagElement.textContent = tag;

            tagsContainer.appendChild(tagElement);
        });

        const modalElement =
            document.getElementById("projectModal");

        const modal =
            new bootstrap.Modal(modalElement);

        modal.show();

    } catch (error) {
        console.error(
            "Gagal memuat detail project:",
            error
        );
    }
}