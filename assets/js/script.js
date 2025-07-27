
function renderCars(cars) {
    const container = document.getElementById("cars-container");
    container.innerHTML = "";

    cars.forEach(car => {
        container.innerHTML += `<div class="transition-all cursor-pointer hover:-translate-y-1 duration-200 hover:scale-[1.03] hover:shadow-xl w-[calc((100%-90px)/4)] rounded-[12px] overflow-hidden bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.15)]">
                                    <div class="relative w-full aspect-[4/3]">
                                        <img src="${car.images[0]}" alt="" class="w-full h-full object-cover" />
                                        <div class="absolute top-[10px] left-[10px] flex gap-[8px]">
                                                ${car.barter ? `<i class="fa-solid fa-rotate cursor-pointer bg-[#76c81c] text-white p-1 rounded"></i>` : ""}
                                                ${car.credit ? `<i class="fa-solid fa-percent cursor-pointer bg-[#f5a623] text-white p-1 rounded"></i>` : ""}
                                            </div>
                                    </div>
                                    <div class="p-[10px] flex flex-col gap-[5px]">
                                        <div class="text-[18px] font-bold text-[#212c3a]">${car.price} ${car.currency}</div>
                                        <div class="text-[16px] font-medium text-[#212c3a]">${car.brand} ${car.model}</div>
                                        <div class="text-[16px] font-normal text-[#212c3a]">${car.year}, ${car.engine} L, ${car.odometer} ${car.odometerUnit}</div>
                                        <div class="text-[14px] font-normal text-[#8d94ad]">${car.city}, bu gün ${car.createdTime}</div>
                                    </div>
                                </div>`;
    });
} addCreatedTime(data);

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

function toggleSelect(id) {
    const element = document.getElementById(id);
    states[id] = !states[id];

    if (states[id]) {
        element.classList.add("outline", "font-bold");
        element.style.borderColor = "#ca1016";
        element.style.color = "#ca1016";
    } else {
        element.classList.remove("font-bold");
        element.classList.remove("outline");
        element.style.borderColor = "";
        element.style.color = "";
    }
    applyFilters();
}