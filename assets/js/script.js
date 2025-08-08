function renderCars(cars, isFavoritesView = false) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const container = document.getElementById("cars-container");
    container.innerHTML = "";

    cars.forEach(car => {
        const isFavorite = favorites.includes(car.id);
        const cardHTML = `
            <div class="transition-all cursor-pointer hover:-translate-y-1 duration-200 hover:scale-[1.03] hover:shadow-xl w-[calc((100%-90px)/4)] rounded-[12px] overflow-hidden bg-[var(--bg-card)] shadow-[0px_3px_8px_rgba(0,0,0,0.15)]" data-car-id="${car.id}">
                <div class="relative w-full aspect-[4/3]">
                    <img src="${car.images[0]}" alt="" class="w-full h-full object-cover" />
                    <div class="absolute top-[10px] left-[10px] flex gap-[8px]">
                        ${car.barter ? `<i class="fa-solid fa-rotate cursor-pointer bg-[#76c81c] text-white p-1 rounded"></i>` : ""}
                        ${car.credit ? `<i class="fa-solid fa-percent cursor-pointer bg-[#f5a623] text-white p-1 rounded"></i>` : ""}
                    </div>
                    <div class="absolute top-[10px] right-[10px]">
                        <i class="fa-solid fa-heart favorite-icon cursor-pointer text-[20px] ${isFavorite ? 'text-red-600' : 'text-white'}"
                           data-id="${car.id}"
                           onclick="toggleFavorite(this, ${isFavoritesView})"></i>
                    </div>
                </div>
              <div class="p-[10px] flex flex-col gap-[5px]">
                <div class="text-[18px] font-bold text-[var(--text-card)]">${car.price} ${car.currency}</div>
                <div class="text-[16px] font-medium text-[var(--text-card)]">${car.brand} ${car.model}</div>
                <div class="text-[16px] font-normal text-[var(--text-card)]">${car.year}, ${car.engine} L, ${car.odometer} ${car.odometerUnit}</div>
                <div class="text-[14px] font-normal text-[var(--text-secondary)]">${car.city}, bu gün ${car.createdTime}</div>
                </div>
            </div>`;
        container.innerHTML += cardHTML;
    });
}
addCreatedTime(data);

function addCreatedTime(data) {
    const time = new Date().toTimeString().slice(0, 5);
    data.forEach(car => car.createdTime = time);
    renderCars(data);
}

function populateBrands(data) {
    const select = document.getElementById("brand");
    const brands = [...new Set(data.map(car => car.brand))];
    select.innerHTML = `<option value="">Marka</option>`;

    brands.forEach(brand => {
        select.innerHTML += `<option value="${brand}">${brand}</option>`;
    });
}

function populateModels(data) {
    const select = document.getElementById("model");
    const models = [...new Set(data.map(car => car.model))];
    select.innerHTML = `<option value="">Model</option>`;

    models.forEach(model => {
        select.innerHTML += `<option value="${model}">${model}</option>`;
    });
}

function populateBanTypes(data) {
    const select = document.getElementById("banType");
    const types = [...new Set(data.map(car => car.banType))];
    select.innerHTML = `<option value="">Ban növü</option>`;

    types.forEach(type => {
        select.innerHTML += `<option value="${type}">${type}</option>`;
    });
}

function populateCities(data) {
    const select = document.getElementById("city");
    const cities = [...new Set(data.map(car => car.city))];
    select.innerHTML = `<option value="">Şəhər</option>`;

    cities.forEach(city => {
        select.innerHTML += `<option value="${city}">${city}</option>`;
    });
}

function populateCurrencies(data) {
    const select = document.getElementById("currency");
    const currencies = [...new Set(data.map(car => car.currency))];
    select.innerHTML = `<option value="">Valyuta</option>`;

    currencies.forEach(curr => {
        select.innerHTML += `<option value="${curr}">${curr}</option>`;
    });
}

populateBrands(data);
populateModels(data);
populateBanTypes(data);
populateCities(data);
populateCurrencies(data);

function applyFilters() {
    const brand = document.getElementById("brand").value;
    const model = document.getElementById("model").value;
    const banType = document.getElementById("banType").value;
    const city = document.getElementById("city").value;
    const currency = document.getElementById("currency").value;

    const odometerMin = document.querySelector('input[name="odometerMin"]').value;
    const odometerMax = document.querySelector('input[name="odometerMax"]').value;
    const priceMin = document.querySelector('input[name="priceMin"]').value;
    const priceMax = document.querySelector('input[name="priceMax"]').value;
    const yearMin = document.querySelector('input[name="yearMin"]').value;
    const yearMax = document.querySelector('input[name="yearMax"]').value;

    const credit = states.credit;
    const barter = states.barter;

    const filtered = data.filter(car => {
        return (
            (brand === "" || car.brand === brand) &&
            (model === "" || car.model === model) &&
            (banType === "" || car.banType === banType) &&
            (city === "" || car.city === city) &&
            (currency === "" || car.currency === currency) &&
            (odometerMin === "" || car.odometer >= parseInt(odometerMin)) &&
            (odometerMax === "" || car.odometer <= parseInt(odometerMax)) &&
            (priceMin === "" || car.price >= parseInt(priceMin)) &&
            (priceMax === "" || car.price <= parseInt(priceMax)) &&
            (yearMin === "" || car.year >= yearMin) &&
            (yearMax === "" || car.year <= yearMax) &&
            (!credit || car.credit) &&
            (!barter || car.barter)
        );
    });
    renderCars(filtered);
}

const filterForm = document.querySelector("#filters form");
filterForm.addEventListener("input", applyFilters);
filterForm.addEventListener("change", applyFilters);

function resetFilters() {
    const form = document.querySelector("#filters form");
    form.querySelectorAll("input, select").forEach(el => {
        el.value = "";
    });
    states.credit = false;
    states.barter = false;

    const toggleIds = ["credit", "barter"];

    for (let i = 0; i < toggleIds.length; i++) {
        const id = toggleIds[i];
        const element = document.getElementById(id);

        element.classList.remove("font-bold");
        element.classList.remove("outline");
        element.style.borderColor = "";
        element.style.color = "";
    }
    renderCars(data);
}
const states = {
    credit: false,
    barter: false,
};

function toggleFavorite(icon, isFavoritesView) {
    const carId = icon.getAttribute('data-id');
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.indexOf(carId);

    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        if (isFavoritesView) {
            const card = icon.closest("[data-car-id]");
            if (card) card.remove();
            const remainingCards = document.querySelectorAll('[data-car-id]');
            if (remainingCards.length === 0) {
                showAllCars();
                return;
            }
        } else {
            icon.classList.remove('text-red-600');
            icon.classList.add('text-white');
        }
    } else {
        favorites.push(carId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        icon.classList.add('text-red-600');
        icon.classList.remove('text-white');
    }
}

function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.length == 0) {
        showAllCars();
        return;
    }
    const favoriteCars = data.filter(car => favorites.includes(car.id));
    if (favoriteCars.length == 0) {
        showAllCars();
        return;
    }
    renderCars(favoriteCars, true);
}

function showAllCars() {
    renderCars(data);
}

function handleThemeWithLocal() {
    const themeToggle = document.getElementById('themeToggle');
    const themeLocal = localStorage.getItem('theme');

    if (themeLocal == 'dark') {
        document.documentElement.classList.add('dark');
        themeToggle.innerHTML = `<i onclick="handleTheme('light')" class="fa-solid fa-moon"></i>`;
    } else {
        document.documentElement.classList.remove('dark');
        themeToggle.innerHTML = `<i onclick="handleTheme('dark')" class="fa-solid fa-sun"></i>`;
    }
}

function handleTheme(theme) {
    localStorage.setItem('theme', theme);
    handleThemeWithLocal();
}
handleThemeWithLocal();

const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const form = document.getElementById('addForm');

openModalBtn.onclick = function () {
    populateSelectOptions();
    modal.classList.remove('hidden');
};
closeModalBtn.onclick = function () {
    modal.classList.add('hidden');
};
modal.onclick = function () {
    modal.classList.add('hidden');
};
modalContent.onclick = function (e) {
    e.stopPropagation();
};

function populateSelectOptions() {
    const brands = [...new Set(data.map(item => item.brand))];
    const banTypes = [...new Set(data.map(item => item.banType))];
    const brandSelect = document.getElementById('brand-modal');
    const banTypeSelect = document.getElementById('banType-modal');
    brandSelect.innerHTML = `<option value="" disabled selected>Marka seç</option>` +
        brands.map(b => `<option value="${b}">${b}</option>`).join("");
    banTypeSelect.innerHTML = `<option value="" disabled selected>Ban tipi seç</option>` +
        banTypes.map(bt => `<option value="${bt}">${bt}</option>`).join("");
}

form.onsubmit = function (e) {
    e.preventDefault();
    const f = form.elements;

    if (!f['brand'].value.trim()) {
        alert("Marka seçməmisən");
        return;
    }
    if (!f['model'].value.trim()) {
        alert("Model yaz");
        return;
    }
    if (!f['banType'].value.trim()) {
        alert("Ban növü seçməmisən");
        return;
    }
    if (!f['odometer'].value.trim()) {
        alert("Yürüş yaz");
        return;
    }
    if (!f['odometerUnit'].value.trim()) {
        alert("Yürüş vahidi seçməmisən");
        return;
    }
    if (!f['price'].value.trim()) {
        alert("Qiymət yaz");
        return;
    }
    if (!f['currency'].value.trim()) {
        alert("Valyuta seçməmisən");
        return;
    }
    if (!f['year'].value.trim()) {
        alert("İl yaz");
        return;
    }
    if (!form.querySelector('input[name="credit"]:checked')) {
        alert("Kredit seçməmisən");
        return;
    }
    if (!form.querySelector('input[name="barter"]:checked')) {
        alert("Barter seçməmisən");
        return;
    }
    if (!f['image'].value.trim()) {
        alert("Şəkil linki yaz");
        return;
    }
    if (!f['city'].value.trim()) {
        alert("Şəhər yaz");
        return;
    }
    if (!f['engine'].value.trim()) {
        alert("Mühərrik yaz");
        return;
    }

    const newItem = {
        id: (data.length + 1).toString(),
        brand: f['brand'].value,
        model: f['model'].value,
        banType: f['banType'].value,
        odometer: Number(f['odometer'].value),
        odometerUnit: f['odometerUnit'].value,
        price: Number(f['price'].value),
        currency: f['currency'].value,
        year: f['year'].value,
        credit: f['credit'].value === "true",
        barter: f['barter'].value === "true",
        images: [f['image'].value],
        city: f['city'].value,
        engine: parseFloat(f['engine'].value),
        createdTime: new Date().toTimeString().slice(0, 5)
    };
    data.unshift(newItem);

    let addedCars = JSON.parse(localStorage.getItem("addedCars")) || [];
    addedCars.push(newItem);
    localStorage.setItem("addedCars", JSON.stringify(addedCars));

    renderCars(data);
    modal.classList.add('hidden');
    form.reset();   
};

const addedCarsJSON = localStorage.getItem("addedCars");
if (addedCarsJSON) {
    const addedCars = JSON.parse(addedCarsJSON);
    data.unshift(...addedCars);
}
renderCars(data);
