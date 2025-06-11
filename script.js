class Profile {
    constructor(menu, open, edit, save, inputImage, profileImage, inputName, inputBio, portfolioList, portfolioAddItem, projectsList, projectsAddItem) {
        this.menu = document.querySelector(menu);
        this.open = document.querySelector(open);
        this.edit = document.querySelector(edit);
        this.save = document.querySelector(save);
        this.inputImage = document.querySelector(inputImage);
        this.profileImage = document.querySelector(profileImage)
        this.inputName = document.querySelector(inputName);
        this.inputBio = document.querySelector(inputBio);
        this.portfolioList = document.querySelector(portfolioList);
        this.portfolioAddItem = document.querySelector(portfolioAddItem);
        this.projectsList = document.querySelector(projectsList);
        this.projectsAddItem = document.querySelector(projectsAddItem);
        this.name = localStorage.getItem("name") || "";
        this.bio = localStorage.getItem("bio") || "";
        this.profileImageUrl = localStorage.getItem("profileImageUrl") || "";
        this.portfolio = JSON.parse(localStorage.getItem("portfolio")) || [];
        this.projects = JSON.parse(localStorage.getItem("projects")) || [];
        this.active = "active";
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    setFormValues() {
        this.inputName.value = this.name;
        this.inputBio.value = this.bio;
        this.setPortfolioValues();
        this.setProjectsValues();
        this.setProfileImage();

        autoResizeTextarea(this.inputBio);
    }

    setPortfolioValues() {
        this.portfolioList.innerHTML = "";
        if (this.portfolio.length === 0) {
            const portfolioItem = document.createElement("div");
            portfolioItem.classList.add("portfolio-item");
        
            portfolioItem.innerHTML = `
                <input type="text" maxLength="15" placeholder="Item" disabled />
                <span class="material-symbols-outlined">attach_money</span>
                <input type="number" min="0" max="99999999" placeholder="Value" disabled />
            `;
        
            this.portfolioList.appendChild(portfolioItem);
        } else {
            this.portfolio.forEach((item, index) => {
                const portfolioItem = document.createElement("div");
                portfolioItem.classList.add("portfolio-item");
            
                portfolioItem.innerHTML = `
                    <input type="text" value="${item.title}" maxLength="15" disabled />
                    <span class="material-symbols-outlined">attach_money</span>
                    <input type="number" value="${item.value}" min="0" max="99999999" disabled />
                    ${index !== 0 ? `<button style="margin-left: 0.5rem" type="button" class="material-symbols-outlined remove-item" style="display: none">close</button>` : ''}
                `;
            
                this.portfolioList.appendChild(portfolioItem);
            
                if (index !== 0) {
                    const removeButton = portfolioItem.querySelector(".remove-item");
                    removeButton.addEventListener("click", () => {
                        this.portfolioList.removeChild(portfolioItem);
                    });
                }
            }); 
        }
    }

    setProjectsValues() {
        const itemsToRemove = this.projectsList.querySelectorAll(".project-item");
        itemsToRemove.forEach(item => item.remove());

        this.projects.forEach((item, index) => {
            const projectItem = document.createElement("div");
            projectItem.classList.add("project-item");

            projectItem.innerHTML = `
                <img src="${item}">
                <i class="material-symbols-outlined">close</i>
            `;

            this.projectsList.appendChild(projectItem);
            const closeButton = projectItem.querySelector("i");

            closeButton.addEventListener("click", () => {
                this.projectsList.removeChild(projectItem);
                this.projects = this.projects.filter(i => i !== item);
            })
        });
    }

    setProfileImage() {
        if (this.profileImageUrl) {
            this.profileImage.style.backgroundImage = `url(${this.profileImageUrl})`;
        } else {
            this.profileImage.style.backgroundImage = "url(../assets/img/default.png)";
        }
        this.profileImage.style.backgroundSize = "cover";
        this.profileImage.style.backgroundPosition = "center";
    }

    toggleMenu() {
        this.menu.classList.toggle(this.active);
        this.open.classList.toggle(this.active);
        this.open.textContent = this.menu.classList.contains(this.active) ? "close" : "person";
    }

    openMenu() {
        this.open.addEventListener("click", () => this.toggleMenu());
    }

    toggleForm(isActive) {
        this.edit.textContent = isActive ? "close" : "edit";
        this.save.style.display = isActive ? "block" : "none";
        this.portfolioAddItem.style.display = isActive ? "block" : "none";
        this.projectsAddItem.style.display = isActive ? "flex" : "none";

        [...this.portfolioList.querySelectorAll(".portfolio-item")].forEach((item, index) => {
            item.querySelector("input[type='text']").disabled = !isActive;
            item.querySelector("input[type='number']").disabled = !isActive;
            if (index === 0) return;
            item.querySelector(".remove-item").style.display = isActive ? "block" : "none";
        });

        this.inputImage.disabled = !isActive;
        this.inputName.disabled = !isActive;
        this.inputBio.disabled = !isActive;

        const newPortfolioItems = this.portfolioList.querySelectorAll(".new-item");
        newPortfolioItems.forEach(item => this.portfolioList.removeChild(item));

        const newProjectItems = this.projectsList.querySelectorAll(".new-item");
        newProjectItems.forEach(item => this.projectsList.removeChild(item));
    }

    toggleEdit() {
        const isActive = this.edit.classList.toggle(this.active);
        this.profileImage.classList.toggle(this.active);
        this.projectsList.classList.toggle(this.active);

        this.toggleForm(isActive);
        this.removeErrors();

        if (!isActive) {
            this.profileImageUrl = localStorage.getItem("profileImageUrl") || "";
            this.projects = JSON.parse(localStorage.getItem("projects")) || [];
            this.setFormValues();
        }
    }

    addPortfolioItem() {
        const newItem = document.createElement("div");
        newItem.classList.add("portfolio-item", "new-item");
    
        newItem.innerHTML = `
            <input type="text" maxLength="15" placeholder="Item" />
            <span class="material-symbols-outlined">attach_money</span>
            <input type="number" min="0" max="99999999" placeholder="Value" />
            <button style="margin-left: 0.5rem" type="button" class="material-symbols-outlined remove-item">close</button>
        `;
    
        this.portfolioList.appendChild(newItem);
    
        newItem.querySelector(".remove-item").style.display = "block";
        newItem.querySelector(".remove-item").addEventListener("click", () => {
            this.portfolioList.removeChild(newItem);
        });
    }

    addProjectItem() {
        const newItem = document.createElement("div");
        newItem.classList.add("project-item", "new-item");
    
        const newInput = document.createElement("input");
        newInput.type = "file";
        newInput.accept = "image/*";
    
        newInput.click();
    
        newInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
    
                reader.onload = (e) => {
                    newItem.innerHTML = `
                        <img src="${e.target.result}" />
                        <i class="material-symbols-outlined">close</i>
                    `;
    
                    this.projects.push(e.target.result);
                    this.projectsList.appendChild(newItem);
    
                    const closeButton = newItem.querySelector("i");
                    closeButton.addEventListener("click", () => {
                        this.projectsList.removeChild(newItem);
                        this.projects = this.projects.filter(item => item !== e.target.result);
                    });
                };
    
                reader.readAsDataURL(file);
            }
        });
    }    

    handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.profileImageUrl = e.target.result;
                this.setProfileImage();
            };
            reader.readAsDataURL(file);
        }
    }

    editProfile() {
        this.edit.addEventListener("click", () => this.toggleEdit());
        this.save.addEventListener("click", (e) => this.saveProfile());
        this.inputBio.addEventListener("input", (e) => autoResizeTextarea(e.target));
        this.portfolioAddItem.addEventListener("click", () => this.addPortfolioItem());
        this.projectsAddItem.addEventListener("click", () => this.addProjectItem());
        this.inputImage.addEventListener("change", this.handleImageChange);
    }

    saveProfile() {
        let error = false;

        if (!this.inputName.value) {
            this.inputName.classList.add("error");
            error = true;
        } else {
            this.inputName.classList.remove("error");
        }

        if (!this.inputBio.value) {
            this.inputBio.classList.add("error");
            error = true;
        } else {
            this.inputBio.classList.remove("error");
        }
    
        const portfolioData = [];
        this.portfolioList.querySelectorAll(".portfolio-item").forEach(item => {
            const inputTitle = item.querySelector("input[type='text']");
            const inputValue = item.querySelector("input[type='number']");
            const title = inputTitle.value;
            const value = inputValue.value;

            if (!title) {
                inputTitle.classList.add("error");
                if (!value) inputValue.classList.add("error");
                error = true;
                return;
            } else if (!value) {
                inputValue.classList.add("error");
                error = true;
                return;
            }

            portfolioData.push({ title, value });
            item.classList.remove("new-item");
        });

        this.projectsList.querySelectorAll(".project-item").forEach(item => {
            item.classList.remove("new-item");
        });

        if (error) return;

        this.name = this.inputName.value;
        this.bio = this.inputBio.value;
        this.portfolio = portfolioData;
        this.setProfileImage();
        localStorage.setItem("name", this.inputName.value);
        localStorage.setItem("bio", this.inputBio.value);
        localStorage.setItem("portfolio", JSON.stringify(portfolioData));
        localStorage.setItem("profileImageUrl", this.profileImageUrl);
        localStorage.setItem("projects", JSON.stringify(this.projects));
    
        const isActive = this.edit.classList.toggle(this.active);
        this.profileImage.classList.toggle(this.active);
        this.projectsList.classList.toggle(this.active);
        this.toggleForm(isActive);
    }
    
    removeErrors() {
        this.inputName.classList.remove("error");
        this.inputBio.classList.remove("error");
        this.portfolioList.querySelectorAll(".portfolio-item").forEach(item => {
            item.querySelector("input[type='text']").classList.remove("error");
            item.querySelector("input[type='number']").classList.remove("error");
        });
    }

    init() {
        if (this.menu) {
            this.openMenu();
            this.setFormValues();
            this.editProfile();

            autoResizeTextarea(this.inputBio);
        }
        return this;
    }
}

const profile = new Profile(
    ".profile", 
    ".profile-button", 
    ".edit-profile",
    ".save-profile",
    "#input-image",
    ".profile-image",
    "#input-name",
    "#input-bio",
    ".portfolio-list",
    ".portfolio-add-item",
    ".projects-list",
    ".projects-add-item"
);

profile.init();

function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}
