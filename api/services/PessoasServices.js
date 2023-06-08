const Services = require('./Services')
const database = require('../models')
const { Op } = require('sequelize')

class PessoasServices extends Services {
  constructor() {
    super('Pessoas')
    this.matriculas = new Services('Matriculas')
  }

  async pegaRegistrosAtivos(where = {}) {
    return database[this.nomeDoModelo].findAll({ where: { ...where }})  // dessa forma, se receber qualquer tipo de where, faz um spread nas condições
  }

  async pegaRegistrosAtivosEInativos(where = {}) {
    return database[this.nomeDoModelo]
      .scope('todos')
      .findAll({ where: { ...where }})
  }

  async pegaTodosOsRegistros(where = {}) {
    return database[this.nomeDoModelo]
      .scope('todos')
      .findAll({ 
        paranoid: false,
        where: { ...where }
      })
  }

  async pegaUmRegistroApagado(id) {
    return database[this.nomeDoModelo]
      .scope('todos')
      .findOne({ 
        paranoid: false,
        where: { 
          id: id,
          deletedAt: { [Op.not]: null }
        }
      })
  }

  async pegaUmRegistroInativo(id) {
    return database[this.nomeDoModelo]
      .scope('todos')
      .findOne({ where: { id: id }})
  }

  async atualizaQualquerPessoa(dadosAtualizados, id) {
    return database.sequelize.transaction(async transacao => {
      await database[this.nomeDoModelo]
        .scope('todos')
        .update(dadosAtualizados, { where: { id: id }}, { transaction: transacao })
    })
  }

  async softDeletePessoa(id) {
    return database[this.nomeDoModelo]
      .scope('todos')
      .destroy({ where: { id: id }})
  }

  async hardDelete(id) {
    return database[this.nomeDoModelo]
      .scope('todos')
      .destroy({
        where: { id: id },
        force: true
      })
  }

  async cancelaPessoaEMatriculas(estudanteId) {
    return database.sequelize.transaction(async transacao => {
      await super.atualizaRegistro({ ativo: false }, estudanteId, { transaction: transacao })
      await this.matriculas.atualizaRegistros({ status: 'cancelado' }, { estudante_id: estudanteId }, { transaction: transacao })
    })
  }

  async pegaMatriculasPorEstudante(where = {}) {
    const matriculas = await database[this.nomeDoModelo]
      .findOne({ where: { ...where } })
    return matriculas.getAulasMatriculadas()
  }
}

module.exports = PessoasServices
