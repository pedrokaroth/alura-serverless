'use strict';

const pacientes = [
  {id: 1, nome: "Pedro", dataNascimento: '1995-08-16'},
  {id: 2, nome: "Juca", dataNascimento: '1999-06-05'},
  {id: 3, nome: "Nelso", dataNascimento: '2008-07-28'}
]

const AWS = require('aws-sdk')

const dynameDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'PACIENTES'
}

module.exports.listarPacientes = async (event) => {
  try {
    let data = await dynameDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (err) {
    console.log("Error: ", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error"
      })
    }
  }
};

module.exports.obterPaciente = async (event) => {

  const { id } = event.pathParameters;
  const paciente = pacientes.find((paciente) => paciente.id == id);

  if (!paciente) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Paciente não encontrado"})
    }
  }

    return {
      statusCode: 200,
      body: JSON.stringify(paciente, null, 2),
    };
};
