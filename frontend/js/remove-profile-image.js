document.addEventListener("DOMContentLoaded", function () {
    const removeBtn = document.getElementById("remove-profile-image");
    const preview = document.getElementById("image-preview");
    const inputImage = document.getElementById("input-image");

    if (removeBtn) {
        removeBtn.addEventListener("click", function () {
            preview.innerHTML = "";
            inputImage.value = "";
        });
    }
});