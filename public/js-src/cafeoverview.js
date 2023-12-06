const cafeUl = document.querySelector('.cafes ul');

const spanPriceLevel = document.createElement('span');

fetch('/cafes')
    .then(response => response.json())
    .then(cafeArray => {
        console.log(cafeArray)
        cafeArray.forEach(cafeObject => {

            const checkEmoji = "✅"
            const errorEmoji = "❌"
            const cafeLi = document.createElement('li');
            cafeLi.setAttribute("class", "cafeLi");
            const spanHeader = document.createElement('span');
            spanHeader.setAttribute("id", "spanCafeName");
            const attributeUl = document.createElement('ul');
            const priceLevelLI = document.createElement('li');
            const noiseLevelLI = document.createElement('li');
            const avaliableWifiLI = document.createElement('li');
            const offersFoodLI = document.createElement('li');
            const descriptionBox = document.createElement("span");
            descriptionBox.setAttribute("class", "descriptionSpan")

            spanHeader.innerText =  cafeObject.cafe_name
            priceLevelLI.innerText = cafeObject.price_level;
            noiseLevelLI.innerText = "Noise level: " + cafeObject.noise_level;
            avaliableWifiLI.innerText = cafeObject.avaliable_wifi;
            offersFoodLI.innerText = cafeObject.offer_food;
            descriptionBox.innerText = cafeObject.description;


            if (cafeObject.available_wifi === 1) {
                avaliableWifiLI.innerText = `WIFI: ${checkEmoji}`;
            } else {
                avaliableWifiLI.innerText = `WIFI: ${errorEmoji}`;
            }

            if (cafeObject.offer_food === 1) {
                offersFoodLI.innerText = `Food availability: ${checkEmoji}`;
            } else {
                offersFoodLI.innerText = `Food availability: ${errorEmoji}`;
            }


            if (cafeObject.price_level === "low"){
                   priceLevelLI.innerText = "Price level: $"
            } else if (cafeObject.price_level === "low-medium"){
                   priceLevelLI.innerText = "Price level: $$"
            } else if (cafeObject.price_level === "medium"){
                       priceLevelLI.innerText = "Price level: $$$"
            } else if (cafeObject.price_level === "medium-high"){
                priceLevelLI.innerText = "Price level: $$$$"
            } else if (cafeObject.price_level === "high") {
                priceLevelLI.innerText = "Price level: $$$$$"
            }


            console.log(noiseLevelLI)
            console.log(avaliableWifiLI)
            console.log(offersFoodLI)


            cafeLi.appendChild(spanHeader);
            attributeUl.appendChild(priceLevelLI);
            attributeUl.appendChild(noiseLevelLI);
            attributeUl.appendChild(avaliableWifiLI);
            attributeUl.appendChild((offersFoodLI));
            cafeLi.appendChild(descriptionBox);
            cafeLi.appendChild(attributeUl);
            cafeUl.appendChild(cafeLi);
        });
    });