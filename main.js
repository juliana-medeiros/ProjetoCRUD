'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}
  
//Pegar
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_cliente')) ?? []
//enviar os dados e usanado JSON para o localStorage aceitar String
const setLocalStorage = (db_cliente) => localStorage.setItem('db_cliente', JSON.stringify (db_cliente))

//CRUD
const deleteCliente = (index) => {
    const db_cliente = readCliente()
    db_cliente.splice(index,1)
    setLocalStorage(db_cliente)
}

const updateCliente = (index, cliente) => {
    const db_cliente = readCliente()
    db_cliente[index] = cliente
    setLocalStorage(db_cliente)
}

const readCliente = () => getLocalStorage()

const criaCliente = (cliente) => {
    //Pegar o que tem no BD e transforma em JSON e armazena em uma variável cliente
    const db_cliente = getLocalStorage()
    //Acrescentar mais um
    db_cliente.push (cliente)
    setLocalStorage(db_cliente)
}

const isValideFields = () => {
   return document.getElementById('form').reportValidity()
}

//Interação com o layout

//limpar os campos após cadastrar
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const salvaCliente = () => {
    //verificar se os dados foram preenchidos
    if (isValideFields()) {
        const cliente = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            criaCliente(cliente)
            updateTable()
            closeModal()
        } else {
            updateCliente(index, cliente)
            updateTable()
            closeModal()
        }
        
    }
}

const createRow = (cliente, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.celular}</td>
        <td>${cliente.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="deemail-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableCliente>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableCliente>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
   const db_cliente = readCliente()
   clearTable()
   db_cliente.forEach(createRow)
}

const fillFields = (cliente) => {
    document.getElementById('nome').value = cliente.nome
    document.getElementById('email').value = cliente.email
    document.getElementById('celular').value = cliente.celular
    document.getElementById('cidade').value = cliente.cidade
    document.getElementById('nome').dataset.index = cliente.index
}

const editCliente = (index) => {
    const cliente = readCliente()[index]
    cliente.index = index
    fillFields(cliente)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editCliente(index)
        } else {
            const cliente = readCliente()[index]
            const response = confirm('Deseja realmente excluir esse cliente??')
            if (response) {
                deleteCliente(index)
                updateTable()  
            }  
        }
    } 
}

updateTable()

//Eventos
//Abrindo o painel de cadastro de clientes
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

//Fechando o painél de cadastro
document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', salvaCliente)

document.querySelector('#tableCliente>tbody')
    .addEventListener('click', editDelete)