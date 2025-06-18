function openMenu() {
    document.getElementById("sidepanel").classList.add("open");
    document.getElementById("overlay").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    document.getElementById("sidepanel").classList.remove("open");
    document.getElementById("overlay").classList.remove("active");
    document.body.style.overflow = "auto";
}
