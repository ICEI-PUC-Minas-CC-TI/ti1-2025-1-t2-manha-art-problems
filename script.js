function autoResizeTextarea(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

class Profile {
    constructor(menu, open, edit, save, inputImage, inputName, inputBio) {
        this.menu = document.querySelector(menu);
        this.open = document.querySelector(open);
        this.edit = document.querySelector(edit);
        this.save = document.querySelector(save);
        this.inputImage = document.querySelector(inputImage);
        this.inputName = document.querySelector(inputName);
        this.inputBio = document.querySelector(inputBio);
        this.name = localStorage.getItem("name") || "";
        this.bio = localStorage.getItem("bio") || "";
        this.active = "active";
        this.toggleMenu = this.toggleMenu.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.saveProfile = this.saveProfile.bind(this);
    }

    setFormValues() {
        this.inputName.value = this.name;
        this.inputBio.value = this.bio;

        autoResizeTextarea(this.inputBio);
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

        this.inputImage.disabled = !isActive;
        this.inputName.disabled = !isActive;
        this.inputBio.disabled = !isActive;
    }

    toggleEdit() {
        const isActive = this.edit.classList.toggle(this.active);

        this.toggleForm(isActive);

        if (!isActive) this.setFormValues();
    }

    editProfile() {
        this.edit.addEventListener("click", () => this.toggleEdit());
        this.save.addEventListener("click", (e) => {
            e.preventDefault();
            this.saveProfile()
        });
    }

    saveProfile() {
        localStorage.setItem("name", this.inputName.value);
        localStorage.setItem("bio", this.inputBio.value);

        const isActive = this.edit.classList.toggle(this.active);

        this.toggleForm(isActive);
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
    "#input-name",
    "#input-bio"
);

profile.init();

const textarea = document.querySelector("textarea");
textarea.addEventListener("input", function () {
    autoResizeTextarea(this);
});

localStorage.setItem("name", "Lucas");
localStorage.setItem("bio", "Desenvolvedor");