const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
        console.log("addEventListener triggered")
        const updateBtn = document.querySelector("button")
        updateBtn.removeAttribute("disabled")
    })
