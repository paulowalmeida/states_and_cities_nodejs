import { promises as fs } from "fs";
import readLine from "readline";

let statesWithCities = [];

function menu() {
    const reader1 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    reader1.question(`Escolha uma opção:
        \n1 - Quantidade de Cidades por Estado
        \n2 - 5 Estados com maior numero de cidades
        \n3 - 5 Estados com menor numero de cidades
        \n4 - Cidade com maior nome por Estado
        \n5 - Cidade com menor nome por Estado
        \n6 - Cidade com Maior nome entre todos Estados
        \n7 - Cidade com Menor nome entre todos Estados
        \nR: `, 
        answer => {
            reader1.close();
            switch (answer){
                case '1':{ 
                    quantityCitiesForState();
                    break;
                }
                case '2':{ 
                    fiveStatesWithNumberCities('greatter');
                    break;
                }
                case '3':{ 
                    fiveStatesWithNumberCities('smaller');
                    break;
                }
                case '4':{ 
                    statesWithNamedCities('biggest');
                    break;
                }
                case '5':{ 
                    statesWithNamedCities('smallest');
                    break;
                }
                case '6':{ 
                    cityWithName('bigger');
                    break;
                }
                case '7':{ 
                    cityWithName('smaller');
                    break;
                }
            }
        }
    );
}

function quantityCitiesForState() {
    const reader2 = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    reader2.question("Digite a Sigla do estado: ", (answer) => {
        reader2.close();
        statesWithCities
            .filter(({initials}) => initials == answer)
            .map(({name, cities}) => {
                console.log(`[${name} - ${cities.length}]`);
            });
    });
}

function fiveStatesWithNumberCities(measure){
    let index = 0;
    statesWithCities
        .map( ({name, cities}) => { 
            return { name, total: cities.length };
        })
        .sort(( a, b) => measure === 'greatter'? b.total - a.total: a.total - b.total)
        .map(state => { 
            state.index = index++;
            return state;
        })
        .filter(state => state.index < 5)
        .forEach(({name, total}) => console.log(`[${name} - ${total}]`));
}

function statesWithNamedCities(measure){
    statesWithCities
        .map(({id, name, cities}) =>{
            return {
                id,
                name,
                cityBiggestName: cities.sort( (a, b) => measure === 'biggest' ? b.name.length - a.name.length : a.name.length - b.name.length)[0]
            }
        })
        .forEach (({name, cityBiggestName}) => {
            console.log(`[${name} - ${cityBiggestName.name}]`);
        })
}

function cityWithName(measure){
    let allCities = [];
    statesWithCities
        .map(({cities, initials}) => {
            cities.map( city => {
                city.initialsState = initials;
                allCities = [...allCities, city];
            })
        });
    let result = allCities
        .sort( (a , b) => measure === 'bigger' ? b.name.length - a.name.length : a.name.length - b.name.length)[0]
    console.log(`[${result.initialsState} - ${result.name}]`);
}

async function createStatesWithCities() {
  const states = JSON.parse(await fs.readFile("./json/states.json"));
  const cities = JSON.parse(await fs.readFile("./json/cities.json"));

  statesWithCities = states.map((state) => {
    state.cities = cities.filter((city) => city.state == state.id);
    return state;
  });

  fs.writeFile(
    "./json/statesWithCities.json", JSON.stringify(statesWithCities))
        .catch((error) => console.error(error)
    );
}

createStatesWithCities();
menu();