'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynameDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: 'PACIENTES'
}

module.exports.listarPacientes = async () => {
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
    const { id } = event.pathParameters;
    

    const data = await dynameDb.get({
      ...params,
      Key: {
        "paciente_id": id
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
      nome, dt_nascimento, email, telefone
    } = dados;
  
    const paciente = {
      paciente_id: uuidv4(),
      nome,
      dt_nascimento,
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

module.exports.atualizarPaciente = async (event) => {
  const { id } = event.pathParameters;

  try {
    const timestamp = new Date().getTime();

    let dados = JSON.parse(event.body);

    const {nome, dt_nascimento, email, telefone } = dados;

    await dynameDb.update({
      ...params,
      Key: {
        paciente_id: id,
      },
      UpdateExpression:
        'SET nome = :nome, dt_nascimento = :dt_nascimento, email = :email, telefone = :telefone, atualizado = :atualizado',
      ConditionExpression: 'attribute_exists(paciente_id)',
      ExpressionAttributeValues: {
        ':nome': nome,
        ':dt_nascimento': dt_nascimento,
        ':email': email,
        ':telefone': telefone,
        ':atualizado': timestamp
      }  
    }).promise();

    return {
      statusCode: 204
    }
    
  } catch (err) {
    console.log("Error: ", err);
    
    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = err.statusCode ? err.statusCode : 500;

    if (error == 'ConditionalCheckFailedException') {
      error = 'Paciente não existe';
      message = `Recurso com o ID ${id} não existe e não pode ser atualizado`,
      statusCode = 404
    }

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message
      })
    }
  }
}

module.exports.excluirPaciente = async (event) => {
  const { id } = event.pathParameters;

  try {
    await dynameDb.delete({
      ...params,
      Key: {
        paciente_id: id
      },
      ConditionExpression: 'attribute_exists(paciente_id)'
    }).promise();

    return {
      statusCode: 204
    }
  } catch (err) {
    console.log("Error: ", err);
    
    let error = err.name ? err.name : "Exception";
    let message = err.message ? err.message : "Unknown error";
    let statusCode = err.statusCode ? err.statusCode : 500;

    if (error == 'ConditionalCheckFailedException') {
      error = 'Paciente não existe';
      message = `Recurso com o ID ${id} não existe e não pode ser atualizado`,
      statusCode = 404
    }

    return {
      statusCode,
      body: JSON.stringify({
        error,
        message
      })
    }
  }
}
