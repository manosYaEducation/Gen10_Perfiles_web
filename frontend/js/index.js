document.addEventListener("DOMContentLoaded", function () {
  // Verificar que la API_URL_PHP esté correctamente configurada
  if (!window.API_URL_PHP) {
    console.error("API_URL_PHP no está definida");
    return;
  }

  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.getElementById("nav-links");

  menuIcon.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Check login status for profile display
  checkLoginStatus();


  // Realiza una solicitud para obtener todos los perfiles desde el endpoint configurado
  fetch(`${window.API_URL_PHP}read_user.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const profilesColumn = document.querySelector(".profiles-column");
        if (profilesColumn) {
          profilesColumn.innerHTML = "";

          data.profiles.forEach((profile, index) => {
            const isEven = index % 2 === 0;
            const profileSection = document.createElement("div");
            profileSection.className = "profile-section";

            profileSection.innerHTML = `
                            ${
                              isEven
                                ? `
                                <div class="profile-image-container">
                                    <img src="${
                                      profile.image ||
                                      "./assets/img/default-profile.png"
                                    }" alt="${profile.name}">
                                </div>
                                <div class="profile-text-container">
                                    <h2>${profile.name}</h2>
                                    <p>${profile.phrase}</p>
                                    <p>${profile.description}</p>
                                    <a href="./frontend/perfiles/profile-template.html?id=${
                                      profile.id
                                    }" class="perfil">Ver Perfil</a>
                                </div>
                            `
                                : `
                                <div class="profile-text-container">
                                    <h2>${profile.name}</h2>
                                    <p>${profile.phrase}</p>
                                    <p>${profile.description}</p>
                                    <a href="./frontend/perfiles/profile-template.html?id=${
                                      profile.id
                                    }" class="perfil">Ver Perfil</a>
                                </div>
                                <div class="profile-image-container">
                                    <img src="${
                                      profile.image ||
                                      "./assets/img/default-profile.png"
                                    }" alt="${profile.name}">
                                </div>
                            `
                            }
                        `;

            profilesColumn.appendChild(profileSection);
          });
        }
      } else {
        console.error("No se pudieron obtener los perfiles:", data.message);
      }
    })
    .catch((error) => console.error("Error al obtener perfiles:", error));
});
function checkLoginStatus() {
  // Primero revisa localStorage (persistente)
  const lsLoggedIn = localStorage.getItem("userLoggedIn") === "true";
  // Después revisa sessionStorage (sesión actual)
  const ssLoggedIn = sessionStorage.getItem("userLoggedIn") === "true";

  // Usuario está logueado si cualquiera de los dos almacenamientos lo considera logueado
  const isLoggedIn = lsLoggedIn || ssLoggedIn;


  const loginContainer = document.getElementById("login-container");
  const profileContainer = document.getElementById("profile-container");

  if (!loginContainer || !profileContainer) return;

  if (isLoggedIn) {
    // User is logged in, show profile dropdown
    loginContainer.style.display = "none";
    profileContainer.style.display = "block";

    // Get username (primero de localStorage, luego de sessionStorage)
    const username =
      localStorage.getItem("username") ||
      sessionStorage.getItem("username") ||
      "Usuario";

    // Update profile name
    const profileName = document.getElementById("profile-name");
    if (profileName) {
      profileName.textContent = username;
    }
  } else {
    // Not logged in, show login button
    loginContainer.style.display = "block";
    profileContainer.style.display = "none";
  }
}

function logout() {
  // Clear stored data
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("sessionPermanent");
  sessionStorage.removeItem("userLoggedIn");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("sessionPermanent");

  // Redirect to home page
  window.location.href = "/index.html";
}
// Agregar manejo de clics para el menú desplegable
document.addEventListener("DOMContentLoaded", function () {
  const profileBtn = document.getElementById("profile-btn");
  const dropdownContent = document.querySelector(".dropdown-content");

  if (profileBtn && dropdownContent) {
    // Alternar menú con clic
    profileBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropdownContent.classList.toggle("show");
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", function (e) {
      if (
        dropdownContent.classList.contains("show") &&
        !profileBtn.contains(e.target) &&
        !dropdownContent.contains(e.target)
      ) {
        dropdownContent.classList.remove("show");
      }
    });

    // Prevenir cierre al hacer clic dentro del menú
    dropdownContent.addEventListener("click", function (e) {
      // Solo prevenir para clics que no sean en enlaces
      if (e.target.tagName !== "A") {
        e.stopPropagation();
      }
    });
  }
});
