'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynameDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'PACIENTES'
}

module.exports.listarPacientes = async (event) => {
  try {
    let data = await dynameDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
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
  try {
    const pacienteId = event.pathParameters;
    

    const data = await dynameDb.get({
      ...params,
      Key: {
        "paciente_id": pacienteId.id
      },
    }).promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({error: "Paciente não existe"}, null, 2)
      }
    }

    const paciente = data.Item;

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item)
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

module.exports.cadastrarPaciente = async (event) => {
  try {
    let dados = JSON.parse(event.body);
    let timestamp = new Date().getTime();
  
    const {
      paciente_id, nome, data_nascimento, email, telefone
    } = dados;
  
    const paciente = {
      paciente_id: uuidv4(),
      nome,
      data_nascimento,
      email,
      telefone,
      status: true,
      criado: timestamp,
      atualizado: timestamp
    }
  
    await dynameDb.put({
      TableName: "PACIENTES",
      Item: paciente
    }).promise();
  
    return {
      statusCode: 201
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
