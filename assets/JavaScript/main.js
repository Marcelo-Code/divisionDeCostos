const btnSpend = document.getElementById("btnSpent");
const btnPerson = document.getElementById("btnPerson");
const btnReset = document.getElementById("btnReset")
const spentContainer = document.getElementById("spentContainer");
const peopleContainer = document.getElementById("peopleContainer");
const totalContainer = document.getElementById("totalContainer");
let titleNameSpentsContainer = document.getElementById("titleNameSpentsContainer");
let nameSpentsContainer = document.getElementById("nameSpentsContainer");

let oneSpent = {
    description: '',
    price: 0,
    name: 'asignar'
};

let person = {
    name: '',
    spent: 0
}

//Recuperar array de personas desde localStorage

const recoverPeople = () => {
    let arrayPeople = JSON.parse(localStorage.getItem("arrayPeople")) || [];
    return arrayPeople;
}

//Recuperar array de gastos desde localStorage

const recoverSpents = () => {
    let arraySpents = JSON.parse(localStorage.getItem("arraySpents")) || [];
    return arraySpents;
}

//Agregar gastos

const addSpent = () => {
    if (oneSpent.description = prompt("Ingresar descripción: ")) {
        if (oneSpent.price = Number(prompt("ingresar valor: "))) {
            let arraySpents = recoverSpents();
            arraySpents.push(oneSpent);
            localStorage.setItem("arraySpents", JSON.stringify(arraySpents));
        }
        printSpentsInDom();
        totalCalculation();
        printPeopleInDom();
    }
}

//Borrar gastos

const deleteSpent = (indexSpent) => {
    let arraySpents = recoverSpents();
    arraySpents.splice(indexSpent, 1);
    localStorage.setItem("arraySpents", JSON.stringify(arraySpents));
    printSpentsInDom();
    printPeopleInDom();
    totalCalculation();
    payCalculation();
}

//Calcular el gasto total

const totalCalculation = () => {
    let arraySpents = recoverSpents();
    let totalSpent = arraySpents.reduce((acc, spent) => {
        return spent.price + acc
    }, 0)
    totalContainer.innerHTML = `<span> Total: </span><span>$ ${totalSpent}</span>`;
    return totalSpent;
}

//Imprimir en pantalla personas

const printPeopleInDom = () => {
    let arraySpents = recoverSpents();
    let arrayPeople = recoverPeople();
    let spentsAccumulator = ``;


    arrayPeople.length > 0 ?
        (
            //Asigna los gastos al array de personas
            arrayPeople.forEach((person) => {
                person.spent = 0;
            }),
            arrayPeople.forEach((person, indexPerson) => {
                arraySpents.forEach((spent) => {
                    spent.name == person.name ? person.spent += spent.price : null;
                })
                spentsAccumulator += `<span class = "card"><span>${person.name}</span><span>$ ${person.spent}</span><button class = "btn btn-danger" onclick = "deletePeople(${indexPerson})">Eliminar</button></span>`
            })
        ) : spentsAccumulator = `<span class = "warningCard">Lista personas vacía</span>`;
    peopleContainer.innerHTML = spentsAccumulator;

    // console.log(arrayPeople)

    localStorage.setItem("arrayPeople", JSON.stringify(arrayPeople))

    payCalculation();
}

//Agregar personas

const addPeople = () => {
    let arrayPeople = recoverPeople();
    person.name = prompt("ingresar nombre persona: ");
    person.name ? (
        arrayPeople.push(person),
        localStorage.setItem("arrayPeople", JSON.stringify(arrayPeople)),
        printSpentsInDom(),
        printPeopleInDom()
    ) : null
    payCalculation();
}

//Borrar personas

const deletePeople = (indexPerson) => {
    let arrayPeople = recoverPeople();
    let arraySpents = recoverSpents();

    arraySpents.forEach(spent =>
        spent.name == arrayPeople[indexPerson].name ? spent.name = "asignar" : null
    )

    arrayPeople.splice(indexPerson, 1);

    localStorage.setItem("arraySpents", JSON.stringify(arraySpents));
    localStorage.setItem("arrayPeople", JSON.stringify(arrayPeople));
    printSpentsInDom();
    printPeopleInDom();
    payCalculation();
}

//Asignar nombre al gasto desde el menú desplegable

const addName = (indexPerson, indexSpent) => {
    let arrayPeople = recoverPeople();
    let arraySpents = recoverSpents();
    arraySpents[indexSpent].name = arrayPeople[indexPerson].name;
    localStorage.setItem("arraySpents", JSON.stringify(arraySpents));
    printSpentsInDom();
    printPeopleInDom();
    payCalculation();
}

//Imprimir gastos

const printSpentsInDom = () => {
    let spentsAccumulator = ``;
    let arrayPeople = recoverPeople();
    let arraySpents = recoverSpents();
    let spentColorName = '';
    let spentColorText = '';

    arraySpents.length > 0 ?
        arraySpents.forEach((spent, indexSpent) => {
            
            //En caso de que existan gastos sin asignar, debe resaltar con fondo amarillo y texto negro

            spent.name == 'asignar' ? (
                    spentColorName = 'yellow',
                    spentColorText = 'black'
                ): null;
            
            spentsAccumulator += `<span class = "card"> <div>${spent.description}</div><div>$ ${spent.price}</div>   
                                    <button class="btn btn-danger" onclick = "deleteSpent(${indexSpent})"> Eliminar </button>
                                    <span style = "padding: 5px" class="dropdown">
                                        <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style = "background-color: ${spentColorName}; color: ${spentColorText}"> ${spent.name}
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">`;
            arrayPeople.forEach((person, indexPerson) => {
                spentsAccumulator += `<li><a class="dropdown-item" onclick = "addName(${indexPerson}, ${indexSpent})" href="#">${person.name}</a></li>`;
            })
            spentsAccumulator += `</ul> </span> </span>`;
        }) :
        spentsAccumulator = `<span class = "warningCard">Lista de costos vacía</span>`

    spentContainer.innerHTML = spentsAccumulator;
}

const reset = () => {
    let arrayPeople = [];
    let arraySpents = [];
    let request = confirm("Se eliminarán todos los datos ¿estás seguro?");
    (request) ? (
        localStorage.setItem("arrayPeople", JSON.stringify(arrayPeople)),
        localStorage.setItem("arraySpents", JSON.stringify(arraySpents))
    ) : null;
    printSpentsInDom();
    printPeopleInDom();
    payCalculation();
}

btnSpend.addEventListener('click', () => {
    addSpent()
});

btnPerson.addEventListener('click', () => {
    addPeople()
});

btnReset.addEventListener('click', () => {
    reset();
})

//Imprimir saldo por persona

const payCalculation = () => {
    let arrayPeople = recoverPeople();
    let arraySpents = recoverSpents();
    let asignedSpendts = true;

    //Recorre el array de costos, y en el caso de que existan costos sin asignar mostrará un cartel identificatorio

    arraySpents.forEach((spent) => {
        spent.name == "asignar" ? asignedSpendts = false : null;
    })

    console.log(asignedSpendts);

    //Calcular gasto total

    let totalSpent = totalCalculation();

    //Calcular costo por persona

    let spentPerCapita = Math.round(totalSpent / arrayPeople.length);

    arrayPeople.length == 0 ? spentPerCapita = 0 : null;

    console.log(spentPerCapita);

    titleNameSpentsContainer.innerHTML = `<div> Costo por persona: $ ${spentPerCapita}</div>`;

    let nameSpentsAccumulator = ``;
    let personaDebe = [];
    let personaHaber = [];
    let n = 1;

    arrayPeople.forEach(person => {
        person.debt = (person.spent - spentPerCapita);
        (person.debt < 0) ? personaDebe.push(person): personaHaber.push(person)
    })

    console.log(arrayPeople);

    localStorage.setItem("arrayPeople", JSON.stringify(arrayPeople))

    // console.log(arrayPeople);

    //Ordenar arrays de acuerdo al debe y al haber (desde el mayor debe y haber, hasta el menor debe y haber)

    personaDebe.sort((a, b) => a.debt - b.debt);
    personaHaber.sort((a, b) => b.debt - a.debt);


    asignedSpendts ? (
            personaHaber.forEach(haber => {
                personaDebe.forEach(debe => {
                    if (debe.debt < 0 && haber.debt > 0) {
                        nameSpentsAccumulator += `<span class = "card"><div>${debe.name}</div>`,
                            (haber.debt + debe.debt) >= 0 ? (
                                haber.debt += debe.debt,
                                // console.log(debe.name + " con deuda " + debe.debt + " da " + debe.debt + " a " + haber.name + " y queda con saldo 0 " + " => " + haber.name + " tenía en haber " + (haber.debt - debe.debt) + " y queda con saldo " + haber.debt),
                                nameSpentsAccumulator += `<div> paga $ ${-debe.debt} </div> <div> a ${haber.name}</div>`,
                                debe.debt = 0
                                // console.log("iteración " + n++)
                            ) : (
                                // console.log(debe.name + " con deuda " + debe.debt + " da " + haber.debt + " a " + haber.name + " y queda con saldo " + (debe.debt + haber.debt) + " => " + haber.name + " tenía en haber " + haber.debt + " y  queda con saldo 0"),
                                nameSpentsAccumulator += `<div> paga $ ${haber.debt} </div> <div> a ${haber.name}</div>`,
                                debe.debt += haber.debt,
                                haber.debt = 0
                                // console.log("iteración " + n++)
                            );
                    }
                    nameSpentsAccumulator += `</span>`
                })
            })
    ) : nameSpentsAccumulator = `<span class = "warningCard">Existen costos por asignar</span>`;
    nameSpentsContainer.innerHTML = nameSpentsAccumulator;
}

document.addEventListener("DOMContentLoaded", () => {
    printPeopleInDom();
    printSpentsInDom();
    totalCalculation();
});