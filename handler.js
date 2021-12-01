'use strict';

const pacientes = [
  {id: 1, nome: "Pedro", dataNascimento: '1995-08-16'},
  {id: 2, nome: "Juca", dataNascimento: '1999-06-05'},
  {id: 3, nome: "Nelso", dataNascimento: '2008-07-28'}
]

module.exports.listarPacientes = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        pacientes
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
