// Data DOM
const formGoods = document.querySelector("#form-goods")
const noGood = document.querySelector("#no-good")
const goodsList = document.querySelector("#goods-list")
const done = document.querySelector("#done")
const deleteAllBtn = document.querySelector("#delete-all")

// CREATE
function addGood(e) {
  e.preventDefault()

  const newGood = e.target.goodName.value

  if (newGood === "") return

  const goodsListLSExists = getLocalStorage()

  if (goodsListLSExists && goodsListLSExists.length > 0) {
    updateLocalStorage([
      ...goodsListLSExists.filter(
        (goodLS) => goodLS.name.toLowerCase() !== newGood.toLowerCase()
      ),
      { id: Date.now(), name: newGood, completed: false },
    ])

    fetchGoods()
    formGoods.reset()
    return
  }

  updateLocalStorage([{ id: Date.now(), name: newGood, completed: false }])

  fetchGoods()
  formGoods.reset()
}

// READ
function fetchGoods() {
  const goodsListLS = getLocalStorage()

  goodsList.innerHTML = ""

  if (goodsListLS && goodsListLS.length > 0) {
    goodsListLS
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((goodLS, idx) => {
        goodsList.innerHTML += `
        <div class="good">
          <h6>
            <span>${idx + 1}).</span>
            <span class="">${
              goodLS.name.substring(0, 1).toUpperCase() +
              goodLS.name.substring(1)
            }</span>
          </h6>
          <div class="actions">
            <input 
              type="checkbox" 
              ${goodLS.completed ? "checked" : ""} 
              id="${goodLS.id}"
            />

            <i class="fa-solid fa-trash-can" id="deleteBtn" data-id="${
              goodLS.id
            }"></i>
          </div>
        </div>
      `
      })

    noGood.style.display = "none"
    done.style.display = goodsListLS.every((goodLS) => goodLS.completed)
      ? "block"
      : "none"

    return
  }

  done.style.display = "none"
  noGood.style.display = "block"
}

// UPDATE
function completeGood(e) {
  if (e.target.type === "checkbox") {
    const completed = e.target.checked
    const id = e.target.id

    const goodsListLSExists = getLocalStorage()

    if (goodsListLSExists && goodsListLSExists.length > 0) {
      const foundGood = goodsListLSExists.find((goodLS) => +goodLS.id === +id)

      updateLocalStorage([
        ...goodsListLSExists.filter((goodLS) => +goodLS.id !== +id),
        { ...foundGood, completed },
      ])

      fetchGoods()
      return
    }
  }
}

// DELETE
function deleteGood(e) {
  const goodsListLSExists = getLocalStorage()
  const id = e.target.dataset.id

  if (
    id &&
    e.target.id === "deleteBtn" &&
    goodsListLSExists &&
    goodsListLSExists.length > 0
  ) {
    updateLocalStorage(goodsListLSExists.filter((goodLS) => +goodLS.id !== +id))

    fetchGoods()
    return
  }
}

function deleteAllGoods() {
  const goods = getLocalStorage()
  if (goods && goods.length > 0 && goods.every((good) => good.completed)) {
    if (confirm("Are you sur to delete all goods ?")) {
      updateLocalStorage([])
      fetchGoods()
    }
  }
}

// Local Storage
function getLocalStorage() {
  return JSON.parse(localStorage.getItem("goods"))
}

function updateLocalStorage(data) {
  localStorage.setItem("goods", JSON.stringify(data))
}

// Event Listeners
fetchGoods()
formGoods.addEventListener("submit", addGood)
goodsList.addEventListener("click", completeGood)
goodsList.addEventListener("click", deleteGood)
deleteAllBtn.addEventListener("click", deleteAllGoods)
