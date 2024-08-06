import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
  import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyASUhS5nJcg2laRkaxvxSLuiIk5ph0Hxt0",
authDomain: "praticarecycler.firebaseapp.com",
projectId: "praticarecycler",
storageBucket: "praticarecycler.appspot.com",
messagingSenderId: "772414068952",
appId: "1:772414068952:web:beac4d469a22e825ce9fad"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para obter as placas de todos os veículos
async function getPlacas() {
  try {
    const querySnapshot = await getDocs(collection(db, "veiculos"));
    const placas = querySnapshot.docs.map(doc => doc.data().placa);
    return placas;
  } catch (error) {
    console.error("Erro ao obter as placas: ", error);
    return [];
  }
}

async function getDados() {
  try {
    const querySnapshot = await getDocs(collection(db, "veiculos"));
    const dados = querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Verificar se os campos são válidos
      const entradaTimestamp = data.entrada;
      const saidaTimestamp = data.saida;
      
      if (!entradaTimestamp) {
        console.error(`Campo de timestamp 'entrada' ausente para o documento ${doc.id}`);
        return null; // Ignorar documentos com dados inválidos
      }

      const entradaDate = entradaTimestamp.toDate();
      const saidaDate = saidaTimestamp ? saidaTimestamp.toDate() : null;    

      // Formatar a data
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      };

      // Ajustar e formatar as datas
      const entradaBrasileira = formatDate(entradaDate);
      const saidaBrasileira = saidaDate ? formatDate(saidaDate) : "Não registrado";

      return {
        id: doc.id,
        placa: data.placa,
        entrada: entradaBrasileira,
        saida: saidaBrasileira,
      };
    }).filter(item => item !== null); // Filtrar documentos inválidos

    return dados;
  } catch (error) {
    console.error("Erro ao obter as informações dos veículos: ", error);
    return [];
  }
}




function mostrarDados() {
  getDados().then(dados => {
    const tabelaDados = document.getElementById("table-datas");
    const cabeçalho = "<tr><th>Id</th><th>Placa</th><th>Entrada</th><th>Saída</th></tr>";
    tabelaDados.innerHTML = cabeçalho;
    dados.forEach(dado => {
      
      const linhaDado = document.createElement("tr");
      const colunaId = document.createElement("td");
      const colunaPlaca = document.createElement("td");
      const colunaEntrada = document.createElement("td");
      const colunaSaida = document.createElement("td");

      colunaId.textContent = dado.id;
      colunaPlaca.textContent = dado.placa;
      colunaEntrada.textContent = dado.entrada;
      colunaSaida.textContent = dado.saida;

      linhaDado.appendChild(colunaId);
      linhaDado.appendChild(colunaPlaca);
      linhaDado.appendChild(colunaEntrada);
      linhaDado.appendChild(colunaSaida);
      tabelaDados.appendChild(linhaDado);
    });
  });
  console.log("Chamou!")
}
const btnAtualizar = document.getElementById("btn-atualizar");

mostrarDados()
btnAtualizar.addEventListener(
  "click",() => {mostrarDados();}
)