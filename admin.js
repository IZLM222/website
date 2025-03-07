class AdminPanel {
    constructor() {
        this.isAdmin = true; // Set isAdmin to true by default
        this.adminPassword = 'password'; // Change this to your desired password
        this.init();
    }

    init() {
        this.setupAdminPanel();
    }

    setupAdminPanel() {
        const adminLoginForm = document.getElementById('admin-login-form');
        const adminLogoutBtn = document.getElementById('admin-logout');

        if (adminLoginForm) {
            adminLoginForm.style.display = 'none'; // Hide login form
        }

        if (adminLogoutBtn) {
            adminLogoutBtn.style.display = 'none'; // Hide logout button
        }

        // Add edit buttons to editable sections
        this.addEditButtons();
    }

    addEditButtons() {
        const editableSections = [
            { id: 'quotes', type: 'list' },
            { id: 'blog-posts', type: 'list' },
            { id: 'photo-gallery', type: 'gallery' }
        ];

        editableSections.forEach(section => {
            const elem = document.getElementById(section.id);
            if (!elem) return;

            const controls = document.createElement('div');
            controls.className = 'admin-controls';
            controls.innerHTML = `
                <button class="edit-btn" onclick="admin.editSection('${section.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="add-btn" onclick="admin.addItem('${section.id}', '${section.type}')">
                    <i class="fas fa-plus"></i> Add New
                </button>
            `;
            elem.insertBefore(controls, elem.firstChild);
        });
    }

    handleAdminLogin() {
        // Removed login logic
    }

    handleAdminLogout() {
        // Removed logout logic
    }

    checkAdminStatus() {
        // Removed admin status check logic
    }

    showAdminInterface() {
        // Removed interface show logic
    }

    hideAdminInterface() {
        // Removed interface hide logic
    }

    editSection(sectionId) {
        if (!this.isAdmin) return;
        const section = document.getElementById(sectionId);
        if (!section) return;

        const content = section.innerHTML;
        const form = document.createElement('form');
        form.className = 'edit-form';
        form.innerHTML = `
            <textarea style="width: 100%; min-height: 200px;">${content}</textarea>
            <div class="form-buttons">
                <button type="submit" class="save-btn">
                    <i class="fas fa-save"></i> Save Changes
                </button>
                <button type="button" class="cancel-btn" onclick="admin.cancelEdit('${sectionId}')">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;

        section.dataset.originalContent = content;
        section.innerHTML = '';
        section.appendChild(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newContent = form.querySelector('textarea').value;
            section.innerHTML = newContent;
            this.addEditButtons();
        });
    }

    addItem(sectionId, type) {
        if (!this.isAdmin) return;
        const section = document.getElementById(sectionId);
        if (!section) return;

        let template = '';
        switch (type) {
            case 'list':
                template = `
                    <div class="item">
                        <input type="text" placeholder="Title">
                        <textarea placeholder="Content"></textarea>
                    </div>`;
                break;
            case 'gallery':
                template = `
                    <div class="item">
                        <input type="file" accept="image/*">
                        <input type="text" placeholder="Caption">
                    </div>`;
                break;
        }

        const form = document.createElement('form');
        form.className = 'add-form';
        form.innerHTML = `
            ${template}
            <div class="form-buttons">
                <button type="submit" class="save-btn">
                    <i class="fas fa-save"></i> Save
                </button>
                <button type="button" class="cancel-btn" onclick="this.closest('.add-form').remove()">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;

        section.insertBefore(form, section.firstChild);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically save the new item to a backend
            // For now, we'll just append it to the section
            const newContent = this.createNewContent(form, type);
            form.remove();
            section.insertAdjacentHTML('beforeend', newContent);
        });
    }

    createNewContent(form, type) {
        switch (type) {
            case 'list':
                const title = form.querySelector('input[type="text"]').value;
                const content = form.querySelector('textarea').value;
                return `
                    <div class="item">
                        <h3>${title}</h3>
                        <p>${content}</p>
                    </div>`;
            case 'gallery':
                const file = form.querySelector('input[type="file"]').files[0];
                const caption = form.querySelector('input[type="text"]').value;
                const imageUrl = URL.createObjectURL(file);
                return `
                    <div class="gallery-item">
                        <img src="${imageUrl}" alt="${caption}">
                        <p>${caption}</p>
                    </div>`;
            default:
                return '';
        }
    }

    cancelEdit(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section || !section.dataset.originalContent) return;
        section.innerHTML = section.dataset.originalContent;
        delete section.dataset.originalContent;
        this.addEditButtons();
    }
}

// Initialize admin panel
const admin = new AdminPanel();
