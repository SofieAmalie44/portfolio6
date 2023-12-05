const cafeUl = document.querySelector('.cafes ul');

const spanPriceLevel = document.createElement('span');

fetch('/cafes')
    .then(response => response.json())
    .then(cafeArray => {
        console.log(cafeArray)
        cafeArray.forEach(cafeObject => {


            const cafeNavnLI = document.createElement('li');
            const spanHeader = document.createElement('span');

            cafeNavnLI.setAttribute('id', "cafeNavnLI");


            const priceLevelUL = document.createElement('ul');
            const priceLevelLI = document.createElement('li');

            priceLevelUL.setAttribute('id', "priceLevelUL");
            priceLevelLI.setAttribute('id', "priceLevelLI");




            spanHeader.innerText = cafeObject.cafe_name;
            priceLevelLI.innerText = cafeObject.price_level;



            cafeNavnLI.appendChild(spanHeader);
            cafeUl.appendChild(cafeNavnLI);
            priceLevelUL.appendChild(cafeNavnLI);
            priceLevelLI.appendChild(priceLevelUL);
        });
    });

/*  spanHeader.innerText = `cafe${i}`;
spanPriceLevel.innerText = `price${i}`;


li.appendChild(spanPriceLevel)

ul.appendChild(li)
})


spanHeader.innerText = `cafe${i}`;
spanPriceLevel.innerText = `price${i}`;

li.appendChild(spanHeader)
li.appendChild(spanPriceLevel)

ul.appendChild(li)
*/


